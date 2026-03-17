from __future__ import annotations

import math

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import settings
from app.models.product import Product
from app.repositories.cart_repo import CartRepository
from app.repositories.order_repo import OrderRepository
from app.schemas.commerce import OrderItemOut, OrderOut


def _order_to_out(order) -> OrderOut:
    items = []
    for oi in order.items:
        items.append(
            OrderItemOut(
                id=oi.id,
                product_id=oi.product_id,
                product_name=oi.product.name if oi.product else "",
                product_image=oi.product.image_url if oi.product else None,
                quantity=oi.quantity,
                price=oi.price,
            )
        )
    return OrderOut(
        id=order.id,
        order_number=order.order_number,
        order_status=order.order_status,
        total_price=order.total_price,
        shipping_address=order.shipping_address,
        created_at=order.created_at,
        items=items,
    )


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.cart_repo = CartRepository(db)

    async def create_order(
        self,
        user_id: int | None,
        shipping_address: str | None,
        submitted_items: list[tuple[int, int]] | None = None,
    ) -> OrderOut:
        """Create order from submitted items (client-side cart) or DB cart."""
        items: list[dict] = []
        total = 0.0

        if submitted_items:
            # Build order from client-submitted cart items
            product_ids = [pid for pid, _ in submitted_items]
            qty_map = {pid: qty for pid, qty in submitted_items}
            result = await self.db.execute(
                select(Product).where(Product.id.in_(product_ids))
            )
            products = {p.id: p for p in result.scalars().all()}

            for pid, qty in submitted_items:
                product = products.get(pid)
                if not product:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Product {pid} not found",
                    )
                price = product.price
                items.append({"product_id": pid, "quantity": qty, "price": price})
                total += price * qty
        elif user_id:
            # Fallback: build order from DB cart
            cart = await self.cart_repo.get_cart(user_id)
            if not cart or not cart.items:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty"
                )
            for ci in cart.items:
                price = ci.product.price if ci.product else 0
                items.append({"product_id": ci.product_id, "quantity": ci.quantity, "price": price})
                total += price * ci.quantity
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No items provided and no user cart found",
            )

        if not items:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No items to order")

        order = await self.order_repo.create(user_id, round(total, 2), shipping_address, items)

        # Clear DB cart if user is authenticated
        if user_id:
            cart = await self.cart_repo.get_cart(user_id)
            if cart and cart.items:
                await self.cart_repo.clear_cart(cart)

        # Re-fetch with relations
        order = await self.order_repo.get_by_id(order.id)
        return _order_to_out(order)

    async def get_order(self, order_id: int, user_id: int | None = None) -> OrderOut:
        order = await self.order_repo.get_by_id(order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        if user_id and order.user_id != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your order")
        return _order_to_out(order)

    async def list_orders(self, user_id: int, page: int = 1, limit: int = 20) -> dict:
        limit = min(limit, settings.MAX_PAGE_SIZE)
        offset = (page - 1) * limit
        orders, total = await self.order_repo.list_by_user(user_id, offset, limit)
        return {
            "items": [_order_to_out(o) for o in orders],
            "total_items": total,
            "total_pages": math.ceil(total / limit) if limit else 1,
            "current_page": page,
        }

    async def list_all_orders(self, page: int = 1, limit: int = 20) -> dict:
        limit = min(limit, settings.MAX_PAGE_SIZE)
        offset = (page - 1) * limit
        orders, total = await self.order_repo.list_all(offset, limit)
        return {
            "items": [_order_to_out(o) for o in orders],
            "total_items": total,
            "total_pages": math.ceil(total / limit) if limit else 1,
            "current_page": page,
        }

    async def update_status(self, order_id: int, new_status: str) -> OrderOut:
        order = await self.order_repo.get_by_id(order_id)
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        order = await self.order_repo.update_status(order, new_status)
        order = await self.order_repo.get_by_id(order.id)
        return _order_to_out(order)
