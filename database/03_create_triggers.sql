-- ============================================================================
-- DevDocs Database Setup - Step 3: Create Triggers
-- ============================================================================
-- This script creates triggers for automatic timestamp updates
-- Run this AFTER creating the table
-- ============================================================================

-- ============================================================================
-- Auto-Update Timestamp Trigger
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_solutions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires BEFORE UPDATE on solutions table
CREATE TRIGGER solutions_updated_at_trigger
BEFORE UPDATE ON solutions
FOR EACH ROW
EXECUTE FUNCTION update_solutions_updated_at();

-- ============================================================================
-- Verification Query
-- ============================================================================

-- Check if trigger was created successfully
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'solutions';
