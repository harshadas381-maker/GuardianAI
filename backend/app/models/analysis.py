from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True,
    )

    text = Column(
        String(5000),
        nullable=False,
    )

    prediction = Column(
        String(50),
        nullable=False,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    source = Column(
        String(20),
        nullable=False,
        default="text",
    )

    filename = Column(
        String(255),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )