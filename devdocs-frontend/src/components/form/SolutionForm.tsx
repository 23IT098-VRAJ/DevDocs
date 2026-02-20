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
import { supabase } from '@/lib/supabase';
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
   * Callback when submitting state changes
   */
  onSubmittingChange?: (isSubmitting: boolean) => void;
  
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
  onSubmittingChange,
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
  const [suggestingTags, setSuggestingTags] = useState(false);

  // AI tag suggestion
  const handleSuggestTags = async () => {
    if (suggestingTags) return;
    setSuggestingTags(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_BASE}/api/solutions/suggest-tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          code: formData.code,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      if (Array.isArray(data.tags) && data.tags.length > 0) {
        const existing = formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
        const merged = Array.from(new Set([...existing, ...data.tags])).join(', ');
        setFormData(prev => ({ ...prev, tags: merged }));
      }
    } catch (err) {
      console.error('Tag suggestion failed:', err);
    } finally {
      setSuggestingTags(false);
    }
  };

  // Notify parent when submitting state changes
  useEffect(() => {
    if (onSubmittingChange) {
      onSubmittingChange(isSubmitting);
    }
  }, [isSubmitting, onSubmittingChange]);

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
    <form id="solution-form" onSubmit={handleSubmit} className={`space-y-8 ${className}`}>
      {/* Title Input - Large */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-base font-medium">
          Solution Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Asynchronous API Fetching in React"
          className="w-full rounded-lg text-white bg-black border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#07b9d5] focus:border-[#07b9d5] h-14 px-4 text-lg font-medium placeholder:text-white/40 transition-all"
        />
        {errors.title && (
          <p className="text-sm text-red-400">{errors.title}</p>
        )}
        <p className="text-xs text-white/40">{formData.title.length}/{VALIDATION.TITLE.MAX} characters</p>
      </div>

      {/* Description Input - With Markdown Note */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-base font-medium flex justify-between">
          <span>Context / Description <span className="text-red-500">*</span></span>
          <span className="text-xs text-white/50 font-normal">Markdown supported</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Explain the context, prerequisites, and how this solution works..."
          className="w-full rounded-lg text-white bg-black border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#07b9d5] focus:border-[#07b9d5] min-h-[140px] p-4 text-base placeholder:text-white/40 transition-all resize-y"
          rows={6}
        />
        {errors.description && (
          <p className="text-sm text-red-400">{errors.description}</p>
        )}
        <p className="text-xs text-white/40">{formData.description.length}/{VALIDATION.DESCRIPTION.MAX} characters</p>
      </div>

      {/* Language & Framework Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-base font-medium">
            Language <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full appearance-none rounded-lg text-white bg-black border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#07b9d5] focus:border-[#07b9d5] h-12 px-4 pr-10 text-base cursor-pointer transition-all [&>option]:bg-black [&>option]:text-white"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang.toLowerCase()} className="bg-black text-white">
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-white/40">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.language && (
            <p className="text-sm text-red-400">{errors.language}</p>
          )}
        </div>

        {/* Framework Input */}
        <div className="flex flex-col gap-2">
          <label className="text-white text-base font-medium">Framework / Lib</label>
          <input
            type="text"
            placeholder="e.g. React 18"
            className="w-full rounded-lg text-white bg-black border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#07b9d5] focus:border-[#07b9d5] h-12 px-4 text-base placeholder:text-white/40 transition-all"
          />
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-base font-medium flex justify-between items-center">
          <span>Code Implementation <span className="text-red-500">*</span></span>
          <button
            type="button"
            className="text-xs flex items-center gap-1 text-[#07b9d5] bg-[#07b9d5]/10 hover:bg-[#07b9d5]/20 px-3 py-1.5 rounded-lg border border-[#07b9d5]/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Format
          </button>
        </label>
        
        {/* Code Editor Container */}
        <div className="w-full rounded-xl overflow-hidden border border-white/20 bg-black backdrop-blur-sm shadow-xl flex flex-col group focus-within:ring-1 focus-within:ring-[#07b9d5]/50 focus-within:border-[#07b9d5]/50 transition-all">
          {/* Editor Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-black border-b border-white/20">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
              <span className="font-mono">code.{formData.language === 'javascript' ? 'js' : formData.language === 'typescript' ? 'ts' : formData.language === 'python' ? 'py' : 'txt'}</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                title="Copy code"
                className="text-white/40 hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Code Textarea */}
          <div className="relative">
            <textarea
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-[300px] bg-transparent border-none resize-none focus:ring-0 p-4 text-white font-mono text-sm leading-6 placeholder:text-white/30"
              spellCheck="false"
            />
          </div>
        </div>
        
        {errors.code && (
          <p className="text-sm text-red-400">{errors.code}</p>
        )}
        <p className="text-xs text-white/40">{formData.code.length}/{VALIDATION.CODE.MAX} characters</p>
        
        {/* Live Code Preview */}
        {formData.code.trim() && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-white/70 mb-2">
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

      {/* Tags Input with Chips */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-white text-base font-medium">
            Tags <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={handleSuggestTags}
            disabled={suggestingTags || !formData.title}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-[#07b9d5] border border-[#07b9d5]/30 hover:border-[#07b9d5]/60 hover:bg-[#07b9d5]/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title={!formData.title ? 'Add a title first' : 'Suggest tags with AI'}
          >
            {suggestingTags ? (
              <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            {suggestingTags ? 'Suggesting...' : 'AI Suggest'}
          </button>
        </div>
        <div className="w-full rounded-lg border border-white/20 bg-black focus-within:border-[#07b9d5] focus-within:ring-1 focus-within:ring-[#07b9d5] min-h-[3rem] px-2 py-1.5 flex flex-wrap items-center gap-2 transition-all cursor-text">
          {/* Tag Chips */}
          {formData.tags
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0)
            .map((tag, index) => (
              <div key={index} className="bg-[#07b9d5]/20 border border-[#07b9d5]/30 rounded-md px-2 py-1 flex items-center gap-1.5 group">
                <span className="text-[#07b9d5] text-sm font-medium">{tag}</span>
                <button
                  type="button"
                  onClick={() => {
                    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== tag);
                    handleChange('tags', tags.join(', '));
                  }}
                  className="text-[#07b9d5]/70 hover:text-[#07b9d5] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          {/* Input */}
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            placeholder="Add tag..."
            className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 min-w-[80px] flex-1 text-base h-8 p-0"
          />
        </div>
        {errors.tags && (
          <p className="text-sm text-red-400">{errors.tags}</p>
        )}
        <p className="text-xs text-white/40">Separate tags with commas</p>
      </div>
    </form>
  );
}