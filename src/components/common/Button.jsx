import React from 'react';

/**
 * Accessible Button component with visible text, optional visible helper text,
 * semantic styling, and multiple variants.
 * 
 * Note: Per accessibility and design requirements, all buttons have clear visible labels
 * and supportive visible helper text.
 */
export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'warm'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  iconPosition = 'left',
  helperText = null,
  disabled = false,
  isLoading = false,
  fullWidth = false,
  ariaLabel,
  id,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex flex-col items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] shadow-sm';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base'
  };

  const variantStyles = {
    primary: 'bg-rose-700 hover:bg-rose-800 text-white focus:ring-rose-500 border border-transparent shadow-rose-100',
    secondary: 'bg-emerald-700 hover:bg-emerald-800 text-white focus:ring-emerald-500 border border-transparent',
    outline: 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 focus:ring-rose-500 hover:border-stone-400',
    danger: 'bg-red-700 hover:bg-red-800 text-white focus:ring-red-500 border border-transparent shadow-red-100',
    ghost: 'bg-transparent hover:bg-rose-50 text-stone-700 hover:text-rose-900 border border-transparent shadow-none',
    warm: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500 border border-transparent'
  };

  const buttonId = id || (ariaLabel ? `btn-${ariaLabel.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : undefined);
  const helperId = helperText && buttonId ? `${buttonId}-helper` : undefined;

  return (
    <div className={`inline-flex flex-col ${fullWidth ? 'w-full' : 'w-auto'}`}>
      <button
        id={buttonId}
        type={type}
        onClick={onClick}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-describedby={helperId}
        aria-busy={isLoading}
        className={`
          ${baseStyles}
          ${sizeStyles[size] || sizeStyles.md}
          ${variantStyles[variant] || variantStyles.primary}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        <span className="inline-flex items-center gap-2">
          {isLoading ? (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : icon && iconPosition === 'left' ? (
            <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
          ) : null}

          <span className="font-semibold tracking-wide">
            {isLoading ? 'Processing...' : children}
          </span>

          {!isLoading && icon && iconPosition === 'right' ? (
            <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
          ) : null}
        </span>
      </button>

      {/* Visible descriptive helper text */}
      {helperText && (
        <span
          id={helperId}
          className="mt-1 text-[11px] leading-tight text-stone-500 text-center font-normal"
        >
          {helperText}
        </span>
      )}
    </div>
  );
}
export default Button;
