import 'user.dart';

/// Solution model matching backend schema
/// Uses camelCase in Dart code, snake_case in JSON serialization
/// Backend uses "solutions" terminology, Frontend uses "library/browse solutions"
class Solution {
  final String id;
  final String userId;
  final String title;
  final String description;
  final String code;
  final String language; // MUST be lowercase when sending to backend
  final List<String> tags; // MUST be lowercase when sending to backend
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isDeleted;
  final User? user;

  Solution({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.code,
    required this.language,
    required this.tags,
    required this.createdAt,
    required this.updatedAt,
    this.isDeleted = false,
    this.user,
  });

  /// Convert to JSON with snake_case for backend
  /// ⚠️ Important: Ensures language and tags are lowercase
  Map<String, dynamic> toJson() => {
        'id': id,
        'user_id': userId, // snake_case for backend
        'title': title,
        'description': description,
        'code': code,
        'language': language.toLowerCase(), // ⚠️ Must be lowercase
        'tags': tags.map((tag) => tag.toLowerCase()).toList(), // ⚠️ Must be lowercase
        'created_at': createdAt.toIso8601String(),
        'updated_at': updatedAt.toIso8601String(),
        'is_deleted': isDeleted,
      };

  /// Parse from JSON with snake_case from backend
  factory Solution.fromJson(Map<String, dynamic> json) {
    return Solution(
      id: json['id'] as String? ?? '',
      userId: json['user_id'] as String? ?? '', // snake_case from backend
      title: json['title'] as String? ?? 'Untitled',
      description: json['description'] as String? ?? '',
      code: json['code'] as String? ?? '',
      language: json['language'] as String? ?? 'unknown',
      tags: json['tags'] != null ? List<String>.from(json['tags'] as List) : [],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at'] as String) : DateTime.now(),
      updatedAt: json['updated_at'] != null ? DateTime.parse(json['updated_at'] as String) : DateTime.now(),
      isDeleted: json['is_deleted'] as bool? ?? false,
      user: json['user'] != null ? User.fromJson(json['user'] as Map<String, dynamic>) : null,
    );
  }

  Solution copyWith({
    String? id,
    String? userId,
    String? title,
    String? description,
    String? code,
    String? language,
    List<String>? tags,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isDeleted,
    User? user,
  }) {
    return Solution(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      title: title ?? this.title,
      description: description ?? this.description,
      code: code ?? this.code,
      language: language ?? this.language,
      tags: tags ?? this.tags,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isDeleted: isDeleted ?? this.isDeleted,
      user: user ?? this.user,
    );
  }
}

/// Solution creation request model
/// Used when creating a new solution (POST /api/solutions)
class SolutionCreate {
  final String title;
  final String description;
  final String code;
  final String language;
  final List<String> tags;

  SolutionCreate({
    required this.title,
    required this.description,
    required this.code,
    required this.language,
    required this.tags,
  });

  /// Validates according to backend requirements
  String? validate() {
    // Title validation: 5-200 characters
    if (title.isEmpty) return 'Title is required';
    if (title.length < 5) return 'Title must be at least 5 characters';
    if (title.length > 200) return 'Title cannot exceed 200 characters';

    // Description validation: 20-2000 characters
    if (description.isEmpty) return 'Description is required';
    if (description.length < 20) return 'Description must be at least 20 characters';
    if (description.length > 2000) return 'Description cannot exceed 2000 characters';

    // Code validation: 10-5000 characters
    if (code.isEmpty) return 'Code is required';
    if (code.length < 10) return 'Code must be at least 10 characters';
    if (code.length > 5000) return 'Code cannot exceed 5000 characters';

    // Language validation: required
    if (language.isEmpty) return 'Language is required';

    // Tags validation: 1-20 items, each 1-50 chars
    if (tags.isEmpty) return 'At least one tag is required';
    if (tags.length > 20) return 'Maximum 20 tags allowed';
    for (var tag in tags) {
      if (tag.length > 50) return 'Each tag must be 50 characters or less';
    }

    return null; // Valid
  }

  Map<String, dynamic> toJson() => {
        'title': title.trim(),
        'description': description.trim(),
        'code': code, // Don't trim code - preserve formatting
        'language': language.toLowerCase(), // ⚠️ Must be lowercase
        'tags': tags.map((tag) => tag.toLowerCase()).toList(), // ⚠️ Must be lowercase
      };
}

/// Solution update request model
/// Used when updating a solution (PUT /api/solutions/{id})
class SolutionUpdate {
  final String? title;
  final String? description;
  final String? code;
  final String? language;
  final List<String>? tags;

  SolutionUpdate({
    this.title,
    this.description,
    this.code,
    this.language,
    this.tags,
  });

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {};
    if (title != null) data['title'] = title!.trim();
    if (description != null) data['description'] = description!.trim();
    if (code != null) data['code'] = code; // Don't trim code
    if (language != null) data['language'] = language!.toLowerCase(); // ⚠️ Must be lowercase
    if (tags != null) data['tags'] = tags!.map((tag) => tag.toLowerCase()).toList(); // ⚠️ Must be lowercase
    return data;
  }
}
