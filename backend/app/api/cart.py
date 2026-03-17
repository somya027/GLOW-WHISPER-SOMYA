from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.commerce import CartAddRequest, CartRemoveRequest, CartUpdateRequest
from app.schemas.common import APIResponse
from app.services.cart_service import CartService

router = APIRouter()


@router.get("", response_model=APIResponse)
async def get_cart(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = CartService(db)
    cart = await svc.get_cart(user.id)
    return APIResponse(data=cart)


@router.post("/add", response_model=APIResponse)
async def add_to_cart(
    data: CartAddRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = CartService(db)
    cart = await svc.add_item(user.id, data.product_id, data.quantity)
    return APIResponse(data=cart, message="Item added to cart")


@router.put("/update", response_model=APIResponse)
async def update_cart(
    data: CartUpdateRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = CartService(db)
    cart = await svc.update_item(user.id, data.product_id, data.quantity)
    return APIResponse(data=cart)


@router.delete("/remove", response_model=APIResponse)
async def remove_from_cart(
    data: CartRemoveRequest,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = CartService(db)
    cart = await svc.remove_item(user.id, data.product_id)
    return APIResponse(data=cart, message="Item removed from cart")
