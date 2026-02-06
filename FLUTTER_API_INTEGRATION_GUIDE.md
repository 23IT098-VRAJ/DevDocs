# Flutter App - Backend API Integration Guide
## 📋 Step-by-Step Integration Process

**⚠️ IMPORTANT:** Follow these steps in order. Do not proceed to the next step until the current step is complete.

**Backend URL:** `http://localhost:8000` (development) or your production URL  
**Authentication:** Supabase JWT tokens (Bearer token)

---

# STEP 1: VERIFY FLUTTER FRONTEND INPUT FIELDS ✅

**🎯 Goal:** Ensure your Flutter frontend forms have EXACTLY the same fields and validation rules as the backend expects. This prevents integration issues later.

## 1.1 Solution Creation Form Requirements

Your Flutter solution creation form **MUST** have these fields with exact validation:

### Required Form Fields:

| Field | Type | Validation | Backend Requirement |
|-------|------|------------|---------------------|
| **Title** | String | 5-200 characters | Required, 5-200 chars |
| **Description** | String | 20-2000 characters | Required, 20-2000 chars |
| **Code** | String | 10-5000 characters | Required, 10-5000 chars |
| **Language** | String | Must be lowercase | Required, lowercase |
| **Tags** | List<String> | 1-20 items | Required, 1-20 items |

### Flutter Validation Functions (Copy these):

```dart
// Title validation
String? validateTitle(String? value) {
  if (value == null || value.isEmpty) {
    return 'Title is required';
  }
  if (value.length < 5) {
    return 'Title must be at least 5 characters';
  }
  if (value.length > 200) {
    return 'Title must not exceed 200 characters';
  }
  return null;
}

// Description validation
String? validateDescription(String? value) {
  if (value == null || value.isEmpty) {
    return 'Description is required';
  }
  if (value.length < 20) {
    return 'Description must be at least 20 characters';
  }
  if (value.length > 2000) {
    return 'Description must not exceed 2000 characters';
  }
  return null;
}

// Code validation
String? validateCode(String? value) {
  if (value == null || value.isEmpty) {
    return 'Code is required';
  }
  if (value.length < 10) {
    return 'Code must be at least 10 characters';
  }
  if (value.length > 5000) {
    return 'Code must not exceed 5000 characters';
  }
  return null;
}

// Tags validation
String? validateTags(List<String> tags) {
  if (tags.isEmpty) {
    return 'At least one tag is required';
  }
  if (tags.length > 20) {
    return 'Maximum 20 tags allowed';
  }
  return null;
}

// Language validation
String? validateLanguage(String? value) {
  if (value == null || value.isEmpty) {
    return 'Language is required';
  }
  return null;
}

// Process data before sending to backend
Map<String, dynamic> prepareDataForBackend({
  required String title,
  required String description,
  required String code,
  required String language,
  required List<String> tags,
}) {
  return {
    'title': title.trim(),
    'description': description.trim(),
    'code': code,
    'language': language.trim().toLowerCase(), // MUST be lowercase
    'tags': tags
        .map((tag) => tag.trim().toLowerCase()) // MUST be lowercase
        .where((tag) => tag.isNotEmpty)
        .toList(),
  };
}
```

### ✅ Step 1.1 Checklist:
- [ ] Flutter form has Title field (TextFormField with validator)
- [ ] Flutter form has Description field (TextFormField/TextArea with validator)
- [ ] Flutter form has Code field (TextFormField/Code editor with validator)
- [ ] Flutter form has Language field (Dropdown/TextField with validator)
- [ ] Flutter form has Tags field (Chip input/TextField with validator)
- [ ] All validators match the functions above
- [ ] Form processes data with `prepareDataForBackend()` before sending

---

## 1.2 User Profile Form Requirements

Your Flutter user profile form **MUST** have these fields:

### Required Profile Fields:

| Field | Type | Validation | Backend Requirement |
|-------|------|------------|---------------------|
| **Email** | String | Read-only | Cannot be changed |
| **Full Name** | String | Optional, max 255 chars | Optional |
| **Bio** | String | Optional, max 500 chars | Optional |
| **GitHub Username** | String | Optional, max 255 chars | Optional |
| **Twitter Username** | String | Optional, max 255 chars | Optional |
| **Website URL** | String | Optional, valid URL | Optional |
| **Avatar URL** | String | Optional, valid URL | Optional |
| **Theme** | String | "dark" or "light" | Optional |

### Flutter Validation Functions (Copy these):

```dart
// Full name validation
String? validateFullName(String? value) {
  if (value != null && value.length > 255) {
    return 'Name must not exceed 255 characters';
  }
  return null;
}

// Bio validation
String? validateBio(String? value) {
  if (value != null && value.length > 500) {
    return 'Bio must not exceed 500 characters';
  }
  return null;
}

// Username validation (GitHub/Twitter)
String? validateUsername(String? value) {
  if (value != null && value.length > 255) {
    return 'Username must not exceed 255 characters';
  }
  return null;
}

// URL validation
String? validateUrl(String? value) {
  if (value == null || value.isEmpty) return null;
  
  final urlPattern = RegExp(
    r'^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
  );
  
  if (!urlPattern.hasMatch(value)) {
    return 'Please enter a valid URL (must start with http:// or https://)';
  }
  return null;
}

// Theme validation
String? validateTheme(String? value) {
  if (value != null && value != 'dark' && value != 'light') {
    return 'Theme must be either "dark" or "light"';
  }
  return null;
}
```

### ✅ Step 1.2 Checklist:
- [ ] Profile form has Email field (read-only/disabled)
- [ ] Profile form has Full Name field (optional, with validator)
- [ ] Profile form has Bio field (optional, TextArea with validator)
- [ ] Profile form has GitHub Username field (optional, with validator)
- [ ] Profile form has Twitter Username field (optional, with validator)
- [ ] Profile form has Website URL field (optional, with URL validator)
- [ ] Profile form has Avatar URL field (optional, with URL validator)
- [ ] Profile form has Theme selector ("dark"/"light")
- [ ] All validators match the functions above

