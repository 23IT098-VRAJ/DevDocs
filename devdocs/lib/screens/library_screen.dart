import 'package:flutter/material.dart';
import '../widgets/widgets.dart';
import '../constants/app_theme.dart';
import '../utils/app_navigator.dart';
import '../utils/ui_feedback.dart';
import '../services/devdocs_api_service.dart';
import '../models/solution.dart';
import 'solution_details_screen.dart';
import 'save_solution_screen.dart';

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> with AutomaticKeepAliveClientMixin {
  static const int _initialLoadLimit = 30;

  final TextEditingController _searchController = TextEditingController();
  final _apiService = DevDocsApiService();
  
  List<Solution> _solutions = [];
  List<Solution> _filteredSolutions = [];
  bool _isLoading = true;
  bool _isRefreshing = false; // Background refresh
  String? _error;
  bool _hasLoadedData = false;

  @override
  bool get wantKeepAlive => true; // Keep state alive when switching tabs

  @override
  void initState() {
    super.initState();
    if (!_hasLoadedData) {
      _loadSolutions();
    }
    _searchController.addListener(_filterSolutions);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadSolutions() async {
    if (!mounted) return;
    
    // If we have data, do background refresh
    final hasExistingData = _hasLoadedData && _solutions.isNotEmpty;
    
    setState(() {
      if (hasExistingData) {
        _isRefreshing = true;
      } else {
        _isLoading = true;
      }
      _error = null;
    });

    try {
      final solutions = await _apiService.getSolutions(limit: _initialLoadLimit);
      if (mounted) {
        setState(() {
          _solutions = solutions;
          _filteredSolutions = solutions;
          _isLoading = false;
          _isRefreshing = false;
          _hasLoadedData = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceAll('Exception: ', '');
          _isLoading = false;
          _isRefreshing = false;
        });
      }
    }
  }

  void _filterSolutions() {
    final query = _searchController.text.toLowerCase();
    setState(() {
      if (query.isEmpty) {
        _filteredSolutions = _solutions;
      } else {
        _filteredSolutions = _solutions.where((solution) {
          return solution.title.toLowerCase().contains(query) ||
                 solution.description.toLowerCase().contains(query) ||
                 solution.language.toLowerCase().contains(query) ||
                 solution.tags.any((tag) => tag.toLowerCase().contains(query));
        }).toList();
      }
    });
  }

  // ── Edit / Delete helpers ─────────────────────────────────────────────────

  Future<void> _showSolutionOptions(Solution solution) async {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0f1923),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12, bottom: 8),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFF334155),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            ListTile(
              leading: const Icon(Icons.edit_outlined, color: Color(0xFF25d1f4)),
              title: const Text(
                'Edit Solution',
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
              ),
              onTap: () async {
                Navigator.pop(context);
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => SaveSolutionScreen(solutionToEdit: solution),
                  ),
                );
                if (result != null && mounted) _loadSolutions();
              },
            ),
            ListTile(
              leading: const Icon(Icons.delete_outline, color: Color(0xFFef4444)),
              title: const Text(
                'Delete Solution',
                style: TextStyle(color: Color(0xFFef4444), fontWeight: FontWeight.w500),
              ),
              onTap: () {
                Navigator.pop(context);
                _confirmAndDelete(solution);
              },
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmAndDelete(Solution solution) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF0f1923),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Delete Solution',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        content: Text(
          'Are you sure you want to delete "${solution.title}"?',
          style: const TextStyle(color: Color(0xFF94a3b8)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel', style: TextStyle(color: Color(0xFF94a3b8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFef4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    try {
      await _apiService.deleteSolution(solution.id);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Solution deleted'),
            backgroundColor: Color(0xFF334155),
          ),
        );
        _loadSolutions();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Delete failed: ${e.toString().replaceAll('Exception: ', '')}'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

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
      body: Stack(
        children: [
          // Main content
          Column(
            children: [
              // Top Navigation Bar
              Container(
                decoration: BoxDecoration(
                  color: const Color(0xFF000000).withValues(alpha: 0.8),
                  border: const Border(
                    bottom: BorderSide(
                      color: Color(0xFF334155),
                      width: 0.5,
                    ),
                  ),
                ),
                child: SafeArea(
                  bottom: false,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: const Text(
                      'Solution Library',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                ),
              ),

              // Scrollable content
              Expanded(
                child: RefreshIndicator(
                  onRefresh: _loadSolutions,
                  color: AppColors.primary,
                  child: Stack(
                    children: [
                      SingleChildScrollView(
                        padding: const EdgeInsets.only(bottom: 100),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                      // Search Section
                      Padding(
                        padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                        child: Container(
                          height: 56,
                          decoration: BoxDecoration(
                            color: const Color(0xFF000000),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: const Color(0xFF334155),
                              width: 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              const Padding(
                                padding: EdgeInsets.only(left: 16, right: 12),
                                child: Icon(
                                  Icons.search,
                                  color: Color(0xFF64748b),
                                  size: 24,
                                ),
                              ),
                              Expanded(
                                child: TextField(
                                  controller: _searchController,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                  ),
                                  decoration: const InputDecoration(
                                    hintText: 'Search snippets, docs, or folders...',
                                    hintStyle: TextStyle(
                                      color: Color(0xFF64748b),
                                      fontSize: 16,
                                    ),
                                    border: InputBorder.none,
                                    contentPadding: EdgeInsets.symmetric(vertical: 16),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Solutions Content
                      _buildContent(),
                    ],
                  ),
                ),
                
                // Subtle progress indicator during background refresh
                if (_isRefreshing)
                  const Positioned(
                    top: 0,
                    left: 0,
                    right: 0,
                    child: LinearProgressIndicator(
                      backgroundColor: Colors.transparent,
                      color: AppColors.primary,
                      minHeight: 2,
                    ),
                  ),
              ],
            ),
          ),
        ),
            ],
          ),
          // Bottom Navigation - Positioned at bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: AppBottomNavigationBar(
              currentIndex: 0, // Library is at index 0
              onTap: (index) {
                if (index != 0) {
                  AppNavigator.navigateToIndex(context, index);
                }
              },
            ),
          ),
        ],
      ),
      ),
    );
  }

  Widget _buildContent() {
    // Only show skeleton on absolute first load
    if (_isLoading && !_hasLoadedData) {
      return const LibrarySkeletonLoader();
    }

    if (_error != null) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.error_outline,
                size: 64,
                color: Color(0xFFef4444),
              ),
              const SizedBox(height: 16),
              Text(
                'Failed to load solutions',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _error!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFF64748b),
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: _loadSolutions,
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

    if (_filteredSolutions.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(24.0),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                _searchController.text.isEmpty ? Icons.inbox : Icons.search_off,
                size: 64,
                color: const Color(0xFF64748b),
              ),
              const SizedBox(height: 16),
              Text(
                _searchController.text.isEmpty
                    ? 'No solutions yet'
                    : 'No solutions found',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _searchController.text.isEmpty
                    ? 'Create your first solution to get started'
                    : 'Try a different search term',
                style: const TextStyle(
                  color: Color(0xFF64748b),
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Text(
              '${_filteredSolutions.length} solution${_filteredSolutions.length == 1 ? '' : 's'}',
              style: const TextStyle(
                color: Color(0xFF64748b),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: EdgeInsets.zero,
            itemCount: _filteredSolutions.length,
            itemBuilder: (context, index) {
              return _buildSolutionCard(_filteredSolutions[index]);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSolutionCard(Solution solution) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            final result = await Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => SolutionDetailsScreen(solution: solution),
              ),
            );
            if (result != null && mounted) _loadSolutions();
          },
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF3b82f6).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        solution.language.toUpperCase(),
                        style: const TextStyle(
                          color: Color(0xFF3b82f6),
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const Spacer(),
                    GestureDetector(
                      onTap: () => _showSolutionOptions(solution),
                      child: const Icon(
                        Icons.more_vert,
                        color: Color(0xFF64748b),
                        size: 20,
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
                const SizedBox(height: 8),
                Text(
                  solution.description,
                  style: const TextStyle(
                    color: Color(0xFF94a3b8),
                    fontSize: 14,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (solution.tags.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: solution.tags.take(4).map((tag) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFF334155).withValues(alpha: 0.5),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          '#$tag',
                          style: const TextStyle(
                            color: Color(0xFF94a3b8),
                            fontSize: 11,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
