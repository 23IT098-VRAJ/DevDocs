import 'package:flutter/material.dart';
import '../screens/dashboard_screen.dart';
import '../screens/library_screen.dart';
import '../screens/search_screen.dart';
import '../screens/profile_screen.dart';

/// Navigation helper class for app-wide navigation
class AppNavigator {
  /// Navigate to a specific screen by index
  static Future<void> navigateToIndex(BuildContext context, int index) async {
    Widget destination;
    
    switch (index) {
      case 0:
        destination = const LibraryScreen();
        break;
      case 1:
        destination = const SearchScreen();
        break;
      case 2:
        destination = const DashboardScreen();
        break;
      case 3:
        // TODO: Implement Ask AI screen
        return; // Don't navigate for now
      case 4:
        destination = const ProfileScreen();
        break;
      default:
        return;
    }
    
    // Use pushReplacement to replace current screen without clearing the whole stack
    // This ensures back buttons work correctly and don't go to logged-out home screen
    await Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (context) => destination),
    );
  }
  
  /// Get current screen index for bottom navigation
  static int getCurrentIndex(BuildContext context) {
    final route = ModalRoute.of(context);
    if (route?.settings.name != null) {
      switch (route!.settings.name) {
        case '/library':
          return 0;
        case '/search':
          return 1;
        case '/dashboard':
          return 2;
        case '/profile':
          return 4;
        default:
          return 2; // Default to dashboard
      }
    }
    return 2; // Default to dashboard
  }
  
  AppNavigator._(); // Private constructor
}
