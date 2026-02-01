-- ============================================================================
-- DevDocs Database Setup - Step 2: Create Indexes
-- ============================================================================
-- This script creates all performance indexes for the solutions table
-- Run this AFTER creating the table
-- ============================================================================

-- ============================================================================
-- B-Tree Indexes (Fast lookups and sorting)
-- ============================================================================

-- Index on language (for filtering by programming language)
CREATE INDEX IF NOT EXISTS idx_solutions_language 
ON solutions(language);

-- Index on created_at DESC (for recent solutions)
CREATE INDEX IF NOT EXISTS idx_solutions_created_at 
ON solutions(created_at DESC);

-- Index on updated_at (for sorting by modification date)
CREATE INDEX IF NOT EXISTS idx_solutions_updated_at 
ON solutions(updated_at DESC);

-- Index on is_archived (filter out archived solutions)
CREATE INDEX IF NOT EXISTS idx_solutions_archived 
ON solutions(is_archived);

-- ============================================================================
-- GIN Indexes (Array and full-text search)
-- ============================================================================

-- GIN index on tags array (search by tags)
CREATE INDEX IF NOT EXISTS idx_solutions_tags 
ON solutions USING GIN(tags);

-- Full-text search index (keyword fallback)
CREATE INDEX IF NOT EXISTS idx_solutions_search 
ON solutions USING gin(to_tsvector('english', title || ' ' || description));

-- ============================================================================
-- Vector Index (Semantic similarity search) - CRITICAL FOR DEVDOCS
-- ============================================================================

-- IVFFLAT index for vector similarity search
-- This is the MOST IMPORTANT index for semantic search performance
-- lists = 100 is optimal for 10K-50K solutions
CREATE INDEX IF NOT EXISTS solutions_embedding_idx 
ON solutions 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Check all indexes were created successfully
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'solutions'
ORDER BY indexname;
