"""
Seed script – populates the database with initial data.
Run:  python -m app.seed
"""
import asyncio
import logging

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import settings
from app.core.security import hash_password
from app.db.session import async_session_factory
from app.db.base import Base
from app.models.user import User
from app.models.category import Category
from app.models.product import Product

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# ───────────────────────── data ─────────────────────────

ADMIN_USER = {
    "name": "Admin",
    "email": "admin@auraskincare.com",
    "mobile": "+91-9000000000",
    "password": "Admin@123",
    "role": "admin",
}

DEMO_CUSTOMER = {
    "name": "Demo Customer",
    "email": "demo@auraskincare.com",
    "mobile": "+91-9111111111",
    "password": "Demo@123",
    "role": "customer",
}

CATEGORIES = ["Shampoo", "Face Cream", "Hair Care", "Skin Care"]

PRODUCTS = [
    {
        "name": "Rose Petal Hydrating Shampoo",
        "price": 599,
        "original_price": 799,
        "category": "Shampoo",
        "description": "A luxurious hydrating shampoo infused with real rose petals and argan oil. Gently cleanses while restoring moisture and shine to your hair.",
        "benefits": ["Deep hydration", "Adds natural shine", "Strengthens hair", "Pleasant rose fragrance"],
        "ingredients": ["Rosa Damascena Flower Water", "Argan Oil", "Keratin", "Vitamin E", "Aloe Vera"],
        "badge": "Bestseller",
        "rating": 4.8,
        "review_count": 234,
        "is_featured": True,
        "is_trending": True,
        "image_url": "/uploads/products/product-shampoo.jpg",
    },
    {
        "name": "Radiance Renewal Face Cream",
        "price": 1299,
        "original_price": None,
        "category": "Face Cream",
        "description": "An ultra-rich face cream that deeply nourishes and revitalizes your skin. Formulated with hyaluronic acid and retinol for a youthful, radiant glow.",
        "benefits": ["Anti-aging", "Deep moisturizing", "Reduces fine lines", "Brightens complexion"],
        "ingredients": ["Hyaluronic Acid", "Retinol", "Vitamin C", "Shea Butter", "Niacinamide"],
        "badge": "New",
        "rating": 4.9,
        "review_count": 412,
        "is_featured": True,
        "is_trending": False,
        "image_url": "/uploads/products/product-facecream.jpg",
    },
    {
        "name": "Silk Repair Hair Serum",
        "price": 899,
        "original_price": None,
        "category": "Hair Care",
        "description": "A lightweight yet powerful hair serum that repairs damaged hair from root to tip. Infused with silk proteins and lavender essential oil.",
        "benefits": ["Repairs split ends", "Reduces frizz", "Heat protection", "Adds silky texture"],
        "ingredients": ["Silk Proteins", "Lavender Oil", "Argan Oil", "Biotin", "Jojoba Oil"],
        "badge": None,
        "rating": 4.7,
        "review_count": 189,
        "is_featured": False,
        "is_trending": True,
        "image_url": "/uploads/products/product-haircare.jpg",
    },
    {
        "name": "Golden Glow Facial Serum",
        "price": 1499,
        "original_price": 1899,
        "category": "Skin Care",
        "description": "A premium facial serum with 24K gold particles and vitamin C. Delivers intense hydration and a luminous, dewy finish.",
        "benefits": ["Intense hydration", "Luminous glow", "Firms skin", "Reduces dark spots"],
        "ingredients": ["24K Gold", "Vitamin C", "Squalane", "Rosehip Oil", "Peptides"],
        "badge": "Top Rated",
        "rating": 4.9,
        "review_count": 567,
        "is_featured": True,
        "is_trending": True,
        "image_url": "/uploads/products/product-skincare.jpg",
    },
    {
        "name": "Velvet Body Lotion",
        "price": 699,
        "original_price": None,
        "category": "Skin Care",
        "description": "A velvety smooth body lotion that melts into your skin, providing 24-hour hydration with a subtle floral scent.",
        "benefits": ["24hr hydration", "Non-greasy", "Softens skin", "Subtle fragrance"],
        "ingredients": ["Shea Butter", "Coconut Oil", "Vitamin E", "Chamomile Extract", "Glycerin"],
        "badge": None,
        "rating": 4.6,
        "review_count": 156,
        "is_featured": False,
        "is_trending": False,
        "image_url": "/uploads/products/product-bodylotion.jpg",
    },
    {
        "name": "Cherry Blossom Lip Balm",
        "price": 349,
        "original_price": None,
        "category": "Skin Care",
        "description": "A nourishing lip balm infused with cherry blossom extract. Keeps lips soft, plump, and beautifully hydrated all day.",
        "benefits": ["Moisturizes lips", "Natural tint", "SPF protection", "Long-lasting"],
        "ingredients": ["Cherry Blossom Extract", "Beeswax", "Vitamin E", "Jojoba Oil", "Rosehip Oil"],
        "badge": None,
        "rating": 4.5,
        "review_count": 298,
        "is_featured": False,
        "is_trending": False,
        "image_url": "/uploads/products/product-lipcare.jpg",
    },
    {
        "name": "Lavender Eye Revive Cream",
        "price": 1099,
        "original_price": None,
        "category": "Face Cream",
        "description": "A delicate eye cream specifically formulated to reduce puffiness, dark circles, and fine lines around the eye area.",
        "benefits": ["Reduces dark circles", "Minimizes puffiness", "Smooths fine lines", "Brightens under-eye"],
        "ingredients": ["Lavender Extract", "Caffeine", "Peptides", "Hyaluronic Acid", "Cucumber Extract"],
        "badge": None,
        "rating": 4.8,
        "review_count": 203,
        "is_featured": True,
        "is_trending": False,
        "image_url": "/uploads/products/product-eyecream.jpg",
    },
    {
        "name": "Botanical Sun Shield SPF 50",
        "price": 999,
        "original_price": None,
        "category": "Skin Care",
        "description": "A lightweight, non-greasy sunscreen with broad-spectrum SPF 50 protection. Enriched with botanical extracts for added skin benefits.",
        "benefits": ["SPF 50 protection", "Non-greasy", "Moisturizing", "No white cast"],
        "ingredients": ["Zinc Oxide", "Green Tea Extract", "Aloe Vera", "Vitamin E", "Chamomile"],
        "badge": "Essential",
        "rating": 4.7,
        "review_count": 178,
        "is_featured": False,
        "is_trending": True,
        "image_url": "/uploads/products/product-sunscreen.jpg",
    },
]


