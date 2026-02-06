-- ============================================================================
-- DevDocs Database Setup - Step 8: Create Bookmarks Table
-- ============================================================================
-- This script creates the bookmarks table to allow users to save solutions
-- Run this after creating solutions and users tables
-- ============================================================================

-- Create Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign Keys
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints to prevent duplicate bookmarks
    CONSTRAINT unique_user_solution UNIQUE (user_id, solution_id)
);

-- ============================================================================
-- Create Indexes for Performance
-- ============================================================================

-- Index on user_id for fast user bookmarks retrieval
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);

-- Index on solution_id for fast solution bookmark checks
CREATE INDEX IF NOT EXISTS idx_bookmarks_solution_id ON bookmarks(solution_id);

-- Composite index for efficient queries
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_solution ON bookmarks(user_id, solution_id);

-- Index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Check bookmarks table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'bookmarks'
ORDER BY ordinal_position;

-- List all indexes on bookmarks table
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'bookmarks';
