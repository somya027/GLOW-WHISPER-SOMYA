from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_admin_user, get_current_user, get_db, get_optional_user
from app.models.user import User
from app.schemas.commerce import OrderCreateRequest, OrderStatusUpdate
from app.schemas.common import APIResponse
from app.services.order_service import OrderService

router = APIRouter()


@router.post("", response_model=APIResponse)
async def create_order(
    data: OrderCreateRequest,
    user: User | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    svc = OrderService(db)
    order = await svc.create_order(
        user_id=user.id if user else None,
        shipping_address=data.shipping_address,
        submitted_items=[(it.product_id, it.quantity) for it in data.items] if data.items else None,
    )
    return APIResponse(data=order, message="Order placed successfully")


@router.get("", response_model=APIResponse)
async def list_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = OrderService(db)
    result = await svc.list_orders(user.id, page, limit)
    return APIResponse(data=result)


@router.get("/{order_id}", response_model=APIResponse)
async def get_order(
    order_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = OrderService(db)
    order = await svc.get_order(order_id, user.id)
    return APIResponse(data=order)


@router.put("/status", response_model=APIResponse)
async def update_order_status(
    order_id: int = Query(...),
    data: OrderStatusUpdate = ...,
    _admin: User = Depends(get_admin_user),
    db: AsyncSession = Depends(get_db),
):
    svc = OrderService(db)
    order = await svc.update_status(order_id, data.order_status)
    return APIResponse(data=order, message="Order status updated")
