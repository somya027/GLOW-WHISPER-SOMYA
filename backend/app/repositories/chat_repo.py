from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.chat import ChatMessage, ChatSession


class ChatRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def start_session(self, user_id: int | None = None) -> ChatSession:
        session_id = uuid.uuid4().hex[:16]
        cs = ChatSession(
            session_id=session_id,
            user_id=user_id,
            is_anonymous=user_id is None,
        )
        self.db.add(cs)
        await self.db.flush()
        await self.db.refresh(cs)
        return cs

    async def get_session(self, session_id: str) -> ChatSession | None:
        q = select(ChatSession).where(ChatSession.session_id == session_id)
        result = await self.db.execute(q)
        return result.scalar_one_or_none()

    async def add_message(self, session_id: str, role: str, content: str) -> ChatMessage:
        msg = ChatMessage(session_id=session_id, role=role, content=content)
        self.db.add(msg)
        await self.db.flush()
        await self.db.refresh(msg)
        return msg

    async def get_messages(self, session_id: str) -> list[ChatMessage]:
        q = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at)
        result = await self.db.execute(q)
        return list(result.scalars().all())

    async def list_sessions(self, offset: int = 0, limit: int = 20) -> tuple[list[ChatSession], int]:
        count_q = select(func.count()).select_from(ChatSession)
        total = (await self.db.execute(count_q)).scalar() or 0

        q = select(ChatSession).order_by(ChatSession.created_at.desc()).offset(offset).limit(limit)
        result = await self.db.execute(q)
        return list(result.scalars().all()), total
