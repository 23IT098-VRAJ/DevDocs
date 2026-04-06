/// Generic paginated response model
/// Used for API endpoints that return paginated data
class PaginatedResponse<T> {
  final int page;
  final int pageSize;
  final int total;
  final int totalPages;
  final List<T> items;
  final bool hasMore;

  PaginatedResponse({
    required this.page,
    required this.pageSize,
    required this.total,
    required this.totalPages,
    required this.items,
  }) : hasMore = page < totalPages;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) itemFromJson,
  ) {
    final itemsList = (json['items'] ?? json['solutions'] ?? json['results'] ?? []) as List;
    
    return PaginatedResponse<T>(
      page: json['page'] as int? ?? 1,
      pageSize: json['page_size'] as int? ?? itemsList.length,
      total: json['total'] as int? ?? itemsList.length,
      totalPages: json['total_pages'] as int? ?? 1,
      items: itemsList.map((item) => itemFromJson(item as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson(Map<String, dynamic> Function(T) itemToJson) => {
        'page': page,
        'page_size': pageSize,
        'total': total,
        'total_pages': totalPages,
        'items': items.map((item) => itemToJson(item)).toList(),
      };

  /// Create an empty paginated response
  factory PaginatedResponse.empty() {
    return PaginatedResponse<T>(
      page: 1,
      pageSize: 0,
      total: 0,
      totalPages: 0,
      items: [],
    );
  }

  /// Merge with another page of results
  PaginatedResponse<T> merge(PaginatedResponse<T> other) {
    return PaginatedResponse<T>(
      page: other.page,
      pageSize: other.pageSize,
      total: other.total,
      totalPages: other.totalPages,
      items: [...items, ...other.items],
    );
  }
}
