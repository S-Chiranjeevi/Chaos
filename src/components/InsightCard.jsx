import React from 'react'
import { AlertTriangle, CheckCircle2, Info, Plus, X } from 'lucide-react'

const labels = { urgent: 'Urgent', soon: 'Discuss soon', routine: 'Routine' }

export function InsightCard({ insight, onDismiss, onAddToSummary, isInSummary }) {
  const Icon = insight.urgency === 'urgent' ? AlertTriangle : insight.urgency === 'soon' ? Info : CheckCircle2
  return <article className={`rounded-2xl border p-5 ${insight.urgency === 'urgent' ? 'border-rose-300 bg-rose-50' : insight.urgency === 'soon' ? 'border-amber-300 bg-amber-50' : 'border-sky-200 bg-sky-50'}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><Icon className={insight.urgency === 'urgent' ? 'text-rose-700' : 'text-stone-600'} size={20} /><span className="text-xs font-bold uppercase tracking-wide">{labels[insight.urgency]}</span></div><span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-stone-600">{insight.source === 'ai_assisted' ? 'AI-assisted' : 'Rule-based'}</span></div>
    <h3 className="mt-3 text-base font-bold text-stone-900">{insight.title}</h3>
    <p className="mt-1 text-sm leading-relaxed text-stone-700">{insight.message}</p>
    <div className="mt-3 rounded-xl bg-white/70 p-3"><p className="text-xs font-bold text-stone-700">Why this appeared</p><p className="mt-1 text-xs leading-relaxed text-stone-600">{insight.whyItAppeared}</p><ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-stone-600">{insight.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
    <p className="mt-3 text-xs font-semibold text-stone-700">Next step: <span className="font-normal">{insight.suggestedAction}</span></p>
    <p className="mt-2 text-xs text-stone-600">Learn: {insight.education}</p>
    <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => onAddToSummary(insight)} className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-2 text-xs font-bold text-white">{isInSummary ? <CheckCircle2 size={14} /> : <Plus size={14} />}{isInSummary ? 'Added to doctor summary' : 'Add to doctor summary'}</button><button type="button" onClick={() => onDismiss(insight.id)} className="inline-flex items-center gap-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-xs font-bold text-stone-700"><X size={14} />Dismiss</button></div>
  </article>
}
