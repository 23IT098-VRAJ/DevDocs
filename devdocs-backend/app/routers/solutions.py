"""
DevDocs Backend - Solutions CRUD Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, and_
from sqlalchemy.exc import IntegrityError, OperationalError, DBAPIError
from typing import Optional
import uuid

from app.database import get_db
from app.models.solution import Solution
from app.models.user import User
from app.models.bookmark import Bookmark
from app.models.embedding import embedding_service
from app.auth import get_current_user, CurrentUser, get_or_create_user
from app.schemas.solution import (
    SolutionCreate,
    SolutionUpdate,
    SolutionResponse,
    SolutionListResponse
)
from app.logger import get_logger

logger = get_logger(__name__)


router = APIRouter()


# ============================================================================
# CREATE - POST /api/solutions
# ============================================================================

@router.post("/solutions", response_model=SolutionResponse, status_code=201)
async def create_solution(
    request: Request,
    solution_data: SolutionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Create a new code solution with automatic embedding generation"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Generate embedding from title + description + code
        solution_text = embedding_service.create_solution_text(
            solution_data.title,
            solution_data.description,
            solution_data.code
        )
        embedding = embedding_service.generate_embedding(solution_text)
        
        # Create new solution with user_id
        new_solution = Solution(
            title=solution_data.title,
            description=solution_data.description,
            code=solution_data.code,
            language=solution_data.language,
            tags=solution_data.tags,
            embedding=embedding,
            user_id=user.id
        )
        
        db.add(new_solution)
        await db.commit()
        await db.refresh(new_solution)
        
        return new_solution
    
    except HTTPException:
        raise
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Database integrity error creating solution: {str(e)}")
        raise HTTPException(status_code=409, detail="Duplicate solution or constraint violation")
    except (OperationalError, DBAPIError) as e:
        await db.rollback()
        logger.error(f"Database connection error creating solution: {str(e)}")
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error creating solution: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create solution")


# ============================================================================
# READ - GET /api/solutions (List all with pagination)
# ============================================================================

@router.get("/solutions", response_model=SolutionListResponse)
async def get_solutions(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    language: Optional[str] = Query(None, description="Filter by language"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    include_archived: bool = Query(False, description="Include archived solutions"),
    my_solutions: bool = Query(False, description="Show only current user's solutions"),
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get paginated list of solutions with optional filters"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Debug logging
        logger.info(f"Fetching solutions - User ID: {user.id}, Email: {user.email}")
        
        # Build query - show only current user's solutions (personal library)
        query = select(Solution).where(Solution.user_id == user.id)
        
        # Apply filters
        from sqlalchemy.sql.elements import ColumnElement
        filters: list[ColumnElement[bool]] = []
        
        if not include_archived:
            filters.append(~Solution.is_archived)
        if language:
            filters.append(Solution.language == language.lower())
        if tag:
            # Use PostgreSQL array contains operator @>
            filters.append(Solution.tags.op('@>')(f'{{{tag.lower()}}}'))
        
        if filters:
            query = query.where(and_(*filters))
        
        # Count total - also filter by user_id
        count_query = select(func.count()).select_from(Solution).where(Solution.user_id == user.id)
        if filters:
            count_query = count_query.where(and_(*filters))
        
        total = await db.scalar(count_query)
        
        # Paginate
        query = query.order_by(Solution.created_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        result = await db.execute(query)
        solutions = result.scalars().all()
        
        # Get bookmark status for all solutions
        solution_ids = [s.id for s in solutions]
        bookmarked_ids = set()
        if solution_ids:
            from app.models.bookmark import Bookmark
            bookmark_query = select(Bookmark.solution_id).where(
                and_(
                    Bookmark.user_id == user.id,
                    Bookmark.solution_id.in_(solution_ids)
                )
            )
            bookmark_result = await db.execute(bookmark_query)
            bookmarked_ids = {row[0] for row in bookmark_result.fetchall()}
        
        # Add bookmark status to solutions
        solutions_with_bookmarks = []
        for solution in solutions:
            solution_dict = {
                "id": solution.id,
                "title": solution.title,
                "description": solution.description,
                "code": solution.code,
                "language": solution.language,
                "tags": solution.tags,
                "created_at": solution.created_at,
                "updated_at": solution.updated_at,
                "is_archived": solution.is_archived,
                "is_bookmarked": solution.id in bookmarked_ids
            }
            solutions_with_bookmarks.append(SolutionResponse(**solution_dict))
        
        # Calculate total pages
        total_count = total if total is not None else 0
        total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1
        
        # Debug logging
        logger.info(f"Found {len(solutions)} solutions (total in DB: {total_count})")
        if solutions:
            logger.info(f"First solution user_id: {solutions[0].user_id}")
        
        return SolutionListResponse(
            solutions=solutions_with_bookmarks,
            total=total_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database error fetching solutions: {str(e)}")
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error fetching solutions: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch solutions")


# ============================================================================
# READ - GET /api/solutions/{id} (Get single solution)
# ============================================================================

@router.get("/solutions/{solution_id}", response_model=SolutionResponse)
async def get_solution(
    request: Request,
    solution_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Get a single solution by ID"""
    # Get or auto-create user
    user = await get_or_create_user(current_user, db)
    
    # Query solution with user_id filter
    query = select(Solution).where(
        Solution.id == solution_id,
        Solution.user_id == user.id,
        ~Solution.is_archived
    )
    
    result = await db.execute(query)
    solution = result.scalar_one_or_none()
    
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    # Check if solution is bookmarked
    bookmark_query = select(Bookmark).where(
        and_(
            Bookmark.user_id == user.id,
            Bookmark.solution_id == solution_id
        )
    )
    bookmark_result = await db.execute(bookmark_query)
    is_bookmarked = bookmark_result.scalar_one_or_none() is not None
    
    # Return solution with bookmark status
    solution_dict = {
        "id": solution.id,
        "title": solution.title,
        "description": solution.description,
        "code": solution.code,
        "language": solution.language,
        "tags": solution.tags,
        "created_at": solution.created_at,
        "updated_at": solution.updated_at,
        "is_archived": solution.is_archived,
        "is_bookmarked": is_bookmarked
    }
    
    return SolutionResponse(**solution_dict)


