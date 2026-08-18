from sqlalchemy import text
from app.database.database import engine

with engine.begin() as connection:
    connection.execute(
        text(
            "ALTER TABLE analyses "
            "ADD COLUMN IF NOT EXISTS source VARCHAR(20) "
            "NOT NULL DEFAULT 'text'"
        )
    )

    connection.execute(
        text(
            "ALTER TABLE analyses "
            "ADD COLUMN IF NOT EXISTS filename VARCHAR(255)"
        )
    )

print("Database columns updated successfully")