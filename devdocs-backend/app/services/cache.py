"""
Redis-backed embedding cache.

Caches (text → embedding vector) pairs so repeated or identical queries
skip the ~400ms model inference step entirely.

Falls back gracefully — if Redis is unreachable, the app continues normally
with every request going through the model.
"""
import hashlib
import json
from typing import List, Optional

import redis.asyncio as aioredis

from app.config import settings
from app.logger import get_logger

logger = get_logger(__name__)

_redis: Optional[aioredis.Redis] = None  # type: ignore[type-arg]


async def init_redis() -> None:
    """Connect to Redis. Called once at application startup."""
    global _redis
    try:
        _redis = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_connect_timeout=2,
            socket_timeout=2,
        )
        await _redis.ping()
        logger.info("✅ Redis connected — embedding cache active")
    except Exception as e:
        logger.warning(f"⚠️  Redis not available ({e}). Embedding cache disabled — app will work normally.")
        _redis = None


async def close_redis() -> None:
    """Disconnect from Redis on shutdown."""
    global _redis
    if _redis:
        await _redis.aclose()
        logger.info("👋 Redis connection closed")


def _key(text: str) -> str:
    """SHA-256 hash of text used as Redis key, prefixed with namespace."""
    digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
    return f"devdocs:emb:{digest}"


async def get_cached_embedding(text: str) -> Optional[List[float]]:
    """Return cached embedding for *text*, or None if not in cache."""
    if _redis is None:
        return None
    try:
        raw = await _redis.get(_key(text))
        if raw:
            return json.loads(raw)
    except Exception as e:
        logger.debug(f"Cache GET failed (non-fatal): {e}")
    return None


async def set_cached_embedding(text: str, embedding: List[float]) -> None:
    """Store *embedding* for *text* with the configured TTL."""
    if _redis is None:
        return
    try:
        await _redis.setex(_key(text), settings.REDIS_EMBEDDING_TTL, json.dumps(embedding))
    except Exception as e:
        logger.debug(f"Cache SET failed (non-fatal): {e}")


async def cache_stats() -> dict:
    """Return basic cache info for the health endpoint."""
    if _redis is None:
        return {"status": "disabled"}
    try:
        info = await _redis.info("stats")
        return {
            "status": "active",
            "hits": info.get("keyspace_hits", 0),
            "misses": info.get("keyspace_misses", 0),
        }
    except Exception:
        return {"status": "error"}
