from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.analysis import Analysis
from app.models.user import User


router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("")
def get_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return all analysis reports belonging to the
    currently authenticated user.

    Reports are ordered from newest to oldest.
    """

    analyses = (
        db.query(Analysis)
        .filter(
            Analysis.user_id == current_user.id
        )
        .order_by(
            Analysis.created_at.desc()
        )
        .all()
    )

    reports = []

    for item in analyses:
        reports.append(
            {
                "id": item.id,

                # Extracted/input text
                "text": item.text or "",

                # Prediction result
                "prediction": item.prediction or "",

                # Always return confidence as a number
                "confidence": float(
                    item.confidence or 0
                ),

                # Analysis source:
                # text / image
                "source": item.source or "",

                # Image filename if applicable
                "filename": item.filename,

                # ISO timestamp for frontend
                "created_at": (
                    item.created_at.isoformat()
                    if item.created_at
                    else None
                ),
            }
        )

    return reports