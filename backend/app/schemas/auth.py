from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Auth requests ──
class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr
    mobile: str | None = None
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=1)
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# ── Auth responses ──
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    mobile: str | None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
