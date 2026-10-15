import React from 'react';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

/**
 * PageHeader - Reusable header component for SakhiCare views.
 * Features:
 * - Back button with visible descriptive label and helper text
 * - Main <h1> title and subtitle
 * - Context badges and optional action slots
 */
export function PageHeader({
  title,
  description,
  badge = null,
  badgeVariant = 'rose',
  onBack = null,
  backLabel = 'Back to Home',
  backHelperText = 'Returns to your main health overview',
  action = null,
  className = ''
}) {
  return (
    <header className={`mb-6 pb-4 border-b border-stone-200/80 ${className}`}>
      {onBack && (
        <div className="mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            ariaLabel={backLabel}
            helperText={backHelperText}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            {backLabel}
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {title}
            </h1>
            {badge && (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {action && (
          <div className="flex-shrink-0 self-start sm:self-center">
            {action}
          </div>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
