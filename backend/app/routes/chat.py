from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.chat import Chat
from app.models.chat_message import ChatMessage
from app.models.analysis import Analysis
from app.services.toxicity_model import analyze_toxicity
from app.services.ai_response_service import generate_ai_response


router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# ============================================
# REQUEST SCHEMAS
# ============================================

class ChatRequest(BaseModel):
    message: str


class NewChatRequest(BaseModel):
    title: str = "New Chat"


# ============================================
# CREATE NEW CHAT
# ============================================

@router.post("/create")
def create_chat(
    request: NewChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = Chat(
        user_id=current_user.id,
        title=request.title.strip() or "New Chat",
    )

    db.add(chat)
    db.commit()
    db.refresh(chat)

    return {
        "id": chat.id,
        "title": chat.title,
        "created_at": chat.created_at,
        "updated_at": chat.updated_at,
    }


# ============================================
# GET CHAT HISTORY
# ============================================

@router.get("/history")
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.updated_at.desc())
        .all()
    )

    return [
        {
            "id": chat.id,
            "title": chat.title,
            "created_at": chat.created_at,
            "updated_at": chat.updated_at,
        }
        for chat in chats
    ]


# ============================================
# GET MESSAGES FROM ONE CHAT
# ============================================

@router.get("/{chat_id}/messages")
def get_chat_messages(
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )

    return [
        {
            "id": message.id,
            "sender": message.sender,
            "text": message.text,
            "prediction": message.prediction,
            "confidence": message.confidence,
            "created_at": message.created_at,
        }
        for message in messages
    ]


# ============================================
# SEND CHAT MESSAGE
# ============================================

@router.post("/{chat_id}/message")
def send_chat_message(
    chat_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ----------------------------------------
    # Clean message
    # ----------------------------------------

    message = request.message.strip()

    if not message:
        return {
            "reply": "Please enter a message.",
            "prediction": "Safe",
            "confidence": 0,
        }

    # ----------------------------------------
    # Verify chat ownership
    # ----------------------------------------

    chat = (
        db.query(Chat)
        .filter(
            Chat.id == chat_id,
            Chat.user_id == current_user.id,
        )
        .first()
    )

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    # ----------------------------------------
    # Dynamic chat title
    # ----------------------------------------

    if chat.title.strip().lower() == "new chat":

        new_title = message

        if len(new_title) > 35:
            new_title = new_title[:35].rstrip() + "..."

        chat.title = new_title

    # ----------------------------------------
    # AI TOXICITY ANALYSIS
    # ----------------------------------------

    result = analyze_toxicity(message)

    prediction = result["prediction"]
    confidence = float(result["confidence"])

    # ----------------------------------------
    # SAVE ANALYSIS
    # This is used by Dashboard statistics
    # ----------------------------------------

    analysis = Analysis(
        user_id=current_user.id,
        text=message,
        prediction=prediction,
        confidence=confidence,
    )

    db.add(analysis)

    # ----------------------------------------
    # SAVE USER MESSAGE
    # ----------------------------------------

    user_message = ChatMessage(
        chat_id=chat.id,
        sender="user",
        text=message,
        prediction=prediction,
        confidence=confidence,
    )

    db.add(user_message)

    # ----------------------------------------
    # GUARDIANAI AI RESPONSE
    # ----------------------------------------

    ai_result = generate_ai_response(
        message=message,
        prediction=prediction,
        confidence=confidence,
    )

    reply = ai_result["reply"]

    # ----------------------------------------
    # SAVE AI MESSAGE
    # ----------------------------------------

    ai_message = ChatMessage(
        chat_id=chat.id,
        sender="ai",
        text=reply,
        prediction=prediction,
        confidence=confidence,
    )

    db.add(ai_message)

    # ----------------------------------------
    # COMMIT ALL DATABASE CHANGES
    # ----------------------------------------

    try:

        db.commit()

        db.refresh(chat)
        db.refresh(analysis)
        db.refresh(user_message)
        db.refresh(ai_message)

    except Exception:

        db.rollback()
        raise

    # ----------------------------------------
    # RESPONSE
    # ----------------------------------------

    return {
        "user_message": {
            "id": user_message.id,
            "sender": user_message.sender,
            "text": user_message.text,
            "prediction": user_message.prediction,
            "confidence": user_message.confidence,
            "created_at": user_message.created_at,
        },

        "ai_message": {
            "id": ai_message.id,
            "sender": ai_message.sender,
            "text": ai_message.text,
            "prediction": ai_message.prediction,
            "confidence": ai_message.confidence,
            "created_at": ai_message.created_at,
        },

        "prediction": prediction,
        "confidence": confidence,

        "ai_response": {
            "risk_level": ai_result["risk_level"],
            "safer_response": ai_result["safer_response"],
        },

        "chat": {
            "id": chat.id,
            "title": chat.title,
            "updated_at": chat.updated_at,
        },
    }