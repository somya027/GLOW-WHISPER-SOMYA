from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: str
    price: float = Field(..., gt=0)
    original_price: float | None = None
    category_id: int
    stock: int = 100
    image_url: str | None = None
    badge: str | None = None
    benefits: list[str] | None = None
    ingredients: list[str] | None = None
    is_featured: bool = False
    is_trending: bool = False


class ProductUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = Field(None, gt=0)
    original_price: float | None = None
    category_id: int | None = None
    stock: int | None = None
    image_url: str | None = None
    badge: str | None = None
    benefits: list[str] | None = None
    ingredients: list[str] | None = None
    is_featured: bool | None = None
    is_trending: bool | None = None


class ProductOut(BaseModel):
    """Shape matches frontend Product interface."""
    id: int
    name: str
    price: float
    originalPrice: float | None = None
    rating: float
    reviews: int = 0
    image: str | None = None
    category: str  # category name, not id
    description: str
    benefits: list[str] | None = None
    ingredients: list[str] | None = None
    badge: str | None = None
    stock: int
    is_featured: bool
    is_trending: bool
    created_at: datetime

    model_config = {"from_attributes": True}
