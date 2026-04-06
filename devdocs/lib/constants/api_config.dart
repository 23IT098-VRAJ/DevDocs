import 'dart:io';
import 'package:flutter/foundation.dart';

/// API Configuration
/// Centralizes API URL management based on platform and environment
class ApiConfig {
  // Stable hotspot/LAN default host to avoid frequent IP edits.
  static const String _defaultLocalHost = '10.171.145.112';
  static const String _localHost = String.fromEnvironment(
    'API_LOCAL_HOST',
    defaultValue: _defaultLocalHost,
  );
  static const String _debugApiBaseUrl = String.fromEnvironment('API_BASE_URL');
  
  // Backend URLs
  static const String prodUrl = 'https://your-backend-domain.com/api';
  static String get localUrl => 'http://$_localHost:8000/api';
  
  /// Get the appropriate base URL for the current platform and environment
  static String get baseUrl {
    if (!kDebugMode) {
      return prodUrl;
    }

    if (_debugApiBaseUrl.isNotEmpty) {
      return _debugApiBaseUrl;
    }

    // Web builds running on the backend machine can use localhost.
    if (kIsWeb) {
      return 'http://localhost:8000/api';
    }

    // Mobile debug builds use a LAN host (hostname or reserved static IP).
    if (Platform.isAndroid || Platform.isIOS) {
      return localUrl;
    }

    return localUrl;
  }
  
  /// Request timeout duration
  static const Duration requestTimeout = Duration(seconds: 30);
  
  /// Optional runtime override (for quick manual testing)
  static String? _overrideBaseUrl;
  
  /// Override the base URL temporarily (for testing different servers)
  static void setBaseUrl(String url) {
    _overrideBaseUrl = url;
  }
  
  /// Clear the override and use default URL
  static void clearOverride() {
    _overrideBaseUrl = null;
  }
  
  /// Get the active base URL (respects override if set)
  static String get activeBaseUrl => _overrideBaseUrl ?? baseUrl;
}
