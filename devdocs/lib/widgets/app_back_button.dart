import 'package:flutter/material.dart';
import '../constants/app_theme.dart';

/// Reusable back button with consistent styling
class AppBackButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Color? color;
  final double? size;

  const AppBackButton({
    super.key,
    this.onPressed,
    this.color,
    this.size,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onPressed ?? () => Navigator.pop(context),
        borderRadius: BorderRadius.circular(20),
        child: Container(
          width: 40,
          height: 40,
          alignment: Alignment.center,
          child: Icon(
            Icons.chevron_left,
            color: color ?? AppColors.textPrimary,
            size: size ?? 28,
          ),
        ),
      ),
    );
  }
}
