from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db, get_optional_user
from app.models.user import User
from app.repositories.chat_repo import ChatRepository
from app.schemas.commerce import ChatMessageOut, ChatMessageRequest, ChatSessionOut, ChatStartRequest
from app.schemas.common import APIResponse

router = APIRouter()


@router.post("/session/start", response_model=APIResponse)
async def start_session(
    data: ChatStartRequest,
    db: AsyncSession = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    repo = ChatRepository(db)
    uid = data.user_id or (user.id if user else None)
    session = await repo.start_session(uid)
    return APIResponse(data=ChatSessionOut.model_validate(session))


@router.post("/message", response_model=APIResponse)
async def send_message(
    data: ChatMessageRequest,
    db: AsyncSession = Depends(get_db),
):
    repo = ChatRepository(db)
    session = await repo.get_session(data.session_id)
    if not session:
        return APIResponse(success=False, message="Session not found")

    # Save user message
    await repo.add_message(data.session_id, "user", data.content)

    # Placeholder bot response (phase 2 will integrate real AI)
    bot_response = _simple_bot_response(data.content)
    msg = await repo.add_message(data.session_id, "assistant", bot_response)

    return APIResponse(data=ChatMessageOut.model_validate(msg))


@router.get("/session/{session_id}", response_model=APIResponse)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)):
    repo = ChatRepository(db)
    session = await repo.get_session(session_id)
    if not session:
        return APIResponse(success=False, message="Session not found")
    messages = await repo.get_messages(session_id)
    return APIResponse(
        data={
            "session": ChatSessionOut.model_validate(session),
            "messages": [ChatMessageOut.model_validate(m) for m in messages],
        }
    )


def _simple_bot_response(message: str) -> str:
    """Keyword-based placeholder bot (to be replaced with LLM in phase 2)."""
    lower = message.lower()
    if any(kw in lower for kw in ["face cream", "moisturizer", "face"]):
        return (
            "I'd recommend our **Radiance Renewal Face Cream** — it's our bestseller with "
            "hyaluronic acid and retinol for a youthful glow! Would you like to know more?"
        )
    if any(kw in lower for kw in ["shampoo", "hair"]):
        return (
            "Our **Rose Petal Hydrating Shampoo** is perfect! Infused with real rose petals "
            "and argan oil, it deeply hydrates while adding shine. Want me to add it to your cart?"
        )
    if any(kw in lower for kw in ["skin", "skincare", "routine"]):
        return (
            "For a complete skincare routine, I suggest: 1. **Golden Glow Facial Serum** in the morning, "
            "2. **Botanical Sun Shield SPF 50** for protection, and 3. **Lavender Eye Revive Cream** at night."
        )
    return (
        "Thank you for reaching out! 🌸 I'm here to help you find the perfect beauty products. "
        "Ask me about face creams, shampoos, skincare routines, or any product from our collection!"
    )