---

## 1.3 Search Form Requirements

Your Flutter search form needs:

| Field | Type | Validation | Backend Requirement |
|-------|------|------------|---------------------|
| **Query** | String | 1-1000 characters | Required, max 1000 chars |
| **Limit** | int | 1-100 | Optional, default 10 |
| **Min Similarity** | double | 0.0-1.0 | Optional, default 0.3 |

### Flutter Validation Function:

```dart
// Search query validation
String? validateSearchQuery(String? value) {
  if (value == null || value.isEmpty) {
    return 'Search query is required';
  }
  if (value.length > 1000) {
    return 'Search query must not exceed 1000 characters';
  }
  return null;
}
```

### ✅ Step 1.3 Checklist:
- [ ] Search form has Query field (TextFormField with validator)
- [ ] Search has limit parameter (1-100, default 10)
- [ ] Search has min_similarity parameter (0.0-1.0, default 0.3)

---

## ✅ STEP 1 COMPLETION CHECKLIST

**Before proceeding to Step 2, verify ALL of these:**

- [ ] Solution form has all 5 required fields (title, description, code, language, tags)
- [ ] All solution form validators match backend requirements exactly
- [ ] Profile form has all fields with correct validation
- [ ] Search form has query field with validation
- [ ] Email field is read-only/disabled in profile
- [ ] Language is converted to lowercase before sending
- [ ] Tags are converted to lowercase before sending
- [ ] All character limits match backend exactly

**🚨 If any checkbox is unchecked, FIX IT BEFORE PROCEEDING TO STEP 2!**

---

# STEP 2: SETUP DATABASE & AUTHENTICATION 🔐

**🎯 Goal:** Configure Supabase authentication and database connection for your Flutter app.

## 2.1 Install Required Dependencies

