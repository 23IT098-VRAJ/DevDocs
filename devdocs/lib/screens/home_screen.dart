import 'package:flutter/material.dart';
import 'login_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000),
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height - MediaQuery.of(context).padding.top - MediaQuery.of(context).padding.bottom,
            ),
            child: IntrinsicHeight(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Header
                  Padding(
                    padding: const EdgeInsets.all(24.0).copyWith(top: 32),
                    child: Row(
                      children: [
                        Container(
                          width: 40,
                          height: 40,
                          decoration: BoxDecoration(
                            color: const Color(0xFF25d1f4).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.code,
                            color: Color(0xFF25d1f4),
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),
                        const Text(
                          'DevDocs',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  
                  // Main Content
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 32),
                          
                          // Hero Text
                          RichText(
                            text: const TextSpan(
                              style: TextStyle(
                                fontSize: 40,
                                height: 1.1,
                                fontWeight: FontWeight.bold,
                                letterSpacing: -1,
                                color: Colors.white,
                              ),
                              children: [
                                TextSpan(text: 'Never solve the\nsame problem\n'),
                                TextSpan(
                                  text: 'twice.',
                                  style: TextStyle(color: Color(0xFF25d1f4)),
                                ),
                              ],
                            ),
                          ),
                          
                          const SizedBox(height: 16),
                          
                          // Subtitle
                          const Text(
                            'Your personal AI knowledge base\nfor code snippets and solutions.',
                            style: TextStyle(
                              color: Color(0xFF94a3b8),
                              fontSize: 18,
                              height: 1.5,
                              fontWeight: FontWeight.w300,
                            ),
                          ),
                          
                          const SizedBox(height: 48),
                          
                          // Feature Cards
                          _buildFeatureCard(
                            context,
                            icon: Icons.save_outlined,
                            title: 'Save solutions',
                            subtitle: 'One-click snippets capture.',
                            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6099umUAk9oNdYmnm5RbjfJxtYT6VHPmKJWKi7n7wD62pQ5ezccgB_32MvjfsoDAXXnkIqS-xOFd_ibo_EHIuNFlD0V374dTKXoNIv7UzeR8IOONwQmECXv9t98TrkeioE6F0aFH8RIGj6GsrWuxLU9nRtZgeiB_vKfcJu8ujzKKVnSQj-GCecD2HQzSODepZun1JDkfGdudfR03yU5CgrRTKLq8oHABD_V8wQFMVbk5zdrfvCKJyjo3Baoe-DNrZii-48M24wFp7',
                          ),
                          
                          const SizedBox(height: 20),
                          
                          _buildFeatureCard(
                            context,
                            icon: Icons.search,
                            title: 'Natural Search',
                            subtitle: 'Ask like a human, get code.',
                            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR-zsdQdQvE05XOb6f3D3DGsxE6dxlSYBt3UBVlBu9yKabSmnD8yJoNIIEOlIFhifeJh72_2sJufJY-EZwne01w8lMnkgrOuE_wMm-IsNvgQrexfVLsogsBd5pW66kBZg9q7V1wt9ZCk7tvsQip8njlrDP2IqCyc1HEwWGtvDvyTaagpAxnlSjhcnfYM7aOxg5eCx2DrwWZPrfDDBt8fP6OxxUYic--bMI8P97a29SatXXxRmDp_2I_ilTQBkasq9o7SSPVcmN880w',
                          ),
                          
                          const SizedBox(height: 20),
                          
                          _buildFeatureCard(
                            context,
                            icon: Icons.auto_awesome,
                            title: 'AI Ranking',
                            subtitle: 'Best fixes prioritized first.',
                            imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyLi-YhLaiyDB9JFqiSsSGwlM1D5NLBjLRv1ylPMXUZBYvCvpI0wPiWkRAIrd4HUH3jIXQZT1v9gKR7YMa6bvuGe2zL9ykkzIpGgbF5Aq_Bgkzt-8jn8ZGpA9ntyRcH95l0fVmIsU9F6hdXG9Ez9TMYq-rEUIw_AEOmxMz3buqMUxmuKV1S4hPb3IcZOFvrbjG8Fr-Gi93jt7Yl-rv3sFiovtl23WNyK4VVn45Ju00pbbGTQtDDa1B91jKGuuF7sW9afHPd3vwIsZQ',
                          ),
                          
                          const Spacer(),
                        ],
                      ),
                    ),
                  ),
                  
                  // Footer / CTA
                  Padding(
                    padding: const EdgeInsets.all(24.0).copyWith(top: 48, bottom: 24),
                    child: Column(
                      children: [
                        // CTA Button
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: () async {
                              await Future.delayed(const Duration(milliseconds: 150));
                              if (context.mounted) {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => const LoginScreen(),
                                  ),
                                );
                              }
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF25d1f4),
                              foregroundColor: const Color(0xFF000000),
                              elevation: 0,
                              shadowColor: const Color(0xFF25d1f4).withValues(alpha: 0.3),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  'Start Saving Solutions',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward, size: 22),
                              ],
                            ),
                          ),
                        ),
                        
                        const SizedBox(height: 24),
                        
                        // Login link
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Text(
                              'Already have an account?',
                              style: TextStyle(
                                color: Color(0xFF64748b),
                                fontSize: 14,
                              ),
                            ),
                            MouseRegion(
                              cursor: SystemMouseCursors.click,
                              child: TextButton(
                                onPressed: () async {
                                  await Future.delayed(const Duration(milliseconds: 150));
                                  if (context.mounted) {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => const LoginScreen(),
                                      ),
                                    );
                                  }
                                },
                                style: TextButton.styleFrom(
                                  foregroundColor: const Color(0xFF25d1f4),
                                  padding: const EdgeInsets.symmetric(horizontal: 8),
                                ),
                                child: const Text(
                                  'Log in',
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildFeatureCard(
    BuildContext context, {
    required IconData icon,
    required String title,
    required String subtitle,
    required String imageUrl,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.03),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.08),
          width: 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            await Future.delayed(const Duration(milliseconds: 150));
            if (context.mounted) {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const LoginScreen(),
                ),
              );
            }
          },
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  flex: 3,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Icon(
                            icon,
                            color: const Color(0xFF25d1f4),
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            title,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: Color(0xFF94a3b8),
                          fontSize: 14,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    image: DecorationImage(
                      image: NetworkImage(imageUrl),
                      fit: BoxFit.cover,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
