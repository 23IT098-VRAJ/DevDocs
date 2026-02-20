"""
DevDocs Backend - Semantic Search Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select, and_
from sqlalchemy.exc import OperationalError, DBAPIError
from pydantic import BaseModel, Field
import time
import uuid

from app.database import get_db
from app.models.embedding import embedding_service
from app.models.bookmark import Bookmark
from app.auth import get_current_user, CurrentUser, get_or_create_user
from app.schemas.solution import SearchResult, SearchResponse, SolutionResponse
from app.logger import get_logger

logger = get_logger(__name__)


router = APIRouter()


# ============================================================================
# Search Request Schema
# ============================================================================

class SearchRequest(BaseModel):
    """Search request with query text"""
    query: str = Field(..., max_length=1000, description="Search query (max 1000 characters)")
    limit: int = Field(10, ge=1, le=100, description="Max results (1-100)")
    min_similarity: float = Field(0.3, ge=0.0, le=1.0)


# ============================================================================
# POST /api/search - Semantic Search
# ============================================================================

@router.post("/search", response_model=SearchResponse)
async def semantic_search(
    request: Request,
    search_request: SearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
):
    """Semantic search for code solutions using AI-powered vector similarity"""
    try:
        start_time = time.time()
        
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Generate embedding for search query (async — does not block event loop)
        query_embedding = await embedding_service.generate_embedding_async(search_request.query)
        
        if query_embedding is None:
            raise HTTPException(
                status_code=503, 
                detail="Semantic search unavailable - embedding model not loaded"
            )
        
        # Convert embedding list to PostgreSQL vector string format
        embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'
        
        # Vector similarity search using pgvector - filter by user_id
        similarity_query = text("""
            SELECT 
                id,
                title,
                description,
                code,
                language,
                tags,
                created_at,
                updated_at,
                is_archived,
                1 - (embedding <=> CAST(:query_embedding AS vector)) as similarity
            FROM solutions
            WHERE is_archived = FALSE
              AND user_id = :user_id
              AND embedding IS NOT NULL
              AND (1 - (embedding <=> CAST(:query_embedding AS vector))) >= :min_similarity
            ORDER BY embedding <=> CAST(:query_embedding AS vector)
            LIMIT :limit
        """)
        
        result = await db.execute(
            similarity_query,
            {
                "query_embedding": embedding_str,
                "user_id": str(user.id),
                "min_similarity": search_request.min_similarity,
                "limit": search_request.limit
            }
        )
        
        rows = result.fetchall()
        
        # Get bookmark status for all solutions in one query
        solution_ids = [row.id for row in rows]
        bookmarked_ids = set()
        if solution_ids:
            bookmark_query = select(Bookmark.solution_id).where(
                and_(
                    Bookmark.user_id == user.id,
                    Bookmark.solution_id.in_(solution_ids)
                )
            )
            bookmark_result = await db.execute(bookmark_query)
            bookmarked_ids = {row[0] for row in bookmark_result.fetchall()}
        
        # Build search results
        search_results: list[SearchResult] = []
        for rank, row in enumerate(rows, start=1):
            # Similarity is already calculated, just clamp between 0 and 1
            similarity_value = max(0.0, min(1.0, float(row.similarity)))
            
            solution = SolutionResponse(
                id=row.id,
                title=row.title,
                description=row.description,
                code=row.code,
                language=row.language,
                tags=row.tags,
                created_at=row.created_at,
                updated_at=row.updated_at,
                is_archived=row.is_archived,
                is_bookmarked=(row.id in bookmarked_ids)
            )
            
            search_results.append(SearchResult(
                solution=solution,
                similarity=similarity_value,
                rank=rank
            ))
        
        # Calculate search time
        search_time_ms = (time.time() - start_time) * 1000
        
        return SearchResponse(
            query=search_request.query,
            results=search_results,
            total_results=len(search_results),
            search_time_ms=round(search_time_ms, 2)
        )
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database connection error during search: {str(e)}")
        raise HTTPException(status_code=503, detail="Search service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected search error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Search failed")


# ============================================================================
# POST /api/search/answer  —  AI answer synthesis (streaming)
# ============================================================================

@router.post("/search/answer")
async def ai_answer(
    search_request: SearchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    """
    Stream a Gemini-generated answer synthesised from the user's top semantic
    search results.  Response is plain text streamed token-by-token.
    """
    from app.services import gemini

    if not gemini.is_available():
        raise HTTPException(
            status_code=503,
            detail="AI answers unavailable — GEMINI_API_KEY not configured",
        )

    user = await get_or_create_user(current_user, db)

    # Reuse the same vector search as /api/search
    query_embedding = await embedding_service.generate_embedding_async(search_request.query)
    if query_embedding is None:
        raise HTTPException(status_code=503, detail="Embedding model not available")

    embedding_str = "[" + ",".join(map(str, query_embedding)) + "]"

    similarity_query = text("""
        SELECT title, description, code, language, tags
        FROM solutions
        WHERE is_archived = FALSE
          AND user_id = :user_id
          AND embedding IS NOT NULL
          AND (1 - (embedding <=> CAST(:query_embedding AS vector))) >= :min_similarity
        ORDER BY embedding <=> CAST(:query_embedding AS vector)
        LIMIT 5
    """)

    result = await db.execute(
        similarity_query,
        {
            "query_embedding": embedding_str,
            "user_id": str(user.id),
            "min_similarity": search_request.min_similarity,
        },
    )
    rows = result.fetchall()

    results = [
        {
            "solution": {
                "title": r.title,
                "description": r.description,
                "code": r.code,
                "language": r.language,
                "tags": r.tags or [],
            }
        }
        for r in rows
    ]

    async def stream():
        async for chunk in gemini.generate_answer_stream(search_request.query, results):
            yield chunk

    return StreamingResponse(stream(), media_type="text/plain; charset=utf-8")


# ============================================================================
# GET /api/search/suggestions - Get search suggestions
# ============================================================================

@router.get("/search/suggestions")
async def get_search_suggestions(
    request: Request,
    query: str = Query(..., min_length=2, description="Partial query for suggestions"),
    limit: int = Query(5, ge=1, le=10),
    db: AsyncSession = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user)
) -> dict[str, list[dict[str, str]]]:
    """Get search suggestions based on partial query"""
    limiter = request.app.state.limiter
    await limiter.check_limit(request, "60/minute")
    try:
        # Get or auto-create user
        user = await get_or_create_user(current_user, db)
        
        # Search in titles using full-text search - filter by user_id
        suggestions_query = text("""
            SELECT DISTINCT
                title,
                ts_rank(
                    to_tsvector('english', title),
                    plainto_tsquery('english', :query)
                ) as rank
            FROM solutions
            WHERE is_archived = FALSE
              AND user_id = :user_id
              AND to_tsvector('english', title) @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC
            LIMIT :limit
        """)
        
        result = await db.execute(suggestions_query, {"query": query, "user_id": str(user.id), "limit": limit})
        suggestions: list[dict[str, str]] = [{"text": str(row.title), "type": "title"} for row in result.fetchall()]
        
        return {"suggestions": suggestions}
    
    except HTTPException:
        raise
    except (OperationalError, DBAPIError) as e:
        logger.error(f"Database connection error during suggestions: {str(e)}")
        raise HTTPException(status_code=503, detail="Suggestions service temporarily unavailable")
    except Exception as e:
        logger.error(f"Unexpected suggestions error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to get suggestions")

