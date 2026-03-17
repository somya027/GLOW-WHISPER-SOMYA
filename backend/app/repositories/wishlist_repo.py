from __future__ import annotations

from sqlalchemy import select, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.wishlist import Wishlist


class WishlistRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_by_user(self, user_id: int) -> list[Wishlist]:
        q = select(Wishlist).options(joinedload(Wishlist.product)).where(Wishlist.user_id == user_id)
        result = await self.db.execute(q)
        return list(result.scalars().unique().all())

    async def add(self, user_id: int, product_id: int) -> Wishlist:
        # Check duplicate
        existing = await self.db.execute(
            select(Wishlist).where(Wishlist.user_id == user_id, Wishlist.product_id == product_id)
        )
        if existing.scalar_one_or_none():
            raise ValueError("Already in wishlist")
        wl = Wishlist(user_id=user_id, product_id=product_id)
        self.db.add(wl)
        await self.db.flush()
        await self.db.refresh(wl)
        return wl

    async def remove(self, user_id: int, product_id: int) -> bool:
        result = await self.db.execute(
            sa_delete(Wishlist).where(Wishlist.user_id == user_id, Wishlist.product_id == product_id)
        )
        await self.db.flush()
        return result.rowcount > 0  # type: ignore[union-attr]
