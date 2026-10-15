import React from 'react';
import { Calendar, Clock, AlertCircle, Info, Sparkles } from 'lucide-react';
import { formatDisplayDate } from '../../services/cycleCalculations.js';

export function UpcomingPeriodCard({ predictionResult }) {
  const {
    status,
    expectedNextPeriod,
    uncertaintyInfo,
    dataQualityWarnings = [],
    stats = {},
  } = predictionResult || {};

  const hasEstimate = expectedNextPeriod && expectedNextPeriod.mostLikelyDate;
  const isInsufficient = status === 'insufficient_history' || !stats.totalCycles;

  return (
    <div className="bg-gradient-to-br from-rose-50/70 via-white to-stone-50 rounded-3xl p-5 sm:p-6 border border-rose-200/60 shadow-sm relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-rose-100/40 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
            <Clock className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-base">
              Upcoming Period Estimate
            </h3>
            <p className="text-[11px] text-stone-500">
              Projected range based on your recorded cycle history
            </p>
          </div>
        </div>

        {hasEstimate && expectedNextPeriod.daysUntilWindow !== null && (
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            expectedNextPeriod.daysUntilWindow < 0
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : expectedNextPeriod.daysUntilWindow <= 3
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}>
            {expectedNextPeriod.daysUntilWindow < 0
              ? `${Math.abs(expectedNextPeriod.daysUntilWindow)} days past expected window`
              : expectedNextPeriod.daysUntilWindow === 0
              ? 'Expected today'
              : `Expected in ~${expectedNextPeriod.daysUntilWindow} days`}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      {hasEstimate ? (
        <div className="space-y-3">
          <div className="p-4 bg-white/90 rounded-2xl border border-rose-100 shadow-xs">
            <span className="text-[11px] font-semibold tracking-wider text-rose-600 uppercase block mb-1">
              Estimated Expected Window
            </span>
            <div className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {expectedNextPeriod.windowText}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Most probable start day around <span className="font-medium text-stone-800">{formatDisplayDate(expectedNextPeriod.mostLikelyDate)}</span>
            </p>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-stone-50/80 rounded-xl text-xs text-stone-600 border border-stone-200/50">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p>
                <strong className="text-stone-800 font-medium">Why a date range?</strong> Menstrual cycles naturally vary by a few days each month based on sleep, stress, and lifestyle. Presenting a range reflects healthy physiological variability rather than false exactness.
              </p>
              {uncertaintyInfo?.description && (
                <p className="text-[11px] text-stone-500">
                  {uncertaintyInfo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-5 px-3 bg-white/70 rounded-2xl border border-stone-200/60">
          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-stone-800 text-sm mb-1">
            Need At Least 2 Period Dates
          </h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Cycle lengths can only be measured between two consecutive period start dates. Once you log your next period, an expected window will appear here automatically.
          </p>
        </div>
      )}

      {/* Warnings & Data Quality */}
      {dataQualityWarnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-rose-100/70 space-y-1.5">
          {dataQualityWarnings.map((warn, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/40">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
