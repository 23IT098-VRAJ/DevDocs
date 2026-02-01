"""
DevDocs Backend - Pydantic Schemas for API Validation
"""
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime
import uuid


# ============================================================================
# Base Schemas
# ============================================================================

class SolutionBase(BaseModel):
    """Base solution schema with common fields"""
    title: str = Field(
        ...,
        min_length=5,
        max_length=200,
        description="Solution title (5-200 characters)"
    )
    description: str = Field(
        ...,
        min_length=20,
        max_length=2000,
        description="Solution description (20-2000 characters)"
    )
    code: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="Code snippet (10-5000 characters)"
    )
    language: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Programming language (e.g., python, javascript)"
    )
    tags: List[str] = Field(
        ...,
        min_length=1,
        description="List of tags (at least 1 required)"
    )
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: List[str]) -> List[str]:
        """Validate tags are not empty and normalize them"""
        if not v or len(v) == 0:
            raise ValueError("At least one tag is required")
        
        # Remove empty tags and strip whitespace
        cleaned_tags = [tag.strip().lower() for tag in v if tag.strip()]
        
        if not cleaned_tags:
            raise ValueError("At least one non-empty tag is required")
        
        return cleaned_tags
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v: str) -> str:
        """Normalize language to lowercase"""
        return v.strip().lower()


# ============================================================================
# Request Schemas (for creating/updating)
# ============================================================================

class SolutionCreate(SolutionBase):
    """Schema for creating a new solution"""
    pass


class SolutionUpdate(BaseModel):
    """Schema for updating an existing solution (all fields optional)"""
    title: Optional[str] = Field(
        None,
        min_length=5,
        max_length=200
    )
    description: Optional[str] = Field(
        None,
        min_length=20,
        max_length=2000
    )
    code: Optional[str] = Field(
        None,
        min_length=10,
        max_length=5000
    )
    language: Optional[str] = Field(
        None,
        min_length=1,
        max_length=50
    )
    tags: Optional[List[str]] = Field(
        None,
        min_length=1
    )
    
    @field_validator('tags')
    @classmethod
    def validate_tags(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        """Validate tags if provided"""
        if v is None:
            return None
        
        cleaned_tags = [tag.strip().lower() for tag in v if tag.strip()]
        if not cleaned_tags:
            raise ValueError("At least one non-empty tag is required")
        
        return cleaned_tags
    
    @field_validator('language')
    @classmethod
    def validate_language(cls, v: Optional[str]) -> Optional[str]:
        """Normalize language to lowercase if provided"""
        return v.strip().lower() if v else None


# ============================================================================
# Response Schemas (returned by API)
# ============================================================================

class SolutionResponse(SolutionBase):
    """Schema for solution response (includes database fields)"""
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    is_archived: bool = False
    
    class Config:
        from_attributes = True  # Enable ORM mode (SQLAlchemy compatibility)


class SolutionListResponse(BaseModel):
    """Schema for paginated solution list"""
    solutions: List[SolutionResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


# ============================================================================
# Search Schemas
# ============================================================================

class SearchResult(BaseModel):
    """Schema for search result with similarity score"""
    solution: SolutionResponse
    similarity: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Similarity score (0.0 to 1.0)"
    )
    rank: int = Field(..., ge=1, description="Result rank (1 = best match)")


class SearchResponse(BaseModel):
    """Schema for search results"""
    query: str
    results: List[SearchResult]
    total_results: int
    search_time_ms: float


# ============================================================================
# Dashboard Schemas
# ============================================================================

class DashboardStats(BaseModel):
    """Schema for dashboard statistics"""
    total_solutions: int
    total_languages: int
    unique_tags: int
    most_recent_solution: Optional[datetime] = None
    language_breakdown: List[dict] = Field(
        default_factory=list,
        description="List of {language, count} objects"
    )


# ============================================================================
# Error Response Schema
# ============================================================================

class ErrorResponse(BaseModel):
    """Schema for error responses"""
    detail: str
    error_code: Optional[str] = None
