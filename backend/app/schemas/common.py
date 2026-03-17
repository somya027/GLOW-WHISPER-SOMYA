"""Shared schema primitives used across many modules."""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    success: bool = True
    data: T | None = None
    message: str | None = None


class PaginatedData(BaseModel, Generic[T]):
    items: list[T]
    total_items: int
    total_pages: int
    current_page: int


class PaginatedResponse(BaseModel, Generic[T]):
    success: bool = True
    data: PaginatedData[T] | None = None
    message: str | None = None
