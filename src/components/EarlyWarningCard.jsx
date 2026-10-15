import React from 'react'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Plus,
  X,
  FileText,
  ShieldAlert,
} from 'lucide-react'
import { PatternExplanation } from './PatternExplanation.jsx'

/**
 * EarlyWarningCard Component
 *
 * Visual card representing a detected health pattern or clinical early warning.
 *
 * Color scheme per requirements:
 * - Red for Urgent
 * - Amber for Soon
 * - Blue/Green for Informational trends
 *
 * Rules:
 * - Do not diagnose.
 * - Do not call a pattern PCOS.
 * - Always show evidence.
 * - Allow users to dismiss non-urgent warnings.
 * - Provide 1-click "Add to doctor summary".
 */
export function EarlyWarningCard({
  warning,
  onDismiss,
  onToggleDoctorSummary,
  showExplanationDefault = false,
}) {
  if (!warning) return null

  const {
    id,
    title,
    message,
    urgency = 'info',
    suggestedAction,
    canDismiss = true,
    isAddedToDoctorSummary = false,
  } = warning

  // Styling maps based on required color logic
  const urgencyStyles = {
    urgent: {
      cardClass:
        'border-red-400/90 dark:border-red-500/70 bg-red-50/60 dark:bg-red-950/30 shadow-red-100/50 dark:shadow-red-950/40',
      badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200 border-red-300 dark:border-red-800',
      icon: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />,
      badgeLabel: 'Urgent Attention',
      headerTextClass: 'text-red-950 dark:text-red-100',
      actionBoxClass: 'bg-red-100/70 dark:bg-red-900/30 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-200',
    },
    soon: {
      cardClass:
        'border-amber-400/90 dark:border-amber-500/70 bg-amber-50/60 dark:bg-amber-950/30 shadow-amber-100/50 dark:shadow-amber-950/40',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
      badgeLabel: 'Discuss Soon',
      headerTextClass: 'text-amber-950 dark:text-amber-100',
      actionBoxClass: 'bg-amber-100/70 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-200',
    },
    info: {
      cardClass:
        'border-sky-300/90 dark:border-sky-700/70 bg-sky-50/60 dark:bg-sky-950/30 shadow-sky-100/50 dark:shadow-sky-950/40',
      badgeClass: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200 border-sky-300 dark:border-sky-800',
      icon: <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 flex-shrink-0" />,
      badgeLabel: 'Informational Trend',
      headerTextClass: 'text-sky-950 dark:text-sky-100',
      actionBoxClass: 'bg-sky-100/70 dark:bg-sky-900/30 border-sky-200 dark:border-sky-800/50 text-sky-900 dark:text-sky-200',
    },
  }

  const currentTheme = urgencyStyles[urgency] || urgencyStyles.info

  return (
    <div
      className={`early-warning-card rounded-2xl border p-5 transition-all duration-200 shadow-sm hover:shadow-md ${currentTheme.cardClass}`}
      role="article"
      aria-labelledby={`warning-title-${id}`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-start gap-2.5">
          {currentTheme.icon}
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${currentTheme.badgeClass}`}
              >
                {currentTheme.badgeLabel}
              </span>
              {urgency === 'urgent' && (
                <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <ShieldAlert size={12} />
                  Requires Clinical Action
                </span>
              )}
            </div>
            <h3
              id={`warning-title-${id}`}
              className={`text-base font-bold leading-snug ${currentTheme.headerTextClass}`}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Dismiss Button (if allowed) */}
        {canDismiss && onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(id)}
            title="Dismiss this warning from active view"
            aria-label="Dismiss warning"
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/50 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Plain Language Message */}
      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
        {message}
      </p>

      {/* Suggested Action Box */}
      {suggestedAction && (
        <div className={`suggested-action-box rounded-xl p-3 text-xs mb-3 border ${currentTheme.actionBoxClass}`}>
          <span className="font-bold uppercase tracking-wide block mb-0.5 text-[10.5px]">
            Suggested Next Step:
          </span>
          <p className="leading-normal font-medium">{suggestedAction}</p>
        </div>
      )}

      {/* Evidence Breakdown & "Why am I seeing this?" */}
      <PatternExplanation warning={warning} defaultExpanded={showExplanationDefault} />

      {/* Action Footer (Add to Doctor Summary + Dismiss button) */}
      <div className="card-action-footer flex items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex-wrap">
        <button
          type="button"
          onClick={() => onToggleDoctorSummary && onToggleDoctorSummary(id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            isAddedToDoctorSummary
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:border-rose-400 hover:text-rose-600'
          }`}
          aria-pressed={isAddedToDoctorSummary}
        >
          {isAddedToDoctorSummary ? (
            <>
              <Check size={14} className="text-white" />
              <span>Added to Doctor Summary</span>
            </>
          ) : (
            <>
              <Plus size={14} />
              <span>Add to Doctor Summary</span>
            </>
          )}
        </button>

        {canDismiss && onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(id)}
            className="text-xs font-medium text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 px-2 py-1 rounded-lg transition-colors"
          >
            Dismiss warning
          </button>
        )}
      </div>
    </div>
  )
}
