"""
DevDocs Backend - Dashboard Statistics Router
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from typing import List, Dict

from app.database import get_db
from app.models.solution import Solution
from app.schemas.solution import DashboardStats


router = APIRouter()


# ============================================================================
# GET /api/dashboard/stats - Get Dashboard Statistics
# ============================================================================

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
):
    """
    Get comprehensive dashboard statistics
    
    Returns:
    - Total number of solutions
    - Total number of programming languages
    - Total unique tags across all solutions
    - Most recent solution timestamp
    - Language breakdown (count per language)
    """
    try:
        # Get basic stats
        stats_query = text("""
            SELECT 
                COUNT(*) as total_solutions,
                COUNT(DISTINCT language) as total_languages,
                (SELECT COUNT(DISTINCT tag) 
                 FROM solutions, unnest(tags) as tag 
                 WHERE is_archived = FALSE) as unique_tags,
                MAX(created_at) as most_recent_solution
            FROM solutions
            WHERE is_archived = FALSE
        """)
        
        result = await db.execute(stats_query)
        stats = result.fetchone()
        
        # Get language breakdown
        language_query = select(
            Solution.language,
            func.count(Solution.id).label('count')
        ).where(
            Solution.is_archived == False
        ).group_by(
            Solution.language
        ).order_by(
            func.count(Solution.id).desc()
        )
        
        language_result = await db.execute(language_query)
        language_breakdown = [
            {"language": row.language, "count": row.count}
            for row in language_result.fetchall()
        ]
        
        return DashboardStats(
            total_solutions=stats.total_solutions,
            total_languages=stats.total_languages,
            unique_tags=stats.unique_tags,
            most_recent_solution=stats.most_recent_solution,
            language_breakdown=language_breakdown
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch dashboard stats: {str(e)}")


# ============================================================================
# GET /api/dashboard/recent - Get Recent Solutions
# ============================================================================

@router.get("/dashboard/recent")
async def get_recent_solutions(
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """
    Get most recently created solutions
    
    - **limit**: Maximum number of solutions (default: 10)
    """
    try:
        query = select(Solution).where(
            Solution.is_archived == False
        ).order_by(
            Solution.created_at.desc()
        ).limit(limit)
        
        result = await db.execute(query)
        solutions = result.scalars().all()
        
        # Convert to dict to avoid serialization issues
        solutions_list = [
            {
                "id": str(sol.id),
                "title": sol.title,
                "description": sol.description,
                "code": sol.code,
                "language": sol.language,
                "tags": sol.tags,
                "created_at": sol.created_at.isoformat(),
                "updated_at": sol.updated_at.isoformat(),
                "is_archived": sol.is_archived
            }
            for sol in solutions
        ]
        
        return {"recent_solutions": solutions_list}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent solutions: {str(e)}")


# ============================================================================
# GET /api/dashboard/popular-tags - Get Most Used Tags
# ============================================================================

@router.get("/dashboard/popular-tags")
async def get_popular_tags(
    limit: int = 20,
    db: AsyncSession = Depends(get_db)
):
    """
    Get most frequently used tags
    
    - **limit**: Maximum number of tags (default: 20)
    """
    try:
        tags_query = text("""
            SELECT 
                tag,
                COUNT(*) as usage_count
            FROM solutions, unnest(tags) as tag
            WHERE is_archived = FALSE
            GROUP BY tag
            ORDER BY usage_count DESC
            LIMIT :limit
        """)
        
        result = await db.execute(tags_query, {"limit": limit})
        popular_tags = [
            {"tag": row.tag, "count": row.usage_count}
            for row in result.fetchall()
        ]
        
        return {"popular_tags": popular_tags}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch popular tags: {str(e)}")
