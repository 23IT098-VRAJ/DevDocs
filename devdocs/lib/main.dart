import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'constants/app_theme.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/registration_screen.dart';
import 'screens/home_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/library_screen.dart';
import 'screens/search_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/settings_screen.dart';
import 'services/connectivity_service.dart';
import 'services/notification_service.dart';
import 'services/cache_service.dart';

final GlobalKey<NavigatorState> appNavigatorKey = GlobalKey<NavigatorState>();

void main() async {
  // Initialize Flutter bindings
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize cache service (for offline support)
  await CacheService().initialize();
  debugPrint("✅ Cache service initialized");

  // Initialize connectivity service
  await ConnectivityService().initialize();
  debugPrint("✅ Connectivity service initialized");

  // Initialize Supabase with error handling
  try {
    await Supabase.initialize(
      url: 'https://kqfehrmqjfzrfufpbhaw.supabase.co',
      anonKey:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZmVocm1xamZ6cmZ1ZnBiaGF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5MTQ4MzQsImV4cCI6MjA4MjQ5MDgzNH0.0OZlMMaoA1tECgb1nCQWWoVAXXzxZ92M-HHNdASy26o',
    );
    debugPrint("✅ Supabase initialized successfully");
  } catch (e) {
    debugPrint("⚠️ Supabase initialization warning: $e");
    // Continue even if Supabase fails - app will use cached data
  }

  try {
    await NotificationService.instance.initialize(navigatorKey: appNavigatorKey);
    debugPrint("✅ Notification service initialized");
  } catch (e) {
    debugPrint("⚠️ Notification service warning: $e");
  }

  runApp(const DevDocsApp());
}

class DevDocsApp extends StatelessWidget {
  const DevDocsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DevDocs',
      debugShowCheckedModeBanner: false,
      navigatorKey: appNavigatorKey,

      // Dark Theme using AppColors
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
        scaffoldBackgroundColor: AppColors.backgroundDark,
        colorScheme: ColorScheme.dark(
          primary: AppColors.primary,
          surface: AppColors.surfaceDark,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: AppColors.backgroundDark,
        colorScheme: ColorScheme.dark(
          primary: AppColors.primary,
          surface: AppColors.surfaceDark,
        ),
      ),
      themeMode: ThemeMode.dark,

      // Supabase Auth StreamBuilder for session management
      home: StreamBuilder<AuthState>(
        stream: Supabase.instance.client.auth.onAuthStateChange,
        builder: (context, snapshot) {
          // Show splash screen while checking auth state
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const SplashScreen();
          }

          // If user is logged in, go to Dashboard
          final session = snapshot.data?.session;
          if (session != null) {
            return const DashboardScreen();
          }

          // If not logged in, show Splash -> HomeScreen -> LoginScreen
          return const SplashScreen();
        },
      ),

      // Named routes for all screens
      routes: {
        '/login': (context) => const LoginScreen(),
        '/registration': (context) => const RegistrationScreen(),
        '/home': (context) => const HomeScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/library': (context) => const LibraryScreen(),
        '/search': (context) => const SearchScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/settings': (context) => const SettingsScreen(),
      },
    );
  }
}
