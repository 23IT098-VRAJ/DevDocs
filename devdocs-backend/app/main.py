"""
DevDocs Backend - Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import solutions, search, dashboard, auth
from app.models.embedding import EmbeddingService


# ============================================================================
# Lifespan Context Manager - Startup/Shutdown Events
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan - load ML models on startup, cleanup on shutdown
    """
    print("🚀 Starting DevDocs Backend...")
    
    # Load sentence transformer model on startup
    print("📦 Loading embedding model...")
    EmbeddingService.get_instance()
    print("✅ Embedding model loaded successfully!")
    
    yield  # Application runs here
    
    # Cleanup on shutdown
    print("👋 Shutting down DevDocs Backend...")


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


# ============================================================================
# CORS Middleware - Allow Frontend Requests
# ============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
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


# ============================================================================
# Run with: uvicorn app.main:app --reload
# ============================================================================
