from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


# ── Cart ──
class CartAddRequest(BaseModel):
    product_id: int
    quantity: int = 1


class CartUpdateRequest(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=0)


class CartRemoveRequest(BaseModel):
    product_id: int


class CartItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_price: float
    product_image: str | None
    product_category: str
    quantity: int

    model_config = {"from_attributes": True}


class CartOut(BaseModel):
    items: list[CartItemOut]
    total: float
    count: int


# ── Orders ──
class OrderItemRequest(BaseModel):
    product_id: int
    quantity: int = Field(..., ge=1)


class OrderCreateRequest(BaseModel):
    shipping_address: str | None = None
    items: list[OrderItemRequest] = Field(default_factory=list)


class OrderStatusUpdate(BaseModel):
    order_status: str


class OrderItemOut(BaseModel):
    id: int
    product_id: int
    product_name: str
    product_image: str | None
    quantity: int
    price: float

    model_config = {"from_attributes": True}


class OrderOut(BaseModel):
    id: int
    order_number: str
    order_status: str
    total_price: float
    shipping_address: str | None
    created_at: datetime
    items: list[OrderItemOut]

    model_config = {"from_attributes": True}


# ── Wishlist ──
class WishlistAddRequest(BaseModel):
    product_id: int


class WishlistRemoveRequest(BaseModel):
    product_id: int


class WishlistItemOut(BaseModel):
    id: int
    product_id: int

    model_config = {"from_attributes": True}


# ── Reviews ──
class ReviewCreate(BaseModel):
    product_id: int
    rating: float = Field(..., ge=1, le=5)
    review_text: str | None = None


class ReviewOut(BaseModel):
    id: int
    user_id: int
    user_name: str | None = None
    product_id: int
    rating: float
    review_text: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Search ──
class SearchLogRequest(BaseModel):
    search_query: str = Field(..., min_length=1, max_length=255)


class TopSearchOut(BaseModel):
    query: str
    count: int


# ── Chat ──
class ChatStartRequest(BaseModel):
    user_id: int | None = None


class ChatMessageRequest(BaseModel):
    session_id: str
    content: str


class ChatMessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionOut(BaseModel):
    id: int
    session_id: str
    user_id: int | None
    is_anonymous: bool
    sentiment_score: float | None
    created_at: datetime

    model_config = {"from_attributes": True}