# ───────────────────────── helpers ──────────────────────

async def _seed_users(session: AsyncSession) -> None:
    existing = (await session.execute(select(User).where(User.email == ADMIN_USER["email"]))).scalar_one_or_none()
    if existing:
        log.info("Admin user already exists – skipping users")
        return

    for u in [ADMIN_USER, DEMO_CUSTOMER]:
        user = User(
            name=u["name"],
            email=u["email"],
            mobile=u["mobile"],
            password_hash=hash_password(u["password"]),
            role=u["role"],
        )
        session.add(user)
    await session.flush()
    log.info("Seeded 2 users (admin + demo customer)")


async def _seed_categories(session: AsyncSession) -> dict[str, int]:
    existing = (await session.execute(select(Category))).scalars().all()
    if existing:
        log.info("Categories already exist – skipping")
        return {c.name: c.id for c in existing}

    cat_map: dict[str, int] = {}
    for name in CATEGORIES:
        cat = Category(name=name)
        session.add(cat)
        await session.flush()
        cat_map[name] = cat.id
    log.info(f"Seeded {len(CATEGORIES)} categories")
    return cat_map


async def _seed_products(session: AsyncSession, cat_map: dict[str, int]) -> None:
    existing = (await session.execute(select(Product).limit(1))).scalar_one_or_none()
    if existing:
        log.info("Products already exist – skipping")
        return

    for p in PRODUCTS:
        product = Product(
            name=p["name"],
            price=p["price"],
            original_price=p["original_price"],
            category_id=cat_map[p["category"]],
            description=p["description"],
            benefits=p["benefits"],
            ingredients=p["ingredients"],
            badge=p["badge"],
            rating=p["rating"],
            review_count=p["review_count"],
            is_featured=p["is_featured"],
            is_trending=p["is_trending"],
            image_url=p["image_url"],
            stock=100,
        )
        session.add(product)
    await session.flush()
    log.info(f"Seeded {len(PRODUCTS)} products")


# ───────────────────────── main ─────────────────────────

async def main() -> None:
    log.info("Starting seed …")
    async with async_session_factory() as session:
        await _seed_users(session)
        cat_map = await _seed_categories(session)
        await _seed_products(session, cat_map)
        await session.commit()
    log.info("Seed complete ✓")


if __name__ == "__main__":
    asyncio.run(main())
