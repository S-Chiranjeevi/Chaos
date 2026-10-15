import React from 'react';
import { Activity, ShieldCheck, HelpCircle, Layers, FileText } from 'lucide-react';

export function CycleInsightsCard({ predictionResult }) {
  const {
    irregularityCategory = 'insufficient_data',
    estimatedIrregularity,
    explanation,
    stats = {},
    modelVersion,
    engineType,
    uncertaintyInfo,
  } = predictionResult || {};

  const totalCycles = stats.totalCycles || 0;
  const isInsufficient = totalCycles < 2;

  // Category styling
  const badgeConfig = {
    regular: {
      label: 'Typical Cycle Regularity',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Your recorded intervals fall within the standard 21–35 day clinical range with low variability.',
    },
    variable: {
      label: 'Variable Cycle Lengths',
      className: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Your cycle lengths fluctuate by 8 or more days. This is common during stress, illness, or hormonal shifts.',
    },
    irregular: {
      label: 'Infrequent / Long Cycles (Oligomenorrhea Pattern)',
      className: 'bg-rose-50 text-rose-800 border-rose-200',
      description: 'Recorded cycles average over 35 days. This pattern is frequently evaluated for hormonal balance or PCOS.',
    },
    insufficient_data: {
      label: 'Awaiting Historical Entries',
      className: 'bg-stone-100 text-stone-700 border-stone-200',
      description: 'Log 2 to 3 consecutive period start dates to calculate regularity metrics.',
    },
  }[irregularityCategory] || {
    label: 'Observation In Progress',
    className: 'bg-stone-100 text-stone-700 border-stone-200',
    description: '',
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-base">
              Cycle Insights & Pattern Observation
            </h3>
            <p className="text-[11px] text-stone-500">
              Deterministic clinical evaluation of your entered cycle history
            </p>
          </div>
        </div>

        {/* Engine Transparency Pill */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-medium text-stone-600">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Rule-Based Engine (ACOG / FIGO)</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
          <span className="text-[11px] text-stone-500 block mb-0.5">Average Cycle</span>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {stats.averageCycleLength ? `${stats.averageCycleLength}d` : '—'}
          </div>
          <span className="text-[10px] text-stone-400">Normal: 21–35d</span>
        </div>

        <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
          <span className="text-[11px] text-stone-500 block mb-0.5">Shortest Cycle</span>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {stats.shortestCycle ? `${stats.shortestCycle}d` : '—'}
          </div>
          <span className="text-[10px] text-stone-400">Earliest start</span>
        </div>

        <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
          <span className="text-[11px] text-stone-500 block mb-0.5">Longest Cycle</span>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {stats.longestCycle ? `${stats.longestCycle}d` : '—'}
          </div>
          <span className="text-[10px] text-stone-400">Maximum spread</span>
        </div>

        <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-100">
          <span className="text-[11px] text-stone-500 block mb-0.5">Cycles Recorded</span>
          <div className="text-xl sm:text-2xl font-bold text-stone-900">
            {stats.totalCycles || 0}
          </div>
          <span className="text-[10px] text-stone-400">
            {stats.totalCycles >= 3 ? '✓ Robust history' : 'Need 3 for trend'}
          </span>
        </div>
      </div>

      {/* Pattern Classification Badge and Text */}
      <div className="p-4 bg-stone-50/60 rounded-2xl border border-stone-200/70 space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeConfig.className}`}>
            {badgeConfig.label}
          </span>
        </div>
        <p className="text-xs text-stone-700 leading-relaxed">
          {explanation || badgeConfig.description}
        </p>
      </div>

      {/* Transparency Note */}
      <div className="text-[11px] text-stone-500 flex items-start gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
        <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-700 font-medium">Model Transparency: </strong>
          This evaluation is calculated using documented clinical criteria (ACOG Practice Bulletin No. 128 and FIGO menstrual guidelines). No artificial intelligence or XGBoost machine learning predictions are claimed or fabricated. A modular XGBoost service interface is architected for future integration when a validated model is trained.
        </div>
      </div>
    </div>
  );
}
