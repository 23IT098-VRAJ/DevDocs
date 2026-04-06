import 'package:flutter/material.dart';
import '../constants/app_theme.dart';

/// Reusable icon button with container background
class AppIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onPressed;
  final Color? iconColor;
  final Color? backgroundColor;
  final double? iconSize;
  final double? containerSize;
  final BorderRadius? borderRadius;

  const AppIconButton({
    super.key,
    required this.icon,
    required this.onPressed,
    this.iconColor,
    this.backgroundColor,
    this.iconSize,
    this.containerSize,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed,
        borderRadius: borderRadius ?? BorderRadius.circular(containerSize != null ? containerSize! / 2 : 20),
        child: Container(
          width: containerSize ?? 40,
          height: containerSize ?? 40,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: borderRadius ?? BorderRadius.circular(containerSize != null ? containerSize! / 2 : 20),
          ),
          alignment: Alignment.center,
          child: Icon(
            icon,
            color: iconColor ?? AppColors.textTertiary,
            size: iconSize ?? 24,
          ),
        ),
      ),
    );
  }
}
