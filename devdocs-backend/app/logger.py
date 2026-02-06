"""
DevDocs Backend - Logging Configuration
"""
import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler
from datetime import datetime

from app.config import settings


def setup_logging():
    """
    Configure application-wide logging with file rotation
    
    Logs Structure:
    - logs/devdocs_YYYY-MM-DD.log (current log file)
    - Auto-rotates at 10MB per file
    - Keeps 10 backup files
    - Both console and file output
    """
    
    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)
    
    # Generate log filename with date
    log_filename = log_dir / f"devdocs_{datetime.now().strftime('%Y-%m-%d')}.log"
    
    # Root logger configuration
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG)
    
    # Clear existing handlers
    root_logger.handlers.clear()
    
    # Formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s:%(funcName)s:%(lineno)d | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )
    
    # Console Handler (stdout)
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)
    root_logger.addHandler(console_handler)
    
    # File Handler with rotation (10MB per file, keep 10 backups)
    file_handler = RotatingFileHandler(
        filename=log_filename,
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=10,
        encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)
    
    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    logging.getLogger("sentence_transformers").setLevel(logging.WARNING)
    
    return root_logger


# Create app logger instance
logger = logging.getLogger("devdocs")


def get_logger(name: str = "devdocs") -> logging.Logger:
    """
    Get a logger instance for a specific module
    
    Usage:
        from app.logger import get_logger
        logger = get_logger(__name__)
        logger.info("Something happened")
    """
    return logging.getLogger(name)
