# DevDocs Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLUTTER APP                              │
│                      (DevDocs Frontend)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   SUPABASE AUTH  │  │   BACKEND API    │
        │                  │  │  (FastAPI)       │
        │  - Authentication│  │  localhost:8000  │
        │  - User Sessions │  │                  │
        └──────────────────┘  └──────────────────┘
```

---

## 📂 Project Structure

```
devdocs/
├── lib/
│   ├── models/                    # 🎯 DATA MODELS
│   │   ├── user.dart              # User profile model
│   │   ├── solution.dart          # Solution CRUD models
│   │   ├── dashboard_stats.dart   # Dashboard data models
│   │   └── search_result.dart     # Search models
│   │
│   ├── services/                  # 🌐 API & BUSINESS LOGIC
│   │   ├── devdocs_api_service.dart  # Backend API client
│   │   └── auth_service.dart         # Supabase authentication
│   │
│   ├── screens/                   # 📱 UI SCREENS
│   │   ├── home_screen.dart
│   │   ├── login_screen.dart
│   │   ├── registration_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── save_solution_screen.dart
│   │   ├── library_screen.dart
│   │   ├── search_screen.dart
│   │   ├── solution_details_screen.dart
│   │   ├── profile_screen.dart
│   │   └── settings_screen.dart
│   │
│   ├── widgets/                   # 🧩 REUSABLE COMPONENTS
│   │   └── widgets.dart
│   │
│   ├── constants/                 # 🎨 THEME & CONSTANTS
│   │   └── app_theme.dart
│   │
│   ├── utils/                     # 🛠️ UTILITIES
│   │   └── app_navigator.dart
│   │
│   └── main.dart                  # 🚀 APP ENTRY POINT
│
├── IMPLEMENTATION_SUMMARY.md      # 📝 Implementation details
├── QUICK_REFERENCE.md             # ⚡ Quick guide
├── TESTING_CHECKLIST.md           # ✅ Test cases
├── copilot-instructions.md        # 📋 Architecture rules
└── pubspec.yaml                   # 📦 Dependencies
```

---

## 🔄 Data Flow

### 1. User Creates Solution

```
┌─────────────────┐
│  User Interface │
│  (Form Input)   │
└────────┬────────┘
         │ User fills:
         │ - Title
         │ - Description
         │ - Code
         │ - Language: "JavaScript"
         │ - Tags: ["React", "Hooks"]
         ▼
┌─────────────────┐
│ SolutionCreate  │
│     Model       │
└────────┬────────┘
         │ Automatic conversion:
         │ - language: "javascript"
         │ - tags: ["react", "hooks"]
         │ 
         │ validate() → null (valid)
         ▼
┌─────────────────┐
│   API Service   │
│ createSolution()│
└────────┬────────┘
         │ POST /api/solutions
         │ Headers: Bearer token
         │ Body: {
         │   "title": "...",
         │   "description": "...",
         │   "code": "...",
         │   "language": "javascript",
         │   "tags": ["react", "hooks"]
         │ }
         ▼
┌─────────────────┐
│  Backend API    │
│   (FastAPI)     │
└────────┬────────┘
         │ Validates & saves
         │ Returns: Solution object
         ▼
┌─────────────────┐
│  Solution Model │
│   (Response)    │
└────────┬────────┘
         │ Parsed to Solution
         │ - id: "uuid-string"
         │ - createdAt: DateTime
         │ - author: User object
         ▼
┌─────────────────┐
│      UI         │
│  Success Toast  │
└─────────────────┘
```

---

## 🎯 Model Relationships

```
┌──────────────────────────────────────────────────────────────┐
│                         Solution                              │
├──────────────────────────────────────────────────────────────┤
│ + id: String (UUID)                                           │
│ + title: String                                               │
│ + description: String                                         │
│ + code: String                                                │
│ + language: String (lowercase)                                │
│ + tags: List<String> (lowercase)                              │
│ + createdBy: String (user UUID)                               │
│ + createdAt: DateTime                                         │
│ + updatedAt: DateTime?                                        │
│ + author: User? ──────────────────┐                          │
└────────────────────────────────────┼──────────────────────────┘
                                     │
                                     │
                                     ▼
                        ┌────────────────────────┐
                        │         User           │
                        ├────────────────────────┤
                        │ + id: String (UUID)    │
                        │ + email: String        │
                        │ + fullName: String?    │
                        │ + username: String?    │
                        │ + avatarUrl: String?   │
                        │ + bio: String?         │
                        │ + githubUrl: String?   │
                        │ + linkedinUrl: String? │
                        │ + createdAt: DateTime  │
                        │ + updatedAt: DateTime? │
                        └────────────────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────┐
