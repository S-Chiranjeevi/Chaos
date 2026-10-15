import React, { useMemo, useState } from 'react'
import { BrainCircuit, FileText } from 'lucide-react'
import { createPersonalizedInsights, INSIGHT_DISCLAIMER } from '../services/personalizedInsights.js'
import { InsightCard } from './InsightCard.jsx'
import { UrgentCareBanner } from './UrgentCareBanner.jsx'
import { detectRedFlags } from '../services/safetyRules.js'
import { validateOutput } from '../services/outputValidator.js'

const DISMISSED_KEY = 'lunaher_dismissed_insights'
const SUMMARY_KEY = 'lunaher_doctor_insights'
const load = (key, fallbackKey) => {
  try {
    const val = localStorage.getItem(key) || (fallbackKey ? localStorage.getItem(fallbackKey) : null)
    return JSON.parse(val || '[]')
  } catch {
    return []
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    if (key === DISMISSED_KEY) localStorage.setItem('sakhicare_dismissed_insights', JSON.stringify(value))
    if (key === SUMMARY_KEY) localStorage.setItem('sakhicare_doctor_insights', JSON.stringify(value))
  } catch { /* Device storage is optional. */ }
}

export function InsightsPanel({ healthHistory = [], periodLogs = [], symptomLogs = [] }) {
  const [dismissedIds, setDismissedIds] = useState(() => load(DISMISSED_KEY, 'sakhicare_dismissed_insights'))
  const [summaryInsights, setSummaryInsights] = useState(() => load(SUMMARY_KEY, 'sakhicare_doctor_insights'))
  const safetyWarnings = useMemo(() => detectRedFlags({ healthHistory, periodLogs, symptomLogs }), [healthHistory, periodLogs, symptomLogs])
  const insights = useMemo(() => createPersonalizedInsights({ healthHistory, periodLogs, symptomLogs, dismissedInsightIds: dismissedIds }), [healthHistory, periodLogs, symptomLogs, dismissedIds])
  const validationResults = insights.map((insight) => ({ insight, validation: validateOutput(insight) }))
  const visible = validationResults
    .filter(({ insight, validation }) => !insight.dismissed && validation.valid)
    .map(({ validation }) => validation.output)
  const blockedCount = validationResults.filter(({ validation }) => !validation.valid).length
  const dismiss = (id) => { const next = [...new Set([...dismissedIds, id])]; setDismissedIds(next); save(DISMISSED_KEY, next) }
  const addToSummary = (insight) => {
    const next = summaryInsights.some((item) => item.id === insight.id) ? summaryInsights : [...summaryInsights, insight]
    setSummaryInsights(next)
    save(SUMMARY_KEY, next)
  }

  return <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="personalized-insights-title">
    <UrgentCareBanner warnings={safetyWarnings} />
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="flex gap-3"><BrainCircuit className="text-violet-700" /><div><p className="text-xs font-bold uppercase tracking-wider text-violet-700">Personalized insights</p><h2 id="personalized-insights-title" className="text-xl font-bold text-stone-900">Patterns from your own records</h2><p className="mt-1 text-sm text-stone-600">Rule-based, explainable, and stored only on this device.</p></div></div><span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600"><FileText size={13} />{summaryInsights.length} in doctor summary</span></div>
    {blockedCount > 0 && <p className="mt-4 rounded-xl border border-rose-700 bg-rose-50 p-3 text-sm font-semibold text-rose-950" role="alert">{blockedCount} automated insight{blockedCount === 1 ? ' was' : 's were'} hidden because {blockedCount === 1 ? 'it did' : 'they did'} not pass safety checks.</p>}
    <div className="mt-5 grid gap-4 lg:grid-cols-2">{visible.map((insight) => <InsightCard key={insight.id} insight={insight} onDismiss={dismiss} onAddToSummary={addToSummary} isInSummary={summaryInsights.some((item) => item.id === insight.id)} />)}</div>
    <p className="mt-5 text-xs font-semibold text-violet-800">{INSIGHT_DISCLAIMER}</p>
  </section>
}
