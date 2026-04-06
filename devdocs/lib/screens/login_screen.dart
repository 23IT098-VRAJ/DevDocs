import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:io';
import '../services/auth_service.dart';
import '../services/connectivity_service.dart';
import 'registration_screen.dart';
import 'dart:async';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _isPasswordVisible = false;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();
  StreamSubscription<AuthState>? _authSubscription;

  @override
  void initState() {
    super.initState();
    // Listen for auth state changes (Google OAuth redirect)
    _authSubscription = Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      final session = data.session;
      if (session != null && mounted) {
        // User just authenticated via Google OAuth
        print('🎉 Google OAuth successful - Navigating to dashboard');
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    });
  }

  @override
  void dispose() {
    _authSubscription?.cancel();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000),
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height - 
                         MediaQuery.of(context).padding.top - 
                         MediaQuery.of(context).padding.bottom,
            ),
            child: IntrinsicHeight(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back, color: Colors.white),
                          onPressed: () => Navigator.pop(context),
                        ),
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(6),
                            gradient: const LinearGradient(
                              colors: [Color(0xFF25d1f4), Color(0xFF0e7a91)],
                            ),
                          ),
                          child: const Center(
                            child: Text(
                              'D',
                              style: TextStyle(
                                  color: Color(0xFF000000),
                                fontWeight: FontWeight.bold,
                                fontSize: 20,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 40),
                      ],
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Hero Text
                    const Text(
                      'Welcome Back',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        letterSpacing: -0.5,
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    const Text(
                      'Your code brain is ready.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color(0xFF9ca3af),
                        fontSize: 16,
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Email Field
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.only(left: 4, bottom: 8),
                          child: Text(
                            'Email',
                            style: TextStyle(
                              color: Color(0xFFd1d5db),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        TextField(
                          controller: _emailController,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'developer@example.com',
                            hintStyle: const TextStyle(color: Color(0xFF6b7280)),
                            filled: true,
                            fillColor: const Color(0xFF000000),
                            prefixIcon: const Icon(
                              Icons.mail_outline,
                              color: Color(0xFF9ca3af),
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF3b5054)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF3b5054)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF25d1f4)),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                          ),
                          keyboardType: TextInputType.emailAddress,
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 20),
                    
                    // Password Field
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.only(left: 4, bottom: 8),
                          child: Text(
                            'Password',
                            style: TextStyle(
                              color: Color(0xFFd1d5db),
                              fontSize: 14,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        TextField(
                          controller: _passwordController,
                          obscureText: !_isPasswordVisible,
                          style: const TextStyle(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: '••••••••',
                            hintStyle: const TextStyle(color: Color(0xFF6b7280)),
                            filled: true,
                            fillColor: const Color(0xFF000000),
                            prefixIcon: const Icon(
                              Icons.lock_outline,
                              color: Color(0xFF9ca3af),
                            ),
                            suffixIcon: IconButton(
                              icon: Icon(
                                _isPasswordVisible
                                    ? Icons.visibility_outlined
                                    : Icons.visibility_off_outlined,
                                color: const Color(0xFF9ca3af),
                              ),
                              onPressed: () {
                                setState(() => _isPasswordVisible = !_isPasswordVisible);
                              },
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF3b5054)),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF3b5054)),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                              borderSide: const BorderSide(color: Color(0xFF25d1f4)),
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 16,
                            ),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {
                              // TODO: Forgot password
                            },
                            child: const Text(
                              'Forgot Password?',
                              style: TextStyle(
                                color: Color(0xFF25d1f4),
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 8),
                    
                    // Sign In Button
                    SizedBox(
                      height: 56,
                      child: ElevatedButton(
                        onPressed: () async {
                          // Validate inputs
                          final email = _emailController.text.trim();
                          final password = _passwordController.text.trim();
                          
                          if (email.isEmpty || password.isEmpty) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Please enter email and password'),
                                backgroundColor: Colors.red,
                                duration: Duration(seconds: 3),
                              ),
                            );
                            return;
                          }
                          
                          // Basic email validation
                          if (!email.contains('@') || !email.contains('.')) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Please enter a valid email address'),
                                backgroundColor: Colors.red,
                                duration: Duration(seconds: 3),
                              ),
                            );
                            return;
                          }
                          
                          // Show loading indicator
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Row(
                                children: [
                                  SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  ),
                                  SizedBox(width: 16),
                                  Text('Signing in...'),
                                ],
                              ),
                              duration: Duration(seconds: 2),
                            ),
                          );
                          
                          try {
                            // ========== FIX 4: Check Internet Connectivity ==========
                            final isOnline = await ConnectivityService().checkConnectivity();
                            if (!mounted) return;
                            
                            if (!isOnline) {
                              ScaffoldMessenger.of(context).clearSnackBars();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('❌ No internet connection. Please check your network and try again.'),
                                  backgroundColor: Colors.red,
                                  duration: Duration(seconds: 4),
                                ),
                              );
                              return;
                            }
                            
                            // Supabase Authentication
                            print('\n🔐 LOGIN ATTEMPT');
                            print('   Email: $email');
                            
                            final response = await _authService.signIn(
                              email: email,
                              password: password,
                            );
                            if (!mounted) return;
                            
                            print('✅ Login response received');
                            print('   User exists: ${response.user != null}');
                            print('   Session exists: ${response.session != null}');
                            if (response.session != null) {
                              print('   Access token exists: ${response.session!.accessToken.isNotEmpty}');
                              print('   Token preview: ${response.session!.accessToken.substring(0, 20)}...');
                            }
                            
                            if (response.user != null) {
                              print('🎉 LOGIN SUCCESSFUL - Navigating to dashboard\n');
                              
                              // Clear loading message
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).clearSnackBars();
                                
                                // Show success message
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Login successful! Welcome back.'),
                                    backgroundColor: Colors.green,
                                    duration: Duration(seconds: 2),
                                  ),
                                );
                                
                                // Navigate to dashboard
                                Navigator.pushReplacementNamed(context, '/dashboard');
                              }
                            } else {
                              print('❌ LOGIN FAILED - No user in response\n');
                            }
                          } catch (e) {
                            print('❌ LOGIN ERROR: $e\n');
                            // Clear loading message
                            ScaffoldMessenger.of(context).clearSnackBars();
                            
                            if (context.mounted) {
                              String errorMessage = 'Login failed';
                              Color backgroundColor = Colors.red;
                              
                              final errorString = e.toString().toLowerCase();
                              
                              // Network-specific errors
                              if (e is SocketException) {
                                errorMessage = '❌ Network error: Unable to reach server. Check your internet connection.';
                                backgroundColor = Colors.red;
                              } else if (e is TimeoutException) {
                                errorMessage = '⏱️ Request timeout. Please check your internet connection and try again.';
                                backgroundColor = Colors.orange;
                              } else if (errorString.contains('failed host lookup') || 
                                         errorString.contains('network unreachable')) {
                                errorMessage = '❌ Network error: Unable to connect to server. Check your internet.';
                                backgroundColor = Colors.red;
                              } else if (errorString.contains('invalid login credentials') ||
                                  errorString.contains('invalid_credentials')) {
                                errorMessage = '⚠️ Invalid email or password. Please try again.';
                                backgroundColor = Colors.orange;
                              } else if (errorString.contains('email not confirmed')) {
                                errorMessage = '⚠️ Please verify your email before signing in.';
                                backgroundColor = Colors.orange;
                              } else if (errorString.contains('user not found')) {
                                errorMessage = '⚠️ No account found with this email. Please register first.';
                                backgroundColor = Colors.orange;
                              } else if (errorString.contains('network')) {
                                errorMessage = '❌ Network error. Please check your connection and try again.';
                                backgroundColor = Colors.red;
                              } else {
                                errorMessage = '❌ Login failed. Please try again.';
                              }
                              
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(errorMessage),
                                  backgroundColor: backgroundColor,
                                  duration: const Duration(seconds: 4),
                                ),
                              );
                            }
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF25d1f4),
                          foregroundColor: const Color(0xFF000000),
                          elevation: 0,
                          shadowColor: const Color(0xFF25d1f4).withValues(alpha: 0.3),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Sign In',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward, size: 20),
                          ],
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Divider
                    Row(
                      children: [
                        Expanded(
                          child: Container(
                            height: 1,
                            color: const Color(0xFF3b5054),
                          ),
                        ),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16),
                          child: Text(
                            'Or continue with',
                            style: TextStyle(
                              color: Color(0xFF6b7280),
                              fontSize: 14,
                            ),
                          ),
                        ),
                        Expanded(
                          child: Container(
                            height: 1,
                            color: const Color(0xFF3b5054),
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 32),
                    
                    // Google Sign-In Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: OutlinedButton.icon(
                        onPressed: () async {
                          try {
                            final success = await _authService.signInWithGoogle();
                            if (success && context.mounted) {
                              // OAuth flow will open browser/webview
                              // User will be redirected back after authentication
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Opening Google Sign-In...'),
                                  backgroundColor: Color(0xFF25d1f4),
                                ),
                              );
                            } else if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Failed to initiate Google Sign-In'),
                                  backgroundColor: Color(0xFFef4444),
                                ),
                              );
                            }
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Error: $e'),
                                  backgroundColor: const Color(0xFFef4444),
                                ),
                              );
                            }
                          }
                        },
                        icon: const Icon(Icons.g_mobiledata, size: 28),
                        label: const Text(
                          'Continue with Google',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                        ),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor: const Color(0xFF16262a),
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          side: const BorderSide(
                            color: Color(0xFF3b5054),
                            width: 1.5,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    
                    const Spacer(),
                    
                    // Footer
                    Padding(
                      padding: const EdgeInsets.only(top: 32, bottom: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            'New here?',
                            style: TextStyle(
                              color: Color(0xFF9ca3af),
                              fontSize: 14,
                            ),
                          ),
                          MouseRegion(
                            cursor: SystemMouseCursors.click,
                            child: TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const RegistrationScreen(),
                                  ),
                                );
                              },
                              style: TextButton.styleFrom(
                                foregroundColor: const Color(0xFF25d1f4),
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                              ),
                              child: const Text(
                                'Create Account',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
