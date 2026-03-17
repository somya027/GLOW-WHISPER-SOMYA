from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.wishlist_repo import WishlistRepository
from app.schemas.commerce import WishlistItemOut
from app.services.product_service import _product_to_out


class WishlistService:
    def __init__(self, db: AsyncSession):
        self.repo = WishlistRepository(db)

    async def list_wishlist(self, user_id: int) -> list:
        items = await self.repo.list_by_user(user_id)
        results = []
        for w in items:
            if w.product:
                p = _product_to_out(w.product)
                results.append(p)
        return results

    async def get_wishlist_ids(self, user_id: int) -> list[int]:
        items = await self.repo.list_by_user(user_id)
        return [w.product_id for w in items]

    async def add(self, user_id: int, product_id: int) -> dict:
        try:
            await self.repo.add(user_id, product_id)
        except ValueError:
            pass  # already there
        ids = await self.get_wishlist_ids(user_id)
        return {"wishlist": ids}

    async def remove(self, user_id: int, product_id: int) -> dict:
        await self.repo.remove(user_id, product_id)
        ids = await self.get_wishlist_ids(user_id)
        return {"wishlist": ids}

    async def toggle(self, user_id: int, product_id: int) -> dict:
        items = await self.repo.list_by_user(user_id)
        existing = any(w.product_id == product_id for w in items)
        if existing:
            return await self.remove(user_id, product_id)
        return await self.add(user_id, product_id)
