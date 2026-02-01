-- ============================================================================
-- DevDocs Database - 100% Completeness Verification
-- ============================================================================
-- Run this in Supabase SQL Editor to verify everything is set up correctly
-- ============================================================================

-- ============================================================================
-- ✅ Check 1: Verify pgvector Extension
-- ============================================================================
SELECT extname, extversion 
FROM pg_extension 
WHERE extname = 'vector';
-- Expected: Should show 'vector' with version number

-- ============================================================================
-- ✅ Check 2: Verify Solutions Table Exists with All Columns
-- ============================================================================
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'solutions'
ORDER BY ordinal_position;
-- Expected: 10 rows (id, title, description, code, language, tags, embedding, created_at, updated_at, is_archived)

-- ============================================================================
-- ✅ Check 3: Verify All Indexes Are Created
-- ============================================================================
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'solutions'
ORDER BY indexname;
-- Expected: At least 9 indexes including 'solutions_embedding_idx' (IVFFLAT)

-- ============================================================================
-- ✅ Check 4: Verify Trigger Function Exists
-- ============================================================================
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'solutions';
-- Expected: Should show 'update_solutions_updated_at_trigger'

-- ============================================================================
-- ✅ Check 5: Verify Sample Data Count
-- ============================================================================
SELECT 
    COUNT(*) as total_solutions,
    COUNT(*) FILTER (WHERE is_archived = FALSE) as active_solutions,
    COUNT(*) FILTER (WHERE is_archived = TRUE) as archived_solutions
FROM solutions;
-- Expected: total_solutions = 6 (5 samples + 1 test), archived_solutions = 1

-- ============================================================================
-- ✅ Check 6: Verify All Languages Present
-- ============================================================================
SELECT DISTINCT language, COUNT(*) as count
FROM solutions
GROUP BY language
ORDER BY count DESC;
-- Expected: python (4), javascript (1), typescript (1), sql (1)

-- ============================================================================
-- ✅ Check 7: Verify Tags Array Works
-- ============================================================================
SELECT title, array_length(tags, 1) as tag_count, tags
FROM solutions
WHERE is_archived = FALSE
LIMIT 3;
-- Expected: Should show solutions with tags arrays

-- ============================================================================
-- ✅ Check 8: Verify Embedding Vectors Work
-- ============================================================================
SELECT 
    id,
    title,
    vector_dims(embedding) as embedding_dimensions
FROM solutions
LIMIT 3;
-- Expected: embedding_dimensions = 384 for all rows

-- ============================================================================
-- ✅ Check 9: Test Vector Similarity Query
-- ============================================================================
SELECT 
    title,
    language,
    1 - (embedding <=> array_fill(0.5::float, ARRAY[384])::vector) as similarity
FROM solutions
WHERE is_archived = FALSE
ORDER BY similarity DESC
LIMIT 3;
-- Expected: Should return 3 solutions with similarity scores (0.0 to 1.0)

-- ============================================================================
-- ✅ Check 10: Verify Constraints Work
-- ============================================================================
-- Test title length constraint (should FAIL with error)
-- Uncomment to test:
-- INSERT INTO solutions (title, description, code, language, tags)
-- VALUES ('abc', 'Valid description here with enough characters', 'SELECT 1;', 'sql', ARRAY['test']);
-- Expected: ERROR - title must be between 5-200 characters

-- ============================================================================
-- ✅ Check 11: Verify Auto-Timestamp Trigger Works
-- ============================================================================
-- Get one solution and check if updated_at changes on UPDATE
UPDATE solutions 
SET description = description || ' [verified]'
WHERE title = 'Test solution - PostgreSQL query'
RETURNING title, created_at, updated_at, (updated_at > created_at) as trigger_worked;
-- Expected: trigger_worked = TRUE

-- ============================================================================
-- ✅ Check 12: Final Summary
-- ============================================================================
SELECT 
    'Solutions Table' as component,
    CASE WHEN COUNT(*) > 0 THEN '✅ Working' ELSE '❌ Missing' END as status
FROM solutions

UNION ALL

SELECT 
    'pgvector Extension' as component,
    CASE WHEN COUNT(*) > 0 THEN '✅ Enabled' ELSE '❌ Disabled' END as status
FROM pg_extension WHERE extname = 'vector'

UNION ALL

SELECT 
    'Vector Index (IVFFLAT)' as component,
    CASE WHEN COUNT(*) > 0 THEN '✅ Created' ELSE '❌ Missing' END as status
FROM pg_indexes 
WHERE tablename = 'solutions' 
  AND indexdef LIKE '%ivfflat%'

UNION ALL

SELECT 
    'Timestamp Trigger' as component,
    CASE WHEN COUNT(*) > 0 THEN '✅ Active' ELSE '❌ Missing' END as status
FROM information_schema.triggers 
WHERE event_object_table = 'solutions';

-- ============================================================================
-- 🎉 RESULT INTERPRETATION
-- ============================================================================
-- If all checks show '✅ Working/Enabled/Created/Active' → Database is 100% ready!
-- If any check fails → Share the error message and I'll help fix it
-- ============================================================================
