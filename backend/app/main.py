from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import APP_NAME, APP_VERSION
from app.utils.constants import WELCOME_MESSAGE

from app.routes.auth import router as auth_router
from app.routes.analysis import router as analysis_router
from app.routes.dashboard import router as dashboard_router
from app.routes.image_analysis import router as image_analysis_router
from app.routes.chat import router as chat_router
from app.routes.reports import router as reports_router

from app.models.user import User
from app.models.analysis import Analysis
from app.models.chat import Chat
from app.models.chat_message import ChatMessage

from app.database.database import engine, Base


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="AI-Powered Cyberbullying Detection Backend",
)


Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(analysis_router)
app.include_router(dashboard_router)
app.include_router(image_analysis_router)
app.include_router(chat_router)
app.include_router(reports_router)


@app.get("/")
def root():
    return {
        "message": WELCOME_MESSAGE
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

