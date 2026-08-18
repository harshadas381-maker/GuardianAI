from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.analysis import Analysis
from app.models.user import User
from app.services.toxicity_model import analyze_toxicity


router = APIRouter(
    prefix="/analysis",
    tags=["Text Analysis"],
)


class TextAnalysisRequest(BaseModel):
    text: str


@router.post("/text")
def analyze_text(
    request: TextAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    text = request.text.strip()

    if not text:
        return {
            "prediction": "No Text",
            "confidence": 0,
        }

    # Run GuardianAI AI model
    result = analyze_toxicity(text)

    # Save text analysis for the logged-in user
    analysis = Analysis(
        user_id=current_user.id,
        text=text,
        prediction=result["prediction"],
        confidence=result["confidence"],
        source="text",
        filename=None,
    )

    db.add(analysis)
    db.commit()
    db.refresh(analysis)

    return {
        "id": analysis.id,
        "prediction": result["prediction"],
        "confidence": result["confidence"],
    }