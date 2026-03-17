from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> User:
        user = User(**kwargs)
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user

    async def list_all(self, offset: int = 0, limit: int = 20) -> tuple[list[User], int]:
        count_q = select(User)
        result = await self.db.execute(count_q)
        all_users = result.scalars().all()
        total = len(all_users)

        q = select(User).offset(offset).limit(limit).order_by(User.created_at.desc())
        result = await self.db.execute(q)
        return list(result.scalars().all()), total
