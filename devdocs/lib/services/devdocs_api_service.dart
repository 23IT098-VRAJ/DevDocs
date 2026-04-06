import 'dart:convert';
import 'dart:async';
import 'package:http/http.dart' as http;
import 'auth_service.dart';
import 'cache_service.dart';
import 'connectivity_service.dart';
import '../models/solution.dart';
import '../models/user.dart';
import '../models/dashboard_stats.dart';
import '../models/search_result.dart';
import '../constants/api_config.dart';

/// API Service for DevDocs Backend
/// Handles all HTTP requests to the FastAPI backend with Supabase JWT authentication
/// Following naming conventions from copilot-instructions.md
class DevDocsApiService {
  // Use centralized API configuration
  static String get baseUrl => ApiConfig.activeBaseUrl;

  final AuthService _authService = AuthService();
  
  /// Get authorization headers with Bearer token
  Map<String, String> get _headers {
    final token = _authService.token;
    print('\n📡 API Headers:');
    print('   Token available: ${token != null}');
    if (token == null) {
      print('   ❌ NO TOKEN - Request will fail with 403!');
    } else {
      print('   ✓ Token will be sent');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${token ?? 'NO_TOKEN'}',
    };
  }
  
  /// Helper to handle API responses
  dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return {};
      try {
        return jsonDecode(response.body);
      } on FormatException {
        final preview = response.body.trimLeft();
        if (preview.startsWith('<')) {
          throw Exception(
            'Unexpected HTML response from API. Check API base URL and backend status. Current base URL: $baseUrl',
          );
        }
        throw Exception('Invalid JSON response from server.');
      }
    } else if (response.statusCode == 401) {
      throw Exception('Unauthorized - Please log in again');
    } else if (response.statusCode == 403) {
      throw Exception('Access denied. You don\'t have permission to perform this action.');
    } else if (response.statusCode == 404) {
      throw Exception('Resource not found.');
    } else if (response.statusCode == 409) {
      final error = response.body.isNotEmpty ? jsonDecode(response.body) : {};
      throw Exception('Conflict: ${error['detail'] ?? "Resource already exists"}');
    } else if (response.statusCode == 422) {
      final error = jsonDecode(response.body);
      throw Exception('Validation Error: ${error['detail']}');
    } else if (response.statusCode >= 500) {
      throw Exception('Server error. Please try again later.');
    } else {
      throw Exception('API Error ${response.statusCode}: ${response.body}');
    }
  }
  
  /// Execute HTTP request with timeout and error handling
  Future<http.Response> _executeRequest(Future<http.Response> Function() request) async {
    const int maxAttempts = 2;

    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await request().timeout(
          ApiConfig.requestTimeout,
          onTimeout: () {
            throw TimeoutException(
              'Request timed out. Please check your connection and try again.',
            );
          },
        );
      } on TimeoutException {
        if (attempt == maxAttempts) {
          rethrow;
        }
        await Future.delayed(const Duration(milliseconds: 800));
      } on http.ClientException {
        if (attempt == maxAttempts) {
          rethrow;
        }
        await Future.delayed(const Duration(milliseconds: 800));
      } catch (e) {
        if (e is Exception) rethrow;
        throw Exception('Network error: ${e.toString()}');
      }
    }

    throw Exception('Request failed unexpectedly.');
  }
  
  // ==================== USER PROFILE ====================
  
  /// Get current user's profile
  /// Supports offline mode by falling back to cached profile
  /// Returns null if no profile available (handles first-time login gracefully)
  Future<User?> getUserProfile() async {
    final isOnline = await ConnectivityService().checkConnectivity();
    
    // Try to fetch from API if online
    if (isOnline) {
      try {
        final response = await _executeRequest(() => http.get(
          Uri.parse('$baseUrl/auth/me'),
          headers: _headers,
        ));
        final data = _handleResponse(response);
        final user = User.fromJson(data);
        
        // Cache the profile
        await CacheService().cacheUserProfile(data);
        print('✅ User profile fetched and cached');
        
        return user;
      } catch (e) {
        // Silently fall through to cache
      }
    } else {
      print('🌐 Offline - Loading user profile from cache');
    }
    
    // Load from cache if API failed or offline
    final cachedProfile = CacheService().getCachedUserProfile();
    if (cachedProfile != null) {
      return User.fromJson(cachedProfile);
    }
    
    // No cache available - return null instead of throwing
    // Dashboard will show "User" as default name and continue working
    print('ℹ️ No cached profile available - continuing without profile data');
    return null;
  }
  
  /// Update user profile
  /// Optional fields: full_name, bio, avatar_url, github_url, linkedin_url, website_url, preferred_theme
  Future<User> updateProfile(Map<String, dynamic> data) async {
    final response = await _executeRequest(() => http.put(
      Uri.parse('$baseUrl/auth/me'),
      headers: _headers,
      body: jsonEncode(data),
    ));
    final responseData = _handleResponse(response);
    return User.fromJson(responseData);
  }
  
  // ==================== SOLUTIONS ====================
  
  /// Create a new solution
  /// Uses SolutionCreate model with automatic validation and lowercase conversion
  Future<Solution> createSolution(SolutionCreate data) async {
    print('\n📡 API: Creating solution...');
    print('   URL: $baseUrl/solutions');
    
    // Validate before sending
    final validationError = data.validate();
    if (validationError != null) {
      print('❌ API: Validation failed: $validationError');
      throw Exception('Validation Error: $validationError');
    }
    
    final jsonData = data.toJson();
    print('   Payload: ${jsonEncode(jsonData)}');
    
    try {
      final response = await _executeRequest(() => http.post(
        Uri.parse('$baseUrl/solutions'),
        headers: _headers,
        body: jsonEncode(jsonData),
      ));
      
      print('   Response status: ${response.statusCode}');
      print('   Response body: ${response.body}');
      
      final responseData = _handleResponse(response);
      final solution = Solution.fromJson(responseData);
      print('✅ API: Solution created successfully');
      return solution;
    } catch (e) {
      print('❌ API: Request failed: $e');
      rethrow;
    }
  }
  
  /// Get all solutions for current user
  /// ⚠️ Backend returns paginated response: { solutions: [...], total, page, ... }
  /// Query params: skip, limit, is_public, is_archived
  /// Uses cache if offline, syncs when online
  Future<List<Solution>> getSolutions({
    int skip = 0,
    int limit = 100,
    bool? isPublic,
    bool? isArchived,
  }) async {
    final isOnline = await ConnectivityService().checkConnectivity();
    
    // Try to fetch from API if online
    if (isOnline) {
      try {
        final queryParams = <String, String>{
          'skip': skip.toString(),
          'limit': limit.toString(),
        };
        if (isPublic != null) queryParams['is_public'] = isPublic.toString();
        if (isArchived != null) queryParams['is_archived'] = isArchived.toString();
        
        final uri = Uri.parse('$baseUrl/solutions').replace(queryParameters: queryParams);
        final response = await _executeRequest(() => http.get(uri, headers: _headers));
        final data = _handleResponse(response);
        
        // ⚠️ Extract solutions array from pagination response
        final solutionsList = data['solutions'] as List? ?? data as List;
        final solutions = solutionsList.map((json) => Solution.fromJson(json)).toList();
        
        // Cache the solutions
        await CacheService().cacheSolutions(solutionsList);
        print('✅ Solutions fetched and cached');
        
        return solutions;
      } catch (e) {
        // Silently fall through to cache
      }
    } else {
      print('🌐 Offline - Loading from cache');
    }
    
    // Load from cache if API failed or offline
    final cachedSolutions = CacheService().getCachedSolutions();
    if (cachedSolutions != null && cachedSolutions.isNotEmpty) {
      return cachedSolutions.map((json) => Solution.fromJson(json)).toList();
    }
    
    // No cache available - return empty list instead of crashing
    // Dashboard will show "no solutions yet" and allow user to create first solution
    return [];
  }
  
  /// Get a specific solution by ID
  Future<Solution> getSolution(String id) async {
    final response = await _executeRequest(() => http.get(
      Uri.parse('$baseUrl/solutions/$id'),
      headers: _headers,
    ));
    final data = _handleResponse(response);
    return Solution.fromJson(data);
  }
  
  /// Update a solution
  /// Uses SolutionUpdate model with automatic lowercase conversion
  Future<Solution> updateSolution(String id, SolutionUpdate data) async {
    final response = await _executeRequest(() => http.put(
      Uri.parse('$baseUrl/solutions/$id'),
      headers: _headers,
      body: jsonEncode(data.toJson()),
    ));
    final responseData = _handleResponse(response);
    return Solution.fromJson(responseData);
  }
  
  /// Delete a solution (soft delete)
  Future<void> deleteSolution(String id) async {
    final response = await _executeRequest(() => http.delete(
      Uri.parse('$baseUrl/solutions/$id'),
      headers: _headers,
    ));
    _handleResponse(response);
  }
  
  /// Archive a solution
  Future<Solution> archiveSolution(String id) async {
    final response = await _executeRequest(() => http.post(
      Uri.parse('$baseUrl/solutions/$id/archive'),
      headers: _headers,
    ));
    final data = _handleResponse(response);
    return Solution.fromJson(data);
  }
  
  /// Restore an archived solution
  Future<Solution> restoreSolution(String id) async {
    final response = await _executeRequest(() => http.post(
      Uri.parse('$baseUrl/solutions/$id/restore'),
      headers: _headers,
    ));
    final data = _handleResponse(response);
    return Solution.fromJson(data);
  }
  
  // ==================== SEARCH ====================
  
  /// Search solutions with semantic search
  /// ⚠️ Backend expects POST /api/search with body: { query, limit, min_similarity }
  /// Uses SearchQuery model with automatic validation and lowercase conversion
  Future<List<SearchResult>> searchSolutions(SearchQuery searchQuery) async {
    // Validate before sending
    final validationError = searchQuery.validate();
    if (validationError != null) {
      throw Exception('Validation Error: $validationError');
    }
    
    final response = await _executeRequest(() => http.post(
      Uri.parse('$baseUrl/search'),
      headers: _headers,
      body: jsonEncode(searchQuery.toJson()),
    ));
    final data = _handleResponse(response);
    
    // ⚠️ Backend returns paginated response: { results: [...], total, ... }
    final resultsList = data['results'] as List? ?? data as List;
    return resultsList.map((json) => SearchResult.fromJson(json)).toList();
  }
  
  // ==================== DASHBOARD ====================
  
  /// Get dashboard statistics
  /// Uses cache if offline, syncs when online
  Future<DashboardStats> getDashboardStats() async {
    print('\n🎯 Calling getDashboardStats()');
    
    final isOnline = await ConnectivityService().checkConnectivity();
    
    // Try to fetch from API if online
    if (isOnline) {
      try {
        print('   URL: $baseUrl/dashboard/stats');
        final response = await _executeRequest(() => http.get(
          Uri.parse('$baseUrl/dashboard/stats'),
          headers: _headers,
        ));
        
        print('   Response status: ${response.statusCode}');
        
        if (response.statusCode != 200) {
          print('   ❌ Non-200 status code');
        }
        
        final data = _handleResponse(response);
        final stats = DashboardStats.fromJson(data);
        
        // Cache the stats
        await CacheService().cacheDashboardStats(data);
        print('   ✅ Stats fetched and cached');
        
        return stats;
      } catch (e, stackTrace) {
        // Silently fall through to cache
      }
    } else {
      print('   🌐 Offline - Loading from cache');
    }
    
    // Load from cache if API failed or offline
    final cachedStats = CacheService().getCachedDashboardStats();
    if (cachedStats != null) {
      final stats = DashboardStats.fromJson(cachedStats);
      print('   ✅ Loaded from cache');
      return stats;
    }
    
    // No cache available - return empty stats instead of crashing
    // Dashboard will show 0 counts and allow user to create first solution
    print('   ℹ️ No cached stats available - returning empty stats');
    return DashboardStats(
      totalSolutions: 0,
      totalLanguages: 0,
      uniqueTags: 0,
      mostRecentSolution: null,
    );
  }
  
  /// Get recent solutions for dashboard
  Future<List<Solution>> getRecentSolutions({int limit = 5}) async {
    final uri = Uri.parse('$baseUrl/dashboard/recent').replace(
      queryParameters: {'limit': limit.toString()},
    );
    final response = await _executeRequest(() => http.get(uri, headers: _headers));
    final data = _handleResponse(response) as List;
    return data.map((json) => Solution.fromJson(json)).toList();
  }
  
  /// Get weekly activity data
  Future<List<WeeklyActivity>> getWeeklyActivity() async {
    final response = await _executeRequest(() => http.get(
      Uri.parse('$baseUrl/dashboard/weekly-activity'),
      headers: _headers,
    ));
    final data = _handleResponse(response) as List;
    return data.map((json) => WeeklyActivity.fromJson(json)).toList();
  }
}
