import React, { useState } from 'react';
import { Badge } from './Badge.jsx';

/**
 * DisclaimerBanner - Communicates both Medical Safety and Local-Only Privacy guarantees.
 * Includes visible toggle to read detailed offline safety protocols.
 */
export function DisclaimerBanner({
  type = 'medical', // 'medical' | 'privacy' | 'combined'
  dismissible = false,
  className = ''
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isDismissed) return null;

  return (
    <aside
      aria-label="Medical and privacy safety disclaimer"
      className={`bg-stone-50 border-l-4 border-rose-600 rounded-r-xl p-4 shadow-sm text-stone-800 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-rose-100/80 text-rose-800 rounded-lg flex-shrink-0" aria-hidden="true">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-stone-900">
                Medical & Privacy Safety Notice
              </h2>
              <Badge variant="rose" size="sm">Advisory Only</Badge>
              <Badge variant="emerald" size="sm" showDot>Local Device Only</Badge>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              SakhiCare offers supportive educational health information and is <strong>not a medical diagnostic tool</strong>.
              Always consult your doctor, ANM, or local healthcare provider for clinical medical advice.
            </p>

            {isExpanded && (
              <div className="pt-2 text-xs text-stone-600 space-y-2 border-t border-stone-200 mt-2">
                <p>
                  🔒 <strong>Device Privacy Guarantee:</strong> Every voice note, symptom log, and cycle date remains exclusively inside this browser/device. No audio or personal health data is uploaded to remote servers.
                </p>
                <p>
                  🚨 <strong>Emergency Situations:</strong> If experiencing acute bleeding, sudden high fever, severe pain, or severe breathlessness, contact <strong>108 / 102</strong> or proceed to the nearest hospital emergency room immediately.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-start flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 text-xs font-medium text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? 'Hide detailed safety protocols' : 'Show detailed safety protocols'}
          >
            {isExpanded ? 'Hide Details' : 'Read Full Safety Notice'}
          </button>

          {dismissible && (
            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md focus:outline-none focus:ring-2 focus:ring-stone-400"
              aria-label="Dismiss disclaimer banner for this session"
            >
              <span className="text-xs font-semibold px-1">✕ Dismiss</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

export default DisclaimerBanner;
