"""
DevDocs Backend - Centralized Exception Handler
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import IntegrityError, OperationalError, DBAPIError
from slowapi.errors import RateLimitExceeded  # type: ignore
from pydantic import ValidationError
import uuid
from typing import Union

from app.logger import get_logger
from app.schemas.error import ErrorResponse, ErrorDetail

logger = get_logger(__name__)


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle FastAPI HTTPExceptions with structured error response"""
    error_response = ErrorResponse(
        error="HTTPError",
        message=exc.detail,
        status_code=exc.status_code,
        path=str(request.url.path)
    )
    
    logger.warning(
        f"HTTP {exc.status_code} - {request.method} {request.url.path} - {exc.detail}"
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump(mode='json'),
        headers={"Access-Control-Allow-Origin": "*"}  # Ensure CORS headers on errors
    )


async def validation_exception_handler(
    request: Request, 
    exc: Union[RequestValidationError, ValidationError]
) -> JSONResponse:
    """Handle Pydantic validation errors with detailed field-level errors"""
    errors = []
    
    if isinstance(exc, RequestValidationError):
        for error in exc.errors():
            field = ".".join(str(loc) for loc in error["loc"] if loc != "body")
            errors.append(ErrorDetail(
                field=field,
                message=error["msg"],
                code=error["type"]
            ))
    
    error_response = ErrorResponse(
        error="ValidationError",
        message="Invalid request data",
        status_code=422,
        path=str(request.url.path),
        details=errors
    )
    
    logger.warning(
        f"Validation error - {request.method} {request.url.path} - {len(errors)} errors"
    )
    
    # Log detailed error information for debugging
    for error in errors:
        logger.warning(f"  Field: {error.field}, Message: {error.message}, Code: {error.code}")
    
    return JSONResponse(
        status_code=422,
        content=error_response.model_dump(mode='json')
    )


async def database_exception_handler(
    request: Request,
    exc: Union[IntegrityError, OperationalError, DBAPIError]
) -> JSONResponse:
    """Handle database-related errors with appropriate status codes"""
    
    if isinstance(exc, IntegrityError):
        # Constraint violation (duplicate, foreign key, etc.)
        status_code = 409
        error_type = "ConflictError"
        message = "Data conflict - resource may already exist or violate constraints"
    elif isinstance(exc, (OperationalError, DBAPIError)):
        # Connection errors, timeouts
        status_code = 503
        error_type = "DatabaseError"
        message = "Database service temporarily unavailable"
    else:
        status_code = 500
        error_type = "DatabaseError"
        message = "Database operation failed"
    
    error_response = ErrorResponse(
        error=error_type,
        message=message,
        status_code=status_code,
        path=str(request.url.path)
    )
    
    logger.error(
        f"Database error - {request.method} {request.url.path} - {type(exc).__name__}: {str(exc)}"
    )
    
    return JSONResponse(
        status_code=status_code,
        content=error_response.model_dump(mode='json')
    )


async def rate_limit_exception_handler(
    request: Request,
    exc: RateLimitExceeded
) -> JSONResponse:
    """Handle rate limit exceeded errors"""
    error_response = ErrorResponse(
        error="RateLimitError",
        message="Too many requests - please slow down",
        status_code=429,
        path=str(request.url.path)
    )
    
    client_host = request.client.host if request.client else "unknown"
    logger.warning(
        f"Rate limit exceeded - {request.method} {request.url.path} - {client_host}"
    )
    
    response = JSONResponse(
        status_code=429,
        content=error_response.model_dump(mode='json')
    )
    response.headers["Retry-After"] = "60"
    
    return response


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler for unexpected exceptions"""
    request_id = str(uuid.uuid4())
    
    error_response = ErrorResponse(
        error="InternalServerError",
        message="An unexpected error occurred",
        status_code=500,
        request_id=request_id,
        path=str(request.url.path)
    )
    
    logger.error(
        f"Unexpected error [{request_id}] - {request.method} {request.url.path} - "
        f"{type(exc).__name__}: {str(exc)}",
        exc_info=True
    )
    
    return JSONResponse(
        status_code=500,
        content=error_response.model_dump(mode='json')  # Ensure JSON serializable
    )


def register_exception_handlers(app):
    """
    Register all exception handlers with the FastAPI app
    
    Usage in main.py:
        from app.exceptions import register_exception_handlers
        register_exception_handlers(app)
    """
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(IntegrityError, database_exception_handler)
    app.add_exception_handler(OperationalError, database_exception_handler)
    app.add_exception_handler(DBAPIError, database_exception_handler)
    app.add_exception_handler(RateLimitExceeded, rate_limit_exception_handler)
    app.add_exception_handler(Exception, generic_exception_handler)
    
    logger.info("✅ Centralized exception handlers registered")
