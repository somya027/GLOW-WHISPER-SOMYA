from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.commerce import WishlistAddRequest, WishlistRemoveRequest
from app.schemas.common import APIResponse
from app.services.wishlist_service import WishlistService

router = APIRouter()


@router.get("", response_model=APIResponse)
async def get_wishlist(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WishlistService(db)
    products = await svc.list_wishlist(user.id)
    return APIResponse(data=products)


@router.get("/ids", response_model=APIResponse)
async def get_wishlist_ids(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WishlistService(db)
    ids = await svc.get_wishlist_ids(user.id)
    return APIResponse(data=ids)


@router.post("/add", response_model=APIResponse)
async def add_to_wishlist(
    data: WishlistAddRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WishlistService(db)
    result = await svc.add(user.id, data.product_id)
    return APIResponse(data=result, message="Added to wishlist")


@router.delete("/remove", response_model=APIResponse)
async def remove_from_wishlist(
    data: WishlistRemoveRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WishlistService(db)
    result = await svc.remove(user.id, data.product_id)
    return APIResponse(data=result, message="Removed from wishlist")


@router.post("/toggle", response_model=APIResponse)
async def toggle_wishlist(
    data: WishlistAddRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = WishlistService(db)
    result = await svc.toggle(user.id, data.product_id)
    return APIResponse(data=result)
