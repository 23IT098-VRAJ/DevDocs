-- ============================================================================
-- DevDocs Database Setup - Step 1: Create Tables
-- ============================================================================
-- This script creates the solutions table with all required columns and constraints
-- Run this first before indexes and triggers
-- ============================================================================

-- Enable pgvector extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================================
-- Create Solutions Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS solutions (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content Fields
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    
    -- Tags (array of strings for categorization)
    tags TEXT[] DEFAULT '{}',
    
    -- Vector Embedding (384 dimensions from all-MiniLM-L6-v2)
    embedding vector(384),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Constraints
    CONSTRAINT title_length CHECK (length(title) >= 5 AND length(title) <= 200),
    CONSTRAINT description_length CHECK (length(description) >= 20 AND length(description) <= 2000),
    CONSTRAINT code_length CHECK (length(code) >= 10 AND length(code) <= 5000),
    CONSTRAINT language_length CHECK (length(language) >= 2 AND length(language) <= 50)
);

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Check if table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'solutions'
ORDER BY ordinal_position;
