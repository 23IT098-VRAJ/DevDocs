"""
DevDocs Backend - Semantic Search Router
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from pydantic import BaseModel
from typing import List
import time

from app.database import get_db
from app.models.solution import Solution
from app.models.embedding import embedding_service
from app.schemas.solution import SearchResult, SearchResponse, SolutionResponse


router = APIRouter()


# ============================================================================
# Search Request Schema
# ============================================================================

class SearchRequest(BaseModel):
    """Search request with query text"""
    query: str
    limit: int = 10
    min_similarity: float = 0.3


# ============================================================================
# POST /api/search - Semantic Search
# ============================================================================

@router.post("/search", response_model=SearchResponse)
async def semantic_search(
    search_request: SearchRequest,
    db: AsyncSession = Depends(get_db)
):
    """Semantic search for code solutions using AI-powered vector similarity"""
    try:
        start_time = time.time()
        
        # Generate embedding for search query
        query_embedding = embedding_service.generate_embedding(search_request.query)
        
        # Convert embedding list to PostgreSQL vector string format
        embedding_str = '[' + ','.join(map(str, query_embedding)) + ']'
        
        # Vector similarity search using pgvector
        # Use COALESCE to handle NaN values from mock embeddings
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
                COALESCE(1 - (embedding <=> CAST(:query_embedding AS vector)), 0.0) as similarity
            FROM solutions
            WHERE is_archived = FALSE
              AND embedding IS NOT NULL
              AND COALESCE(1 - (embedding <=> CAST(:query_embedding AS vector)), 0.0) >= :min_similarity
            ORDER BY embedding <=> CAST(:query_embedding AS vector)
            LIMIT :limit
        """)
        
        result = await db.execute(
            similarity_query,
            {
                "query_embedding": embedding_str,
                "min_similarity": search_request.min_similarity,
                "limit": search_request.limit
            }
        )
        
        rows = result.fetchall()
        
        # Build search results
        search_results = []
        for rank, row in enumerate(rows, start=1):
            # Handle NaN similarity values from mock embeddings
            import math
            similarity_value = float(row.similarity) if not math.isnan(row.similarity) else 0.0
            # Clamp between 0 and 1
            similarity_value = max(0.0, min(1.0, similarity_value))
            
            solution = SolutionResponse(
                id=row.id,
                title=row.title,
                description=row.description,
                code=row.code,
                language=row.language,
                tags=row.tags,
                created_at=row.created_at,
                updated_at=row.updated_at,
                is_archived=row.is_archived
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
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


# ============================================================================
# GET /api/search/suggestions - Get search suggestions
# ============================================================================

@router.get("/search/suggestions")
async def get_search_suggestions(
    query: str = Query(..., min_length=2, description="Partial query for suggestions"),
    limit: int = Query(5, ge=1, le=10),
    db: AsyncSession = Depends(get_db)
):
    """Get search suggestions based on partial query"""
    try:
        # Search in titles using full-text search
        suggestions_query = text("""
            SELECT DISTINCT
                title,
                ts_rank(
                    to_tsvector('english', title),
                    plainto_tsquery('english', :query)
                ) as rank
            FROM solutions
            WHERE is_archived = FALSE
              AND to_tsvector('english', title) @@ plainto_tsquery('english', :query)
            ORDER BY rank DESC
            LIMIT :limit
        """)
        
        result = await db.execute(suggestions_query, {"query": query, "limit": limit})
        suggestions = [{"text": row.title, "type": "title"} for row in result.fetchall()]
        
        return {"suggestions": suggestions}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get suggestions: {str(e)}")

