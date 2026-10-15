import React from 'react';

/**
 * Accessible Badge component with color schemes and optional status indicator dot.
 */
export function Badge({
  children,
  variant = 'default', // 'default' | 'rose' | 'emerald' | 'amber' | 'danger' | 'purple' | 'blue'
  size = 'md', // 'sm' | 'md'
  showDot = false,
  className = '',
  srLabel = null,
  ...props
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5'
  };

  const variantStyles = {
    default: 'bg-stone-100 text-stone-700 border-stone-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-red-50 text-red-800 border-red-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
    blue: 'bg-sky-50 text-sky-800 border-sky-200'
  };

  const dotColors = {
    default: 'bg-stone-400',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    danger: 'bg-red-600 animate-pulse',
    purple: 'bg-purple-500',
    blue: 'bg-sky-500'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
      {...props}
    >
      {srLabel && <span className="sr-only">{srLabel}: </span>}
      {showDot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
