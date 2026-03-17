from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from app.repositories.user_repo import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, RefreshRequest, TokenResponse, UserOut


class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def register(self, data: RegisterRequest) -> dict:
        existing = await self.repo.get_by_email(data.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

        user = await self.repo.create(
            name=data.name,
            email=data.email,
            mobile=data.mobile,
            password_hash=hash_password(data.password),
        )
        tokens = self._issue_tokens(user.id, user.role)
        return {
            "user": UserOut.model_validate(user),
            "access_token": tokens.access_token,
            "refresh_token": tokens.refresh_token,
        }

    async def login(self, data: LoginRequest) -> dict:
        user = await self.repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

        tokens = self._issue_tokens(user.id, user.role)
        return {
            "user": UserOut.model_validate(user),
            "access_token": tokens.access_token,
            "refresh_token": tokens.refresh_token,
        }

    async def refresh(self, data: RefreshRequest) -> TokenResponse:
        try:
            payload = decode_token(data.refresh_token)
            if payload.get("type") != "refresh":
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
            user_id = int(payload["sub"])
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token") from exc

        user = await self.repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

        return self._issue_tokens(user.id, user.role)

    @staticmethod
    def _issue_tokens(user_id: int, role: str) -> TokenResponse:
        return TokenResponse(
            access_token=create_access_token(user_id, role),
            refresh_token=create_refresh_token(user_id),
        )
