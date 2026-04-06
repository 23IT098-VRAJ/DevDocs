import 'package:flutter/material.dart';
import 'dart:async';
import 'package:permission_handler/permission_handler.dart';
import 'home_screen.dart';
import 'dashboard_screen.dart';
import '../services/permission_service.dart';
import '../services/auth_service.dart';
import '../services/cache_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<double> _scaleAnimation;
  bool _showCursor = true;
  Timer? _cursorTimer;
  double _loadingProgress = 0.0;

  @override
  void initState() {
    super.initState();
    
    // Setup animations
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOutBack),
    );
    
    _controller.forward();
    
    // Cursor blink animation
    _cursorTimer = Timer.periodic(const Duration(milliseconds: 500), (timer) {
      if (mounted) {
        setState(() => _showCursor = !_showCursor);
      }
    });
    
    // Loading progress animation
    _animateLoading();
    
    // Request permissions and navigate to home
    _initializePermissions();
  }
  
  /// Request app permissions and check for existing session
  Future<void> _initializePermissions() async {
    try {
      // Request essential permissions
      final permService = PermissionService();
      
      // Request notification permission (important for LAB 10)
      await permService.requestNotificationPermission();
      
      // Request camera and photo permissions (for potential image upload)
      await permService.requestCameraPermission();
      await permService.requestPhotoPermission();
      
      print('✅ Permission requests completed');
    } catch (e) {
      print('⚠️ Permission error: $e');
    }

    // Check for existing cached session before navigating
    await _checkExistingSession();
  }

  /// Check if user has a cached session and navigate accordingly
  Future<void> _checkExistingSession() async {
    try {
      // Try to restore session from cache
      final authService = AuthService();
      final sessionRestored = await authService.restoreSessionFromCache();
      
      if (sessionRestored) {
        print('✅ Session restored from cache - navigating to Dashboard');
        _navigateToDashboard();
      } else {
        print('ℹ️ No cached session - navigating to Login Screen');
        _navigateToHome();
      }
    } catch (e) {
      print('⚠️ Session check error: $e - navigating to Login Screen');
      _navigateToHome();
    }
  }

  /// Navigate to Dashboard with cached data
  void _navigateToDashboard() {
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const DashboardScreen()),
        );
      }
    });
  }

  /// Navigate to Home Screen (login)
  void _navigateToHome() {
    Future.delayed(const Duration(seconds: 3), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      }
    });
  }
  
  void _animateLoading() {
    Timer.periodic(const Duration(milliseconds: 50), (timer) {
      if (mounted && _loadingProgress < 1.0) {
        setState(() => _loadingProgress += 0.02);
      } else {
        timer.cancel();
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    _cursorTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000),
      body: Stack(
        children: [
          // Background pattern
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    const Color(0xFF000000),
                    const Color(0xFF000000).withValues(alpha: 0.95),
                    const Color(0xFF000000),
                  ],
                ),
              ),
            ),
          ),
          
          // Main content
          SafeArea(
            child: Column(
              children: [
                const Spacer(),
                
                // Logo and title section
                FadeTransition(
                  opacity: _fadeAnimation,
                  child: ScaleTransition(
                    scale: _scaleAnimation,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Icon container with glow
                        Container(
                          width: 128,
                          height: 128,
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: const Color(0xFF000000),
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(
                              color: const Color(0xFF25d1f4).withValues(alpha: 0.3),
                              width: 1,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF25d1f4).withValues(alpha: 0.4),
                                blurRadius: 40,
                                spreadRadius: -10,
                              ),
                            ],
                            gradient: LinearGradient(
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                              colors: [
                                const Color(0xFF25d1f4).withValues(alpha: 0.1),
                                Colors.transparent,
                              ],
                            ),
                          ),
                          child: Stack(
                            children: [
                              Center(
                                child: Icon(
                                  Icons.terminal,
                                  size: 80,
                                  color: const Color(0xFF25d1f4),
                                ),
                              ),
                              // Decorative brackets
                              Positioned(
                                top: 12,
                                left: 12,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    border: Border(
                                      left: BorderSide(
                                        color: const Color(0xFF25d1f4).withValues(alpha: 0.5),
                                        width: 2,
                                      ),
                                      top: BorderSide(
                                        color: const Color(0xFF25d1f4).withValues(alpha: 0.5),
                                        width: 2,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: 12,
                                right: 12,
                                child: Container(
                                  width: 8,
                                  height: 8,
                                  decoration: BoxDecoration(
                                    border: Border(
                                      right: BorderSide(
                                        color: const Color(0xFF25d1f4).withValues(alpha: 0.5),
                                        width: 2,
                                      ),
                                      bottom: BorderSide(
                                        color: const Color(0xFF25d1f4).withValues(alpha: 0.5),
                                        width: 2,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        
                        // Title
                        const Text(
                          'DevDocs',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 36,
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.5,
                          ),
                        ),
                        
                        const SizedBox(height: 8),
                        
                        // Subtitle with decorative lines
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 32,
                              height: 1,
                              color: const Color(0xFF25d1f4).withValues(alpha: 0.4),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'INTELLIGENT SEARCH',
                              style: TextStyle(
                                color: const Color(0xFF25d1f4).withValues(alpha: 0.8),
                                fontSize: 11,
                                letterSpacing: 2,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              width: 32,
                              height: 1,
                              color: const Color(0xFF25d1f4).withValues(alpha: 0.4),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
                
                const Spacer(),
                
                // Bottom status section
                Padding(
                  padding: const EdgeInsets.only(bottom: 48, left: 32, right: 32),
                  child: Column(
                    children: [
                      // Loading bar
                      Container(
                        width: 256,
                        height: 4,
                        decoration: BoxDecoration(
                          color: const Color(0xFF050505),
                          borderRadius: BorderRadius.circular(2),
                        ),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: FractionallySizedBox(
                            widthFactor: _loadingProgress,
                            child: Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFF25d1f4),
                                borderRadius: BorderRadius.circular(2),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF25d1f4).withValues(alpha: 0.7),
                                    blurRadius: 10,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Status text
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            '> ',
                            style: TextStyle(
                              color: Color(0xFF25d1f4),
                              fontSize: 14,
                              fontFamily: 'monospace',
                            ),
                          ),
                          const Text(
                            'Initializing AI Search Engine',
                            style: TextStyle(
                              color: Color(0xFF9cb5ba),
                              fontSize: 14,
                              fontFamily: 'monospace',
                            ),
                          ),
                          AnimatedOpacity(
                            opacity: _showCursor ? 1.0 : 0.0,
                            duration: const Duration(milliseconds: 100),
                            child: const Text(
                              '_',
                              style: TextStyle(
                                color: Color(0xFF25d1f4),
                                fontSize: 14,
                                fontFamily: 'monospace',
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      const SizedBox(height: 8),
                      
                      // Version info
                      const Text(
                        'v2.0.4 • Build 8923a',
                        style: TextStyle(
                          color: Color(0xFF4a5f64),
                          fontSize: 10,
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
