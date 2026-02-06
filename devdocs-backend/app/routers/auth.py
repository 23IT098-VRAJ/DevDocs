"""
DevDocs Backend - Authentication Router
Endpoints for user authentication and profile management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserPublic
from app.auth import get_current_user, CurrentUser, get_auth_status, get_or_create_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ============================================================================
# AUTH STATUS
# ============================================================================

@router.get("/status")
async def auth_status():
    """
    Get authentication configuration status
    
    Returns information about whether auth is enabled and configured
    """
    return get_auth_status()

# ============================================================================
# USER PROFILE
# ============================================================================

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user's profile
    
    Auto-creates user on first login if doesn't exist (via get_or_create_user).
    Requires authentication.
    """
    # Get or auto-create user
    user = await get_or_create_user(current_user, db)
    return user

@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_update: UserUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update current user's profile
    
    Auto-creates user if doesn't exist (fallback).
    Requires authentication.
    """
    # Get or auto-create user
    user = await get_or_create_user(current_user, db)
    
    # Update fields
    update_data = user_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    await db.commit()
    await db.refresh(user)
    
    return user

# ============================================================================
# USER REGISTRATION (WEBHOOK FROM SUPABASE)
# ============================================================================

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_create: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create user profile after Supabase authentication
    
    This endpoint should be called by Supabase webhook or after successful signup
    """
    # Check if user already exists
    result = await db.execute(
        select(User).where(User.email == user_create.email)
    )
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        return existing_user
    
    # Create new user
    new_user = User(
        email=user_create.email,
        full_name=user_create.full_name,
        auth_id=user_create.auth_id,
        avatar_url=str(user_create.avatar_url) if user_create.avatar_url else None,
        is_verified=True  # Since they came from Supabase Auth
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

# ============================================================================
# PUBLIC USER PROFILES
# ============================================================================

@router.get("/users/{user_id}", response_model=UserPublic)
async def get_user_profile(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get public user profile by ID
    
    No authentication required
    """
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
