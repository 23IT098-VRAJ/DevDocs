import 'package:flutter/material.dart';
import '../services/devdocs_api_service.dart';
import '../models/solution.dart';

class SaveSolutionScreen extends StatefulWidget {
  final Solution? solutionToEdit; // null = create, non-null = edit

  const SaveSolutionScreen({super.key, this.solutionToEdit});

  @override
  State<SaveSolutionScreen> createState() => _SaveSolutionScreenState();
}

class _SaveSolutionScreenState extends State<SaveSolutionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _codeController = TextEditingController();
  final _tagController = TextEditingController();
  // All languages the dropdown supports (lowercase, must match backend values)
  static const List<String> _supportedLanguages = [
    'python', 'javascript', 'typescript', 'java', 'go', 'rust',
    'c++', 'csharp', 'php', 'ruby', 'swift', 'kotlin',
    'css', 'html', 'sql', 'bash', 'dart', 'scala', 'r',
  ];

  String _selectedLanguage = 'python';
  final List<String> _tags = [];
  bool _isLoading = false;
  final _apiService = DevDocsApiService();

  bool get _isEditing => widget.solutionToEdit != null;

  @override
  void initState() {
    super.initState();
    // Pre-fill fields when editing an existing solution
    if (_isEditing) {
      final s = widget.solutionToEdit!;
      _titleController.text = s.title;
      _descriptionController.text = s.description;
      _codeController.text = s.code;
      // Use the solution's language if supported, otherwise keep default
      final lang = s.language.toLowerCase();
      _selectedLanguage = _supportedLanguages.contains(lang) ? lang : 'python';
      _tags.addAll(s.tags);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _codeController.dispose();
    _tagController.dispose();
    super.dispose();
  }

  // ========================================================================
  // VALIDATION FUNCTIONS (Match Backend Requirements)
  // ========================================================================
  
  String? validateTitle(String? value) {
    if (value == null || value.isEmpty) {
      return 'Title is required';
    }
    if (value.length < 5) {
      return 'Title must be at least 5 characters';
    }
    if (value.length > 200) {
      return 'Title must not exceed 200 characters';
    }
    return null;
  }

  String? validateDescription(String? value) {
    if (value == null || value.isEmpty) {
      return 'Description is required';
    }
    if (value.length < 20) {
      return 'Description must be at least 20 characters';
    }
    if (value.length > 2000) {
      return 'Description must not exceed 2000 characters';
    }
    return null;
  }

  String? validateCode(String? value) {
    if (value == null || value.isEmpty) {
      return 'Code is required';
    }
    if (value.length < 10) {
      return 'Code must be at least 10 characters';
    }
    if (value.length > 5000) {
      return 'Code must not exceed 5000 characters';
    }
    return null;
  }

  String? validateLanguage(String? value) {
    if (value == null || value.isEmpty) {
      return 'Language is required';
    }
    return null;
  }

  void _addTag(String tag) {
    final trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag.isNotEmpty && !_tags.contains(trimmedTag)) {
      if (_tags.length < 20) {
        setState(() {
          _tags.add(trimmedTag);
        });
        _tagController.clear();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Maximum 20 tags allowed')),
        );
      }
    }
  }

  void _removeTag(String tag) {
    setState(() {
      _tags.remove(tag);
    });
  }

  Future<void> _saveSolution() async {
    print('\n═══════════════════════════════════════');
    print(_isEditing ? '✏️ UPDATE SOLUTION START' : '💾 SAVE SOLUTION START');
    print('═══════════════════════════════════════');

    if (!_formKey.currentState!.validate()) {
      print('❌ Form validation failed');
      return;
    }

    if (_tags.isEmpty) {
      print('❌ No tags provided');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('At least one tag is required'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      Solution solution;

      if (_isEditing) {
        // ── UPDATE existing solution ──
        final update = SolutionUpdate(
          title: _titleController.text.trim(),
          description: _descriptionController.text.trim(),
          code: _codeController.text,
          language: _selectedLanguage,
          tags: _tags,
        );
        print('🔄 Updating solution ${widget.solutionToEdit!.id}...');
        solution = await _apiService.updateSolution(widget.solutionToEdit!.id, update);
        print('✅ Solution updated successfully!');
      } else {
        // ── CREATE new solution ──
        final solutionCreate = SolutionCreate(
          title: _titleController.text.trim(),
          description: _descriptionController.text.trim(),
          code: _codeController.text,
          language: _selectedLanguage,
          tags: _tags,
        );

        final validationError = solutionCreate.validate();
        if (validationError != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(validationError), backgroundColor: Colors.red),
          );
          setState(() => _isLoading = false);
          return;
        }

        print('🔄 Sending to API...');
        solution = await _apiService.createSolution(solutionCreate);
        print('✅ Solution saved successfully!');
      }

      print('   ID: ${solution.id}');
      print('   Title: ${solution.title}');
      print('═══════════════════════════════════════\n');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
                _isEditing
                    ? 'Solution "${solution.title}" updated!'
                    : 'Solution "${solution.title}" saved!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context, solution); // Return updated/created solution
      }
    } catch (e) {
      print('❌ OPERATION FAILED!');
      print('   Error: $e');
      print('═══════════════════════════════════════\n');

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: ${e.toString().replaceAll('Exception: ', '')}'),
            backgroundColor: Colors.red,
            duration: const Duration(seconds: 5),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF000000),
      body: Form(
        key: _formKey,
        child: Column(
          children: [
            // Top App Bar
            SafeArea(
              bottom: false,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text(
                        'Cancel',
                        style: TextStyle(
                          color: Color(0xFF9cb5ba),
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Text(
                      _isEditing ? 'Edit Solution' : 'New Solution',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 70),
                  ],
                ),
              ),
            ),
            
            // Progress Bar
            Container(
              height: 4,
              width: double.infinity,
              color: const Color(0xFF000000),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: _tags.isEmpty ? 0.33 : (_tags.length >= 3 ? 1.0 : 0.66),
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF25d1f4),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF25d1f4).withValues(alpha: 0.5),
                        blurRadius: 10,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title Field (5-200 chars)
                    _buildLabel('Title *', '5-200 characters'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _titleController,
                      validator: validateTitle,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                      decoration: _buildInputDecoration(
                        'e.g. Implement JWT Authentication in Node.js',
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Language Selector
                    _buildLabel('Language *', 'Must be lowercase'),
                    const SizedBox(height: 8),
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF000000),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF2a3e42)),
                      ),
                      child: DropdownButtonFormField<String>(
                        initialValue: _selectedLanguage,
                        validator: validateLanguage,
                        isExpanded: true,
                        dropdownColor: const Color(0xFF000000),
                        icon: const Icon(
                          Icons.expand_more,
                          color: Color(0xFF6b7280),
                        ),
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                        ),
                        decoration: const InputDecoration(
                          border: InputBorder.none,
                          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                        borderRadius: BorderRadius.circular(12),
                        items: _supportedLanguages.map((lang) {
                          final display = const {
                            'c++': 'C++',
                            'csharp': 'C#',
                            'sql': 'SQL',
                            'html': 'HTML',
                            'css': 'CSS',
                            'r': 'R',
                          }[lang] ?? (lang[0].toUpperCase() + lang.substring(1));
                          return DropdownMenuItem(value: lang, child: Text(display));
                        }).toList(),
                        onChanged: (value) {
                          if (value != null) {
                            setState(() => _selectedLanguage = value);
                          }
                        },
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Description Field (20-2000 chars)
                    _buildLabel('Description *', '20-2000 characters'),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _descriptionController,
                      validator: validateDescription,
                      maxLines: 4,
                      style: const TextStyle(color: Colors.white, fontSize: 16),
                      decoration: _buildInputDecoration(
                        'Explain what this solution does, when to use it, edge cases...',
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Code Field (10-5000 chars)
                    _buildLabel('Solution Code *', '10-5000 characters'),
                    const SizedBox(height: 8),
                    Container(
                      height: 250,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0b1214),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF2a3e42)),
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Line Numbers
                          Container(
                            width: 40,
                            decoration: const BoxDecoration(
                              color: Color(0xFF0d1618),
                              border: Border(
                                right: BorderSide(
                                  color: Color(0xFF1a2527),
                                  width: 1,
                                ),
                              ),
                              borderRadius: BorderRadius.only(
                                topLeft: Radius.circular(12),
                                bottomLeft: Radius.circular(12),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const SizedBox(height: 14),
                                ...List.generate(
                                  7,
                                  (index) => Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 3),
                                    child: Text(
                                      '${index + 1}',
                                      style: const TextStyle(
                                        color: Color(0xFF475569),
                                        fontSize: 12,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          
                          // Code Input
                          Expanded(
                            child: TextFormField(
                              controller: _codeController,
                              validator: validateCode,
                              maxLines: null,
                              expands: true,
                              style: const TextStyle(
                                color: Color(0xFFd1d5db),
                                fontSize: 14,
                                fontFamily: 'monospace',
                                height: 1.5,
                              ),
                              decoration: const InputDecoration(
                                hintText: '// Paste your code here...\n// Example: function reverseArray(arr) { ... }',
                                hintStyle: TextStyle(
                                  color: Color(0xFF475569),
                                  fontFamily: 'monospace',
                                ),
                                border: InputBorder.none,
                                errorBorder: InputBorder.none,
                                focusedErrorBorder: InputBorder.none,
                                contentPadding: EdgeInsets.all(14),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 24),
                    
                    // Tags Field (1-20 items, required)
                    _buildLabel('Tags * (1-20 required)', 'Press Enter or + to add'),
                    const SizedBox(height: 8),
                    
                    // Tags Input
                    Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF000000),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _tags.isEmpty ? Colors.red.withValues(alpha: 0.3) : const Color(0xFF2a3e42),
                        ),
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      child: Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _tagController,
                              style: const TextStyle(color: Colors.white, fontSize: 16),
                              decoration: InputDecoration(
                                hintText: _tags.isEmpty ? 'e.g. authentication, jwt, security' : 'Add another tag...',
                                hintStyle: const TextStyle(color: Color(0xFF6b7280)),
                                border: InputBorder.none,
                                isDense: true,
                              ),
                              onSubmitted: (value) {
                                if (value.isNotEmpty) {
                                  _addTag(value);
                                }
                              },
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.add_circle, color: Color(0xFF25d1f4)),
                            onPressed: () {
                              if (_tagController.text.isNotEmpty) {
                                _addTag(_tagController.text);
                              }
                            },
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 12),
                    
                    // Tags Display
                    if (_tags.isNotEmpty)
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: _tags.map((tag) => Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          decoration: BoxDecoration(
                            color: const Color(0xFF25d1f4).withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: const Color(0xFF25d1f4).withValues(alpha: 0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                tag,
                                style: const TextStyle(
                                  color: Color(0xFF25d1f4),
                                  fontSize: 14,
                                ),
                              ),
                              const SizedBox(width: 6),
                              GestureDetector(
                                onTap: () => _removeTag(tag),
                                child: const Icon(
                                  Icons.close,
                                  size: 16,
                                  color: Color(0xFF25d1f4),
                                ),
                              ),
                            ],
                          ),
                        )).toList(),
                      ),
                    
                    if (_tags.isEmpty)
                      const Text(
                        '⚠️ At least one tag is required',
                        style: TextStyle(
                          color: Colors.red,
                          fontSize: 12,
                        ),
                      ),
                    
                    const SizedBox(height: 8),
                    
                    // Helper Text
                    Row(
                      children: [
                        const Icon(
                          Icons.info_outline,
                          size: 16,
                          color: Color(0xFF6b7280),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Tags: ${_tags.length}/20 | All tags will be lowercase',
                          style: const TextStyle(
                            color: Color(0xFF6b7280),
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      
      // Sticky Footer Button
      bottomNavigationBar: Container(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(context).padding.bottom + 20,
        ),
        decoration: BoxDecoration(
          color: const Color(0xFF000000),
          border: Border(
            top: BorderSide(
              color: Colors.white.withValues(alpha: 0.05),
              width: 1,
            ),
          ),
        ),
        child: ElevatedButton(
          onPressed: _isLoading ? null : _saveSolution,
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFF25d1f4),
            foregroundColor: const Color(0xFF000000),
            padding: const EdgeInsets.symmetric(vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
            shadowColor: const Color(0xFF25d1f4).withValues(alpha: 0.2),
          ),
          child: _isLoading
              ? Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Color(0xFF000000),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      _isEditing ? 'Updating...' : 'Saving...',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(_isEditing ? Icons.edit : Icons.save, size: 24),
                    const SizedBox(width: 8),
                    Text(
                      _isEditing ? 'Update Solution' : 'Save Solution',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text, String hint) {
    return Row(
      children: [
        Text(
          text,
          style: const TextStyle(
            color: Color(0xFFd1d5db),
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          hint,
          style: const TextStyle(
            color: Color(0xFF6b7280),
            fontSize: 11,
          ),
        ),
      ],
    );
  }

  InputDecoration _buildInputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Color(0xFF6b7280)),
      filled: true,
      fillColor: const Color(0xFF000000),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF2a3e42)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF2a3e42)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFF25d1f4)),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.red),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.red),
      ),
      contentPadding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 14,
      ),
    );
  }
}
