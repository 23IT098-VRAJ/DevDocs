-- ============================================================================
-- DevDocs Database Setup - Step 5: Test All Queries
-- ============================================================================
-- This script tests all database functionality
-- Run this AFTER inserting sample data
-- ============================================================================

-- ============================================================================
-- Test 1: Basic SELECT (Get all solutions)
-- ============================================================================

SELECT 
    id,
    title,
    language,
    tags,
    created_at
FROM solutions
WHERE is_archived = FALSE
ORDER BY created_at DESC;

-- ============================================================================
-- Test 2: Filter by Language
-- ============================================================================

SELECT 
    id,
    title,
    language
FROM solutions
WHERE language = 'python'
  AND is_archived = FALSE
ORDER BY created_at DESC;

-- ============================================================================
-- Test 3: Search by Tags (Array contains)
-- ============================================================================

SELECT 
    id,
    title,
    tags
FROM solutions
WHERE 'fastapi' = ANY(tags)
  AND is_archived = FALSE;

-- ============================================================================
-- Test 4: Full-Text Search (Keyword search)
-- ============================================================================

SELECT 
    id,
    title,
    ts_rank(
        to_tsvector('english', title || ' ' || description),
        plainto_tsquery('english', 'authentication')
    ) as rank
FROM solutions
WHERE to_tsvector('english', title || ' ' || description) @@ 
      plainto_tsquery('english', 'authentication')
  AND is_archived = FALSE
ORDER BY rank DESC;

-- ============================================================================
-- Test 5: Vector Similarity Search (Semantic search)
-- ============================================================================
-- This tests the CRITICAL semantic search functionality
-- Mock query embedding (in production, this comes from sentence-transformers)

SELECT 
    id,
    title,
    language,
    1 - (embedding <=> array_fill(0.0::float, ARRAY[384])::vector) as similarity
FROM solutions
WHERE is_archived = FALSE
ORDER BY embedding <=> array_fill(0.0::float, ARRAY[384])::vector
LIMIT 5;

-- ============================================================================
-- Test 6: Dashboard Statistics
-- ============================================================================

SELECT 
    COUNT(*) as total_solutions,
    COUNT(DISTINCT language) as total_languages,
    (SELECT COUNT(DISTINCT tag) FROM solutions, unnest(tags) as tag WHERE is_archived = FALSE) as unique_tags,
    MAX(created_at) as most_recent_solution
FROM solutions
WHERE is_archived = FALSE;

-- ============================================================================
-- Test 7: Language Breakdown
-- ============================================================================

SELECT 
    language,
    COUNT(*) as solution_count
FROM solutions
WHERE is_archived = FALSE
GROUP BY language
ORDER BY solution_count DESC;

-- ============================================================================
-- Test 8: INSERT New Solution
-- ============================================================================

INSERT INTO solutions (
    title,
    description,
    code,
    language,
    tags
) VALUES (
    'Test solution - PostgreSQL query',
    'This is a test solution to verify INSERT works correctly with proper validation.',
    'SELECT * FROM users WHERE active = true ORDER BY created_at DESC LIMIT 10;',
    'sql',
    ARRAY['postgresql', 'query', 'test']
)
RETURNING id, title, created_at;

-- ============================================================================
-- Test 9: UPDATE Solution
-- ============================================================================

-- Update the test solution we just created
UPDATE solutions
SET 
    title = 'Updated test solution',
    tags = ARRAY['postgresql', 'query', 'test', 'updated']
WHERE title = 'Test solution - PostgreSQL query'
RETURNING id, title, updated_at;

-- ============================================================================
-- Test 10: Soft DELETE (Archive)
-- ============================================================================

-- Soft delete the test solution
UPDATE solutions
SET is_archived = TRUE
WHERE title = 'Updated test solution'
RETURNING id, title, is_archived;

-- ============================================================================
-- Test 11: Check Auto-Timestamp Trigger
-- ============================================================================

-- Verify that updated_at was automatically updated
SELECT 
    title,
    created_at,
    updated_at,
    updated_at > created_at as timestamp_updated
FROM solutions
WHERE title = 'Updated test solution';

-- ============================================================================
-- Test 12: Index Usage Analysis
-- ============================================================================

-- Check if indexes are being used properly
EXPLAIN ANALYZE
SELECT * FROM solutions
WHERE language = 'python'
  AND is_archived = FALSE
ORDER BY created_at DESC;

-- ============================================================================
-- Verification Summary
-- ============================================================================

-- Final count of all solutions (including archived)
SELECT 
    COUNT(*) FILTER (WHERE is_archived = FALSE) as active_solutions,
    COUNT(*) FILTER (WHERE is_archived = TRUE) as archived_solutions,
    COUNT(*) as total_solutions
FROM solutions;
