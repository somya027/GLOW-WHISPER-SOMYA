from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review


class ReviewRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, **kwargs) -> Review:
        review = Review(**kwargs)
        self.db.add(review)
        await self.db.flush()
        await self.db.refresh(review)
        return review

    async def list_by_product(self, product_id: int) -> list[Review]:
        q = select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())
        result = await self.db.execute(q)
        return list(result.scalars().all())

    async def get_avg_rating(self, product_id: int) -> tuple[float, int]:
        q = select(func.avg(Review.rating), func.count(Review.id)).where(Review.product_id == product_id)
        result = await self.db.execute(q)
        row = result.one()
        return float(row[0] or 0), int(row[1] or 0)
