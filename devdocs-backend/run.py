"""
DevDocs Backend - Quick Start Script

Run this to start the FastAPI server with hot reload
"""
import uvicorn
from app.config import settings

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 Starting DevDocs Backend API Server")
    print("=" * 70)
    print(f"📍 Environment: {settings.ENVIRONMENT}")
    print(f"🌐 Host: {settings.API_HOST}:{settings.API_PORT}")
    print(f"📚 API Docs: http://localhost:{settings.API_PORT}/api/docs")
    print(f"🔍 Health Check: http://localhost:{settings.API_PORT}/api/health")
    print("=" * 70)
    print("\n⏳ Loading embedding model (first run may take 1-2 minutes)...\n")
    
    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.API_RELOAD,
        log_level=settings.LOG_LEVEL.lower()
    )
