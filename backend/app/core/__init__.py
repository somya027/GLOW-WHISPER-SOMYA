from __future__ import annotations

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ──
    APP_NAME: str = "Aura Skincare API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ── Database ──
    DATABASE_URL: str = "postgresql+asyncpg://aura:aura_secret@localhost:5432/aura_skincare"

    # ── JWT ──
    SECRET_KEY: str = "CHANGE-ME-super-secret-key-aura-skincare-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── CORS ──
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:5173",
    ]

    # ── Upload ──
    UPLOAD_DIR: str = str(Path(__file__).resolve().parent.parent / "uploads")
    MAX_UPLOAD_SIZE_MB: int = 10

    # ── Pagination defaults ──
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

# Ensure upload directories exist
os.makedirs(os.path.join(settings.UPLOAD_DIR, "products"), exist_ok=True)
