import React from 'react';
import { Button } from '../common/Button.jsx';

/**
 * GlobalError - Dedicated notification banner/area for application-wide alerts.
 * Semantic, accessible, and equipped with retry and dismiss options.
 */
export function GlobalError({
  error,
  onDismiss,
  onRetry = null,
  className = ''
}) {
  if (!error) return null;

  const title = typeof error === 'object' ? error.title || 'An Error Occurred' : 'System Notice';
  const message = typeof error === 'object' ? error.message : error;
  const code = typeof error === 'object' ? error.code : null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-slideDown ${className}`}
    >
      <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-4 shadow-xl text-red-950 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-red-600 text-white rounded-xl flex-shrink-0 mt-0.5" aria-hidden="true">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-red-950">
                {title}
              </h2>
              {code && (
                <span className="text-[10px] font-mono bg-red-200/70 text-red-800 px-1.5 py-0.5 rounded">
                  Code: {code}
                </span>
              )}
            </div>
            <p className="text-xs text-red-900 leading-relaxed">
              {message}
            </p>
            <p className="text-[11px] text-red-700">
              Your device data remains safe and stored locally.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
          {onRetry && (
            <Button
              variant="danger"
              size="sm"
              onClick={onRetry}
              ariaLabel="Retry failed operation"
              helperText="Re-attempts the failed action"
            >
              Retry
            </Button>
          )}

          {onDismiss && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDismiss}
              ariaLabel="Dismiss this error banner"
              helperText="Hides warning banner"
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalError;
