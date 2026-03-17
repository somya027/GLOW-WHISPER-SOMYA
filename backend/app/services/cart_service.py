from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.cart_repo import CartRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.commerce import CartItemOut, CartOut


def _cart_item_out(item) -> CartItemOut:
    return CartItemOut(
        id=item.id,
        product_id=item.product_id,
        product_name=item.product.name if item.product else "",
        product_price=item.product.price if item.product else 0,
        product_image=item.product.image_url if item.product else None,
        product_category=item.product.category.name if item.product and item.product.category else "",
        quantity=item.quantity,
    )


class CartService:
    def __init__(self, db: AsyncSession):
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)

    async def get_cart(self, user_id: int) -> CartOut:
        cart = await self.cart_repo.get_or_create_cart(user_id)
        items = [_cart_item_out(i) for i in cart.items]
        total = sum(i.product_price * i.quantity for i in items)
        count = sum(i.quantity for i in items)
        return CartOut(items=items, total=round(total, 2), count=count)

    async def add_item(self, user_id: int, product_id: int, quantity: int) -> CartOut:
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        cart = await self.cart_repo.get_or_create_cart(user_id)
        await self.cart_repo.add_item(cart, product_id, quantity)
        return await self.get_cart(user_id)

    async def update_item(self, user_id: int, product_id: int, quantity: int) -> CartOut:
        cart = await self.cart_repo.get_or_create_cart(user_id)
        await self.cart_repo.update_item(cart, product_id, quantity)
        return await self.get_cart(user_id)

    async def remove_item(self, user_id: int, product_id: int) -> CartOut:
        cart = await self.cart_repo.get_or_create_cart(user_id)
        await self.cart_repo.remove_item(cart, product_id)
        return await self.get_cart(user_id)
