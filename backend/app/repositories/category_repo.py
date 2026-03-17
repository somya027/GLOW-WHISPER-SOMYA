from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category


class CategoryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Category]:
        result = await self.db.execute(select(Category).order_by(Category.name))
        return list(result.scalars().all())

    async def get_by_id(self, cat_id: int) -> Category | None:
        result = await self.db.execute(select(Category).where(Category.id == cat_id))
        return result.scalar_one_or_none()

    async def get_by_name(self, name: str) -> Category | None:
        result = await self.db.execute(select(Category).where(Category.name == name))
        return result.scalar_one_or_none()

    async def create(self, **kwargs) -> Category:
        cat = Category(**kwargs)
        self.db.add(cat)
        await self.db.flush()
        await self.db.refresh(cat)
        return cat

    async def update(self, cat: Category, **kwargs) -> Category:
        for k, v in kwargs.items():
            if v is not None:
                setattr(cat, k, v)
        await self.db.flush()
        await self.db.refresh(cat)
        return cat

    async def delete(self, cat: Category) -> None:
        await self.db.delete(cat)
        await self.db.flush()
