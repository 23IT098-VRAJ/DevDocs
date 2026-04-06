import 'package:permission_handler/permission_handler.dart';

/// Handles all app permissions
/// Requests from user with proper dialogs and settings redirects
class PermissionService {
  static final PermissionService _instance = PermissionService._internal();
  factory PermissionService() => _instance;
  PermissionService._internal();

  /// Request all necessary permissions
  Future<bool> requestAllPermissions() async {
    final permissions = [
      Permission.camera,
      Permission.photos,
      Permission.notification,
      Permission.location,
    ];

    final statuses = await permissions.request();
    
    // Check if all required permissions are granted
    final allGranted = statuses.values.every((status) => status.isGranted);
    
    if (allGranted) {
      print('✅ All permissions granted');
    } else {
      print('⚠️ Some permissions denied');
      _logPermissionStatus(statuses);
    }
    
    return allGranted;
  }

  /// Request camera permission (for image upload)
  Future<PermissionStatus> requestCameraPermission() async {
    final status = await Permission.camera.request();
    print('📷 Camera permission: $status');
    return status;
  }

  /// Request photo library permission
  Future<PermissionStatus> requestPhotoPermission() async {
    final status = await Permission.photos.request();
    print('📸 Photos permission: $status');
    return status;
  }

  /// Request notification permission
  Future<PermissionStatus> requestNotificationPermission() async {
    final status = await Permission.notification.request();
    print('🔔 Notification permission: $status');
    return status;
  }

  /// Request location permission
  Future<PermissionStatus> requestLocationPermission() async {
    final status = await Permission.location.request();
    print('📍 Location permission: $status');
    return status;
  }

  /// Check if permission is granted
  Future<bool> isPermissionGranted(Permission permission) async {
    final status = await permission.status;
    return status.isGranted;
  }

  /// Check all permissions status
  Future<Map<String, PermissionStatus>> checkAllPermissions() async {
    return {
      'Camera': await Permission.camera.status,
      'Photos': await Permission.photos.status,
      'Notifications': await Permission.notification.status,
      'Location': await Permission.location.status,
    };
  }

  /// Log permission status
  void _logPermissionStatus(Map<Permission, PermissionStatus> statuses) {
    statuses.forEach((permission, status) {
      print('${permission.toString()}: ${status.toString()}');
    });
  }

  /// Open app settings for permission management
  Future<bool> openAppSettings() async {
    return await openAppSettings();
  }
}
