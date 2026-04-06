/// Dashboard statistics model
/// Used for GET /api/dashboard/stats response
class DashboardStats {
  final int totalSolutions;
  final int totalLanguages;
  final int uniqueTags;
  final String? mostRecentSolution;

  DashboardStats({
    required this.totalSolutions,
    required this.totalLanguages,
    required this.uniqueTags,
    this.mostRecentSolution,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalSolutions: json['total_solutions'] ?? 0,
      totalLanguages: json['total_languages'] ?? 0,
      uniqueTags: json['unique_tags'] ?? 0,
      mostRecentSolution: json['most_recent_solution'],
    );
  }

  Map<String, dynamic> toJson() => {
        'total_solutions': totalSolutions,
        'total_languages': totalLanguages,
        'unique_tags': uniqueTags,
        'most_recent_solution': mostRecentSolution,
      };
}

/// Weekly activity data point
class WeeklyActivity {
  final String date;
  final int count;

  WeeklyActivity({
    required this.date,
    required this.count,
  });

  factory WeeklyActivity.fromJson(Map<String, dynamic> json) {
    return WeeklyActivity(
      date: json['date'] as String,
      count: json['count'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
        'date': date,
        'count': count,
      };
}

/// Popular tag data
class PopularTag {
  final String tag;
  final int count;

  PopularTag({
    required this.tag,
    required this.count,
  });

  factory PopularTag.fromJson(Map<String, dynamic> json) {
    return PopularTag(
      tag: json['tag'] as String,
      count: json['count'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
        'tag': tag,
        'count': count,
      };
}
