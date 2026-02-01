"""
DevDocs Backend - User Schemas
Pydantic models for user data validation and serialization
"""

from pydantic import BaseModel, EmailStr, Field, HttpUrl
from typing import Optional
from datetime import datetime
from uuid import UUID

# ============================================================================
# BASE SCHEMAS
# ============================================================================

class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    full_name: Optional[str] = None

class UserProfile(BaseModel):
    """User profile information"""
    bio: Optional[str] = None
    github_username: Optional[str] = None
    twitter_username: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    avatar_url: Optional[HttpUrl] = None

class UserPreferences(BaseModel):
    """User preferences"""
    theme: str = Field(default="dark", pattern="^(dark|light)$")
    language: str = Field(default="en", min_length=2, max_length=10)

# ============================================================================
# REQUEST SCHEMAS
# ============================================================================

class UserCreate(UserBase):
    """Schema for creating a new user (during signup)"""
    auth_id: UUID  # From Supabase auth.users(id)
    avatar_url: Optional[HttpUrl] = None

class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    bio: Optional[str] = None
    github_username: Optional[str] = None
    twitter_username: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    avatar_url: Optional[HttpUrl] = None
    theme: Optional[str] = Field(None, pattern="^(dark|light)$")
    language: Optional[str] = Field(None, min_length=2, max_length=10)

# ============================================================================
# RESPONSE SCHEMAS
# ============================================================================

class UserResponse(UserBase):
    """Schema for user data in responses"""
    id: UUID
    auth_id: UUID
    avatar_url: Optional[HttpUrl] = None
    bio: Optional[str] = None
    github_username: Optional[str] = None
    twitter_username: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    theme: str
    language: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    is_active: bool
    is_verified: bool

    class Config:
        from_attributes = True

class UserPublic(BaseModel):
    """Public user profile (without sensitive data)"""
    id: UUID
    full_name: Optional[str] = None
    avatar_url: Optional[HttpUrl] = None
    bio: Optional[str] = None
    github_username: Optional[str] = None
    twitter_username: Optional[str] = None
    website_url: Optional[HttpUrl] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================================================
# AUTH SCHEMAS
# ============================================================================

class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: UserResponse

class LoginRequest(BaseModel):
    """Login request"""
    email: EmailStr
    password: str = Field(min_length=6)

class SignupRequest(BaseModel):
    """Signup request"""
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: Optional[str] = None
