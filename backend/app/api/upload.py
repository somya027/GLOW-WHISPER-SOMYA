from __future__ import annotations

import os
import uuid

from fastapi import APIRouter, HTTPException, UploadFile, File, status

from app.core import settings

router = APIRouter()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
MAX_SIZE = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@router.post("/product-image", response_model=dict)
async def upload_product_image(file: UploadFile = File(...)):
    # Validate extension
    ext = os.path.splitext(file.filename or "")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {ext} not allowed. Use: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.MAX_UPLOAD_SIZE_MB}MB limit",
        )

    # Generate unique filename
    unique_name = f"{uuid.uuid4().hex}{ext}"
    save_path = os.path.join(settings.UPLOAD_DIR, "products", unique_name)

    with open(save_path, "wb") as f:
        f.write(content)

    url_path = f"/uploads/products/{unique_name}"
    return {"success": True, "data": {"url": url_path, "filename": unique_name}, "message": "Image uploaded"}
