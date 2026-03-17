from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.search_log import SearchLog


class SearchLogRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def log(self, search_query: str, user_id: int | None = None) -> SearchLog:
        sl = SearchLog(search_query=search_query, user_id=user_id)
        self.db.add(sl)
        await self.db.flush()
        await self.db.refresh(sl)
        return sl

    async def top_searches(self, limit: int = 20) -> list[tuple[str, int]]:
        q = (
            select(SearchLog.search_query, func.count(SearchLog.id).label("cnt"))
            .group_by(SearchLog.search_query)
            .order_by(func.count(SearchLog.id).desc())
            .limit(limit)
        )
        result = await self.db.execute(q)
        return [(row[0], row[1]) for row in result.all()]
