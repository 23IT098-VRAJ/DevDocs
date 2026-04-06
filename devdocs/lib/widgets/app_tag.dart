import 'package:flutter/material.dart';
import '../constants/app_theme.dart';

/// Reusable tag widget for displaying labels/chips
class AppTag extends StatelessWidget {
  final String label;
  final bool hasIndicator;
  final Color? backgroundColor;
  final Color? textColor;
  final Color? borderColor;
  final double? fontSize;
  final EdgeInsets? padding;

  const AppTag({
    super.key,
    required this.label,
    this.hasIndicator = false,
    this.backgroundColor,
    this.textColor,
    this.borderColor,
    this.fontSize,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ??
          const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.cardDark,
        borderRadius: AppRadius.circularSM,
        border: Border.all(
          color: borderColor ??
              AppColors.borderLight.withValues(alpha: 0.5),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (hasIndicator) ...[
            Container(
              width: 6,
              height: 6,
              decoration: const BoxDecoration(
                color: AppColors.success,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 6),
          ],
          Text(
            label,
            style: TextStyle(
              color: textColor ?? AppColors.textSecondary,
              fontSize: fontSize ?? 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
