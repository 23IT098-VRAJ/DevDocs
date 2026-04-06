import 'package:flutter/material.dart';

class SkeletonLoader extends StatefulWidget {
  final double? height;
  final double? width;
  final BorderRadius? borderRadius;
  
  const SkeletonLoader({
    super.key,
    this.height,
    this.width,
    this.borderRadius,
  });

  @override
  State<SkeletonLoader> createState() => _SkeletonLoaderState();
}

class _SkeletonLoaderState extends State<SkeletonLoader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat();
    
    _animation = Tween<double>(begin: -1.0, end: 2.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          height: widget.height,
          width: widget.width,
          decoration: BoxDecoration(
            borderRadius: widget.borderRadius ?? BorderRadius.circular(8),
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: const [
                Color(0xFF1a1a1a),
                Color(0xFF2a2a2a),
                Color(0xFF1a1a1a),
              ],
              stops: [
                _animation.value - 0.3,
                _animation.value,
                _animation.value + 0.3,
              ].map((e) => e.clamp(0.0, 1.0)).toList(),
            ),
          ),
        );
      },
    );
  }
}

class DashboardSkeletonLoader extends StatelessWidget {
  const DashboardSkeletonLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header Skeleton
        Container(
          padding: EdgeInsets.all(16).copyWith(
            top: MediaQuery.of(context).padding.top + 16,
            bottom: 8,
          ),
          child: Row(
            children: [
              // Profile picture skeleton
              SkeletonLoader(
                height: 40,
                width: 40,
                borderRadius: BorderRadius.circular(20),
              ),
              const SizedBox(width: 12),
              // Welcome text skeleton
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SkeletonLoader(
                      height: 12,
                      width: 80,
                      borderRadius: BorderRadius.circular(6),
                    ),
                    const SizedBox(height: 6),
                    SkeletonLoader(
                      height: 18,
                      width: 150,
                      borderRadius: BorderRadius.circular(6),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 16),
        
        // Stats Cards Skeleton
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Expanded(
                child: _buildStatCardSkeleton(),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatCardSkeleton(),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        
        // Recent Solutions Header Skeleton
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SkeletonLoader(
                height: 20,
                width: 140,
                borderRadius: BorderRadius.circular(6),
              ),
              SkeletonLoader(
                height: 16,
                width: 60,
                borderRadius: BorderRadius.circular(6),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 12),
        
        // Recent Solution Cards Skeleton (3 cards)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              _buildSolutionCardSkeleton(),
              const SizedBox(height: 12),
              _buildSolutionCardSkeleton(),
              const SizedBox(height: 12),
              _buildSolutionCardSkeleton(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatCardSkeleton() {
    return Container(
      height: 165,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              SkeletonLoader(
                height: 36,
                width: 36,
                borderRadius: BorderRadius.circular(8),
              ),
              SkeletonLoader(
                height: 20,
                width: 40,
                borderRadius: BorderRadius.circular(12),
              ),
            ],
          ),
          const Spacer(),
          SkeletonLoader(
            height: 12,
            width: 80,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 4),
          SkeletonLoader(
            height: 28,
            width: 50,
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      ),
    );
  }

  Widget _buildSolutionCardSkeleton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              SkeletonLoader(
                height: 24,
                width: 60,
                borderRadius: BorderRadius.circular(6),
              ),
              const Spacer(),
              SkeletonLoader(
                height: 14,
                width: 50,
                borderRadius: BorderRadius.circular(6),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SkeletonLoader(
            height: 18,
            width: double.infinity,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 8),
          SkeletonLoader(
            height: 16,
            width: double.infinity,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 6),
          SkeletonLoader(
            height: 16,
            width: 200,
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      ),
    );
  }
}

class LibrarySkeletonLoader extends StatelessWidget {
  const LibrarySkeletonLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Search bar skeleton with its padding
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
          child: SkeletonLoader(
            height: 56,
            width: double.infinity,
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        
        // Solutions count skeleton
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: SkeletonLoader(
            height: 13,
            width: 80,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        
        const SizedBox(height: 12),
        
        // Solution cards skeleton
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              ...List.generate(
                3,
                (index) => Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _buildSolutionCardSkeleton(),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSolutionCardSkeleton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              SkeletonLoader(
                height: 24,
                width: 60,
                borderRadius: BorderRadius.circular(6),
              ),
              const Spacer(),
              SkeletonLoader(
                height: 14,
                width: 50,
                borderRadius: BorderRadius.circular(6),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SkeletonLoader(
            height: 18,
            width: double.infinity,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 8),
          SkeletonLoader(
            height: 16,
            width: double.infinity,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 6),
          SkeletonLoader(
            height: 16,
            width: 200,
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      ),
    );
  }
}

class ProfileSkeletonLoader extends StatelessWidget {
  const ProfileSkeletonLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        left: 16,
        right: 16,
      ),
      child: Column(
        children: [
          // Profile picture skeleton
          SkeletonLoader(
            height: 100,
            width: 100,
            borderRadius: BorderRadius.circular(50),
          ),
          
          const SizedBox(height: 16),
          
          // Name skeleton
          SkeletonLoader(
            height: 24,
            width: 150,
            borderRadius: BorderRadius.circular(6),
          ),
          
          const SizedBox(height: 8),
          
          // Email skeleton
          SkeletonLoader(
            height: 16,
            width: 200,
            borderRadius: BorderRadius.circular(6),
          ),
          
          const SizedBox(height: 32),
          
          // Stats cards skeleton
          Row(
            children: [
              Expanded(
                child: _buildStatSkeleton(),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildStatSkeleton(),
              ),
            ],
          ),
          
          const SizedBox(height: 32),
          
          // Menu items skeleton
          ...List.generate(
            4,
            (index) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: SkeletonLoader(
                height: 56,
                width: double.infinity,
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatSkeleton() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF000000),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFF334155).withValues(alpha: 0.5),
        ),
      ),
      child: Column(
        children: [
          SkeletonLoader(
            height: 28,
            width: 50,
            borderRadius: BorderRadius.circular(6),
          ),
          const SizedBox(height: 8),
          SkeletonLoader(
            height: 14,
            width: 80,
            borderRadius: BorderRadius.circular(6),
          ),
        ],
      ),
    );
  }
}
