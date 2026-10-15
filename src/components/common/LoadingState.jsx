import React from 'react';

/**
 * LoadingState - Accessible loading state with spinner or skeleton cards
 * and descriptive assistive text.
 */
export function LoadingState({
  message = 'Loading your health records...',
  helperText = 'Retrieving encrypted offline data from local device storage...',
  variant = 'spinner', // 'spinner' | 'skeleton'
  count = 3,
  className = ''
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`py-8 px-4 flex flex-col items-center justify-center text-center ${className}`}
    >
      {variant === 'spinner' ? (
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-12 mb-3">
            <div className="absolute inset-0 rounded-full border-4 border-rose-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-rose-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-semibold text-stone-800">
            {message}
          </p>
          {helperText && (
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              {helperText}
            </p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-stone-500 animate-pulse">
              {message}
            </p>
            <span className="text-[11px] text-stone-400">Encrypted Local Fetch</span>
          </div>
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200/80 rounded-2xl p-4 animate-pulse space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 bg-stone-200 rounded-md w-1/3"></div>
                <div className="h-3 bg-stone-200 rounded-full w-16"></div>
              </div>
              <div className="h-3 bg-stone-100 rounded-md w-3/4"></div>
              <div className="h-3 bg-stone-100 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      )}
      <span className="sr-only">Data is currently loading. Please wait.</span>
    </div>
  );
}

export default LoadingState;
