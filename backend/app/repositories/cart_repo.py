from __future__ import annotations

from sqlalchemy import select, delete as sa_delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.cart import Cart, CartItem


class CartRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_or_create_cart(self, user_id: int) -> Cart:
        q = select(Cart).options(joinedload(Cart.items).joinedload(CartItem.product)).where(Cart.user_id == user_id)
        result = await self.db.execute(q)
        cart = result.scalar_one_or_none()
        if cart is None:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            await self.db.flush()
            await self.db.refresh(cart)
        return cart

    async def get_cart(self, user_id: int) -> Cart | None:
        q = select(Cart).options(joinedload(Cart.items).joinedload(CartItem.product)).where(Cart.user_id == user_id)
        result = await self.db.execute(q)
        return result.scalar_one_or_none()

    async def add_item(self, cart: Cart, product_id: int, quantity: int) -> CartItem:
        # Check if item already exists
        for item in cart.items:
            if item.product_id == product_id:
                item.quantity += quantity
                await self.db.flush()
                await self.db.refresh(item)
                return item

        item = CartItem(cart_id=cart.id, product_id=product_id, quantity=quantity)
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def update_item(self, cart: Cart, product_id: int, quantity: int) -> CartItem | None:
        for item in cart.items:
            if item.product_id == product_id:
                if quantity <= 0:
                    await self.db.delete(item)
                    await self.db.flush()
                    return None
                item.quantity = quantity
                await self.db.flush()
                await self.db.refresh(item)
                return item
        return None

    async def remove_item(self, cart: Cart, product_id: int) -> bool:
        for item in cart.items:
            if item.product_id == product_id:
                await self.db.delete(item)
                await self.db.flush()
                return True
        return False

    async def clear_cart(self, cart: Cart) -> None:
        await self.db.execute(sa_delete(CartItem).where(CartItem.cart_id == cart.id))
        await self.db.flush()