Add these to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  supabase_flutter: ^2.0.0
```

Run:
```bash
flutter pub get
```

### ✅ Step 2.1 Checklist:
- [ ] Added `http` package to pubspec.yaml
- [ ] Added `supabase_flutter` package to pubspec.yaml
- [ ] Ran `flutter pub get` successfully

---

## 2.2 Initialize Supabase

### Get Your Supabase Credentials:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

### Initialize in `main.dart`:

```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',        // Replace with your Project URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Anon key
  );
  
  runApp(const MyApp());
}
```

### ✅ Step 2.2 Checklist:
- [ ] Copied Supabase URL from dashboard
- [ ] Copied Supabase Anon Key from dashboard
- [ ] Added Supabase initialization to main.dart
- [ ] App runs without errors

---

## 2.3 Implement Authentication

### Create Auth Service:

```dart
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final SupabaseClient _supabase = Supabase.instance.client;
  
  // Get current user
  User? get currentUser => _supabase.auth.currentUser;
  
  // Get current session
  Session? get currentSession => _supabase.auth.currentSession;
  
  // Get auth token
  String? get token => _supabase.auth.currentSession?.accessToken;
  
  // Check if user is logged in
  bool get isLoggedIn => currentUser != null;
  
  // Sign up with email and password
  Future<AuthResponse> signUp({
    required String email,
    required String password,
  }) async {
    return await _supabase.auth.signUp(
      email: email,
      password: password,
    );
  }
  
  // Sign in with email and password
  Future<AuthResponse> signIn({
    required String email,
    required String password,
  }) async {
    return await _supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }
  
  // Sign out
  Future<void> signOut() async {
    await _supabase.auth.signOut();
  }
  
  // Listen to auth state changes
  Stream<AuthState> get authStateChanges => _supabase.auth.onAuthStateChange;
}
```

### Create Sign Up Page:

```dart
// Example sign up form
class SignUpPage extends StatefulWidget {
  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;
  
  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    
    try {
      final response = await _authService.signUp(
        email: _emailController.text.trim(),
        password: _passwordController.text,
      );
      
      if (response.user != null) {
        // Success! Navigate to home
        Navigator.pushReplacementNamed(context, '/home');
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sign up failed: $e')),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Sign Up')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Email is required';
                }
                if (!value.contains('@')) {
                  return 'Please enter a valid email';
                }
                return null;
              },
            ),
            SizedBox(height: 16),
            TextFormField(
              controller: _passwordController,
              decoration: InputDecoration(labelText: 'Password'),
              obscureText: true,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'Password is required';
                }
                if (value.length < 6) {
                  return 'Password must be at least 6 characters';
                }
                return null;
              },
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _signUp,
              child: _isLoading
                  ? CircularProgressIndicator()
                  : Text('Sign Up'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Create Sign In Page (Similar structure):

```dart
// Copy the same pattern as sign up, but use _authService.signIn()
```

### ✅ Step 2.3 Checklist:
- [ ] Created AuthService class
- [ ] Implemented Sign Up page with email/password
- [ ] Implemented Sign In page with email/password
- [ ] Implemented Sign Out functionality
- [ ] Tested sign up successfully creates account
- [ ] Tested sign in successfully logs in
- [ ] Tested sign out successfully logs out
- [ ] Auth token is accessible via `AuthService.token`

---

## ✅ STEP 2 COMPLETION CHECKLIST

**Before proceeding to Step 3, verify ALL of these:**

- [ ] Supabase is initialized in main.dart
- [ ] Auth service is created and working
- [ ] Users can sign up successfully
- [ ] Users can sign in successfully
- [ ] Users can sign out successfully
- [ ] Auth token is retrievable after login
- [ ] Auth state changes are handled properly

**🚨 Test authentication thoroughly before proceeding to Step 3!**

---

# STEP 3: IMPLEMENT BACKEND API INTEGRATION 🔗

**🎯 Goal:** Connect your Flutter app to the FastAPI backend and fetch data.

## 3.1 Backend API Endpoints Reference

## 3.1 Backend API Endpoints Reference

### Complete List of Available Endpoints:

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/status` | GET | Check if auth is enabled | No |
| `/api/auth/me` | GET | Get user profile | Yes |
| `/api/auth/me` | PUT | Update user profile | Yes |
| `/api/solutions` | POST | Create solution | Yes |
| `/api/solutions` | GET | List solutions (paginated) | Yes |
| `/api/solutions/{id}` | GET | Get single solution | Yes |
| `/api/solutions/{id}` | PUT | Update solution | Yes |
| `/api/solutions/{id}` | DELETE | Delete solution | Yes |
| `/api/solutions/{id}/archive` | POST | Archive solution | Yes |
| `/api/solutions/{id}/restore` | POST | Restore solution | Yes |
| `/api/search` | POST | Semantic search | Yes |
| `/api/dashboard/stats` | GET | Get user stats | Yes |
| `/api/dashboard/recent` | GET | Get recent solutions | Yes |
| `/api/dashboard/weekly-activity` | GET | Get weekly activity | Yes |

---

## 3.2 Create API Service Class

Create `lib/services/devdocs_api_service.dart`:

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:supabase_flutter/supabase_flutter.dart';

class DevDocsApiService {
  // ⚠️ CHANGE THIS to your backend URL
  static const String baseUrl = 'http://localhost:8000/api';
  
  final SupabaseClient _supabase = Supabase.instance.client;
  
  // Get auth headers with token
  Future<Map<String, String>> _getHeaders() async {
    final token = _supabase.auth.currentSession?.accessToken;
    if (token == null) {
      throw Exception('User not authenticated');
    }
    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }
  
  // ========================================================================
  // AUTHENTICATION
  // ========================================================================
  
  /// Get current user profile (auto-creates on first call)
  Future<Map<String, dynamic>> getUserProfile() async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get profile: ${response.body}');
    }
  }
  
  /// Update user profile (all fields optional)
  Future<Map<String, dynamic>> updateProfile({
    String? fullName,
    String? bio,
    String? githubUsername,
    String? twitterUsername,
    String? websiteUrl,
    String? avatarUrl,
    String? theme,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      if (fullName != null) 'full_name': fullName,
      if (bio != null) 'bio': bio,
      if (githubUsername != null) 'github_username': githubUsername,
      if (twitterUsername != null) 'twitter_username': twitterUsername,
      if (websiteUrl != null) 'website_url': websiteUrl,
      if (avatarUrl != null) 'avatar_url': avatarUrl,
      if (theme != null) 'theme': theme,
    });
    
    final response = await http.put(
      Uri.parse('$baseUrl/auth/me'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update profile: ${response.body}');
    }
  }
  
  // ========================================================================
  // SOLUTIONS CRUD
  // ========================================================================
  
  /// Create a new solution
  Future<Map<String, dynamic>> createSolution({
    required String title,
    required String description,
    required String code,
    required String language,
    required List<String> tags,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      'title': title,
      'description': description,
      'code': code,
      'language': language.toLowerCase(),
      'tags': tags.map((t) => t.toLowerCase()).toList(),
    });
    
    final response = await http.post(
      Uri.parse('$baseUrl/solutions'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create solution: ${response.body}');
    }
  }
  
  /// Get paginated list of solutions
  Future<Map<String, dynamic>> getSolutions({
    int page = 1,
    int pageSize = 20,
    String? language,
    String? tag,
    bool includeArchived = false,
  }) async {
    final headers = await _getHeaders();
    var url = '$baseUrl/solutions?page=$page&page_size=$pageSize';
    if (language != null) url += '&language=${language.toLowerCase()}';
    if (tag != null) url += '&tag=${tag.toLowerCase()}';
    if (includeArchived) url += '&include_archived=true';
    
    final response = await http.get(
      Uri.parse(url),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load solutions: ${response.body}');
    }
  }
  
  /// Get single solution by ID
  Future<Map<String, dynamic>> getSolution(String solutionId) async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/solutions/$solutionId'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load solution: ${response.body}');
    }
  }
  
  /// Update solution (all fields optional)
  Future<Map<String, dynamic>> updateSolution({
    required String solutionId,
    String? title,
    String? description,
    String? code,
    String? language,
    List<String>? tags,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      if (title != null) 'title': title,
      if (description != null) 'description': description,
      if (code != null) 'code': code,
      if (language != null) 'language': language.toLowerCase(),
      if (tags != null) 'tags': tags.map((t) => t.toLowerCase()).toList(),
    });
    
    final response = await http.put(
      Uri.parse('$baseUrl/solutions/$solutionId'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update solution: ${response.body}');
    }
  }
  
  /// Delete solution
  Future<void> deleteSolution(String solutionId) async {
    final headers = await _getHeaders();
    
    final response = await http.delete(
      Uri.parse('$baseUrl/solutions/$solutionId'),
      headers: headers,
    );
    
    if (response.statusCode != 204) {
      throw Exception('Failed to delete solution: ${response.body}');
    }
  }
  
  /// Archive solution (soft delete)
  Future<Map<String, dynamic>> archiveSolution(String solutionId) async {
    final headers = await _getHeaders();
    
    final response = await http.post(
      Uri.parse('$baseUrl/solutions/$solutionId/archive'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to archive solution: ${response.body}');
    }
  }
  
  /// Restore archived solution
  Future<Map<String, dynamic>> restoreSolution(String solutionId) async {
    final headers = await _getHeaders();
    
    final response = await http.post(
      Uri.parse('$baseUrl/solutions/$solutionId/restore'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to restore solution: ${response.body}');
    }
  }
  
  // ========================================================================
  // SEARCH
  // ========================================================================
  
  /// Semantic search for solutions
  Future<Map<String, dynamic>> searchSolutions({
    required String query,
    int limit = 10,
    double minSimilarity = 0.3,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      'query': query,
      'limit': limit,
      'min_similarity': minSimilarity,
    });
    
    final response = await http.post(
      Uri.parse('$baseUrl/search'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to search: ${response.body}');
    }
  }
  
  // ========================================================================
  // DASHBOARD
  // ========================================================================
  
  /// Get user statistics
  Future<Map<String, dynamic>> getDashboardStats() async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/dashboard/stats'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get stats: ${response.body}');
    }
  }
  
  /// Get recent solutions
  Future<List<dynamic>> getRecentSolutions({int limit = 5}) async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/dashboard/recent?limit=$limit'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get recent solutions: ${response.body}');
    }
  }
  
  /// Get weekly activity (last 7 days)
  Future<List<int>> getWeeklyActivity() async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/dashboard/weekly-activity'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return List<int>.from(data['weekly_activity']);
    } else {
      throw Exception('Failed to get weekly activity: ${response.body}');
    }
  }
}
```

### ✅ Step 3.2 Checklist:
- [ ] Created `devdocs_api_service.dart` file
- [ ] Updated `baseUrl` to your backend URL
- [ ] All CRUD methods are implemented
- [ ] Search method is implemented
- [ ] Dashboard methods are implemented
- [ ] Auth headers are included in all requests

---

## 3.3 Test API Integration

Create a test page to verify backend connection:

```dart
import 'package:flutter/material.dart';
import 'package:your_app/services/devdocs_api_service.dart';

class ApiTestPage extends StatefulWidget {
  @override
  _ApiTestPageState createState() => _ApiTestPageState();
}

class _ApiTestPageState extends State<ApiTestPage> {
  final _apiService = DevDocsApiService();
  String _result = 'Not tested yet';
  bool _isLoading = false;
  
  Future<void> _testGetProfile() async {
    setState(() => _isLoading = true);
    try {
      final profile = await _apiService.getUserProfile();
      setState(() => _result = 'Success! Profile: ${profile.toString()}');
    } catch (e) {
      setState(() => _result = 'Error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  Future<void> _testCreateSolution() async {
    setState(() => _isLoading = true);
    try {
      final solution = await _apiService.createSolution(
        title: 'Test from Flutter',
        description: 'This is a test solution created from Flutter app to verify API integration',
        code: 'print("Hello from Flutter");',
        language: 'python',
        tags: ['test', 'flutter', 'integration'],
      );
      setState(() => _result = 'Success! Created: ${solution['id']}');
    } catch (e) {
      setState(() => _result = 'Error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  Future<void> _testGetSolutions() async {
    setState(() => _isLoading = true);
    try {
      final response = await _apiService.getSolutions();
      setState(() => _result = 'Success! Found ${response['total']} solutions');
    } catch (e) {
      setState(() => _result = 'Error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  Future<void> _testSearch() async {
    setState(() => _isLoading = true);
    try {
      final results = await _apiService.searchSolutions(
        query: 'authentication',
        limit: 5,
      );
      setState(() => _result = 'Success! Found ${results['total_results']} matches');
    } catch (e) {
      setState(() => _result = 'Error: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('API Test')),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('Test Result:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(_result),
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetProfile,
              child: Text('Test Get Profile'),
            ),
            ElevatedButton(
              onPressed: _isLoading ? null : _testCreateSolution,
              child: Text('Test Create Solution'),
            ),
            ElevatedButton(
              onPressed: _isLoading ? null : _testGetSolutions,
              child: Text('Test Get Solutions'),
            ),
            ElevatedButton(
              onPressed: _isLoading ? null : _testSearch,
              child: Text('Test Search'),
            ),
            if (_isLoading)
              Center(child: CircularProgressIndicator()),
          ],
        ),
      ),
    );
  }
}
```

### Test Each Endpoint:

1. **Test Get Profile:**
   - Should return your user data
   - If first time, backend auto-creates profile
   
2. **Test Create Solution:**
   - Should successfully create and return solution ID
   - Check web app to verify it appears there too
   
3. **Test Get Solutions:**
   - Should return list of your solutions
   - Should match what you see in web app
   
4. **Test Search:**
   - Should return search results with similarity scores
   - Try searching for "authentication" or other keywords

### ✅ Step 3.3 Checklist:
- [ ] Created test page
- [ ] Backend is running (`uvicorn main:app --reload`)
- [ ] Get Profile test returns 200 OK
- [ ] Create Solution test returns 201 Created
- [ ] Get Solutions test returns 200 OK with list
- [ ] Search test returns 200 OK with results
- [ ] All tests pass without 401 Unauthorized errors
- [ ] All tests pass without 422 Validation errors

---

## 3.4 Integrate into Your App

Now that API is working, integrate into your actual app pages:

### Example: Create Solution Page Integration

```dart
class CreateSolutionPage extends StatefulWidget {
  @override
  _CreateSolutionPageState createState() => _CreateSolutionPageState();
}

class _CreateSolutionPageState extends State<CreateSolutionPage> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = DevDocsApiService();
  
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _codeController = TextEditingController();
  String _selectedLanguage = 'python';
  List<String> _tags = [];
  
  bool _isSubmitting = false;
  
  Future<void> _submitSolution() async {
    if (!_formKey.currentState!.validate()) return;
    if (_tags.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please add at least one tag')),
      );
      return;
    }
    
    setState(() => _isSubmitting = true);
    
    try {
      final solution = await _apiService.createSolution(
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        code: _codeController.text,
        language: _selectedLanguage,
        tags: _tags,
      );
      
      // Success!
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Solution created successfully!')),
      );
      Navigator.pop(context, solution); // Return to previous page
      
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    } finally {
      setState(() => _isSubmitting = false);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Create Solution')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            // Title field
            TextFormField(
              controller: _titleController,
              decoration: InputDecoration(labelText: 'Title'),
              validator: validateTitle, // From Step 1
            ),
            SizedBox(height: 16),
            
            // Description field
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(labelText: 'Description'),
              maxLines: 3,
              validator: validateDescription, // From Step 1
            ),
            SizedBox(height: 16),
            
            // Code field
            TextFormField(
              controller: _codeController,
              decoration: InputDecoration(labelText: 'Code'),
              maxLines: 10,
              validator: validateCode, // From Step 1
            ),
            SizedBox(height: 16),
            
            // Language dropdown
            DropdownButtonFormField<String>(
              value: _selectedLanguage,
              decoration: InputDecoration(labelText: 'Language'),
              items: ['python', 'javascript', 'java', 'typescript', 'dart']
                  .map((lang) => DropdownMenuItem(
                        value: lang,
                        child: Text(lang),
                      ))
                  .toList(),
              onChanged: (value) => setState(() => _selectedLanguage = value!),
            ),
            SizedBox(height: 16),
            
            // Tags input (implement your tag input widget)
            Text('Tags: ${_tags.join(", ")}'),
            // Add your tag input widget here
            
            SizedBox(height: 24),
            
            // Submit button
            ElevatedButton(
              onPressed: _isSubmitting ? null : _submitSolution,
              child: _isSubmitting
                  ? CircularProgressIndicator()
                  : Text('Create Solution'),
            ),
          ],
        ),
      ),
    );
  }
}
```

### ✅ Step 3.4 Checklist:
- [ ] Integrated API service into Create Solution page
- [ ] Integrated API service into View Solutions page
- [ ] Integrated API service into Edit Solution page
- [ ] Integrated API service into Search page
- [ ] Integrated API service into Profile page
- [ ] Integrated API service into Dashboard page
- [ ] All pages handle loading states
- [ ] All pages handle error states
- [ ] All pages show success messages

---

## ✅ STEP 3 COMPLETION CHECKLIST

**Verify ALL integration points:**

- [ ] API service class is created and working
- [ ] Backend URL is correct (localhost:8000 or production URL)
- [ ] All test endpoints return successful responses
- [ ] Create solution works from Flutter app
- [ ] Get solutions works and shows list
- [ ] Update solution works
- [ ] Delete solution works
- [ ] Search works and returns results
- [ ] Dashboard stats load correctly
- [ ] Profile loads and updates correctly
- [ ] No 401 Unauthorized errors
- [ ] No 422 Validation errors
- [ ] Solutions created in Flutter appear in web app
- [ ] Solutions created in web app appear in Flutter

---

# FINAL VERIFICATION ✅

## Complete Integration Checklist

**Step 1: Frontend Validation**
- [ ] All forms have correct fields
- [ ] All validators match backend requirements
- [ ] Language is lowercase
- [ ] Tags are lowercase
- [ ] Character limits match exactly

**Step 2: Authentication**
- [ ] Supabase is initialized
- [ ] Sign up works
- [ ] Sign in works
- [ ] Sign out works
- [ ] Auth token is retrievable

**Step 3: Backend Integration**
- [ ] API service is created
- [ ] All CRUD operations work
- [ ] Search works
- [ ] Dashboard stats work
- [ ] Profile works
- [ ] Error handling is implemented

**Cross-Platform Verification:**
- [ ] Solution created in Flutter appears in web app
- [ ] Solution created in web app appears in Flutter
- [ ] Search results match between platforms
- [ ] User profile syncs between platforms
- [ ] Dashboard stats match between platforms

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
**Symptoms:** All API calls return 401  
**Causes:**
- Supabase token is null or expired
- User is not logged in
- Token not included in headers

**Solutions:**
```dart
// Check if user is logged in
final user = Supabase.instance.client.auth.currentUser;
if (user == null) {
  // Redirect to login
  Navigator.pushReplacementNamed(context, '/login');
  return;
}

// Check if token exists
final token = Supabase.instance.client.auth.currentSession?.accessToken;
print('Token: ${token != null ? "exists" : "null"}');
```

---

### Issue: 422 Validation Error
**Symptoms:** API returns "Validation Error"  
**Causes:**
- Field lengths don't match requirements
- Language not lowercase
- Tags array empty or >20 items
- Missing required fields

**Solutions:**
```dart
// Always validate and prepare data before sending
final preparedData = prepareDataForBackend(
  title: title,
  description: description,
  code: code,
  language: language,
  tags: tags,
);

// Log what you're sending
print('Sending to backend: ${json.encode(preparedData)}');
```

---

### Issue: Connection Refused / Network Error
**Symptoms:** Cannot connect to backend  
**Causes:**
- Backend not running
- Wrong URL
- CORS issues (shouldn't happen, backend has CORS enabled)

**Solutions:**
```bash
# Make sure backend is running
cd devdocs-backend
uvicorn main:app --reload --port 8000

# Test backend directly
curl http://localhost:8000/api/auth/status

# For Android emulator, use 10.0.2.2 instead of localhost
static const String baseUrl = 'http://10.0.2.2:8000/api';

# For iOS simulator, localhost should work
static const String baseUrl = 'http://localhost:8000/api';

# For physical device, use computer's IP address
static const String baseUrl = 'http://192.168.1.XXX:8000/api';
```

---

### Issue: Empty Solutions List
**Symptoms:** Get solutions returns empty array  
**Causes:**
- User has no solutions yet
- Solutions belong to different user
- Filtering too strict

**Solutions:**
```dart
// Check total count
final response = await apiService.getSolutions();
print('Total solutions: ${response['total']}');

// Try without filters
final response = await apiService.getSolutions(
  page: 1,
  pageSize: 100, // Get more results
  language: null, // Remove language filter
  tag: null, // Remove tag filter
);

// Create a test solution
await apiService.createSolution(
  title: 'Test Solution',
  description: 'Testing if solutions appear',
  code: 'print("test")',
  language: 'python',
  tags: ['test'],
);
```

---

### Issue: Search Returns No Results
**Symptoms:** Search always returns empty  
**Causes:**
- No solutions in database
- Query too specific
- min_similarity too high

**Solutions:**
```dart
// Lower min_similarity
final results = await apiService.searchSolutions(
  query: 'test',
  limit: 10,
  minSimilarity: 0.1, // Lower threshold
);

// Try broader query
final results = await apiService.searchSolutions(
  query: 'python', // Search by language
  limit: 10,
);
```

---

## 📚 API Response Examples

#### GET `/api/auth/status`
Check if authentication is enabled (no auth required)
```dart
Response: {
  "auth_enabled": true,
  "message": "Authentication is enabled"
}
```

## 📚 API Response Examples

### Authentication Responses

#### GET `/api/auth/me`
Get current user profile (auto-creates on first login)
```dart
// No request body needed
Response: {
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "bio": "Developer bio",
  "github_username": "johndoe",
  "twitter_username": "johndoe",
  "website_url": "https://example.com",
  "avatar_url": "https://example.com/avatar.jpg",
  "theme": "dark",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### PUT `/api/auth/me`
Update user profile (all fields optional)
```dart
Request Body: {
  "full_name": "John Doe",           // Optional, max 255 chars
  "bio": "Full-stack developer",     // Optional, max 500 chars
  "github_username": "johndoe",      // Optional, max 255 chars
  "twitter_username": "johndoe",     // Optional, max 255 chars
  "website_url": "https://...",      // Optional, valid URL
  "avatar_url": "https://...",       // Optional, valid URL
  "theme": "dark"                    // Optional, "dark" or "light"
}

Response: Same as GET /api/auth/me
```

---

### 2. **Solutions (Code Snippets)**

#### POST `/api/solutions`
Create a new solution
```dart
Request Body: {
  "title": "String (5-200 chars)",        // Required
  "description": "String (20-2000)",      // Required
  "code": "String (10-5000 chars)",       // Required
  "language": "python",                   // Required, lowercase
  "tags": ["api", "rest"]                 // Required, 1-20 tags, lowercase
}

Response: {
  "id": "uuid",
  "title": "Solution title",
  "description": "Solution description",
  "code": "code snippet",
  "language": "python",
  "tags": ["api", "rest"],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "is_archived": false,
  "user_id": "uuid"
}
```

**⚠️ Flutter Validation Requirements:**
- `title`: 5-200 characters
- `description`: 20-2000 characters
- `code`: 10-5000 characters
- `language`: Must be lowercase (e.g., "python", "javascript", "java")
- `tags`: Array with 1-20 items, automatically converted to lowercase

#### GET `/api/solutions`
Get paginated list of solutions (shows only current user's solutions)
```dart
Query Parameters:
- page: int (default 1, min 1)
- page_size: int (default 20, min 1, max 100)
- language: string (optional filter, e.g., "python")
- tag: string (optional filter, e.g., "api")
- include_archived: bool (default false)

Response: {
  "solutions": [...],  // Array of solution objects
  "total": 50,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

#### GET `/api/solutions/{solution_id}`
Get single solution by ID
```dart
// No request body
Response: Same as POST /api/solutions response
```

#### PUT `/api/solutions/{solution_id}`
Update solution (all fields optional)
```dart
Request Body: {
  "title": "Updated title",           // Optional
  "description": "Updated desc",      // Optional
  "code": "Updated code",             // Optional
  "language": "javascript",           // Optional
  "tags": ["updated", "tags"]         // Optional
}

Response: Same as POST /api/solutions response
```

#### DELETE `/api/solutions/{solution_id}`
Delete solution
```dart
// No request body
Response: 204 No Content
```

#### POST `/api/solutions/{solution_id}/archive`
Archive solution (soft delete)
```dart
// No request body
Response: Same as solution object with is_archived: true
```

#### POST `/api/solutions/{solution_id}/restore`
Restore archived solution
```dart
// No request body
Response: Same as solution object with is_archived: false
```

---

### 3. **Semantic Search (AI-Powered)**

#### POST `/api/search`
Search solutions using natural language
```dart
Request Body: {
  "query": "How to implement JWT auth",  // Required, max 1000 chars
  "limit": 10,                           // Optional, 1-100, default 10
  "min_similarity": 0.3                  // Optional, 0.0-1.0, default 0.3
}

Response: {
  "results": [
    {
      "solution": {
        // Full solution object
      },
      "similarity": 0.85,          // Match percentage (0.0-1.0)
      "rank": 1
    }
  ],
  "query": "How to implement JWT auth",
  "total_results": 5,
  "search_time_ms": 150
}
```

**⚠️ Note:** Only searches within the current user's solutions

---

### 4. **Dashboard Stats**

#### GET `/api/dashboard/stats`
Get user's statistics
```dart
// No request body
Response: {
  "total_solutions": 25,
  "total_languages": 5,
  "languages_breakdown": {
    "python": 10,
    "javascript": 8,
    "java": 7
  }
}
```

#### GET `/api/dashboard/recent`
Get recent solutions
```dart
Query Parameters:
- limit: int (default 5, min 1, max 20)

Response: [
  {
    // Array of solution objects
  }
]
```

#### GET `/api/dashboard/weekly-activity`
Get solutions created per day (last 7 days)
```dart
// No request body
Response: {
  "weekly_activity": [0, 1, 2, 0, 3, 1, 0]  // 7 integers (oldest to newest)
}
```

---

## 🛠️ Flutter Implementation Example

### 1. Create API Service Class

```dart
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:supabase_flutter/supabase_flutter.dart';

class DevDocsApiService {
  static const String baseUrl = 'http://localhost:8000/api';
  final SupabaseClient supabase = Supabase.instance.client;
  
  // Get auth headers
  Future<Map<String, String>> _getHeaders() async {
    final token = supabase.auth.currentSession?.accessToken;
    return {
      'Authorization': 'Bearer $token',
      'Content-Type': 'application/json',
    };
  }
  
  // Create Solution
  Future<Map<String, dynamic>> createSolution({
    required String title,
    required String description,
    required String code,
    required String language,
    required List<String> tags,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      'title': title,
      'description': description,
      'code': code,
      'language': language.toLowerCase(),
      'tags': tags.map((t) => t.toLowerCase()).toList(),
    });
    
    final response = await http.post(
      Uri.parse('$baseUrl/solutions'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to create solution: ${response.body}');
    }
  }
  
  // Get Solutions
  Future<Map<String, dynamic>> getSolutions({
    int page = 1,
    int pageSize = 20,
    String? language,
    String? tag,
  }) async {
    final headers = await _getHeaders();
    var url = '$baseUrl/solutions?page=$page&page_size=$pageSize';
    if (language != null) url += '&language=$language';
    if (tag != null) url += '&tag=$tag';
    
    final response = await http.get(
      Uri.parse(url),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load solutions');
    }
  }
  
  // Search Solutions
  Future<Map<String, dynamic>> searchSolutions({
    required String query,
    int limit = 10,
    double minSimilarity = 0.3,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      'query': query,
      'limit': limit,
      'min_similarity': minSimilarity,
    });
    
    final response = await http.post(
      Uri.parse('$baseUrl/search'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to search: ${response.body}');
    }
  }
  
  // Get User Profile
  Future<Map<String, dynamic>> getUserProfile() async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/auth/me'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get profile');
    }
  }
  
  // Update User Profile
  Future<Map<String, dynamic>> updateProfile({
    String? fullName,
    String? bio,
    String? githubUsername,
    String? twitterUsername,
    String? websiteUrl,
    String? avatarUrl,
    String? theme,
  }) async {
    final headers = await _getHeaders();
    final body = json.encode({
      if (fullName != null) 'full_name': fullName,
      if (bio != null) 'bio': bio,
      if (githubUsername != null) 'github_username': githubUsername,
      if (twitterUsername != null) 'twitter_username': twitterUsername,
      if (websiteUrl != null) 'website_url': websiteUrl,
      if (avatarUrl != null) 'avatar_url': avatarUrl,
      if (theme != null) 'theme': theme,
    });
    
    final response = await http.put(
      Uri.parse('$baseUrl/auth/me'),
      headers: headers,
      body: body,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to update profile');
    }
  }
  
  // Get Dashboard Stats
  Future<Map<String, dynamic>> getDashboardStats() async {
    final headers = await _getHeaders();
    
    final response = await http.get(
      Uri.parse('$baseUrl/dashboard/stats'),
      headers: headers,
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get stats');
    }
  }
}
```

---

## ⚠️ Important Validation Rules for Flutter Forms

### Solution Creation Form:

```dart
// Title validation
String? validateTitle(String? value) {
  if (value == null || value.isEmpty) {
    return 'Title is required';
  }
  if (value.length < 5) {
    return 'Title must be at least 5 characters';
  }
  if (value.length > 200) {
    return 'Title must not exceed 200 characters';
  }
  return null;
}

// Description validation
String? validateDescription(String? value) {
  if (value == null || value.isEmpty) {
    return 'Description is required';
  }
  if (value.length < 20) {
    return 'Description must be at least 20 characters';
  }
  if (value.length > 2000) {
    return 'Description must not exceed 2000 characters';
  }
  return null;
}

// Code validation
String? validateCode(String? value) {
  if (value == null || value.isEmpty) {
    return 'Code is required';
  }
  if (value.length < 10) {
    return 'Code must be at least 10 characters';
  }
  if (value.length > 5000) {
    return 'Code must not exceed 5000 characters';
  }
  return null;
}

// Tags validation
String? validateTags(List<String> tags) {
  if (tags.isEmpty) {
    return 'At least one tag is required';
  }
  if (tags.length > 20) {
    return 'Maximum 20 tags allowed';
  }
  return null;
}

// Process before sending
void processDataBeforeSending() {
  // Convert language to lowercase
  language = language.toLowerCase();
  
  // Convert all tags to lowercase and trim
  tags = tags.map((tag) => tag.trim().toLowerCase()).toList();
  
  // Remove empty tags
  tags = tags.where((tag) => tag.isNotEmpty).toList();
}
```

### User Profile Form:

```dart
// Full name validation
String? validateFullName(String? value) {
  if (value != null && value.length > 255) {
    return 'Name must not exceed 255 characters';
  }
  return null;
}

// Bio validation
String? validateBio(String? value) {
  if (value != null && value.length > 500) {
    return 'Bio must not exceed 500 characters';
  }
  return null;
}

// URL validation
String? validateUrl(String? value) {
  if (value == null || value.isEmpty) return null;
  
  final urlPattern = RegExp(
    r'^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
  );
  
  if (!urlPattern.hasMatch(value)) {
    return 'Please enter a valid URL';
  }
  return null;
}

// Theme validation
String? validateTheme(String? value) {
  if (value != null && value != 'dark' && value != 'light') {
    return 'Theme must be either "dark" or "light"';
  }
  return null;
}
```

---

## 🔧 Environment Configuration

### pubspec.yaml
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  supabase_flutter: ^2.0.0
```

### Initialize Supabase
```dart
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: 'YOUR_SUPABASE_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
  );
  
  runApp(MyApp());
}
```

---

## 🚀 Testing the Integration

### 1. Test Auth Status
```dart
final response = await http.get(Uri.parse('$baseUrl/auth/status'));
print(response.body); // Should show auth is enabled
```

### 2. Test Creating Solution
```dart
final apiService = DevDocsApiService();

try {
  final solution = await apiService.createSolution(
    title: 'Test Flutter Integration',
    description: 'This is a test solution created from Flutter app',
    code: 'print("Hello from Flutter");',
    language: 'python',
    tags: ['test', 'flutter'],
  );
  print('Success: $solution');
} catch (e) {
  print('Error: $e');
}
```

### 3. Test Search
```dart
final results = await apiService.searchSolutions(
  query: 'authentication',
  limit: 5,
);
print('Found ${results['total_results']} results');
```

---

## 📝 Key Differences from Web Frontend

1. **All fields are validated on backend** - Flutter forms must match these requirements
2. **Language and tags are auto-converted to lowercase** on backend
3. **User is auto-created on first API call** (no need for explicit registration endpoint)
4. **Solutions are user-scoped** - each user only sees their own solutions
5. **Search only searches within user's solutions** (not global search)
6. **Authentication is required for all endpoints** except `/api/auth/status`

---

## 🐛 Common Issues & Solutions

### Issue: 401 Unauthorized
- **Solution**: Check if Supabase token is valid and not expired
- Verify Authorization header format: `Bearer ${token}`

### Issue: 422 Validation Error
- **Solution**: Check request body matches exact field names and validation rules
- Ensure language is lowercase
- Ensure tags array has at least 1 item

### Issue: 503 Service Unavailable
- **Solution**: Backend might be down or database connection failed
- Check if backend is running on correct port

### Issue: CORS errors (if backend on different domain)
- **Solution**: Backend already has CORS enabled for all origins
- If still issues, check backend logs

---

## 📚 Additional Notes

- All timestamps are in ISO 8601 format (UTC)
- All UUIDs are version 4
- Backend uses PostgreSQL with pgvector for semantic search
- Embedding model: sentence-transformers/all-mpnet-base-v2 (768 dimensions)
- Supabase handles authentication, backend handles business logic
- Backend port: 8000 (default)
- Database: PostgreSQL with Supabase

---

## 🔗 Backend Setup (if needed)

```bash
# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn main:app --reload --port 8000

# Backend will be available at http://localhost:8000
```

}
```

---

## 🚀 Backend Setup Instructions

### Prerequisites:
- Python 3.8 or higher
- PostgreSQL database (via Supabase)
- Git

### Setup Steps:

```bash
# 1. Navigate to backend directory
cd devdocs-backend

# 2. Create virtual environment (optional but recommended)
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create .env file with your Supabase credentials
# Copy from .env.example if available

# 6. Run backend
uvicorn main:app --reload --port 8000
```

### .env Configuration:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
DATABASE_URL=your_postgres_connection_string
```

### Verify Backend is Running:
- Open browser: http://localhost:8000/docs
- Should see Swagger API documentation
- Test `/api/auth/status` endpoint

---

## 📱 Platform-Specific Notes

### Android
```dart
// In devdocs_api_service.dart
// Use 10.0.2.2 instead of localhost for Android emulator
static const String baseUrl = 'http://10.0.2.2:8000/api';

// For physical Android device, use computer's IP
static const String baseUrl = 'http://192.168.1.XXX:8000/api';
```

### iOS
```dart
// localhost works fine for iOS simulator
static const String baseUrl = 'http://localhost:8000/api';

// For physical iOS device, use computer's IP
static const String baseUrl = 'http://192.168.1.XXX:8000/api';
```

### Web
```dart
// Use full URL for web builds
static const String baseUrl = 'http://localhost:8000/api';

// For production
static const String baseUrl = 'https://your-backend-domain.com/api';
```

---

## 🎯 Next Steps After Integration

1. **Add Loading States:** Show spinners while API calls are in progress
2. **Add Error Handling:** Display user-friendly error messages
3. **Add Offline Support:** Cache data locally with sqflite or hive
4. **Add Pull to Refresh:** Let users refresh data manually
5. **Add Pagination:** Load more solutions as user scrolls
6. **Add Image Upload:** If you want to add screenshots/images to solutions
7. **Add Real-time Updates:** Use Supabase realtime for live updates

---

## 📖 Additional Resources

- **Backend API Docs:** http://localhost:8000/docs
- **Supabase Docs:** https://supabase.com/docs
- **Flutter HTTP Package:** https://pub.dev/packages/http
- **Supabase Flutter:** https://pub.dev/packages/supabase_flutter

---

## ✅ Final Success Criteria

**Your integration is complete when:**

1. ✅ User can sign up and sign in
2. ✅ User can create solutions from Flutter
3. ✅ User can view their solutions list
4. ✅ User can search solutions with AI
5. ✅ User can edit and delete solutions
6. ✅ User can update their profile
7. ✅ Dashboard shows correct statistics
8. ✅ Solutions sync between Flutter and web app
9. ✅ All API calls handle errors gracefully
10. ✅ No validation errors from backend

**🎉 Congratulations! Your Flutter app is now fully integrated with the backend!**

---

## 📝 GitHub Copilot Instructions

If you're using this guide with GitHub Copilot, follow these prompts in order:

### Prompt 1: Verify Frontend
```
Review my Flutter app and verify:
1. Solution form has title, description, code, language, and tags fields
2. All validators match the validation functions in Step 1.1
3. Profile form has all required fields with correct validators
4. Language is converted to lowercase before sending
5. Tags are converted to lowercase before sending

If any field is missing or validator is incorrect, fix it now.
```

### Prompt 2: Setup Authentication
```
Implement Supabase authentication in my Flutter app:
1. Initialize Supabase in main.dart
2. Create AuthService class from Step 2.3
3. Create sign up page with email/password
4. Create sign in page with email/password
5. Test authentication flow

Ensure auth token is accessible after login.
```

### Prompt 3: Integrate Backend API
```
Integrate backend API into my Flutter app:
1. Create DevDocsApiService class from Step 3.2
2. Update baseUrl to http://10.0.2.2:8000/api (for Android emulator)
3. Create API test page from Step 3.3
4. Test all endpoints (profile, create solution, get solutions, search)
5. Integrate API into existing app pages

Ensure all API calls include auth headers and handle errors.
```

### Prompt 4: Final Verification
```
Verify complete integration:
1. Create a solution in Flutter app
2. Verify it appears in web app
3. Create a solution in web app  
4. Verify it appears in Flutter app
5. Test search functionality
6. Test profile update

Fix any issues found during verification.
```

---

**End of Guide** - Good luck with your integration! 🚀
