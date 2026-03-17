from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.repositories.search_repo import SearchLogRepository
from app.schemas.commerce import TopSearchOut
from app.schemas.common import APIResponse
from app.services.product_service import ProductService

router = APIRouter()


@router.get("/top-searches", response_model=APIResponse)
async def top_searches(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    repo = SearchLogRepository(db)
    results = await repo.top_searches(limit)
    return APIResponse(data=[TopSearchOut(query=q, count=c) for q, c in results])


@router.get("/top-products", response_model=APIResponse)
async def top_products(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    svc = ProductService(db)
    products = await svc.get_top_products(limit)
    return APIResponse(data=products)


@router.get("/product-discovery", response_model=APIResponse)
async def product_discovery(db: AsyncSession = Depends(get_db)):
    """Aggregate endpoint for admin product discovery analytics."""
    svc = ProductService(db)
    top = await svc.get_top_products(5)
    featured = await svc.get_featured()
    trending = await svc.get_trending()
    return APIResponse(
        data={
            "top_products": top,
            "featured_products": featured,
            "trending_products": trending,
        }
    )
