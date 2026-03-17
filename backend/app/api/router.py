from __future__ import annotations

from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.categories import router as category_router
from app.api.products import router as product_router
from app.api.cart import router as cart_router
from app.api.orders import router as order_router
from app.api.wishlist import router as wishlist_router
from app.api.reviews import router as review_router
from app.api.search import router as search_router
from app.api.chat import router as chat_router
from app.api.admin import router as admin_router
from app.api.upload import router as upload_router
from app.api.analytics import router as analytics_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(category_router, prefix="/categories", tags=["Categories"])
api_router.include_router(product_router, prefix="/products", tags=["Products"])
api_router.include_router(cart_router, prefix="/cart", tags=["Cart"])
api_router.include_router(order_router, prefix="/orders", tags=["Orders"])
api_router.include_router(wishlist_router, prefix="/wishlist", tags=["Wishlist"])
api_router.include_router(review_router, prefix="/reviews", tags=["Reviews"])
api_router.include_router(search_router, prefix="/search", tags=["Search"])
api_router.include_router(chat_router, prefix="/chat", tags=["Chat"])
api_router.include_router(admin_router, prefix="/admin", tags=["Admin"])
api_router.include_router(upload_router, prefix="/upload", tags=["Upload"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["Analytics"])
