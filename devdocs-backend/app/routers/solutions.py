"""
DevDocs Backend - Solutions CRUD Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, and_
from typing import List, Optional
import uuid

from app.database import get_db
from app.models.solution import Solution
from app.models.embedding import embedding_service
from app.schemas.solution import (
    SolutionCreate,
    SolutionUpdate,
    SolutionResponse,
    SolutionListResponse
)


router = APIRouter()


# ============================================================================
# CREATE - POST /api/solutions
# ============================================================================

@router.post("/solutions", response_model=SolutionResponse, status_code=201)
async def create_solution(
    solution_data: SolutionCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new code solution with automatic embedding generation"""
    try:
        # Generate embedding from title + description + code
        solution_text = embedding_service.create_solution_text(
            solution_data.title,
            solution_data.description,
            solution_data.code
        )
        embedding = embedding_service.generate_embedding(solution_text)
        
        # Create new solution
        new_solution = Solution(
            title=solution_data.title,
            description=solution_data.description,
            code=solution_data.code,
            language=solution_data.language,
            tags=solution_data.tags,
            embedding=embedding
        )
        
        db.add(new_solution)
        await db.commit()
        await db.refresh(new_solution)
        
        return new_solution
    
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create solution: {str(e)}")


# ============================================================================
# READ - GET /api/solutions (List all with pagination)
# ============================================================================

@router.get("/solutions", response_model=SolutionListResponse)
async def get_solutions(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    language: Optional[str] = Query(None, description="Filter by language"),
    tag: Optional[str] = Query(None, description="Filter by tag"),
    include_archived: bool = Query(False, description="Include archived solutions"),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of solutions with optional filters"""
    try:
        # Build query
        query = select(Solution)
        
        # Apply filters
        filters = []
        if not include_archived:
            filters.append(Solution.is_archived == False)
        if language:
            filters.append(Solution.language == language.lower())
        if tag:
            # Use PostgreSQL array contains operator @>
            from sqlalchemy.dialects.postgresql import ARRAY
            filters.append(Solution.tags.op('@>')(f'{{{tag.lower()}}}'))
        
        if filters:
            query = query.where(and_(*filters))
        
        # Count total
        count_query = select(func.count()).select_from(Solution)
        if filters:
            count_query = count_query.where(and_(*filters))
        
        total = await db.scalar(count_query)
        
        # Paginate
        query = query.order_by(Solution.created_at.desc())
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        result = await db.execute(query)
        solutions = result.scalars().all()
        
        # Calculate total pages
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        
        return SolutionListResponse(
            solutions=solutions,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch solutions: {str(e)}")


# ============================================================================
# READ - GET /api/solutions/{id} (Get single solution)
# ============================================================================

@router.get("/solutions/{solution_id}", response_model=SolutionResponse)
async def get_solution(
    solution_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a single solution by ID"""
    query = select(Solution).where(
        Solution.id == solution_id,
        Solution.is_archived == False
    )
    
    result = await db.execute(query)
    solution = result.scalar_one_or_none()
    
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")
    
    return solution


# ============================================================================
# UPDATE - PUT /api/solutions/{id}
# ============================================================================

@router.put("/solutions/{solution_id}", response_model=SolutionResponse)
async def update_solution(
    solution_id: uuid.UUID,
    solution_data: SolutionUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update an existing solution"""
    try:
        # Get existing solution
        query = select(Solution).where(
            Solution.id == solution_id,
            Solution.is_archived == False
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
                solution.title,
                solution.description,
                solution.code
            )
            solution.embedding = embedding_service.generate_embedding(solution_text)
        
        await db.commit()
        await db.refresh(solution)
        
        return solution
    
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update solution: {str(e)}")


# ============================================================================
# DELETE - DELETE /api/solutions/{id} (Soft delete)
# ============================================================================

@router.delete("/solutions/{solution_id}", status_code=204)
async def delete_solution(
    solution_id: uuid.UUID,
    permanent: bool = Query(False, description="Permanently delete instead of archiving"),
    db: AsyncSession = Depends(get_db)
):
    """Delete (archive) a solution"""
    try:
        if permanent:
            # Permanent delete
            query = select(Solution).where(Solution.id == solution_id)
            result = await db.execute(query)
            solution = result.scalar_one_or_none()
            
            if not solution:
                raise HTTPException(status_code=404, detail="Solution not found")
            
            await db.delete(solution)
        else:
            # Soft delete (archive)
            query = update(Solution).where(
                Solution.id == solution_id,
                Solution.is_archived == False
            ).values(is_archived=True)
            
            result = await db.execute(query)
            
            if result.rowcount == 0:
                raise HTTPException(status_code=404, detail="Solution not found")
        
        await db.commit()
        return None  # 204 No Content
    
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete solution: {str(e)}")

