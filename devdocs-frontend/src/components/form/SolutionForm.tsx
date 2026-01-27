/**
 * SolutionForm Component
 * Create/Edit solution form with real-time validation
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Button, Badge, CodePreview } from '@/components/ui';
import { useCreateSolution, useUpdateSolution } from '@/hooks';
import { LANGUAGES, VALIDATION } from '@/lib/constants';
import { triggerRealisticConfetti } from '@/lib/confetti';
import type { Solution, SolutionCreate, SolutionUpdate } from '@/lib/types';

// ============================================================================
// TYPES
// ============================================================================

interface SolutionFormProps {
  /**
   * Existing solution for edit mode (undefined for create mode)
   */
  solution?: Solution;
  
  /**
   * Form mode
   */
  mode: 'create' | 'edit';
  
  /**
   * Callback after successful submission
   */
  onSuccess?: (solution: Solution) => void;
  
  /**
   * Custom className
   */
  className?: string;
}

interface FormData {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  code?: string;
  language?: string;
  tags?: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function SolutionForm({
  solution,
  mode,
  onSuccess,
  className = '',
}: SolutionFormProps) {
  const router = useRouter();
  const createSolution = useCreateSolution();
  const updateSolution = useUpdateSolution();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: solution?.title || '',
    description: solution?.description || '',
    code: solution?.code || '',
    language: solution?.language || 'javascript',
    tags: solution?.tags?.join(', ') || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  function validateForm(): boolean {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < VALIDATION.TITLE.MIN) {
      newErrors.title = `Title must be at least ${VALIDATION.TITLE.MIN} characters`;
    } else if (formData.title.length > VALIDATION.TITLE.MAX) {
      newErrors.title = `Title must not exceed ${VALIDATION.TITLE.MAX} characters`;
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < VALIDATION.DESCRIPTION.MIN) {
      newErrors.description = `Description must be at least ${VALIDATION.DESCRIPTION.MIN} characters`;
    } else if (formData.description.length > VALIDATION.DESCRIPTION.MAX) {
      newErrors.description = `Description must not exceed ${VALIDATION.DESCRIPTION.MAX} characters`;
    }

    // Code validation
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required';
    } else if (formData.code.length < VALIDATION.CODE.MIN) {
      newErrors.code = `Code must be at least ${VALIDATION.CODE.MIN} characters`;
    } else if (formData.code.length > VALIDATION.CODE.MAX) {
      newErrors.code = `Code must not exceed ${VALIDATION.CODE.MAX} characters`;
    }

    // Language validation
    if (!formData.language) {
      newErrors.language = 'Language is required';
    }

    // Tags validation
    const tagsArray = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (tagsArray.length < 1) {
      newErrors.tags = `At least 1 tag is required`;
    } else if (tagsArray.length > VALIDATION.TAGS.MAX_COUNT) {
      newErrors.tags = `Maximum ${VALIDATION.TAGS.MAX_COUNT} tags allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim(),
        language: formData.language,
        tags: tagsArray,
      };

      let result: Solution;

      if (mode === 'create') {
        result = await createSolution.mutateAsync(data as SolutionCreate);
        // Celebrate successful creation!
        triggerRealisticConfetti();
      } else {
        result = await updateSolution.mutateAsync({
          id: solution!.id,
          data: data as SolutionUpdate,
        });
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        router.push(`/solution/${result.id}`);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      alert(error.response?.data?.detail || 'Failed to save solution. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle input change
  function handleChange(field: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Title */}
      <Input
        label="Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        hasError={!!errors.title}
        errorMessage={errors.title}
        helperText={`${formData.title.length}/${VALIDATION.TITLE.MAX} characters`}
        required
        placeholder="e.g., Binary Search Algorithm in Python"
      />

      {/* Description */}
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
        hasError={!!errors.description}
        errorMessage={errors.description}
        showCount
        maxLength={VALIDATION.DESCRIPTION.MAX}
        required
        placeholder="Describe what this solution does and when to use it..."
        rows={4}
      />

      {/* Code */}
      <div>
        <Textarea
          label="Code"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          hasError={!!errors.code}
          errorMessage={errors.code}
          showCount
          maxLength={VALIDATION.CODE.MAX}
          required
          placeholder="Paste your code here..."
          rows={12}
          className="font-mono text-sm"
        />
        
        {/* Live Code Preview */}
        {formData.code.trim() && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Live Preview
            </label>
            <CodePreview 
              code={formData.code} 
              language={formData.language}
              className="animate-fade-in"
            />
          </div>
        )}
      </div>

      {/* Language Dropdown */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Programming Language <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.language}
          onChange={(e) => handleChange('language', e.target.value)}
          className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-slate-600/50 transition-colors"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang.toLowerCase()} className="bg-slate-800 text-slate-100">
              {lang}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="mt-1 text-sm text-red-600">{errors.language}</p>
        )}
      </div>

      {/* Tags */}
      <div>
        <Input
          label="Tags"
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          hasError={!!errors.tags}
          errorMessage={errors.tags}
          helperText="Separate tags with commas (e.g., algorithm, sorting, array)"
          required
          placeholder="algorithm, data-structure, sorting"
        />
        
        {/* Tags Preview */}
        {formData.tags.trim() && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Preview:</span>
            {formData.tags
              .split(',')
              .map(t => t.trim())
              .filter(t => t.length > 0)
              .map((tag, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          {mode === 'create' ? 'Create Solution' : 'Update Solution'}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}