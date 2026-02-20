"""
DevDocs Backend - Configuration Settings
"""
from pydantic_settings import BaseSettings
from typing import List
from pathlib import Path


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables (.env file)
    """
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/devdocs"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30
    
    # Application
    ENVIRONMENT: str = "development"  # production, staging, development
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # CORS - In development, allow all origins. In production, specify exact origins.
    CORS_ORIGINS: List[str] = ["*"]  # Allow all in development
    
    # Security
    JWT_SECRET_KEY: str  # REQUIRED - No default, must be set in .env
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440  # 24 hours
    
    # Supabase (REQUIRED for authentication)
    SUPABASE_URL: str  # REQUIRED - No default
    SUPABASE_JWT_SECRET: str  # REQUIRED - No default
    SUPABASE_KEY: str = ""  # Optional API key
    
    # AI/ML Settings
    EMBEDDING_MODEL: str = "sentence-transformers/all-mpnet-base-v2"
    EMBEDDING_DIMENSION: int = 768  # all-mpnet-base-v2 uses 768 dimensions
    MODEL_CACHE_DIR: str = str(Path.home() / ".cache" / "devdocs" / "models")
    
    # Supported Programming Languages
    SUPPORTED_LANGUAGES: List[str] = [
        "python", "javascript", "typescript", "java", "cpp", "c", "csharp", "go",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "dart", "r",
        "sql", "html", "css", "shell", "bash", "powershell", "dockerfile",
        "yaml", "json", "xml", "markdown", "other"
    ]

    # Gemini AI — for answer generation and smart tagging
    GEMINI_API_KEY: str = ""

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields in .env


# Global settings instance
try:
    settings = Settings(_env_file=".env")  # type: ignore[call-arg]
except Exception:
    # Fallback if .env not found
    settings = Settings()  # type: ignore[call-arg]
