import 'package:supabase_flutter/supabase_flutter.dart';
import 'cache_service.dart';

/// Authentication service for Supabase
/// Handles sign up, sign in, sign out, and auth state management
class AuthService {
  final SupabaseClient _supabase = Supabase.instance.client;
  
  // Get current user
  User? get currentUser => _supabase.auth.currentUser;
  
  // Get current session
  Session? get currentSession => _supabase.auth.currentSession;
  
  // Get auth token for API calls
  String? get token {
    final session = _supabase.auth.currentSession;
    final token = session?.accessToken;
    print('🔐 AuthService.token called:');
    print('   Session exists: ${session != null}');
    print('   Token exists: ${token != null}');
    if (token != null) {
      print('   Token preview: ${token.substring(0, 20)}...');
    }
    return token;
  }
  
  // Check if user is logged in
  bool get isLoggedIn => currentUser != null;
  
  /// Sign up with email and password
  Future<AuthResponse> signUp({
    required String email,
    required String password,
  }) async {
    return await _supabase.auth.signUp(
      email: email,
      password: password,
    );
  }
  
  /// Sign in with email and password
  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
    
    // Cache session if login successful
    if (response.session != null) {
      await _cacheSessionOnLogin();
    }
    
    return response;
  }
  
  /// Sign in with Google OAuth
  Future<bool> signInWithGoogle() async {
    try {
      final response = await _supabase.auth.signInWithOAuth(
        OAuthProvider.google,
        redirectTo: 'io.supabase.devdocs://login-callback',
      );
      return response;
    } catch (e) {
      print('❌ Google sign-in error: $e');
      return false;
    }
  }
  
  /// Sign out
  Future<void> signOut() async {
    // Clear session cache before signing out
    await clearCachedSession();
    await _supabase.auth.signOut();
  }
  
  /// Listen to auth state changes
  Stream<AuthState> get authStateChanges => _supabase.auth.onAuthStateChange;
  
  /// Update user metadata (username)
  Future<void> updateUserMetadata({String? fullName}) async {
    final updates = <String, dynamic>{};
    if (fullName != null) {
      updates['full_name'] = fullName;
    }
    
    if (updates.isNotEmpty) {
      await _supabase.auth.updateUser(
        UserAttributes(
          data: updates,
        ),
      );
    }
  }
  
  /// Get user's full name from metadata or email
  String getUserDisplayName() {
    final user = currentUser;
    if (user == null) return 'User';
    
    // Try to get from user metadata first
    final fullName = user.userMetadata?['full_name'];
    if (fullName != null && fullName.toString().isNotEmpty) {
      return fullName.toString();
    }
    
    // Fallback to email-based name
    final email = user.email ?? 'user@example.com';
    final username = email.split('@')[0];
    final parts = username.replaceAll('.', ' ').split(' ');
    return parts
        .where((word) => word.isNotEmpty)
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(' ');
  }

  // ==================== SESSION CACHING ====================
  
  /// Cache session after successful login
  Future<void> _cacheSessionOnLogin() async {
    try {
      final session = currentSession;
      final user = currentUser;
      
      if (session != null && user != null) {
        await CacheService().cacheSession({
          'accessToken': session.accessToken,
          'userId': user.id,
          'email': user.email,
          'refreshToken': session.refreshToken,
        });
        print('✅ Session cached successfully');
      }
    } catch (e) {
      print('⚠️ Failed to cache session: $e');
    }
  }

  /// Restore session from cache (for auto-login)
  Future<bool> restoreSessionFromCache() async {
    try {
      final cached = CacheService().getCachedSession();
      if (cached == null) {
        print('ℹ️ No cached session found');
        return false;
      }

      print('✅ Found cached session, attempting to restore...');
      
      // Session exists in cache even if user isn't logged in to Supabase
      // This allows showing cached data
      return true;
    } catch (e) {
      print('⚠️ Failed to restore session: $e');
      return false;
    }
  }

  /// Clear cached session (on logout)
  Future<void> clearCachedSession() async {
    try {
      await CacheService().clearAllCache();
      print('✅ Cached session cleared');
    } catch (e) {
      print('⚠️ Failed to clear session: $e');
    }
  }

  /// Override sign in to also cache session
  Future<AuthResponse> signInWithCaching({
    required String email,
    required String password,
  }) async {
    final response = await signIn(email: email, password: password);
    if (response.session != null) {
      await _cacheSessionOnLogin();
    }
    return response;
  }
}
