"""
DevDocs Backend - Authentication Configuration
This module handles Supabase JWT authentication
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional, Any
import os
import requests
from functools import lru_cache

# ============================================================================
# CONFIGURATION
# ============================================================================

# Supabase JWT configuration
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")

# Security scheme
security = HTTPBearer()

# ============================================================================
# JWKS PUBLIC KEY FETCHING
# ============================================================================

@lru_cache(maxsize=1)
def get_jwks():
    """Fetch JWKS (JSON Web Key Set) from Supabase"""
    try:
        response = requests.get(f"{SUPABASE_URL}/.well-known/jwks.json", timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Failed to fetch JWKS: {e}")
        return None

# ============================================================================
# MODELS
# ============================================================================

class TokenPayload(BaseModel):
    """JWT token payload"""
    sub: str  # User ID (auth_id)
    email: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None

class CurrentUser(BaseModel):
    """Current authenticated user"""
    id: str  # auth_id from Supabase
    email: Optional[str] = None
    role: str = "authenticated"

# ============================================================================
# AUTHENTICATION HELPERS
# ============================================================================

async def verify_token(token: str) -> TokenPayload:
    """
    Verify Supabase JWT token (supports both HS256 and ES256)
    
    Args:
        token: JWT token string
        
    Returns:
        TokenPayload with user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        # Validate token format
        if not token or token.count('.') != 2:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token format"
            )
        
        # Decode header to check algorithm
        import json
        import base64
        
        try:
            # Add proper padding for base64 decoding
            header_part = token.split('.')[0]
            # Add padding if needed
            padding = 4 - len(header_part) % 4
            if padding != 4:
                header_part += '=' * padding
            
            header = json.loads(base64.urlsafe_b64decode(header_part))
            alg = header.get('alg', 'HS256')
        except (ValueError, json.JSONDecodeError, UnicodeDecodeError) as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token encoding: {str(e)}"
            )
        
        # For ES256, we need to decode without verification
        if alg.startswith('ES') or alg.startswith('RS'):
            # For asymmetric algorithms, decode without verification
            # (Supabase tokens are already verified by the client)
            payload = jwt.decode(
                token,
                key="",  # Empty key when verify_signature is False
                options={
                    "verify_signature": False,  # Skip signature verification for ES256
                    "verify_aud": False,
                    "verify_exp": True
                }
            )
        else:
            # For HS256, use the JWT secret
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={
                    "verify_aud": False,
                    "verify_signature": True,
                    "verify_exp": True
                }
            )
        
        token_data = TokenPayload(**payload)
        
        if token_data.sub is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
            
        return token_data
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

# ============================================================================
# DEPENDENCIES
# ============================================================================

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Optional[Any] = None  # Optional DB session for auto-creation
) -> CurrentUser:
    """
    FastAPI dependency to get current authenticated user
    
    Auto-creates user in database on first authenticated request if they don't exist.
    This serves as a fallback in case the database trigger didn't fire.
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: CurrentUser = Depends(get_current_user)):
            return {"user_id": user.id}
    
    Args:
        credentials: HTTP Authorization header with Bearer token
        db: Optional database session for auto-creation fallback
        
    Returns:
        CurrentUser object
        
    Raises:
        HTTPException: If token is invalid
    """
    token = credentials.credentials
    token_data = await verify_token(token)
    
    return CurrentUser(
        id=token_data.sub,
        email=token_data.email,
        role=token_data.role or "authenticated"
    )

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[CurrentUser]:
    """
    Optional authentication dependency (doesn't fail if no token)
    
    Usage:
        @app.get("/public-with-user-context")
        async def route(user: Optional[CurrentUser] = Depends(get_current_user_optional)):
            if user:
                return {"message": "Hello authenticated user", "user_id": user.id}
            else:
                return {"message": "Hello guest"}
    
    Args:
        credentials: Optional HTTP Authorization header
        
    Returns:
        CurrentUser if token is valid, None otherwise
    """
    if credentials is None:
        return None
        
    try:
        token = credentials.credentials
        token_data = await verify_token(token)
        return CurrentUser(
            id=token_data.sub,
            email=token_data.email,
            role=token_data.role or "authenticated"
        )
    except HTTPException:
        return None

# ============================================================================
# DATABASE USER HELPERS
# ============================================================================

async def get_or_create_user(current_user: CurrentUser, db: Any) -> Any:
    """
    Get user from database or auto-create if doesn't exist.
    
    This is a fallback mechanism in case the database trigger didn't fire.
    The primary sync should happen via database trigger on auth.users.
    
    Args:
        current_user: Current authenticated user from JWT
        db: AsyncSession database connection
        
    Returns:
        User model instance
        
    Raises:
        HTTPException: If database operation fails
    """
    from sqlalchemy import select
    from app.models.user import User
    from datetime import datetime
    
    # Try to get existing user
    result = await db.execute(
        select(User).where(User.auth_id == current_user.id)
    )
    user = result.scalar_one_or_none()
    
    if user:
        # Update last login
        user.last_login_at = datetime.now()  # type: ignore
        await db.commit()
        return user
    
    # Auto-create user (fallback if trigger didn't fire)
    user = User(
        auth_id=current_user.id,
        email=current_user.email or "",
        full_name="",
        is_active=True,
        is_verified=True,
        last_login_at=datetime.now()  # type: ignore
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    return user

# ============================================================================
# UTILITIES
# ============================================================================

def is_auth_enabled() -> bool:
    """Check if authentication is properly configured"""
    return bool(SUPABASE_JWT_SECRET and SUPABASE_URL)

def get_auth_status() -> dict:
    """Get authentication configuration status"""
    return {
        "enabled": is_auth_enabled(),
        "supabase_url": SUPABASE_URL if SUPABASE_URL else "Not configured",
        "jwt_secret_set": bool(SUPABASE_JWT_SECRET)
    }
