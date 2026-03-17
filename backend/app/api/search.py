from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_optional_user
from app.models.user import User
from app.repositories.search_repo import SearchLogRepository
from app.schemas.commerce import SearchLogRequest
from app.schemas.common import APIResponse

router = APIRouter()


@router.post("/log", response_model=APIResponse)
async def log_search(
    data: SearchLogRequest,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    repo = SearchLogRepository(db)
    await repo.log(data.search_query, user.id if user else None)
    return APIResponse(message="Search logged")
