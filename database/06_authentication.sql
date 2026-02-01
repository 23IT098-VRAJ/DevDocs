-- DevDocs Database - Authentication Tables
-- This file creates the necessary authentication tables and policies

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    
    -- Supabase Auth integration
    auth_id UUID UNIQUE NOT NULL, -- References auth.users(id) in Supabase
    
    -- Profile information
    bio TEXT,
    github_username VARCHAR(255),
    twitter_username VARCHAR(255),
    website_url TEXT,
    
    -- User preferences
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'en',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- ============================================================================
-- UPDATE SOLUTIONS TABLE
-- ============================================================================

-- Add user_id column to solutions
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_solutions_user_id ON solutions(user_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp for users
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_users_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view all profiles (public read)
CREATE POLICY "Users can view all profiles"
    ON users FOR SELECT
    USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth_id = auth.uid());

-- Users can insert their own profile (during signup)
CREATE POLICY "Users can create own profile"
    ON users FOR INSERT
    WITH CHECK (auth_id = auth.uid());

-- Enable RLS on solutions table
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

-- Anyone can view public solutions
CREATE POLICY "Anyone can view solutions"
    ON solutions FOR SELECT
    USING (true);

-- Authenticated users can create solutions
CREATE POLICY "Authenticated users can create solutions"
    ON solutions FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own solutions
CREATE POLICY "Users can update own solutions"
    ON solutions FOR UPDATE
    USING (user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
    ));

-- Users can delete their own solutions
CREATE POLICY "Users can delete own solutions"
    ON solutions FOR DELETE
    USING (user_id IN (
        SELECT id FROM users WHERE auth_id = auth.uid()
    ));

-- ============================================================================
-- SAMPLE ADMIN USER (OPTIONAL)
-- ============================================================================

-- Note: This will fail if auth_id doesn't exist in auth.users
-- You'll need to sign up through Supabase Auth first, then run:
-- INSERT INTO users (email, full_name, auth_id, is_verified)
-- VALUES ('admin@devdocs.com', 'Admin User', '[YOUR_AUTH_UUID]', true);