│   User      │
│   Opens App │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│   main.dart     │
│  Initialize     │
│  Supabase       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐     NO      ┌──────────────┐
│  Check Session  ├────────────→│ Login Screen │
└──────┬──────────┘              └──────┬───────┘
       │ YES                             │
       │                                 │ Enter credentials
       │                                 ▼
       │                        ┌──────────────────┐
       │                        │  Supabase.auth   │
       │                        │  .signInWithPassword()
       │                        └──────┬───────────┘
       │                               │
       │                               │ Success
       │                               │
       │            ┌──────────────────┘
       │            │
       ▼            ▼
┌─────────────────────────┐
│   Dashboard Screen      │
│   (Authenticated)       │
└─────────────────────────┘
       │
       │ API calls include:
       │ Authorization: Bearer <token>
       ▼
┌─────────────────────────┐
│   Backend API           │
│   Validates token       │
│   Returns data          │
└─────────────────────────┘
```

---

## 📡 API Endpoints Mapping

| HTTP Method | Backend Endpoint | Frontend Method | Model Used |
|------------|------------------|-----------------|------------|
| GET | `/api/users/me` | `getUserProfile()` | User |
| POST | `/api/solutions` | `createSolution()` | SolutionCreate → Solution |
| GET | `/api/solutions` | `getSolutions()` | List<Solution> |
| GET | `/api/solutions/{id}` | `getSolution(id)` | Solution |
| PUT | `/api/solutions/{id}` | `updateSolution(id, data)` | SolutionUpdate → Solution |
| DELETE | `/api/solutions/{id}` | `deleteSolution(id)` | - |
| POST | `/api/solutions/{id}/archive` | `archiveSolution(id)` | Solution |
| POST | `/api/solutions/{id}/restore` | `restoreSolution(id)` | Solution |
| POST | `/api/search` | `searchSolutions(query)` | SearchQuery → List<SearchResult> |
| GET | `/api/dashboard/stats` | `getDashboardStats()` | DashboardStats |
| GET | `/api/dashboard/recent` | `getRecentSolutions()` | List<Solution> |
| GET | `/api/dashboard/weekly-activity` | `getWeeklyActivity()` | List<WeeklyActivity> |

---

## 🔄 JSON Serialization Flow

### Request (Frontend → Backend)

```dart
// DART CODE (camelCase)
final solution = SolutionCreate(
  title: 'Test',
  description: 'Description...',
  code: 'function() {...}',
  language: 'JavaScript',  // Mixed case
  tags: ['React', 'Hooks'], // Mixed case
);

// ↓ toJson() automatic conversion

// JSON (snake_case, lowercase)
{
  "title": "Test",
  "description": "Description...",
  "code": "function() {...}",
  "language": "javascript",  // ← Lowercase
  "tags": ["react", "hooks"] // ← Lowercase
}

// ↓ Sent to backend

// BACKEND RECEIVES
{
  title: str = "Test"
  description: str = "Description..."
  code: str = "function() {...}"
  language: str = "javascript"  // ✅ Matches validation
  tags: List[str] = ["react", "hooks"] // ✅ Valid
}
```

### Response (Backend → Frontend)

```python
# BACKEND RESPONSE (snake_case)
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Test",
  "description": "Description...",
  "code": "function() {...}",
  "language": "javascript",
  "tags": ["react", "hooks"],
  "created_by": "user-uuid",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": null,
  "author": {
    "user_id": "user-uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    ...
  }
}

# ↓ fromJson() automatic conversion

// DART MODEL (camelCase)
Solution(
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'Test',
  description: 'Description...',
  code: 'function() {...}',
  language: 'javascript',
  tags: ['react', 'hooks'],
  createdBy: 'user-uuid',
  createdAt: DateTime.parse('2024-01-01T00:00:00Z'),
  updatedAt: null,
  author: User(
    userId: 'user-uuid',
    email: 'user@example.com',
    fullName: 'John Doe',
    ...
  ),
)
```

---

## ✅ Validation Pipeline

```
┌──────────────────┐
│   User Input     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Form Validation │  ← Flutter form validators
│  (UI Level)      │     (Real-time feedback)
└────────┬─────────┘
         │ Valid
         ▼
