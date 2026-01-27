/**
 * Tag Colors and Utilities
 * Gradient color mappings for different tag categories
 */

export interface TagColor {
  gradient: string;
  hover: string;
  text: string;
  border: string;
}

/**
 * Tag color schemes based on tag content
 * Uses gradient backgrounds with matching borders and text colors
 */
export const TAG_COLORS: Record<string, TagColor> = {
  // Language tags
  javascript: {
    gradient: 'from-yellow-500/20 to-yellow-600/20',
    hover: 'hover:from-yellow-500/30 hover:to-yellow-600/30',
    text: 'text-yellow-400',
    border: 'border-yellow-500/50',
  },
  typescript: {
    gradient: 'from-cyan-400/20 to-cyan-600/20',
    hover: 'hover:from-cyan-400/30 hover:to-cyan-600/30',
    text: 'text-cyan-400',
    border: 'border-cyan-400/50',
  },
  python: {
    gradient: 'from-cyan-400/20 to-cyan-500/20',
    hover: 'hover:from-cyan-400/30 hover:to-cyan-500/30',
    text: 'text-cyan-300',
    border: 'border-cyan-400/50',
  },
  java: {
    gradient: 'from-red-500/20 to-orange-500/20',
    hover: 'hover:from-red-500/30 hover:to-orange-500/30',
    text: 'text-red-400',
    border: 'border-red-500/50',
  },
  go: {
    gradient: 'from-cyan-300/20 to-cyan-500/20',
    hover: 'hover:from-cyan-300/30 hover:to-cyan-500/30',
    text: 'text-cyan-400',
    border: 'border-cyan-400/50',
  },
  rust: {
    gradient: 'from-orange-500/20 to-orange-600/20',
    hover: 'hover:from-orange-500/30 hover:to-orange-600/30',
    text: 'text-orange-400',
    border: 'border-orange-500/50',
  },

  // Category tags
  algorithm: {
    gradient: 'from-purple-500/20 to-purple-600/20',
    hover: 'hover:from-purple-500/30 hover:to-purple-600/30',
    text: 'text-purple-400',
    border: 'border-purple-500/50',
  },
  'data-structure': {
    gradient: 'from-green-500/20 to-green-600/20',
    hover: 'hover:from-green-500/30 hover:to-green-600/30',
    text: 'text-green-400',
    border: 'border-green-500/50',
  },
  sorting: {
    gradient: 'from-pink-500/20 to-rose-600/20',
    hover: 'hover:from-pink-500/30 hover:to-rose-600/30',
    text: 'text-pink-400',
    border: 'border-pink-500/50',
  },
  database: {
    gradient: 'from-indigo-500/20 to-indigo-600/20',
    hover: 'hover:from-indigo-500/30 hover:to-indigo-600/30',
    text: 'text-indigo-400',
    border: 'border-indigo-500/50',
  },
  api: {
    gradient: 'from-teal-500/20 to-cyan-600/20',
    hover: 'hover:from-teal-500/30 hover:to-cyan-600/30',
    text: 'text-teal-400',
    border: 'border-teal-500/50',
  },
  async: {
    gradient: 'from-fuchsia-500/20 to-pink-600/20',
    hover: 'hover:from-fuchsia-500/30 hover:to-pink-600/30',
    text: 'text-fuchsia-400',
    border: 'border-fuchsia-500/50',
  },
  security: {
    gradient: 'from-red-600/20 to-rose-700/20',
    hover: 'hover:from-red-600/30 hover:to-rose-700/30',
    text: 'text-red-400',
    border: 'border-red-600/50',
  },
  performance: {
    gradient: 'from-lime-500/20 to-green-600/20',
    hover: 'hover:from-lime-500/30 hover:to-green-600/30',
    text: 'text-lime-400',
    border: 'border-lime-500/50',
  },
  testing: {
    gradient: 'from-amber-500/20 to-orange-600/20',
    hover: 'hover:from-amber-500/30 hover:to-orange-600/30',
    text: 'text-amber-400',
    border: 'border-amber-500/50',
  },

  // Default for unknown tags
  default: {
    gradient: 'from-slate-500/20 to-slate-600/20',
    hover: 'hover:from-slate-500/30 hover:to-slate-600/30',
    text: 'text-slate-400',
    border: 'border-slate-500/50',
  },
};

/**
 * Get tag color scheme based on tag name
 * Falls back to default if tag not found
 */
export function getTagColor(tag: string): TagColor {
  const normalized = tag.toLowerCase().trim();
  return TAG_COLORS[normalized] || TAG_COLORS.default;
}

/**
 * Generate className string for a tag
 */
export function getTagClassName(tag: string): string {
  const color = getTagColor(tag);
  return `bg-gradient-to-r ${color.gradient} ${color.hover} ${color.text} border ${color.border}`;
}
