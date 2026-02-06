"""
DevDocs Backend - Structured Error Response Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
import uuid


class ErrorDetail(BaseModel):
    """Detailed error information"""
    field: Optional[str] = Field(None, description="Field name that caused the error (for validation errors)")
    message: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code for programmatic handling")


class ErrorResponse(BaseModel):
    """
    Structured error response schema for consistent API error handling
    
    HTTP Status Code Mapping:
    - 400: Bad Request (validation errors, malformed input)
    - 401: Unauthorized (missing/invalid authentication)
    - 403: Forbidden (insufficient permissions)
    - 404: Not Found (resource not found)
    - 409: Conflict (duplicate resource, constraint violation)
    - 422: Unprocessable Entity (validation failed)
    - 429: Too Many Requests (rate limit exceeded)
    - 500: Internal Server Error (unexpected errors)
    - 503: Service Unavailable (database connection, external service failure)
    """
    
    error: str = Field(
        ...,
        description="Error type (e.g., 'ValidationError', 'NotFoundError', 'DatabaseError')"
    )
    message: str = Field(
        ...,
        description="Human-readable error message"
    )
    status_code: int = Field(
        ...,
        ge=400,
        le=599,
        description="HTTP status code"
    )
    request_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique request ID for tracing"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow,
        description="Error timestamp in UTC"
    )
    details: Optional[list[ErrorDetail]] = Field(
        default=None,
        description="Additional error details (e.g., validation errors)"
    )
    path: Optional[str] = Field(
        None,
        description="API path that generated the error"
    )
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "error": "ValidationError",
                    "message": "Invalid input data",
                    "status_code": 422,
                    "request_id": "550e8400-e29b-41d4-a716-446655440000",
                    "timestamp": "2024-01-15T10:30:00Z",
                    "details": [
                        {
                            "field": "title",
                            "message": "Title must be at least 5 characters",
                            "code": "MIN_LENGTH"
                        }
                    ],
                    "path": "/api/v1/solutions"
                },
                {
                    "error": "NotFoundError",
                    "message": "Solution not found",
                    "status_code": 404,
                    "request_id": "550e8400-e29b-41d4-a716-446655440001",
                    "timestamp": "2024-01-15T10:35:00Z",
                    "path": "/api/v1/solutions/123"
                },
                {
                    "error": "DatabaseError",
                    "message": "Failed to connect to database",
                    "status_code": 503,
                    "request_id": "550e8400-e29b-41d4-a716-446655440002",
                    "timestamp": "2024-01-15T10:40:00Z"
                }
            ]
        }
    }


class DatabaseErrorResponse(ErrorResponse):
    """Specific error response for database-related errors"""
    error: str = "DatabaseError"
    status_code: int = 503
    message: str = "Database operation failed. Please try again later."


class ConflictErrorResponse(ErrorResponse):
    """Specific error response for conflict/duplicate errors"""
    error: str = "ConflictError"
    status_code: int = 409
    message: str = "Resource already exists or conflicts with existing data."


class RateLimitErrorResponse(ErrorResponse):
    """Specific error response for rate limit exceeded"""
    error: str = "RateLimitError"
    status_code: int = 429
    message: str = "Rate limit exceeded. Please try again later."
    retry_after: Optional[int] = Field(
        None,
        description="Seconds to wait before retrying"
    )
