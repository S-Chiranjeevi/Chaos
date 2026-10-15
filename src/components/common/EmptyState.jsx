import React from 'react';
import { Button } from './Button.jsx';

/**
 * EmptyState - Accessible empty state with friendly visual,
 * descriptive text, and a prominent call-to-action with visible helper text.
 */
export function EmptyState({
  title = 'No Health Entries Recorded Yet',
  description = 'Your device health log is clean and empty. Record your first symptom, daily kick count, or question for your doctor.',
  helperText = 'Everything is stored strictly on this device without requiring internet.',
  actionLabel = 'Log First Entry',
  actionHelperText = 'Opens quick logging form',
  onAction = null,
  icon = null,
  className = ''
}) {
  return (
    <div
      role="region"
      aria-label="Empty state notification"
      className={`bg-white border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center flex flex-col items-center justify-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4 shadow-inner" aria-hidden="true">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-stone-600 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>

      {onAction && actionLabel && (
        <div className="flex flex-col items-center">
          <Button
            variant="primary"
            size="md"
            onClick={onAction}
            ariaLabel={actionLabel}
            helperText={actionHelperText}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            {actionLabel}
          </Button>
        </div>
      )}

      {helperText && (
        <p className="mt-4 text-[11px] text-stone-400">
          🔒 {helperText}
        </p>
      )}
    </div>
  );
}

export default EmptyState;
