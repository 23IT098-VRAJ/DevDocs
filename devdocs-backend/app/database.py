"""
DevDocs Backend - Database Connection and Session Management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from typing import AsyncGenerator

from app.config import settings


# ============================================================================
# Convert PostgreSQL URL to Async Format
# ============================================================================
# postgresql:// -> postgresql+asyncpg://
DATABASE_URL = settings.DATABASE_URL.replace(
    "postgresql://", 
    "postgresql+asyncpg://"
)


# ============================================================================
# SQLAlchemy Async Engine
# ============================================================================

engine = create_async_engine(
    DATABASE_URL,
    echo=settings.ENVIRONMENT == "development",  # Log SQL queries in dev mode
    pool_size=settings.DATABASE_POOL_SIZE,
    max_overflow=settings.DATABASE_MAX_OVERFLOW,
    pool_timeout=settings.DATABASE_POOL_TIMEOUT,
    pool_pre_ping=True,  # Verify connections before using
)


# ============================================================================
# Session Factory
# ============================================================================

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ============================================================================
# Base Class for Models
# ============================================================================

Base = declarative_base()


# ============================================================================
# Dependency - Get Database Session
# ============================================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency to get database session
    
    Usage in routes:
        async def my_endpoint(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

