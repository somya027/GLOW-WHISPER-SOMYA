from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.review_repo import ReviewRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.commerce import ReviewCreate, ReviewOut


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.repo = ReviewRepository(db)
        self.product_repo = ProductRepository(db)
        self.db = db

    async def create_review(self, user: User, data: ReviewCreate) -> ReviewOut:
        review = await self.repo.create(
            user_id=user.id,
            product_id=data.product_id,
            rating=data.rating,
            review_text=data.review_text,
        )
        # Update product aggregate rating
        avg, count = await self.repo.get_avg_rating(data.product_id)
        product = await self.product_repo.get_by_id(data.product_id)
        if product:
            await self.product_repo.update(product, rating=round(avg, 1), review_count=count)

        return ReviewOut(
            id=review.id,
            user_id=review.user_id,
            user_name=user.name,
            product_id=review.product_id,
            rating=review.rating,
            review_text=review.review_text,
            created_at=review.created_at,
        )

    async def list_product_reviews(self, product_id: int) -> list[ReviewOut]:
        reviews = await self.repo.list_by_product(product_id)
        # We need user names — do a quick lookup
        from app.repositories.user_repo import UserRepository
        user_repo = UserRepository(self.db)

        result = []
        for r in reviews:
            user = await user_repo.get_by_id(r.user_id)
            result.append(
                ReviewOut(
                    id=r.id,
                    user_id=r.user_id,
                    user_name=user.name if user else None,
                    product_id=r.product_id,
                    rating=r.rating,
                    review_text=r.review_text,
                    created_at=r.created_at,
                )
            )
        return result
