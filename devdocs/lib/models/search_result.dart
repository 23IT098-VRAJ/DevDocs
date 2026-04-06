import 'solution.dart';

/// Search result model
/// Used for POST /api/search response
class SearchResult {
  final Solution solution;
  final double similarity;

  SearchResult({
    required this.solution,
    required this.similarity,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) {
    return SearchResult(
      solution: Solution.fromJson(json['solution'] as Map<String, dynamic>),
      similarity: (json['similarity'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
        'solution': solution.toJson(),
        'similarity': similarity,
      };
}

/// Search query parameters
class SearchQuery {
  final String query;
  final int limit;
  final double minSimilarity;
  final String? language;
  final List<String>? tags;

  SearchQuery({
    required this.query,
    this.limit = 10,
    this.minSimilarity = 0.3,
    this.language,
    this.tags,
  });

  /// Validates search query
  String? validate() {
    if (query.isEmpty) return 'Search query is required';
    if (query.length > 1000) return 'Search query cannot exceed 1000 characters';
    if (limit < 1 || limit > 100) return 'Limit must be between 1 and 100';
    if (minSimilarity < 0.0 || minSimilarity > 1.0) return 'Min similarity must be between 0.0 and 1.0';
    return null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = {
      'query': query,
      'limit': limit,
      'min_similarity': minSimilarity,
    };
    if (language != null) data['language'] = language!.toLowerCase();
    if (tags != null && tags!.isNotEmpty) {
      data['tags'] = tags!.map((tag) => tag.toLowerCase()).toList();
    }
    return data;
  }
}
