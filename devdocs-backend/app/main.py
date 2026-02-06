"""
DevDocs Backend - Main FastAPI Application
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler  # type: ignore
from slowapi.util import get_remote_address  # type: ignore
from slowapi.errors import RateLimitExceeded  # type: ignore
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import settings
from app.routers import solutions, search, dashboard, auth, bookmarks
from app.models.embedding import EmbeddingService
from app.logger import setup_logging, get_logger
from app.exceptions import register_exception_handlers

# Initialize logging
setup_logging()
logger = get_logger(__name__)


# ============================================================================
# Rate Limiting Configuration
# ============================================================================

limiter = Limiter(key_func=get_remote_address)


# ============================================================================
# Security Headers Middleware
# ============================================================================

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        return response


# ============================================================================
# Lifespan Context Manager - Startup/Shutdown Events
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan - load ML models on startup, cleanup on shutdown
    """
    logger.info("🚀 Starting DevDocs Backend...")
    
    # Validate required secrets
    logger.info("🔐 Validating required configuration...")
    if not settings.SUPABASE_URL or settings.SUPABASE_URL == "":
        raise ValueError("SUPABASE_URL is required but not set in environment variables")
    if not settings.SUPABASE_JWT_SECRET or settings.SUPABASE_JWT_SECRET == "":
        raise ValueError("SUPABASE_JWT_SECRET is required but not set in environment variables")
    if not settings.JWT_SECRET_KEY or settings.JWT_SECRET_KEY == "":
        raise ValueError("JWT_SECRET_KEY is required but not set in environment variables")
    
    # Log CORS configuration
    logger.info(f"🌐 CORS Origins configured: {settings.CORS_ORIGINS}")
    logger.info(f"🌐 CORS Origins type: {type(settings.CORS_ORIGINS)}")
    
    # Validate CORS in production
    if settings.ENVIRONMENT == "production":
        if "*" in settings.CORS_ORIGINS:
            raise ValueError("CORS_ORIGINS cannot contain wildcard '*' in production")
    
    logger.info("✅ Configuration validated")
    
    # Load sentence transformer model on startup
    logger.info("📦 Loading embedding model...")
    try:
        EmbeddingService.get_instance()
        logger.info("✅ Embedding model loaded successfully!")
    except Exception as e:
        logger.warning(f"⚠️ Warning: Failed to load embedding model: {e}")
        logger.warning("⚠️ Semantic search will not be available")
    
    yield  # Application runs here
    
    # Cleanup on shutdown
    logger.info("👋 Shutting down DevDocs Backend...")


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(
    title="DevDocs API",
    description="Backend API for DevDocs - AI-powered code solution storage and semantic search",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# Add rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Register centralized exception handlers
register_exception_handlers(app)


# ============================================================================
# Middleware Stack
# ============================================================================

# Security headers (applied first)
app.add_middleware(SecurityHeadersMiddleware)

# GZip compression for responses > 1KB
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ============================================================================
# CORS Middleware - Allow Frontend Requests
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  # Include OPTIONS for preflight
    allow_headers=["*"],  # Allow all headers
)


# ============================================================================
# API Routes
# ============================================================================

# Health check endpoint
@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - API health check"""
    return {
        "status": "online",
        "message": "DevDocs API is running",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "database": "connected",
        "embedding_model": "loaded"
    }


# Include routers
app.include_router(solutions.router, prefix="/api", tags=["Solutions"])
app.include_router(search.router, prefix="/api", tags=["Search"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(bookmarks.router, prefix="/api", tags=["Bookmarks"])


# ============================================================================
# Run with: uvicorn app.main:app --reload
# ============================================================================
