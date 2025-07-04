from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from supabase import create_client, Client
from typing import AsyncGenerator
from .config import settings

# Database engine and models
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=20,  # Increased pool size for session pooler
    max_overflow=10,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_timeout=30,  # Added timeout
    echo=False  # Set to True for debugging SQL queries
)

# SQLAlchemy async session
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for SQLAlchemy models
Base = declarative_base()

# Supabase client singleton
_supabase: Client | None = None

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for getting database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()

def get_supabase() -> Client:
    """Get or create Supabase client instance"""
    global _supabase
    if not _supabase:
        _supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
    return _supabase 