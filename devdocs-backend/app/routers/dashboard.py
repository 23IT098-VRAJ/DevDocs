"""
DevDocs Backend - Dashboard Statistics Router
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from sqlalchemy.exc import OperationalError, DBAPIError
from typing import Any

from app.database import get_db
from app.models.solution import Solution
from app.models.user import User
from app.auth import get_current_user, CurrentUser, get_or_create_user
from app.schemas.dashboard import DashboardStats
from app.logger import get_logger

logger = get_logger(__name__)

router = APIRouter()


# ============================================================================
# GET /api/dashboard/stats - Get Dashboard Statistics
# ============================================================================

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Get comprehensive dashboard statistics for current user
    
    Returns:
    - Total number of user's solutions
    - Total number of programming languages used
    - Total unique tags across user's solutions
    - Most recent solution timestamp
    - Language breakdown (count per language)
    """
    try:
        # Get or auto-create user (fallback if database trigger didn't fire)
        user = await get_or_create_user(current_user, db)
        
        # Get basic stats - only current user's solutions (personal library)
        stats_query = text("""
            SELECT 
                COUNT(*) as total_solutions,
                COUNT(DISTINCT language) as total_languages,
                (SELECT COUNT(DISTINCT tag) 
                 FROM solutions, unnest(tags) as tag 
                 WHERE is_archived = FALSE AND user_id = :user_id) as unique_tags,
                MAX(created_at) as most_recent_solution
            FROM solutions
            WHERE is_archived = FALSE AND user_id = :user_id
        """)
        
        result = await db.execute(stats_query, {"user_id": str(user.id)})
        stats = result.fetchone()
        
        # Get language breakdown - only current user's solutions
        language_query = select(
            Solution.language,
            func.count(Solution.id).label('count')
        ).where(
            ~Solution.is_archived,
            Solution.user_id == user.id
        ).group_by(
            Solution.language
        ).order_by(
            func.count(Solution.id).desc()
        )
        
        language_result = await db.execute(language_query)
        language_breakdown: list[dict[str, Any]] = [
            {"language": row.language, "count": row.count}
            for row in language_result.fetchall()
        ]
        
        return DashboardStats(
            total_solutions=stats.total_solutions if stats else 0,  # type: ignore
            total_languages=stats.total_languages if stats else 0,  # type: ignore
            unique_tags=stats.unique_tags if stats else 0,  # type: ignore
            most_recent_solution=stats.most_recent_solution if stats else None,  # type: ignore
            language_breakdown=language_breakdown
        )
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database connection error fetching dashboard stats: {str(e)}")
        raise HTTPException(status_code=503, detail="Dashboard service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error fetching dashboard stats: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard stats")


# ============================================================================
# GET /api/dashboard/recent - Get Recent Solutions
# ============================================================================

@router.get("/dashboard/recent")
async def get_recent_solutions(
    request: Request,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
) -> dict[str, Any]:
    """
    Get most recently created solutions (from all users)
    
    - **limit**: Maximum number of solutions (default: 10)
    """
    try:
        # Get or auto-create user (fallback if database trigger didn't fire)
        user = await get_or_create_user(current_user, db)
        
        # Debug logging
        logger.info(f"Fetching recent solutions - User ID: {user.id}, Email: {user.email}, Limit: {limit}")
        
        # Show only current user's recent solutions (personal library)
        query = select(Solution).where(
            ~Solution.is_archived,
            Solution.user_id == user.id
        ).order_by(
            Solution.created_at.desc()
        ).limit(limit)
        
        result = await db.execute(query)
        solutions = result.scalars().all()
        
        # Debug logging
        logger.info(f"Found {len(solutions)} recent solutions")
        
        # Convert to dict to avoid serialization issues
        solutions_list: list[dict[str, Any]] = [
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
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database connection error fetching recent solutions: {str(e)}")
        raise HTTPException(status_code=503, detail="Dashboard service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error fetching recent solutions: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch recent solutions")


# ============================================================================
# GET /api/dashboard/popular-tags - Get Most Used Tags
# ============================================================================

@router.get("/dashboard/weekly-activity")
async def get_weekly_activity(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Get solutions created per day for the last 7 days
    
    Returns array of 7 integers representing count per day (oldest to newest)
    """
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Query to count solutions per day for last 7 days
        activity_query = text("""
            WITH dates AS (
                SELECT generate_series(
                    CURRENT_DATE - INTERVAL '6 days',
                    CURRENT_DATE,
                    '1 day'::interval
                )::date AS day
            )
            SELECT 
                d.day,
                COUNT(s.id) as count
            FROM dates d
            LEFT JOIN solutions s ON DATE(s.created_at) = d.day 
                AND s.user_id = :user_id 
                AND s.is_archived = FALSE
            GROUP BY d.day
            ORDER BY d.day ASC
        """)
        
        result = await db.execute(activity_query, {"user_id": str(user.id)})
        activity = [row.count for row in result.fetchall()]
        
        return {"weekly_activity": activity}
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database error fetching weekly activity: {str(e)}")
        raise HTTPException(status_code=503, detail="Dashboard service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error fetching weekly activity: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch weekly activity")


@router.get("/dashboard/popular-tags")
async def get_popular_tags(
    request: Request,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """
    Get most frequently used tags for current user
    
    - **limit**: Maximum number of tags (default: 20)
    """
    
    try:
        # Get or auto-create user (fallback if database trigger didn't fire)
        user = await get_or_create_user(current_user, db)
        
        tags_query = text("""
            SELECT 
                tag,
                COUNT(*) as usage_count
            FROM solutions, unnest(tags) as tag
            WHERE is_archived = FALSE AND user_id = :user_id
            GROUP BY tag
            ORDER BY usage_count DESC
            LIMIT :limit
        """)
        
        result = await db.execute(tags_query, {"user_id": str(user.id), "limit": limit})
        popular_tags = [
            {"tag": row.tag, "count": row.usage_count}
            for row in result.fetchall()
        ]
        
        return {"popular_tags": popular_tags}
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database error fetching popular tags: {str(e)}")
        raise HTTPException(status_code=503, detail="Dashboard service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected error fetching popular tags: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch popular tags")
