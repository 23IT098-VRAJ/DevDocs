import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/devdocs_api_service.dart';
import '../models/user.dart';
import '../widgets/widgets.dart';
import '../constants/app_theme.dart';
import '../utils/app_navigator.dart';
import '../utils/ui_feedback.dart';
import '../services/notification_service.dart';
import 'home_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with AutomaticKeepAliveClientMixin {
  final _apiService = DevDocsApiService();
  final _authService = AuthService();
  
  User? _user;
  bool _isLoading = true;
  bool _isRefreshing = false; // Background refresh
  bool _isEditingUsername = false;
  final _usernameController = TextEditingController();
  final _usernameFocusNode = FocusNode();
  bool _isSavingUsername = false;
  bool _hasLoadedData = false;

  @override
  bool get wantKeepAlive => true; // Keep state alive when switching tabs

  @override
  void initState() {
    super.initState();
    if (!_hasLoadedData) {
      _loadUserProfile();
    }
  }
  
  @override
  void dispose() {
    _usernameController.dispose();
    _usernameFocusNode.dispose();
    super.dispose();
  }

  Future<void> _loadUserProfile() async {
    if (!mounted) return;
    
    // If we have data, do background refresh
    final hasExistingData = _hasLoadedData && _user != null;
    
    setState(() {
      if (hasExistingData) {
        _isRefreshing = true;
      } else {
        _isLoading = true;
      }
    });

    try {
      final user = await _apiService.getUserProfile();
      if (mounted) {
        setState(() {
          _user = user;
          _isLoading = false;
          _isRefreshing = false;
          _hasLoadedData = true;
        });
      }
    } catch (e) {
      print('⚠️ Profile load failed (non-critical): $e');
      // Don't block the UI - show profile with current auth user
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isRefreshing = false;
          _hasLoadedData = true;
        });
      }
    }
  }
  
  Future<void> _saveUsername() async {
    final newUsername = _usernameController.text.trim();
    if (newUsername.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Username cannot be empty'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }
    
    setState(() => _isSavingUsername = true);
    
    try {
      // First, update Supabase user metadata directly (this always works)
      await _authService.updateUserMetadata(fullName: newUsername);
      print('✅ Updated Supabase user metadata');
      
      // Then try to update backend database (if server is running)
      try {
        final updatedUser = await _apiService.updateProfile({'full_name': newUsername});
        setState(() => _user = updatedUser);
        print('✅ Updated backend database');
      } catch (backendError) {
        print('⚠️  Backend update failed (non-critical): $backendError');
        // Continue anyway - Supabase metadata is updated
      }
      
      setState(() {
        _isEditingUsername = false;
        _isSavingUsername = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Username updated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() => _isSavingUsername = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to update username: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
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
          ? const ProfileSkeletonLoader()
          : RefreshIndicator(
              onRefresh: _loadUserProfile,
              color: AppColors.primary,
              child: Stack(
                children: [
                  _buildProfileContent(),
                  
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
    );
  }

  Widget _buildProfileContent() {
    final email = _authService.currentUser?.email ?? 'user@example.com';
    // Get username from Supabase metadata first, fallback to email-based name
    final displayName = _authService.getUserDisplayName();
    
    final currentUser = _user ?? User(
      id: _authService.currentUser?.id ?? '',
      email: email,
      fullName: displayName,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );

    return Column(
      children: [
        // Header with gradient
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF000000),
                const Color(0xFF000000),
              ],
            ),
          ),
          child: SafeArea(
            bottom: false,
            child: Column(
              children: [
                // Top bar
                const Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    'Profile',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      letterSpacing: -0.5,
                    ),
                  ),
                ),
                
                // Profile Avatar and Info
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                  child: Column(
                    children: [
                      // Avatar
                      Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                            colors: [
                              const Color(0xFF25d1f4),
                              const Color(0xFF1e8e9f),
                            ],
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF25d1f4).withValues(alpha: 0.3),
                              blurRadius: 20,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            currentUser.fullName?.isNotEmpty == true
                                ? currentUser.fullName![0].toUpperCase()
                                : currentUser.email[0].toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Name with Edit functionality
                      _isEditingUsername
                          ? Container(
                              constraints: const BoxConstraints(maxWidth: 300),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Flexible(
                                    child: TextField(
                                      controller: _usernameController,
                                      focusNode: _usernameFocusNode,
                                      autofocus: true,
                                      textAlign: TextAlign.center,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 24,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      decoration: InputDecoration(
                                        isDense: true,
                                        contentPadding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 8,
                                        ),
                                        filled: true,
                                        fillColor: const Color(0xFF000000),
                                        border: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: const BorderSide(color: Color(0xFF25d1f4)),
                                        ),
                                        enabledBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: const BorderSide(color: Color(0xFF334155)),
                                        ),
                                        focusedBorder: OutlineInputBorder(
                                          borderRadius: BorderRadius.circular(8),
                                          borderSide: const BorderSide(color: Color(0xFF25d1f4), width: 2),
                                        ),
                                      ),
                                      onSubmitted: (_) => _saveUsername(),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  if (_isSavingUsername)
                                    const SizedBox(
                                      width: 24,
                                      height: 24,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF25d1f4)),
                                      ),
                                    )
                                  else ...[
                                    IconButton(
                                      icon: const Icon(Icons.check, color: Color(0xFF10b981)),
                                      onPressed: _saveUsername,
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                    ),
                                    const SizedBox(width: 4),
                                    IconButton(
                                      icon: const Icon(Icons.close, color: Color(0xFFef4444)),
                                      onPressed: () {
                                        setState(() => _isEditingUsername = false);
                                      },
                                      padding: EdgeInsets.zero,
                                      constraints: const BoxConstraints(),
                                    ),
                                  ],
                                ],
                              ),
                            )
                          : Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  currentUser.fullName ?? currentUser.email.split('@')[0],
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(width: 8),
                                InkWell(
                                  onTap: () {
                                    setState(() {
                                      _isEditingUsername = true;
                                      _usernameController.text = currentUser.fullName ?? currentUser.email.split('@')[0];
                                    });
                                    // Focus after build completes
                                    WidgetsBinding.instance.addPostFrameCallback((_) {
                                      _usernameFocusNode.requestFocus();
                                      _usernameController.selection = TextSelection(
                                        baseOffset: 0,
                                        extentOffset: _usernameController.text.length,
                                      );
                                    });
                                  },
                                  borderRadius: BorderRadius.circular(20),
                                  child: Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFF25d1f4).withValues(alpha: 0.1),
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: const Icon(
                                      Icons.edit,
                                      size: 16,
                                      color: Color(0xFF25d1f4),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                      
                      const SizedBox(height: 4),
                      
                      // Email
                      Text(
                        currentUser.email,
                        style: const TextStyle(
                          color: Color(0xFF94a3b8),
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Scrollable content
        Expanded(
          child: SingleChildScrollView(
            child: Column(
              children: [
                const SizedBox(height: 24),
                
                // Actions
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Column(
                    children: [
                      _buildActionTile(
                        icon: Icons.edit_outlined,
                        title: 'Edit Profile',
                        subtitle: 'Update your profile information',
                        onTap: () {
                          // TODO: Navigate to edit profile
                        },
                      ),
                      const SizedBox(height: 12),
                      _buildActionTile(
                        icon: Icons.notifications_outlined,
                        title: 'Notifications',
                        subtitle: 'Manage notification preferences',
                        onTap: _showNotificationCenter,
                      ),
                      const SizedBox(height: 12),
                      _buildActionTile(
                        icon: Icons.security_outlined,
                        title: 'Privacy & Security',
                        subtitle: 'Manage your privacy settings',
                        onTap: () {
                          // TODO: Navigate to privacy
                        },
                      ),
                      const SizedBox(height: 12),
                      _buildActionTile(
                        icon: Icons.help_outline,
                        title: 'Help & Support',
                        subtitle: 'Get help or contact support',
                        onTap: () {
                          // TODO: Navigate to help
                        },
                      ),
                      const SizedBox(height: 24),
                      
                      // Sign Out Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () async {
                            await _authService.signOut();
                            if (mounted) {
                              Navigator.pushAndRemoveUntil(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const HomeScreen(),
                                ),
                                (route) => false,
                              );
                            }
                          },
                          icon: const Icon(Icons.logout, size: 20),
                          label: const Text(
                            'Sign Out',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF000000),
                            foregroundColor: const Color(0xFFef4444),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: const Color(0xFFef4444).withValues(alpha: 0.3),
                              ),
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        
        // Bottom Navigation
        AppBottomNavigationBar(
          currentIndex: 4,
          onTap: (index) {
            if (index != 4) {
              AppNavigator.navigateToIndex(context, index);
            }
          },
        ),
      ],
    );
  }

  Widget _buildActionTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Material(
      color: const Color(0xFF000000),
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: const Color(0xFF334155).withValues(alpha: 0.5),
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: const Color(0xFF25d1f4).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: const Color(0xFF25d1f4),
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        color: Color(0xFF64748b),
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right,
                color: Color(0xFF64748b),
                size: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showNotificationCenter() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0f172a),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (sheetContext) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFF334155),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Notifications',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'Use local notifications for practical screenshots and demo flows.',
                style: TextStyle(
                  color: Color(0xFF94a3b8),
                  fontSize: 13,
                ),
              ),
              const SizedBox(height: 16),
              _buildNotificationActionButton(
                icon: Icons.notifications_active_outlined,
                label: 'Request Permission',
                onPressed: () async {
                  final granted = await NotificationService.instance.requestPermissions();
                  if (!sheetContext.mounted) {
                    return;
                  }
                  Navigator.pop(sheetContext);
                  if (!mounted) {
                    return;
                  }
                  UiFeedback.showInfo(
                    context,
                    granted ? 'Notification permission granted.' : 'Notification permission denied.',
                  );
                },
              ),
              const SizedBox(height: 10),
              _buildNotificationActionButton(
                icon: Icons.notification_add_outlined,
                label: 'Send Instant Notification',
                onPressed: () async {
                  await NotificationService.instance.showInstantNotification(
                    title: 'DevDocs Notification',
                    body: 'This notification was triggered from the Profile screen.',
                    payload: '/profile',
                    id: DateTime.now().millisecondsSinceEpoch ~/ 1000,
                  );
                  if (!sheetContext.mounted) {
                    return;
                  }
                  Navigator.pop(sheetContext);
                  if (!mounted) {
                    return;
                  }
                  UiFeedback.showSuccess(context, 'Instant notification sent.');
                },
              ),
              const SizedBox(height: 10),
              _buildNotificationActionButton(
                icon: Icons.schedule,
                label: 'Schedule 10s Reminder',
                onPressed: () async {
                  await NotificationService.instance.scheduleNotification(
                    title: 'Reminder',
                    body: 'This scheduled reminder came from Profile.',
                    after: const Duration(seconds: 10),
                    payload: '/dashboard',
                    id: (DateTime.now().millisecondsSinceEpoch ~/ 1000) + 1,
                  );
                  if (!sheetContext.mounted) {
                    return;
                  }
                  Navigator.pop(sheetContext);
                  if (!mounted) {
                    return;
                  }
                  UiFeedback.showInfo(context, 'Scheduled reminder set for 10 seconds.');
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationActionButton({
    required IconData icon,
    required String label,
    required VoidCallback? onPressed,
  }) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon),
        label: Text(label),
      ),
    );
  }
}
