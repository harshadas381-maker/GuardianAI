from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.analysis import Analysis
from app.models.user import User


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # ============================================================
    # USER FILTER
    # ============================================================

    user_filter = Analysis.user_id == current_user.id

    # ============================================================
    # TOTAL REPORTS
    # ============================================================

    total = (
        db.query(Analysis)
        .filter(user_filter)
        .count()
    )

    # ============================================================
    # PREDICTION COUNTS
    # ============================================================

    toxic = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.prediction) == "toxic",
        )
        .count()
    )

    safe = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.prediction) == "safe",
        )
        .count()
    )

    cyberbullying = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.prediction) == "cyberbullying",
        )
        .count()
    )

    offensive = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.prediction) == "offensive",
        )
        .count()
    )

    hate = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.prediction) == "hate",
        )
        .count()
    )

    # ============================================================
    # HARMFUL CONTENT
    #
    # Everything except Safe is treated as harmful/risky.
    # ============================================================

    harmful = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.prediction) != "safe",
        )
        .count()
    )

    # ============================================================
    # HARMFUL / TOXICITY RATE
    # ============================================================

    harmful_rate = (
        round((harmful / total) * 100, 2)
        if total > 0
        else 0
    )

    # Keep this field because the frontend already uses it.
    toxicity_rate = harmful_rate

    # Cyberbullying percentage
    cyberbullying_rate = (
        round((cyberbullying / total) * 100, 2)
        if total > 0
        else 0
    )

    # ============================================================
    # SOURCE COUNTS
    # ============================================================

    text_analyses = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.source) == "text",
        )
        .count()
    )

    image_analyses = (
        db.query(Analysis)
        .filter(
            user_filter,
            func.lower(Analysis.source) == "image",
        )
        .count()
    )

    # ============================================================
    # RECENT ACTIVITY
    # ============================================================

    recent = (
        db.query(Analysis)
        .filter(user_filter)
        .order_by(Analysis.created_at.desc())
        .limit(5)
        .all()
    )

    recent_activity = []

    for item in recent:
        recent_activity.append(
            {
                "id": item.id,
                "text": item.text or "",
                "prediction": item.prediction or "",
                "confidence": float(item.confidence or 0),
                "source": item.source or "",
                "filename": item.filename,
                "created_at": (
                    item.created_at.isoformat()
                    if item.created_at
                    else None
                ),
            }
        )

    # ============================================================
    # LAST 7 DAYS
    # ============================================================

    today = datetime.now().date()

    weekly = []

    for i in range(6, -1, -1):
        day = today - timedelta(days=i)

        count = (
            db.query(Analysis)
            .filter(
                user_filter,
                func.date(Analysis.created_at) == day,
            )
            .count()
        )

        weekly.append(
            {
                "day": day.strftime("%a"),
                "value": count,
            }
        )

    # ============================================================
    # RESPONSE
    # ============================================================

    return {
        # Main statistics
        "total": total,
        "toxic": toxic,
        "safe": safe,
        "cyberbullying": cyberbullying,

        # Additional prediction classes
        "offensive": offensive,
        "hate": hate,

        # Harmful content
        "harmful": harmful,
        "harmful_rate": harmful_rate,

        # Frontend compatibility
        "toxicity_rate": toxicity_rate,
        "cyberbullying_rate": cyberbullying_rate,

        # Source statistics
        "text_analyses": text_analyses,
        "image_analyses": image_analyses,

        # Charts
        "weekly": weekly,

        # Recent activity
        "recent_activity": recent_activity,
    }