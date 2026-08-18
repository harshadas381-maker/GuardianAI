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
    analyses = (
        db.query(Analysis)
        .filter(Analysis.user_id == current_user.id)
        .order_by(Analysis.created_at.desc())
        .all()
    )

    return [
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
        for item in analyses
    ]