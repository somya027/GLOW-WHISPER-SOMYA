from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.product import Product


class ProductRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, product_id: int) -> Product | None:
        q = select(Product).options(joinedload(Product.category)).where(Product.id == product_id)
        result = await self.db.execute(q)
        return result.scalar_one_or_none()

    async def list_products(
        self,
        *,
        category: str | None = None,
        category_id: int | None = None,
        search: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        offset: int = 0,
        limit: int = 20,
        sort_by: str | None = None,
    ) -> tuple[list[Product], int]:
        from app.models.category import Category

        base = select(Product).options(joinedload(Product.category))

        if category:
            base = base.join(Category).where(Category.name.ilike(f"%{category}%"))

        if category_id:
            base = base.where(Product.category_id == category_id)

        if search:
            base = base.where(Product.name.ilike(f"%{search}%"))

        if min_price is not None:
            base = base.where(Product.price >= min_price)

        if max_price is not None:
            base = base.where(Product.price <= max_price)

        # Count
        count_q = select(func.count()).select_from(base.subquery())
        total = (await self.db.execute(count_q)).scalar() or 0

        # Sorting
        if sort_by == "price_asc":
            base = base.order_by(Product.price.asc())
        elif sort_by == "price_desc":
            base = base.order_by(Product.price.desc())
        elif sort_by == "rating":
            base = base.order_by(Product.rating.desc())
        elif sort_by == "popular":
            base = base.order_by(Product.review_count.desc())
        else:
            base = base.order_by(Product.created_at.desc())

        q = base.offset(offset).limit(limit)
        result = await self.db.execute(q)
        return list(result.scalars().unique().all()), total

    async def get_featured(self, limit: int = 4) -> list[Product]:
        q = (
            select(Product)
            .options(joinedload(Product.category))
            .where(Product.is_featured.is_(True))
            .order_by(Product.rating.desc())
            .limit(limit)
        )
        result = await self.db.execute(q)
        return list(result.scalars().unique().all())

    async def get_trending(self, limit: int = 8) -> list[Product]:
        q = (
            select(Product)
            .options(joinedload(Product.category))
            .where(Product.is_trending.is_(True))
            .order_by(Product.review_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(q)
        return list(result.scalars().unique().all())

    async def create(self, **kwargs) -> Product:
        product = Product(**kwargs)
        self.db.add(product)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def update(self, product: Product, **kwargs) -> Product:
        for k, v in kwargs.items():
            if v is not None:
                setattr(product, k, v)
        await self.db.flush()
        await self.db.refresh(product)
        return product

    async def delete(self, product: Product) -> None:
        await self.db.delete(product)
        await self.db.flush()

    async def get_top_by_reviews(self, limit: int = 10) -> list[Product]:
        q = (
            select(Product)
            .options(joinedload(Product.category))
            .order_by(Product.review_count.desc())
            .limit(limit)
        )
        result = await self.db.execute(q)
        return list(result.scalars().unique().all())
