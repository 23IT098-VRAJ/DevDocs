/**
 * Language Icon Mappings
 * SVG icons and colors for programming languages
 */

export interface LanguageConfig {
  icon: string;
  color: string;
  gradient: string;
}

export const LANGUAGE_ICONS: Record<string, LanguageConfig> = {
  javascript: {
    icon: '⚡',
    color: 'text-yellow-400',
    gradient: 'from-yellow-500 to-yellow-600',
  },
  typescript: {
    icon: '📘',
    color: 'text-blue-400',
    gradient: 'from-blue-500 to-blue-600',
  },
  python: {
    icon: '🐍',
    color: 'text-blue-300',
    gradient: 'from-blue-400 to-yellow-400',
  },
  java: {
    icon: '☕',
    color: 'text-red-400',
    gradient: 'from-red-500 to-orange-500',
  },
  go: {
    icon: '🔷',
    color: 'text-cyan-400',
    gradient: 'from-cyan-400 to-blue-400',
  },
  rust: {
    icon: '🦀',
    color: 'text-orange-400',
    gradient: 'from-orange-500 to-orange-600',
  },
  cpp: {
    icon: '⚙️',
    color: 'text-blue-500',
    gradient: 'from-blue-600 to-indigo-600',
  },
  csharp: {
    icon: '#️⃣',
    color: 'text-purple-400',
    gradient: 'from-purple-500 to-indigo-500',
  },
  ruby: {
    icon: '💎',
    color: 'text-red-500',
    gradient: 'from-red-600 to-rose-600',
  },
  php: {
    icon: '🐘',
    color: 'text-indigo-400',
    gradient: 'from-indigo-500 to-purple-500',
  },
  swift: {
    icon: '🔶',
    color: 'text-orange-500',
    gradient: 'from-orange-400 to-red-500',
  },
  kotlin: {
    icon: '🟣',
    color: 'text-purple-500',
    gradient: 'from-purple-600 to-pink-600',
  },
  sql: {
    icon: '🗄️',
    color: 'text-cyan-500',
    gradient: 'from-cyan-500 to-blue-500',
  },
  bash: {
    icon: '💻',
    color: 'text-green-400',
    gradient: 'from-green-500 to-emerald-500',
  },
  html: {
    icon: '🌐',
    color: 'text-orange-500',
    gradient: 'from-orange-600 to-red-600',
  },
  css: {
    icon: '🎨',
    color: 'text-blue-500',
    gradient: 'from-blue-500 to-cyan-500',
  },
  default: {
    icon: '📄',
    color: 'text-slate-400',
    gradient: 'from-slate-500 to-slate-600',
  },
};

/**
 * Get language configuration
 */
export function getLanguageConfig(language: string): LanguageConfig {
  const normalized = language.toLowerCase().trim();
  return LANGUAGE_ICONS[normalized] || LANGUAGE_ICONS.default;
}

/**
 * Language Icon Component Props
 */
export interface LanguageIconProps {
  language: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * Language Icon Component
 * Display language with icon and gradient background
 */
export function LanguageIcon({ language, size = 'md', showLabel = true, className = '' }: LanguageIconProps) {
  const config = getLanguageConfig(language);
  
  const sizeClasses = {
    sm: 'text-base px-2 py-0.5',
    md: 'text-lg px-2.5 py-1',
    lg: 'text-xl px-3 py-1.5',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${config.gradient} bg-opacity-20 backdrop-blur-sm border border-white/10 font-medium ${sizeClasses[size]} ${className}`}
    >
      <span className="flex-shrink-0">{config.icon}</span>
      {showLabel && (
        <span className={`${config.color} ${labelSizeClasses[size]}`}>
          {language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
      )}
    </span>
  );
}
