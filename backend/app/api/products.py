from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_admin_user, get_db
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_products(
    category: str | None = Query(None),
    search: str | None = Query(None),
    min_price: float | None = Query(None),
    max_price: float | None = Query(None),
    sort_by: str | None = Query(None, pattern="^(price_asc|price_desc|rating|popular)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100, alias="page_size"),
    limit: int | None = Query(None, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    svc = ProductService(db)
    effective_limit = limit if limit is not None else page_size
    result = await svc.list_products(
        category=category,
        search=search,
        min_price=min_price,
        max_price=max_price,
        page=page,
        limit=effective_limit,
        sort_by=sort_by,
    )
    return APIResponse(data=result)


@router.get("/featured", response_model=APIResponse)
async def featured_products(db: AsyncSession = Depends(get_db)):
    svc = ProductService(db)
    data = await svc.get_featured()
    return APIResponse(data=data)


@router.get("/trending", response_model=APIResponse)
async def trending_products(db: AsyncSession = Depends(get_db)):
    svc = ProductService(db)
    data = await svc.get_trending()
    return APIResponse(data=data)


@router.get("/{product_id}", response_model=APIResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    svc = ProductService(db)
    data = await svc.get_by_id(product_id)
    return APIResponse(data=data)


@router.post("", response_model=APIResponse)
async def create_product(
    data: ProductCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    svc = ProductService(db)
    product = await svc.create(data)
    return APIResponse(data=product, message="Product created")


@router.put("/{product_id}", response_model=APIResponse)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    svc = ProductService(db)
    product = await svc.update(product_id, data)
    return APIResponse(data=product)


@router.delete("/{product_id}", response_model=APIResponse)
async def delete_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    svc = ProductService(db)
    await svc.delete(product_id)
    return APIResponse(message="Product deleted")


@router.get("/{product_id}/reviews", response_model=APIResponse)
async def product_reviews(product_id: int, db: AsyncSession = Depends(get_db)):
    from app.services.review_service import ReviewService
    svc = ReviewService(db)
    reviews = await svc.list_product_reviews(product_id)
    return APIResponse(data=reviews)