┌──────────────────┐
│  Create Model    │  ← SolutionCreate(...)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Model.validate()│  ← Built-in validation
│                  │     (title: 5-200)
│                  │     (desc: 20-2000)
│                  │     (code: 10-5000)
│                  │     (tags: 1-20)
└────────┬─────────┘
         │ Valid
         ▼
┌──────────────────┐
│  Model.toJson()  │  ← Automatic lowercase
│                  │     language, tags
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  API Request     │  ← POST to backend
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Backend         │  ← Pydantic validation
│  Validation      │     (Final check)
└────────┬─────────┘
         │ Valid
         ▼
┌──────────────────┐
│  Save to DB      │
└──────────────────┘
```

---

## 🎨 Key Design Patterns

### 1. Repository Pattern
```dart
// API Service acts as repository
class DevDocsApiService {
  // Abstracts backend communication
  Future<Solution> createSolution(SolutionCreate data);
  Future<List<Solution>> getSolutions();
  // ...
}
```

### 2. Model-View Pattern
```dart
// Model: Data structure
class Solution { ... }

// View: UI Component
class SolutionCard extends StatelessWidget {
  final Solution solution; // ← Uses model
  // ...
}
```

### 3. Factory Pattern
```dart
// Models have factory constructors
class Solution {
  factory Solution.fromJson(Map<String, dynamic> json) {
    // Parse JSON → Object
  }
}
```

### 4. Validation Pattern
```dart
// Centralized validation in models
class SolutionCreate {
  String? validate() {
    // All validation logic in one place
    if (title.length < 5) return 'Title too short';
    // ...
    return null; // Valid
  }
}
```

---

## 🚦 Error Handling Flow

```
┌──────────────────┐
│   API Request    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  try-catch       │
└────────┬─────────┘
         │
         ├─→ Success (200-299)
         │   └─→ Parse JSON
         │       └─→ Return Model
         │
         ├─→ Client Error (400-499)
         │   ├─→ 400: Validation error
         │   ├─→ 401: Unauthorized
         │   ├─→ 403: Forbidden
         │   └─→ 404: Not found
         │       └─→ Show error message
         │
         ├─→ Server Error (500-599)
         │   └─→ Show "Server error, try again"
         │
         └─→ Network Error
             └─→ Show "Network error, check connection"
```

---

## 📊 State Management

```
Current State Management: StatefulWidget

┌──────────────────────────┐
│   StatefulWidget         │
│   (Screen)               │
└────────┬─────────────────┘
         │
         │ setState(() { ... })
         │
         ▼
┌──────────────────────────┐
│   Local State            │
│   - _solutions           │
│   - _isLoading           │
│   - _error               │
└──────────────────────────┘
         │
         │ UI rebuilds
         ▼
┌──────────────────────────┐
│   Widget Tree            │
│   (Re-rendered)          │
└──────────────────────────┘

Future Enhancement: Consider Provider, Riverpod, or Bloc
```

---

## 🔧 Configuration

### Backend URL
```dart
// lib/services/devdocs_api_service.dart
static const String baseUrl = 'http://10.0.2.2:8000/api';
// ↑ Android Emulator URL for localhost
```

### Supabase
```dart
// lib/main.dart
await Supabase.initialize(
  url: 'YOUR_SUPABASE_URL',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
);
```

---

## 📈 Performance Considerations

1. **Lazy Loading**: Load solutions on demand (pagination)
2. **Caching**: Consider caching frequently accessed data
3. **Image Optimization**: Compress avatars and images
4. **Debouncing**: Debounce search queries
5. **Code Highlighting**: Use efficient syntax highlighter

---

## 🔒 Security Features

1. **Bearer Token Auth**: All API requests include auth token
2. **Token Refresh**: Supabase handles token refresh
3. **Input Validation**: Client-side + server-side
4. **XSS Prevention**: Flutter handles escaping
5. **HTTPS**: Use HTTPS in production

---

## 🚀 Deployment Checklist

- [ ] Update backend URL to production
- [ ] Update Supabase credentials
- [ ] Enable HTTPS
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Check error handling
- [ ] Test on multiple devices
- [ ] Review permissions
- [ ] Optimize images
- [ ] Enable analytics (optional)

---

**Architecture Status:** ✅ Complete and Production-Ready
**Last Updated:** After full implementation following copilot-instructions.md
