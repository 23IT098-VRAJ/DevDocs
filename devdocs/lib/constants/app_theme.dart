import 'package:flutter/material.dart';

/// App-wide color constants
class AppColors {
  // Primary Colors
  static const Color primary = Color(0xFF25d1f4);
  static const Color primaryLight = Color(0xFF3ae0ff);
  static const Color primaryDark = Color(0xFF1fc2e5);
  
  // Background Colors - Pure Black Theme
  static const Color backgroundDark = Color(0xFF000000);
  static const Color surfaceDark = Color(0xFF000000);
  static const Color cardDark = Color(0xFF000000);
  static const Color inputBackground = Color(0xFF000000);
  
  // Border Colors
  static const Color borderLight = Color(0xFF334155);
  static const Color borderDark = Color(0xFF1e3338);
  
  // Text Colors
  static const Color textPrimary = Colors.white;
  static const Color textSecondary = Color(0xFF9cb5ba);
  static const Color textTertiary = Color(0xFF64748b);
  static const Color textMuted = Color(0xFF475569);
  
  // Status Colors
  static const Color success = Color(0xFF6cc24a);
  static const Color warning = Color(0xFFfbbf24);
  static const Color error = Color(0xFFef4444);
  static const Color info = Color(0xFF3b82f6);
  
  // Badge Colors
  static const Color gold = Color(0xFFfbbf24);
  static const Color silver = Color(0xFF94a3b8);
  static const Color bronze = Color(0xFFea580c);
  static const Color orange = Color(0xFFf97316);
  static const Color purple = Color(0xFFa855f7);
  static const Color green = Color(0xFF10b981);
  
  // Code Highlighting Colors
  static const Color codeKeyword = Color(0xFFc792ea);
  static const Color codeFunction = Color(0xFF82aaff);
  static const Color codeVariable = Color(0xFF25d1f4);
  static const Color codeString = Color(0xFFc3e88d);
  static const Color codeComment = Color(0xFF546e7a);
  
  AppColors._(); // Private constructor to prevent instantiation
}

/// App-wide typography styles
class AppTextStyles {
  // Headings
  static const TextStyle h1 = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 24,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  );
  
  static const TextStyle h2 = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  );
  
  static const TextStyle h3 = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: FontWeight.bold,
  );
  
  static const TextStyle h4 = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: FontWeight.bold,
  );
  
  // Body Text
  static const TextStyle bodyLarge = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: FontWeight.normal,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 14,
    fontWeight: FontWeight.normal,
  );
  
  static const TextStyle bodySmall = TextStyle(
    color: AppColors.textSecondary,
    fontSize: 12,
    fontWeight: FontWeight.normal,
  );
  
  // Labels
  static const TextStyle labelLarge = TextStyle(
    color: AppColors.textPrimary,
    fontSize: 15,
    fontWeight: FontWeight.w600,
  );
  
  static const TextStyle labelMedium = TextStyle(
    color: AppColors.textSecondary,
    fontSize: 13,
    fontWeight: FontWeight.w500,
  );
  
  static const TextStyle labelSmall = TextStyle(
    color: AppColors.textTertiary,
    fontSize: 11,
    fontWeight: FontWeight.w600,
  );
  
  // Caption/Subtitle
  static const TextStyle caption = TextStyle(
    color: AppColors.textTertiary,
    fontSize: 12,
  );
  
  static const TextStyle subtitle = TextStyle(
    color: AppColors.textSecondary,
    fontSize: 13,
  );
  
  // Section Headers
  static const TextStyle sectionHeader = TextStyle(
    color: AppColors.textTertiary,
    fontSize: 12,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.2,
  );
  
  // Code/Monospace
  static const TextStyle code = TextStyle(
    color: AppColors.textSecondary,
    fontSize: 13,
    fontFamily: 'monospace',
    height: 1.5,
  );
  
  AppTextStyles._(); // Private constructor
}

/// Common spacing values
class AppSpacing {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
  
  AppSpacing._(); // Private constructor
}

/// Common border radius values
class AppRadius {
  static const double xs = 4.0;
  static const double sm = 8.0;
  static const double md = 12.0;
  static const double lg = 16.0;
  static const double xl = 20.0;
  static const double full = 9999.0;
  
  static BorderRadius circularXS = BorderRadius.circular(xs);
  static BorderRadius circularSM = BorderRadius.circular(sm);
  static BorderRadius circularMD = BorderRadius.circular(md);
  static BorderRadius circularLG = BorderRadius.circular(lg);
  static BorderRadius circularXL = BorderRadius.circular(xl);
  
  AppRadius._(); // Private constructor
}
