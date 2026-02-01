"""
DevDocs Backend - Authentication Configuration
This module handles Supabase JWT authentication
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
import os

# ============================================================================
# CONFIGURATION
# ============================================================================

# Supabase JWT configuration
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
ALGORITHM = "HS256"

# Security scheme
security = HTTPBearer()

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
    Verify Supabase JWT token
    
    Args:
        token: JWT token string
        
    Returns:
        TokenPayload with user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[ALGORITHM],
            options={"verify_aud": False}  # Supabase doesn't use aud
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
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> CurrentUser:
    """
    FastAPI dependency to get current authenticated user
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: CurrentUser = Depends(get_current_user)):
            return {"user_id": user.id}
    
    Args:
        credentials: HTTP Authorization header with Bearer token
        
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
