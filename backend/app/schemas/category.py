from __future__ import annotations

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: str | None = None


class CategoryUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class CategoryOut(BaseModel):
    id: int
    name: str
    description: str | None
    image: str | None = None  # Derived: first product image for that category

    model_config = {"from_attributes": True}
