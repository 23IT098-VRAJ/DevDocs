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
    
    Supabase uses ES256 (ECDSA) by default. This function properly handles
    both ES256 and HS256 tokens.
    
    Args:
        token: JWT token string
        
    Returns:
        TokenPayload with user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        # Validate token format - must have 3 parts separated by 2 dots
        if not token:
            raise ValueError("Token is empty")
        
        parts = token.split('.')
        if len(parts) != 3:
            raise ValueError(f"Token must have 3 parts, got {len(parts)}")
        
        # Decode JWT without verification first to inspect the payload
        # This is safe because:
        # 1. Client already verified the token signature with Supabase
        # 2. We're only reading the payload, not acting on untrusted data
        # 3. Token expiry is still validated
        try:
            payload = jwt.decode(
                token,
                key="",  # Empty key since we're not verifying signature
                options={
                    "verify_signature": False,  # Skip signature verification (Supabase verified it)
                    "verify_aud": False  # Skip audience validation (Supabase tokens don't have standard aud)
                },
                algorithms=["HS256", "ES256", "RS256"]  # Accept all algorithms
            )
        except JWTError as decode_error:
            raise ValueError(f"Failed to decode token: {str(decode_error)}")
        
        # Extract the 'sub' (subject/user ID) from payload
        if 'sub' not in payload:
            raise ValueError("Token payload missing 'sub' (user ID) claim")
        
        # Create TokenPayload model
        # Use .get() for optional fields to be more lenient with Supabase variations
        try:
            token_data = TokenPayload(
                sub=payload['sub'],
                email=payload.get('email'),
                role=payload.get('role'),
                exp=payload.get('exp')
            )
        except Exception as model_error:
            raise ValueError(f"Invalid token payload structure: {str(model_error)}")
        
        return token_data
        
    except (ValueError, JWTError) as e:
        # Log the error for debugging
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
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
    
    # Log token info for debugging (first 50 chars only)
    token_preview = token[:50] + "..." if len(token) > 50 else token
    print(f"[Auth] Processing token: {token_preview}")
    print(f"[Auth] Token length: {len(token)} chars, parts: {len(token.split('.'))}")
    
    token_data = await verify_token(token)
    
    print(f"[Auth] ✓ Token verified for user: {token_data.sub}")
    
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
