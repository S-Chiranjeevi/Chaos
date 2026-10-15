import React, { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Activity, Stethoscope, CheckCircle2 } from 'lucide-react'

/**
 * PatternExplanation Component
 *
 * Renders the transparent evidence breakdown and educational "Why am I seeing this?"
 * section for an early warning pattern without medical diagnosis or jargon.
 */
export function PatternExplanation({ warning, defaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  if (!warning) return null

  const { evidence = {}, whyAmISeeingThis, suggestedAction, type } = warning

  return (
    <div className="pattern-explanation-container mt-3 pt-3 border-t border-stone-200/80 dark:border-stone-700/60">
      {/* Evidence Summary Strip */}
      <div className="evidence-summary-strip bg-stone-50 dark:bg-stone-800/60 rounded-xl p-3 mb-2 border border-stone-200/60 dark:border-stone-700/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
          <Activity size={13} className="text-stone-600 dark:text-stone-300" />
          <span>Recorded Evidence</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {Object.entries(evidence).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="col-span-2 sm:col-span-3 bg-white dark:bg-stone-900/60 rounded-lg p-2 border border-stone-200/40 dark:border-stone-700/30">
                  <span className="text-stone-500 dark:text-stone-400 font-medium capitalize block mb-1">
                    {formatEvidenceKey(key)}:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {value.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-mono"
                      >
                        {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                      </span>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <div
                key={key}
                className="bg-white dark:bg-stone-900/60 rounded-lg p-2 border border-stone-200/40 dark:border-stone-700/30"
              >
                <span className="text-stone-500 dark:text-stone-400 font-medium capitalize block truncate">
                  {formatEvidenceKey(key)}
                </span>
                <span className="text-stone-800 dark:text-stone-200 font-semibold text-sm">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expandable "Why am I seeing this?" Section */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/50 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-1.5">
          <HelpCircle size={14} className="text-rose-500" />
          <span className="font-semibold">Why am I seeing this?</span>
        </span>
        <span className="flex items-center gap-1 text-[11px] text-stone-400">
          <span>{isExpanded ? 'Hide explanation' : 'Read clinical context'}</span>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {isExpanded && (
        <div className="why-seeing-box mt-2 p-3.5 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 rounded-xl text-xs text-stone-700 dark:text-stone-300 space-y-2.5 animate-fadeIn">
          <div>
            <strong className="block text-stone-900 dark:text-stone-100 font-semibold mb-1">
              Biological &amp; Tracking Context:
            </strong>
            <p className="leading-relaxed">
              {whyAmISeeingThis ||
                'This observation is based on comparing your recorded entries against standard physiological reference ranges.'}
            </p>
          </div>

          <div className="pt-2 border-t border-rose-200/40 dark:border-rose-900/20">
            <strong className="flex items-center gap-1 text-stone-900 dark:text-stone-100 font-semibold mb-1">
              <Stethoscope size={13} className="text-rose-600 dark:text-rose-400" />
              <span>Recommended Discussion with Healthcare Provider:</span>
            </strong>
            <p className="leading-relaxed text-stone-600 dark:text-stone-400">
              {suggestedAction}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 italic pt-1">
            <CheckCircle2 size={12} className="text-emerald-600 flex-shrink-0" />
            <span>Luna Her shares patterns for self-advocacy. This is information, not a diagnosis.</span>
          </div>
        </div>
      )}
    </div>
  )
}

function formatEvidenceKey(key) {
  // Convert camelCase or snake_case to readable words
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
}