# ============================================================================
# UPDATE - PUT /api/solutions/{id}
# ============================================================================

@router.put("/solutions/{solution_id}", response_model=SolutionResponse)
async def update_solution(
    request: Request,
    solution_id: uuid.UUID,
    solution_data: SolutionUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Update an existing solution"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Get existing solution - filter by user_id for ownership
        query = select(Solution).where(
            Solution.id == solution_id,
            Solution.user_id == user.id,
            ~Solution.is_archived
        )
        result = await db.execute(query)
        solution = result.scalar_one_or_none()
        
        if not solution:
            raise HTTPException(status_code=404, detail="Solution not found")
        
        # Track if content changed (need to regenerate embedding)
        content_changed = False
        
        # Update fields
        update_data = solution_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(solution, field, value)
            if field in ["title", "description", "code"]:
                content_changed = True
        
        # Regenerate embedding if content changed
        if content_changed:
            solution_text = embedding_service.create_solution_text(
                str(solution.title),  # type: ignore
                str(solution.description),  # type: ignore
                str(solution.code)  # type: ignore
            )
            new_embedding = embedding_service.generate_embedding(solution_text)
            if new_embedding:
                solution.embedding = new_embedding  # type: ignore
        
        await db.commit()
        await db.refresh(solution)
        
        return solution
    
    except HTTPException:
        raise
    except IntegrityError as e:
        await db.rollback()
        logger.error(f"Database integrity error updating solution: {str(e)}")
        raise HTTPException(status_code=409, detail="Duplicate solution or constraint violation")
    except (OperationalError, DBAPIError) as e:
        await db.rollback()
        logger.error(f"Database connection error updating solution: {str(e)}")
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error updating solution: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to update solution")


# ============================================================================
# DELETE - DELETE /api/solutions/{id} (Soft delete)
# ============================================================================

@router.delete("/solutions/{solution_id}", status_code=204)
async def delete_solution(
    request: Request,
    solution_id: uuid.UUID,
    permanent: bool = Query(False, description="Permanently delete instead of archiving"),
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Delete (archive) a solution"""
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        if permanent:
            # Permanent delete - filter by user_id for ownership
            query = select(Solution).where(
                Solution.id == solution_id,
                Solution.user_id == user.id
            )
            result = await db.execute(query)
            solution = result.scalar_one_or_none()
            
            if not solution:
                raise HTTPException(status_code=404, detail="Solution not found")
            
            await db.delete(solution)
        else:
            # Soft delete (archive) - filter by user_id for ownership
            query = update(Solution).where(
                Solution.id == solution_id,
                Solution.user_id == user.id,
                ~Solution.is_archived
            ).values(is_archived=True)
            
            result = await db.execute(query)
            
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="Solution not found")
        
        await db.commit()
        return None  # 204 No Content
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        await db.rollback()
        logger.error(f"Database connection error deleting solution: {str(e)}")
        raise HTTPException(status_code=503, detail="Database service temporarily unavailable")
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error deleting solution: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete solution")

