import 'package:flutter/material.dart';
import 'dart:async';
import 'package:fl_chart/fl_chart.dart';
import 'save_solution_screen.dart';
import 'solution_details_screen.dart';
import '../widgets/widgets.dart';
import '../constants/app_theme.dart';
import '../utils/app_navigator.dart';
import '../utils/ui_feedback.dart';
import '../services/devdocs_api_service.dart';
import '../services/auth_service.dart';
import '../services/connectivity_service.dart';
import '../models/dashboard_stats.dart';
import '../models/user.dart';
import '../models/solution.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with WidgetsBindingObserver, AutomaticKeepAliveClientMixin {
  final _apiService = DevDocsApiService();
  final _authService = AuthService();

  DashboardStats? _stats;
  User? _currentUser;
  List<Solution> _allSolutions = [];
  List<Solution> _recentSolutions = [];
  bool _isLoading = true;
  bool _isRefreshing = false; // For background refresh
  String? _error;
  bool _hasLoadedData = false; // Prevent unnecessary reloads

  @override
  bool get wantKeepAlive => true; // Keep state alive when switching tabs

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    // Only load data if not already loaded
    if (!_hasLoadedData) {
      _loadDashboardData();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  Future<void> _loadDashboardData() async {
    if (!mounted) return;

    // If we have data, do background refresh instead of showing loading spinner
    final hasExistingData = _hasLoadedData && _stats != null;

    setState(() {
      if (hasExistingData) {
        _isRefreshing = true; // Background refresh
      } else {
        _isLoading = true; // First load
      }
      _error = null;
    });

    try {
      DashboardStats? stats;
      List<Solution> solutions = [];
      String? loadWarning;

      // Load critical dashboard data in parallel, but tolerate single-endpoint failures.
      await Future.wait([
        _apiService.getDashboardStats().then((value) {
          stats = value;
        }).catchError((e) {
          loadWarning = e.toString();
        }),
        _loadAllSolutionsForAccount().then((value) {
          solutions = value;
        }).catchError((e) {
          loadWarning ??= e.toString();
        }),
      ]);

      // If both endpoints failed, keep the existing error behavior.
      if (stats == null && solutions.isEmpty) {
        throw Exception(loadWarning ?? 'Failed to load dashboard data.');
      }

      setState(() {
        _stats = stats;
        _allSolutions = solutions;
        _recentSolutions = solutions.take(5).toList();
        _error = stats == null ? (loadWarning ?? 'Stats are temporarily unavailable.') : null;
      });

      // Load profile in background; do not block dashboard rendering.
      unawaited(_loadUserProfileInBackground());

      // Mark as successfully loaded
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isRefreshing = false;
          _hasLoadedData = true;
        });
      }
    } catch (e) {
      print('Dashboard load failed: $e');

      if (mounted) {
        setState(() {
          _error = e.toString();
          _isLoading = false;
          _isRefreshing = false;
        });
      }
    }
  }

  Future<void> _loadUserProfileInBackground() async {
    try {
      final user = await _apiService.getUserProfile();
      if (!mounted) return;
      setState(() {
        _currentUser = user;
      });
    } catch (_) {
      // Non-critical for dashboard rendering.
    }
  }

  Future<List<Solution>> _loadAllSolutionsForAccount() async {
    const int pageSize = 100;
    int skip = 0;
    final List<Solution> all = [];

    while (true) {
      final List<Solution> batch = await _apiService.getSolutions(
        skip: skip,
        limit: pageSize,
      );

      if (batch.isEmpty) {
        break;
      }

      all.addAll(batch);

      if (batch.length < pageSize) {
        break;
      }

      skip += pageSize;
    }

    return all;
  }

  @override
  Widget build(BuildContext context) {
    super.build(context); // Must call super for AutomaticKeepAliveClientMixin
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        final shouldExit = await UiFeedback.showExitConfirmation(context);
        if (shouldExit && context.mounted) {
          Navigator.of(context).pop();
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.backgroundDark,
        body: _isLoading && !_hasLoadedData
            ? const DashboardSkeletonLoader()
            : _error != null && !_hasLoadedData
            ? _buildErrorView()
            : _buildDashboardContent(),
        floatingActionButton: _isLoading && !_hasLoadedData || _error != null
            ? null
            : Padding(
                padding: const EdgeInsets.only(bottom: 60),
                child: FloatingActionButton.extended(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const SaveSolutionScreen(),
                      ),
                    );
                  },
                  backgroundColor: const Color(0xFF25d1f4),
                  elevation: 4,
                  icon: const Icon(
                    Icons.add,
                    color: Color(0xFF000000),
                    size: 24,
                  ),
                  label: const Text(
                    'Save Solution',
                    style: TextStyle(
                      color: Color(0xFF000000),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 64),
            const SizedBox(height: 16),
            Text(
              'Failed to load dashboard',
              style: AppTextStyles.h3,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              _error!,
              style: const TextStyle(color: AppColors.textSecondary),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadDashboardData,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDashboardContent() {
    return SafeArea(
      child: RefreshIndicator(
        onRefresh: _loadDashboardData,
        color: AppColors.primary,
        child: Column(
          children: [
            // Offline indicator banner
            StreamBuilder<bool>(
              stream: ConnectivityService().connectivityStream,
              initialData: true,
              builder: (context, snapshot) {
                final isOnline = snapshot.data ?? true;
                if (!isOnline) {
                  return Container(
                    color: Colors.orange.withValues(alpha: 0.8),
                    padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                    child: const Row(
                      children: [
                        Icon(Icons.cloud_off, color: Colors.white, size: 20),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Offline - Showing cached data',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }
                return const SizedBox.shrink();
              },
            ),
            
            // Refresh indicator bar (subtle)
            if (_isRefreshing)
              Container(
                height: 2,
                child: const LinearProgressIndicator(
                  backgroundColor: Colors.transparent,
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                ),
              ),
            // Main scrollable content
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Header
                    Container(
                      padding: const EdgeInsets.all(16).copyWith(
                        top: 8,
                        bottom: 8,
                      ),
                    decoration: BoxDecoration(
                      color: AppColors.backgroundDark.withValues(alpha: 0.9),
                    ),
                    child: Row(
                      children: [
                        // Profile Picture - Dynamic
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: AppColors.primary.withValues(alpha: 0.2),
                              width: 2,
                            ),
                            image: _currentUser?.avatarUrl != null
                                ? DecorationImage(
                                    image: NetworkImage(
                                      _currentUser!.avatarUrl!,
                                    ),
                                    fit: BoxFit.cover,
                                  )
                                : null,
                            color: _currentUser?.avatarUrl == null
                                ? AppColors.primary.withValues(alpha: 0.2)
                                : null,
                          ),
                          child: _currentUser?.avatarUrl == null
                              ? Center(
                                  child: Text(
                                    () {
                                      // Get display name from Supabase metadata or profile
                                      final displayName = _authService
                                          .getUserDisplayName();
                                      if (displayName.isNotEmpty &&
                                          displayName != 'User') {
                                        return displayName[0].toUpperCase();
                                      }
                                      if (_currentUser?.fullName?.isNotEmpty ==
                                          true) {
                                        return _currentUser!.fullName![0]
                                            .toUpperCase();
                                      }
                                      if (_currentUser?.email.isNotEmpty ==
                                          true) {
                                        return _currentUser!.email[0]
                                            .toUpperCase();
                                      }
                                      return 'U';
                                    }(),
                                    style: const TextStyle(
                                      color: AppColors.primary,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                )
                              : null,
                        ),

                        const SizedBox(width: 12),

                        // Welcome Text - Dynamic
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'DASHBOARD',
                                style: TextStyle(
                                  color: AppColors.textSecondary,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w500,
                                  letterSpacing: 1.5,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'Welcome, ${_authService.getUserDisplayName()}',
                                style: const TextStyle(
                                  color: AppColors.textPrimary,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: -0.27,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Stats Grid
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: [
                        SizedBox(
                          height: 165,
                          child: Row(
                            children: [
                              Expanded(child: _buildSolutionsCard()),
                              const SizedBox(width: 12),
                              Expanded(child: _buildLanguagesCard()),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Language Distribution Chart
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: _buildLanguageDistributionCard(),
                  ),

                  const SizedBox(height: 24),

                  // Recent Solutions Section
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Recent Solutions',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                AppNavigator.navigateToIndex(
                                  context,
                                  0,
                                ); // Navigate to Library
                              },
                              child: const Text(
                                'View All',
                                style: TextStyle(
                                  color: Color(0xFF25d1f4),
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        _recentSolutions.isNotEmpty
                            ? Column(
                                children: _recentSolutions
                                    .take(3)
                                    .map(
                                      (solution) => Padding(
                                        padding: const EdgeInsets.only(
                                          bottom: 12,
                                        ),
                                        child: _buildRecentSolutionCard(
                                          solution,
                                        ),
                                      ),
                                    )
                                    .toList(),
                              )
                            : _buildEmptyRecentSolutions(),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),

          // Bottom Navigation - Fixed at bottom
          AppBottomNavigationBar(
            currentIndex: 2, // Dashboard is at index 2
            onTap: (index) {
              if (index != 2) {
                AppNavigator.navigateToIndex(context, index);
              }
            },
          ),
        ],
      ),
    ),
    ); // SafeArea closing
  }

  Widget _buildSolutionsCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: const Color(0xFF25d1f4).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.code_outlined,
                  color: Color(0xFF25d1f4),
                  size: 20,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: const Color(0xFF10b981).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.trending_up, size: 14, color: Color(0xFF10b981)),
                    SizedBox(width: 2),
                    Text(
                      '12%',
                      style: TextStyle(
                        color: Color(0xFF10b981),
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const Spacer(),
          const Text(
            'SOLUTIONS',
            style: TextStyle(
              color: Color(0xFF9cb5ba),
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${_stats?.totalSolutions ?? 0}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguagesCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.language,
              color: Color(0xFF3b82f6),
              size: 20,
            ),
          ),
          const Spacer(),
          const Text(
            'LANGUAGES',
            style: TextStyle(
              color: Color(0xFF9cb5ba),
              fontSize: 11,
              fontWeight: FontWeight.w500,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${_stats?.totalLanguages ?? 0}',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              _buildLanguageBadge('JS', const Color(0xFF1e293b)),
              Transform.translate(
                offset: const Offset(-8, 0),
                child: _buildLanguageBadge('PY', const Color(0xFF334155)),
              ),
              Transform.translate(
                offset: const Offset(-16, 0),
                child: _buildLanguageBadge('RS', const Color(0xFF475569)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageBadge(String text, Color backgroundColor) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: backgroundColor,
        shape: BoxShape.circle,
        border: Border.all(color: const Color(0xFF000000), width: 1.5),
      ),
      child: Center(
        child: Text(
          text,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 9,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget _buildRecentSolutionCard(Solution solution) {
    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => SolutionDetailsScreen(solution: solution),
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF000000),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: const Color(0xFF334155).withValues(alpha: 0.5),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    solution.language.toUpperCase(),
                    style: const TextStyle(
                      color: Color(0xFF3b82f6),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  _formatDate(solution.createdAt),
                  style: const TextStyle(
                    color: Color(0xFF64748b),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              solution.title,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            if (solution.description.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                solution.description,
                style: const TextStyle(color: Color(0xFF94a3b8), fontSize: 14),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildLanguageDistributionCard() {
    final Map<String, int> counts = _languageDistribution;
    final int total = _allSolutions.length;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Language Distribution',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '$total total solutions',
            style: const TextStyle(color: Color(0xFF94a3b8), fontSize: 13),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 220,
            child: counts.isEmpty
                ? const Center(
                    child: Text(
                      'No data yet for chart',
                      style: TextStyle(color: Color(0xFF64748b), fontSize: 14),
                    ),
                  )
                : PieChart(
                    PieChartData(
                      sectionsSpace: 2,
                      centerSpaceRadius: 42,
                      sections: _buildPieSections(counts),
                    ),
                  ),
          ),
          if (counts.isNotEmpty) ...[
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: counts.entries.toList().asMap().entries.map((entry) {
                final int index = entry.key;
                final MapEntry<String, int> item = entry.value;
                final int value = item.value;
                final double percentage = total == 0
                    ? 0
                    : (value / total) * 100;

                return _buildLegendItem(
                  color: _chartColors[index % _chartColors.length],
                  label: item.key.toUpperCase(),
                  value: '${percentage.toStringAsFixed(0)}%',
                );
              }).toList(),
            ),
          ],
        ],
      ),
    );
  }

  List<PieChartSectionData> _buildPieSections(Map<String, int> counts) {
    final int total = _allSolutions.length;
    final List<MapEntry<String, int>> entries = counts.entries.toList();

    return entries.asMap().entries.map((entry) {
      final int index = entry.key;
      final int value = entry.value.value;
      final double percentage = total == 0 ? 0 : (value / total) * 100;

      return PieChartSectionData(
        color: _chartColors[index % _chartColors.length],
        value: value.toDouble(),
        title: '${percentage.toStringAsFixed(0)}%',
        radius: 66,
        titleStyle: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.w700,
        ),
      );
    }).toList();
  }

  Widget _buildLegendItem({
    required Color color,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF0f172a),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFF1e293b)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(
              color: Color(0xFFcbd5e1),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(width: 6),
          Text(
            value,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  Map<String, int> get _languageDistribution {
    final Map<String, int> counts = <String, int>{};

    for (final Solution solution in _allSolutions) {
      final String language = solution.language.trim().toLowerCase();
      if (language.isEmpty) {
        continue;
      }
      counts[language] = (counts[language] ?? 0) + 1;
    }

    final List<MapEntry<String, int>> sorted = counts.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    return Map<String, int>.fromEntries(sorted);
  }

  static const List<Color> _chartColors = [
    Color(0xFF25d1f4),
    Color(0xFF3b82f6),
    Color(0xFF10b981),
    Color(0xFFf97316),
    Color(0xFFef4444),
    Color(0xFFa855f7),
  ];

  Widget _buildEmptyRecentSolutions() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Center(
        child: Column(
          children: [
            Icon(
              Icons.code_off,
              size: 48,
              color: Colors.white.withValues(alpha: 0.3),
            ),
            const SizedBox(height: 12),
            const Text(
              'No solutions yet',
              style: TextStyle(
                color: Color(0xFF64748b),
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'Save your first solution to see it here',
              style: TextStyle(color: Color(0xFF475569), fontSize: 14),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);

    if (diff.inDays > 0) {
      return '${diff.inDays}d ago';
    } else if (diff.inHours > 0) {
      return '${diff.inHours}h ago';
    } else if (diff.inMinutes > 0) {
      return '${diff.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}
