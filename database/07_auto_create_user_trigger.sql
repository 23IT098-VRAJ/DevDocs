-- ============================================================================
-- DevDocs Database - Auto-Create User on Signup
-- ============================================================================
-- This trigger automatically creates a user in the public.users table
-- whenever a new user signs up through Supabase Auth.
-- 
-- This ensures perfect sync between auth.users and public.users tables
-- without requiring backend API calls or webhooks.
-- ============================================================================

-- ============================================================================
-- TRIGGER FUNCTION: Auto-create user on auth signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert new user into public.users table
    INSERT INTO public.users (
        auth_id,
        email,
        full_name,
        avatar_url,
        is_verified,
        is_active,
        created_at,
        last_login_at
    )
    VALUES (
        NEW.id,                                      -- auth_id from auth.users
        NEW.email,                                   -- email from auth.users
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),  -- from metadata
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''), -- from metadata
        COALESCE(NEW.email_confirmed_at IS NOT NULL, false), -- verified if email confirmed
        true,                                        -- is_active = true by default
        NEW.created_at,                             -- created_at from auth.users
        NEW.last_sign_in_at                         -- last_login_at
    )
    ON CONFLICT (auth_id) DO UPDATE SET
        -- Update existing user if somehow already exists
        email = EXCLUDED.email,
        last_login_at = EXCLUDED.last_login_at,
        is_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, public.users.is_verified);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- CREATE TRIGGER on auth.users table
-- ============================================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger that fires after INSERT on auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- BACKFILL EXISTING USERS (Run once to sync existing auth users)
-- ============================================================================

-- This will create public.users records for any existing auth.users
-- that don't have a corresponding public.users record
INSERT INTO public.users (
    auth_id,
    email,
    full_name,
    avatar_url,
    is_verified,
    is_active,
    created_at,
    last_login_at
)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', ''),
    COALESCE(au.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(au.email_confirmed_at IS NOT NULL, false),
    true,
    au.created_at,
    au.last_sign_in_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.auth_id = au.id
WHERE pu.id IS NULL;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify trigger was created successfully
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verify users were backfilled
SELECT 
    COUNT(*) as total_auth_users,
    (SELECT COUNT(*) FROM public.users) as total_public_users
FROM auth.users;

-- Show any auth users without public.users record (should be 0)
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON pu.auth_id = au.id
WHERE pu.id IS NULL;

