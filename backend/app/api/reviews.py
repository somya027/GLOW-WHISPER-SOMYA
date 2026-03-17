from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.commerce import ReviewCreate
from app.schemas.common import APIResponse
from app.services.review_service import ReviewService

router = APIRouter()


@router.post("", response_model=APIResponse)
async def create_review(
    data: ReviewCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    svc = ReviewService(db)
    review = await svc.create_review(user, data)
    return APIResponse(data=review, message="Review posted")
