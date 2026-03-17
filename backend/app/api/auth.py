from __future__ import annotations

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.schemas.auth import LoginRequest, RefreshRequest, RegisterRequest
from app.schemas.common import APIResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=APIResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    svc = AuthService(db)
    result = await svc.register(data)
    return APIResponse(data=result, message="Registration successful")


@router.post("/login", response_model=APIResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    svc = AuthService(db)
    result = await svc.login(data)
    return APIResponse(data=result, message="Login successful")


@router.post("/refresh", response_model=APIResponse)
async def refresh_token(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    svc = AuthService(db)
    tokens = await svc.refresh(data)
    return APIResponse(data=tokens)


@router.get("/me", response_model=APIResponse)
async def me(
    db: AsyncSession = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(HTTPBearer()),
):
    from app.core.deps import _get_user_from_token
    user = await _get_user_from_token(credentials, db, required=True)
    return APIResponse(data={
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile or "",
        "role": user.role,
    })


@router.post("/logout", response_model=APIResponse)
async def logout():
    # JWT is stateless — client discards the token
    return APIResponse(message="Logged out successfully")
