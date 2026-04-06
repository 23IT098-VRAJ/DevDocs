import 'package:flutter/material.dart';
import '../widgets/widgets.dart';
import '../constants/app_theme.dart';
import '../services/notification_service.dart';
import '../utils/ui_feedback.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _pushNotifications = true;
  bool _incognitoMode = false;

  @override
  Widget build(BuildContext context) {
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
        body: SafeArea(
          child: Column(
            children: [
              // Header
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.backgroundDark.withValues(alpha: 0.95),
                  border: const Border(
                    bottom: BorderSide(
                      color: AppColors.borderLight,
                      width: 0.5,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    AppBackButton(),
                    const Text('Settings & Activity', style: AppTextStyles.h3),
                    const SizedBox(width: 40),
                  ],
                ),
              ),

              // Scrollable Content
              Expanded(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 24),

                      // System Preferences Section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Text(
                          'SYSTEM PREFERENCES',
                          style: TextStyle(
                            color: const Color(0xFF64748b),
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          children: [
                            // Dark Mode
                            _buildPreferenceItem(
                              icon: Icons.dark_mode,
                              title: 'Dark Mode',
                              subtitle: 'Always on for deep focus',
                              value: true,
                              enabled: false,
                              onChanged: null,
                            ),
                            const SizedBox(height: 8),

                            // Push Notifications
                            _buildPreferenceItem(
                              icon: Icons.notifications_active,
                              title: 'Push Notifications',
                              subtitle: 'Streaks & code reviews',
                              value: _pushNotifications,
                              enabled: true,
                              onChanged: (value) async {
                                if (value) {
                                  final bool granted = await NotificationService
                                      .instance
                                      .requestPermissions();

                                  if (!granted && context.mounted) {
                                    UiFeedback.showInfo(
                                      context,
                                      'Notification permission denied.',
                                    );
                                  }
                                }

                                if (!context.mounted) {
                                  return;
                                }

                                setState(() {
                                  _pushNotifications = value;
                                });

                                if (_pushNotifications && context.mounted) {
                                  UiFeedback.showSuccess(
                                    context,
                                    'Notifications enabled.',
                                  );
                                }
                              },
                            ),
                            const SizedBox(height: 8),

                            // Incognito Mode
                            _buildPreferenceItem(
                              icon: Icons.visibility_off,
                              title: 'Incognito Mode',
                              subtitle: 'Hide searches from history',
                              value: _incognitoMode,
                              enabled: true,
                              onChanged: (value) {
                                setState(() {
                                  _incognitoMode = value;
                                });
                              },
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 32),

                      // Recent Activity Section
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'RECENT ACTIVITY',
                              style: TextStyle(
                                color: const Color(0xFF64748b),
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                            Material(
                              color: Colors.transparent,
                              child: InkWell(
                                onTap: () {
                                  // Mark all as read
                                },
                                borderRadius: BorderRadius.circular(4),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 4,
                                    vertical: 2,
                                  ),
                                  child: Text(
                                    'Mark all read',
                                    style: TextStyle(
                                      color: const Color(0xFF25d1f4),
                                      fontSize: 11,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),

                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Column(
                          children: [
                            // Achievement Notification (Unread)
                            _buildNotificationCard(
                              icon: Icons.emoji_events,
                              iconColor: const Color(0xFF25d1f4),
                              title: 'Achievement Unlocked: Bug Hunter',
                              description:
                                  'You\'ve solved 50 critical bugs. Keep squashing them!',
                              time: '2m ago',
                              isUnread: true,
                            ),
                            const SizedBox(height: 12),

                            // Streak Milestone
                            _buildNotificationCard(
                              icon: Icons.local_fire_department,
                              iconColor: const Color(0xFFf97316),
                              title: '7-Day Streak Milestone!',
                              description:
                                  'You\'re on fire! Code consistency is key to mastery.',
                              time: '5h ago',
                              isUnread: false,
                            ),
                            const SizedBox(height: 12),

                            // Snippet Saved
                            _buildNotificationCard(
                              icon: Icons.code,
                              iconColor: const Color(0xFFa855f7),
                              title: 'Snippet Saved',
                              description:
                                  '"React Auth Provider" was successfully added to your library.',
                              time: '1d ago',
                              isUnread: false,
                            ),
                            const SizedBox(height: 12),

                            // Weekly Summary (Read)
                            _buildNotificationCard(
                              icon: Icons.analytics,
                              iconColor: const Color(0xFF10b981),
                              title: 'Weekly Summary Available',
                              description:
                                  'Check out your productivity stats for the last week.',
                              time: '2d ago',
                              isUnread: false,
                              isRead: true,
                            ),
                            const SizedBox(height: 16),

                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                onPressed: () async {
                                  await NotificationService.instance
                                      .showInstantNotification(
                                        title: 'DevDocs Alert',
                                        body:
                                            'This is an instant local notification test.',
                                        payload: '/settings',
                                        id:
                                            DateTime.now()
                                                .millisecondsSinceEpoch ~/
                                            1000,
                                      );

                                  if (!context.mounted) {
                                    return;
                                  }

                                  UiFeedback.showSuccess(
                                    context,
                                    'Instant notification triggered.',
                                  );
                                },
                                icon: const Icon(
                                  Icons.notification_add_outlined,
                                ),
                                label: const Text('Test Instant Notification'),
                              ),
                            ),
                            const SizedBox(height: 10),
                            SizedBox(
                              width: double.infinity,
                              child: OutlinedButton.icon(
                                onPressed: () async {
                                  await NotificationService.instance
                                      .scheduleNotification(
                                        title: 'Reminder',
                                        body:
                                            'Scheduled reminder from DevDocs.',
                                        after: const Duration(seconds: 15),
                                        payload: '/dashboard',
                                        id:
                                            (DateTime.now()
                                                    .millisecondsSinceEpoch ~/
                                                1000) +
                                            1,
                                      );

                                  if (!context.mounted) {
                                    return;
                                  }

                                  UiFeedback.showInfo(
                                    context,
                                    'Scheduled notification set for 15 seconds.',
                                  );
                                },
                                icon: const Icon(Icons.schedule),
                                label: const Text(
                                  'Test Scheduled Notification',
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPreferenceItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required bool enabled,
    required ValueChanged<bool>? onChanged,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF25d1f4).withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: const Color(0xFF25d1f4), size: 20),
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
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: Color(0xFF64748b),
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Opacity(
            opacity: enabled ? 1.0 : 0.6,
            child: Switch(
              value: value,
              onChanged: enabled ? onChanged : null,
              activeThumbColor: const Color(0xFF25d1f4),
              activeTrackColor: const Color(0xFF25d1f4).withValues(alpha: 0.5),
              inactiveThumbColor: Colors.white,
              inactiveTrackColor: const Color(0xFF475569),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String description,
    required String time,
    required bool isUnread,
    bool isRead = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isUnread
              ? const Color(0xFF25d1f4).withValues(alpha: 0.3)
              : const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Opacity(
        opacity: isRead ? 0.7 : 1.0,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: iconColor.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: iconColor.withValues(alpha: 0.2)),
              ),
              child: Icon(icon, color: iconColor, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      if (isUnread)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: const Color(0xFF25d1f4),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: const Color(
                                  0xFF25d1f4,
                                ).withValues(alpha: 0.6),
                                blurRadius: 10,
                                spreadRadius: 0,
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    description,
                    style: const TextStyle(
                      color: Color(0xFF64748b),
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    time,
                    style: const TextStyle(
                      color: Color(0xFF475569),
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
