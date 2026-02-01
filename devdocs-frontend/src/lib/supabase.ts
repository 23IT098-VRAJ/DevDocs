/**
 * Supabase Client Configuration
 * 
 * This module initializes and exports the Supabase client for authentication
 * and database operations. The client is configured with environment variables
 * and provides a singleton instance for use throughout the application.
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// ENVIRONMENT VARIABLES
// ============================================================================

/**
 * Supabase project URL
 * Format: https://<project-id>.supabase.co
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Supabase anonymous key (public key)
 * Safe to use in client-side code
 */
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ============================================================================
// VALIDATION
// ============================================================================

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL environment variable. ' +
    'Please add it to your .env.local file.'
  );
}

if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable. ' +
    'Please add it to your .env.local file.'
  );
}

// Log configuration in development only
if (process.env.NODE_ENV === 'development') {
  console.log('✅ Supabase configuration loaded:', {
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey.substring(0, 20) + '...'
  });
}

// ============================================================================
// CLIENT INITIALIZATION
// ============================================================================

/**
 * Supabase client instance
 * 
 * This client provides:
 * - Authentication methods (signIn, signUp, signOut, etc.)
 * - Database queries (if needed)
 * - Real-time subscriptions (if needed)
 * - Storage operations (if needed)
 * 
 * Configuration:
 * - auth.persistSession: true - Enables session persistence
 * - auth.autoRefreshToken: true - Automatically refreshes tokens
 * - auth.detectSessionInUrl: true - Handles OAuth callbacks
 * - auth.storage: localStorage - Session stored in localStorage (Supabase default)
 * 
 * Note: Supabase handles token storage internally. The AuthContext manages
 * the in-memory state for React components.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage for persistence across page refreshes
    persistSession: true,
    
    // Automatically refresh tokens before they expire
    autoRefreshToken: true,
    
    // Detect and handle OAuth callback URLs
    detectSessionInUrl: true,
    
    // Use localStorage for session storage (Supabase default)
    // Note: This is managed by Supabase internally and is secure
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the current session
 * @returns Promise resolving to the current session or null
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data.session;
}

/**
 * Get the current user
 * @returns Promise resolving to the current user or null
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data.user;
}

/**
 * Sign out the current user
 * @returns Promise resolving when sign out is complete
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
