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
    user_filter = Analysis.user_id == current_user.id

    total = (
        db.query(Analysis)
        .filter(user_filter)
        .count()
    )

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

    toxicity_rate = (
        round((toxic / total) * 100, 2)
        if total
        else 0
    )

    recent = (
        db.query(Analysis)
        .filter(user_filter)
        .order_by(Analysis.created_at.desc())
        .limit(5)
        .all()
    )

    recent_activity = [
        {
            "id": item.id,
            "text": item.text,
            "prediction": item.prediction,
            "confidence": item.confidence,
            "source": item.source,
            "filename": item.filename,
            "created_at": (
                item.created_at.isoformat()
                if item.created_at
                else None
            ),
        }
        for item in recent
    ]

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

    return {
        "total": total,
        "toxic": toxic,
        "safe": safe,
        "text_analyses": text_analyses,
        "image_analyses": image_analyses,
        "toxicity_rate": toxicity_rate,
        "weekly": weekly,
        "recent_activity": recent_activity,
    }