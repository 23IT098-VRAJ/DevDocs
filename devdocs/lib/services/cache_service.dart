import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Local caching service for offline support
/// Stores user data, solutions, and dashboard stats
class CacheService {
  static final CacheService _instance = CacheService._internal();
  factory CacheService() => _instance;
  CacheService._internal();

  late SharedPreferences _prefs;

  // Cache keys
  static const String _userProfileKey = 'user_profile';
  static const String _userSessionKey = 'user_session';
  static const String _solutionsKey = 'solutions_cache';
  static const String _dashboardStatsKey = 'dashboard_stats';
  static const String _lastSyncKey = 'last_sync_time';

  /// Initialize cache service
  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
    debugLog('✅ Cache service initialized');
  }

  // ==================== USER DATA ====================

  /// Cache user profile
  Future<void> cacheUserProfile(Map<String, dynamic> userProfile) async {
    try {
      await _prefs.setString(_userProfileKey, jsonEncode(userProfile));
      await _updateLastSync('user_profile');
      debugLog('✅ User profile cached');
    } catch (e) {
      debugLog('❌ Failed to cache user profile: $e');
    }
  }

  /// Get cached user profile
  Map<String, dynamic>? getCachedUserProfile() {
    try {
      final jsonStr = _prefs.getString(_userProfileKey);
      if (jsonStr == null) return null;
      return jsonDecode(jsonStr);
    } catch (e) {
      debugLog('❌ Failed to read user profile: $e');
      return null;
    }
  }

  // ==================== SESSION DATA ====================

  /// Cache session/token
  Future<void> cacheSession(Map<String, dynamic> sessionData) async {
    try {
      await _prefs.setString(_userSessionKey, jsonEncode(sessionData));
      debugLog('✅ Session cached');
    } catch (e) {
      debugLog('❌ Failed to cache session: $e');
    }
  }

  /// Get cached session
  Map<String, dynamic>? getCachedSession() {
    try {
      final jsonStr = _prefs.getString(_userSessionKey);
      if (jsonStr == null) return null;
      return jsonDecode(jsonStr);
    } catch (e) {
      debugLog('❌ Failed to read session: $e');
      return null;
    }
  }

  // ==================== SOLUTIONS ====================

  /// Cache solutions list
  Future<void> cacheSolutions(List<dynamic> solutions) async {
    try {
      await _prefs.setString(_solutionsKey, jsonEncode(solutions));
      await _updateLastSync('solutions');
      debugLog('✅ ${solutions.length} solutions cached');
    } catch (e) {
      debugLog('❌ Failed to cache solutions: $e');
    }
  }

  /// Get cached solutions
  List<dynamic>? getCachedSolutions() {
    try {
      final jsonStr = _prefs.getString(_solutionsKey);
      if (jsonStr == null) return null;
      return jsonDecode(jsonStr);
    } catch (e) {
      debugLog('❌ Failed to read solutions: $e');
      return null;
    }
  }

  // ==================== DASHBOARD STATS ====================

  /// Cache dashboard stats
  Future<void> cacheDashboardStats(Map<String, dynamic> stats) async {
    try {
      await _prefs.setString(_dashboardStatsKey, jsonEncode(stats));
      await _updateLastSync('dashboard_stats');
      debugLog('✅ Dashboard stats cached');
    } catch (e) {
      debugLog('❌ Failed to cache dashboard stats: $e');
    }
  }

  /// Get cached dashboard stats
  Map<String, dynamic>? getCachedDashboardStats() {
    try {
      final jsonStr = _prefs.getString(_dashboardStatsKey);
      if (jsonStr == null) return null;
      return jsonDecode(jsonStr);
    } catch (e) {
      debugLog('❌ Failed to read dashboard stats: $e');
      return null;
    }
  }

  // ==================== SYNC TIME ====================

  /// Update last sync time for a key
  Future<void> _updateLastSync(String key) async {
    try {
      final now = DateTime.now().toIso8601String();
      await _prefs.setString('${_lastSyncKey}_$key', now);
    } catch (e) {
      debugLog('❌ Failed to update sync time: $e');
    }
  }

  /// Get last sync time for a key
  DateTime? getLastSyncTime(String key) {
    try {
      final timeStr = _prefs.getString('${_lastSyncKey}_$key');
      if (timeStr == null) return null;
      return DateTime.parse(timeStr);
    } catch (e) {
      return null;
    }
  }

  /// Get human-readable time since last sync
  String getLastSyncDisplay(String key) {
    final lastSync = getLastSyncTime(key);
    if (lastSync == null) return 'Never';
    
    final now = DateTime.now();
    final diff = now.difference(lastSync);
    
    if (diff.inMinutes < 1) return 'Just now';
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    return '${diff.inDays}d ago';
  }

  // ==================== CLEAR CACHE ====================

  /// Clear all cached data
  Future<void> clearAllCache() async {
    try {
      await Future.wait([
        _prefs.remove(_userProfileKey),
        _prefs.remove(_userSessionKey),
        _prefs.remove(_solutionsKey),
        _prefs.remove(_dashboardStatsKey),
      ]);
      debugLog('✅ All cache cleared');
    } catch (e) {
      debugLog('❌ Failed to clear cache: $e');
    }
  }

  /// Check if cache exists for given key
  bool hasCachedData(String key) {
    return _prefs.containsKey(key);
  }

  // ==================== HELPERS ====================

  /// Debug logging
  static void debugLog(String message) {
    print('📦 [CACHE] $message');
  }
}
