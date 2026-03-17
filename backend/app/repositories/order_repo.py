from __future__ import annotations

import random
import string

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.order import Order, OrderItem


class OrderRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @staticmethod
    def _generate_order_number() -> str:
        suffix = "".join(random.choices(string.digits, k=6))
        return f"AURA-{suffix}"

    async def create(self, user_id: int | None, total_price: float, shipping_address: str | None, items: list[dict]) -> Order:
        order = Order(
            user_id=user_id,
            order_number=self._generate_order_number(),
            total_price=total_price,
            shipping_address=shipping_address,
        )
        self.db.add(order)
        await self.db.flush()

        for item in items:
            oi = OrderItem(order_id=order.id, **item)
            self.db.add(oi)
        await self.db.flush()
        await self.db.refresh(order)
        return order

    async def get_by_id(self, order_id: int) -> Order | None:
        q = select(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).where(Order.id == order_id)
        result = await self.db.execute(q)
        return result.unique().scalar_one_or_none()

    async def get_by_order_number(self, order_number: str) -> Order | None:
        q = select(Order).options(joinedload(Order.items).joinedload(OrderItem.product)).where(Order.order_number == order_number)
        result = await self.db.execute(q)
        return result.unique().scalar_one_or_none()

    async def list_by_user(self, user_id: int, offset: int = 0, limit: int = 20) -> tuple[list[Order], int]:
        count_q = select(func.count()).select_from(Order).where(Order.user_id == user_id)
        total = (await self.db.execute(count_q)).scalar() or 0

        q = (
            select(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        result = await self.db.execute(q)
        return list(result.scalars().unique().all()), total

    async def list_all(self, offset: int = 0, limit: int = 20) -> tuple[list[Order], int]:
        count_q = select(func.count()).select_from(Order)
        total = (await self.db.execute(count_q)).scalar() or 0

        q = (
            select(Order)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
            .order_by(Order.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        result = await self.db.execute(q)
        return list(result.scalars().unique().all()), total

    async def update_status(self, order: Order, status: str) -> Order:
        order.order_status = status
        await self.db.flush()
        await self.db.refresh(order)
        return order
