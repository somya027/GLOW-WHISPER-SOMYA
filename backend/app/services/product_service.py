from __future__ import annotations

import math

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import settings
from app.repositories.product_repo import ProductRepository
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate


def _product_to_out(p) -> ProductOut:
    """Map ORM Product (with joined category) to ProductOut schema."""
    return ProductOut(
        id=p.id,
        name=p.name,
        price=p.price,
        originalPrice=p.original_price,
        rating=p.rating,
        reviews=p.review_count,
        image=p.image_url,
        category=p.category.name if p.category else "",
        description=p.description,
        benefits=p.benefits or [],
        ingredients=p.ingredients or [],
        badge=p.badge,
        stock=p.stock,
        is_featured=p.is_featured,
        is_trending=p.is_trending,
        created_at=p.created_at,
    )


class ProductService:
    def __init__(self, db: AsyncSession):
        self.repo = ProductRepository(db)

    async def list_products(
        self,
        *,
        category: str | None = None,
        category_id: int | None = None,
        search: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        page: int = 1,
        limit: int = 20,
        sort_by: str | None = None,
    ) -> dict:
        limit = min(limit, settings.MAX_PAGE_SIZE)
        offset = (page - 1) * limit

        products, total = await self.repo.list_products(
            category=category,
            category_id=category_id,
            search=search,
            min_price=min_price,
            max_price=max_price,
            offset=offset,
            limit=limit,
            sort_by=sort_by,
        )
        return {
            "items": [_product_to_out(p) for p in products],
            "total_items": total,
            "total_pages": math.ceil(total / limit) if limit else 1,
            "current_page": page,
        }

    async def get_by_id(self, product_id: int) -> ProductOut:
        p = await self.repo.get_by_id(product_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return _product_to_out(p)

    async def get_featured(self) -> list[ProductOut]:
        products = await self.repo.get_featured()
        return [_product_to_out(p) for p in products]

    async def get_trending(self) -> list[ProductOut]:
        products = await self.repo.get_trending()
        return [_product_to_out(p) for p in products]

    async def create(self, data: ProductCreate) -> ProductOut:
        p = await self.repo.create(**data.model_dump())
        # Re-fetch with joined category
        p = await self.repo.get_by_id(p.id)
        return _product_to_out(p)

    async def update(self, product_id: int, data: ProductUpdate) -> ProductOut:
        p = await self.repo.get_by_id(product_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        update_data = data.model_dump(exclude_unset=True)
        p = await self.repo.update(p, **update_data)
        p = await self.repo.get_by_id(p.id)
        return _product_to_out(p)

    async def delete(self, product_id: int) -> None:
        p = await self.repo.get_by_id(product_id)
        if not p:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        await self.repo.delete(p)

    async def get_top_products(self, limit: int = 10) -> list[ProductOut]:
        products = await self.repo.get_top_by_reviews(limit)
        return [_product_to_out(p) for p in products]
