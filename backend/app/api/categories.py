from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_admin_user, get_db
from app.models.user import User
from app.repositories.category_repo import CategoryRepository
from app.repositories.product_repo import ProductRepository
from app.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from app.schemas.common import APIResponse

router = APIRouter()


@router.get("", response_model=APIResponse)
async def list_categories(db: AsyncSession = Depends(get_db)):
    repo = CategoryRepository(db)
    cats = await repo.get_all()

    # Attach first product image per category
    prod_repo = ProductRepository(db)
    result = []
    for c in cats:
        products, _ = await prod_repo.list_products(category_id=c.id, limit=1)
        image = products[0].image_url if products else None
        result.append(CategoryOut(id=c.id, name=c.name, description=c.description, image=image))

    return APIResponse(data=result)


@router.post("", response_model=APIResponse)
async def create_category(
    data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    repo = CategoryRepository(db)
    cat = await repo.create(name=data.name, description=data.description)
    return APIResponse(data=CategoryOut.model_validate(cat), message="Category created")


@router.put("/{category_id}", response_model=APIResponse)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    repo = CategoryRepository(db)
    cat = await repo.get_by_id(category_id)
    if not cat:
        return APIResponse(success=False, message="Category not found")
    cat = await repo.update(cat, **data.model_dump(exclude_unset=True))
    return APIResponse(data=CategoryOut.model_validate(cat))


@router.delete("/{category_id}", response_model=APIResponse)
async def delete_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    repo = CategoryRepository(db)
    cat = await repo.get_by_id(category_id)
    if not cat:
        return APIResponse(success=False, message="Category not found")
    await repo.delete(cat)
    return APIResponse(message="Category deleted")
