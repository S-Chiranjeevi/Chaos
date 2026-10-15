import React from 'react';

/**
 * Reusable Card component for Luna Her.
 * Provides accessible container semantics, elevation styles, and clear slots.
 */
export function Card({
  children,
  as: Component = 'section',
  variant = 'default', // 'default' | 'elevated' | 'outlined' | 'interactive' | 'accent' | 'warning'
  className = '',
  title = null,
  subtitle = null,
  headerAction = null,
  footer = null,
  helperText = null,
  onClick = null,
  role = undefined,
  ariaLabel = undefined,
  ...props
}) {
  const baseCard = 'rounded-2xl transition-all duration-200 overflow-hidden';

  const variantStyles = {
    default: 'bg-white border border-stone-200/80 shadow-sm',
    elevated: 'bg-white border border-stone-200/60 shadow-md hover:shadow-lg',
    outlined: 'bg-stone-50/50 border border-stone-200 shadow-none',
    interactive: 'bg-white border border-stone-200 hover:border-rose-400 hover:shadow-md cursor-pointer active:scale-[0.99]',
    accent: 'bg-gradient-to-br from-rose-50/80 to-amber-50/50 border border-rose-200/70 shadow-sm',
    warning: 'bg-amber-50/70 border border-amber-200 shadow-sm'
  };

  const isClickable = Boolean(onClick);

  return (
    <Component
      className={`
        ${baseCard}
        ${variantStyles[variant] || variantStyles.default}
        ${isClickable ? 'cursor-pointer hover:border-rose-300 transition-colors' : ''}
        ${className}
      `}
      onClick={onClick}
      role={role || (isClickable ? 'button' : undefined)}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={ariaLabel || (typeof title === 'string' ? title : undefined)}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <header className="px-5 pt-4 pb-3 border-b border-stone-100 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-base font-semibold text-stone-900 tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-stone-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </header>
      )}

      <div className="p-5">
        {children}
      </div>

      {(footer || helperText) && (
        <footer className="px-5 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
          <div>
            {footer}
            {helperText && (
              <p className="text-[11px] text-stone-500 italic mt-0.5">
                {helperText}
              </p>
            )}
          </div>
        </footer>
      )}
    </Component>
  );
}

export default Card;
