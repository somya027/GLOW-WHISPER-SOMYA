from __future__ import annotations

import math

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_admin_user, get_db
from app.models.user import User
from app.repositories.chat_repo import ChatRepository
from app.repositories.user_repo import UserRepository
from app.schemas.auth import UserOut
from app.schemas.commerce import ChatSessionOut
from app.schemas.common import APIResponse
from app.services.order_service import OrderService
from app.services.product_service import ProductService

router = APIRouter()


@router.get("/users", response_model=APIResponse)
async def admin_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    repo = UserRepository(db)
    offset = (page - 1) * limit
    users, total = await repo.list_all(offset, limit)
    return APIResponse(
        data={
            "items": [UserOut.model_validate(u) for u in users],
            "total_items": total,
            "total_pages": math.ceil(total / limit) if limit else 1,
            "current_page": page,
        }
    )


@router.get("/orders", response_model=APIResponse)
async def admin_orders(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    svc = OrderService(db)
    result = await svc.list_all_orders(page, limit)
    return APIResponse(data=result)


@router.get("/products", response_model=APIResponse)
async def admin_products(
    page: int = Query(1, ge=1),
    limit: int = Query(100, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    svc = ProductService(db)
    result = await svc.list_products(page=page, limit=limit)
    return APIResponse(data=result)


@router.get("/chat-sessions", response_model=APIResponse)
async def admin_chat_sessions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    repo = ChatRepository(db)
    offset = (page - 1) * limit
    sessions, total = await repo.list_sessions(offset, limit)
    return APIResponse(
        data={
            "items": [ChatSessionOut.model_validate(s) for s in sessions],
            "total_items": total,
            "total_pages": math.ceil(total / limit) if limit else 1,
            "current_page": page,
        }
    )
