"""
DevDocs Backend - Bookmarks Router
API endpoints for bookmark management
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, and_, exists
from sqlalchemy.exc import IntegrityError
from typing import List
import uuid

from app.database import get_db
from app.models.bookmark import Bookmark
from app.models.solution import Solution
from app.auth import get_current_user, CurrentUser, get_or_create_user
from app.logger import get_logger

logger = get_logger(__name__)

router = APIRouter()


# ============================================================================
# Pydantic Schemas
# ============================================================================

from pydantic import BaseModel
from datetime import datetime

class BookmarkResponse(BaseModel):
    """Bookmark response schema"""
    id: uuid.UUID
    user_id: uuid.UUID
    solution_id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class BookmarkToggleResponse(BaseModel):
    """Response for bookmark toggle operation"""
    bookmarked: bool
    message: str


# ============================================================================
# CREATE/TOGGLE - POST /api/bookmarks/toggle/{solution_id}
# ============================================================================

@router.post("/bookmarks/toggle/{solution_id}", response_model=BookmarkToggleResponse)
async def toggle_bookmark(
    request: Request,
    solution_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Toggle bookmark for a solution (add if not exists, remove if exists)"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Check if solution exists
        solution_query = select(Solution).where(Solution.id == solution_id)
        solution_result = await db.execute(solution_query)
        solution = solution_result.scalar_one_or_none()
        
        if not solution:
            raise HTTPException(status_code=404, detail="Solution not found")
        
        # Check if bookmark already exists
        bookmark_query = select(Bookmark).where(
            and_(
                Bookmark.user_id == user.id,
                Bookmark.solution_id == solution_id
            )
        )
        result = await db.execute(bookmark_query)
        existing_bookmark = result.scalar_one_or_none()
        
        if existing_bookmark:
            # Remove bookmark
            await db.delete(existing_bookmark)
            await db.commit()
            logger.info(f"User {user.email} removed bookmark for solution {solution_id}")
            return BookmarkToggleResponse(
                bookmarked=False,
                message="Bookmark removed"
            )
        else:
            # Add bookmark
            new_bookmark = Bookmark(
                user_id=user.id,
                solution_id=solution_id
            )
            db.add(new_bookmark)
            await db.commit()
            logger.info(f"User {user.email} bookmarked solution {solution_id}")
            return BookmarkToggleResponse(
                bookmarked=True,
                message="Bookmark added"
            )
    
    except HTTPException:
        raise
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Database integrity error toggling bookmark: {str(e)}")
        raise HTTPException(status_code=409, detail="Bookmark operation failed")
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error toggling bookmark: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to toggle bookmark")


# ============================================================================
# READ - GET /api/bookmarks (List all bookmarks for current user)
# ============================================================================

@router.get("/bookmarks", response_model=List[BookmarkResponse])
async def get_bookmarks(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get all bookmarks for the current user"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Get bookmarks
        query = select(Bookmark).where(Bookmark.user_id == user.id).order_by(Bookmark.created_at.desc())
        result = await db.execute(query)
        bookmarks = result.scalars().all()
        
        logger.info(f"Retrieved {len(bookmarks)} bookmarks for user {user.email}")
        return bookmarks
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting bookmarks: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve bookmarks")


# ============================================================================
# CHECK - GET /api/bookmarks/check/{solution_id}
# ============================================================================

@router.get("/bookmarks/check/{solution_id}")
async def check_bookmark(
    request: Request,
    solution_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Check if a solution is bookmarked by the current user"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Check if bookmark exists
        bookmark_exists = await db.scalar(
            select(exists().where(
                and_(
                    Bookmark.user_id == user.id,
                    Bookmark.solution_id == solution_id
                )
            ))
        )
        
        return {"bookmarked": bookmark_exists}
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error checking bookmark: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to check bookmark")


# ============================================================================
# DELETE - DELETE /api/bookmarks/{solution_id}
# ============================================================================

@router.delete("/bookmarks/{solution_id}")
async def delete_bookmark(
    request: Request,
    solution_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Delete a specific bookmark"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Delete the bookmark
        delete_query = delete(Bookmark).where(
            and_(
                Bookmark.user_id == user.id,
                Bookmark.solution_id == solution_id
            )
        )
        result = await db.execute(delete_query)
        await db.commit()
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Bookmark not found")
        
        logger.info(f"User {user.email} deleted bookmark for solution {solution_id}")
        return {"message": "Bookmark deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error deleting bookmark: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete bookmark")
