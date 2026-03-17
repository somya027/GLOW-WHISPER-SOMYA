# Aura Skincare — Backend API

Production-ready FastAPI backend for the Aura Skincare e-commerce platform.

## Tech Stack
- Python 3.11, FastAPI, SQLAlchemy (async), PostgreSQL, Alembic, JWT auth, bcrypt

## Quick Start (Docker)
```bash
docker-compose up --build
```

API available at `http://localhost:8000`
Docs at `http://localhost:8000/docs`

## Manual Setup
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
```

## Project Structure
```
backend/
├── app/
│   ├── api/          # Route handlers
│   ├── core/         # Config, security, dependencies
│   ├── db/           # Database engine & session
│   ├── models/       # SQLAlchemy ORM models
│   ├── schemas/      # Pydantic request/response schemas
│   ├── services/     # Business logic
│   ├── repositories/ # Database operations
│   ├── utils/        # Helpers
│   ├── main.py       # App entrypoint
│   └── seed.py       # Seed data script
├── uploads/products/ # Product images
├── alembic/          # Migrations
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```
