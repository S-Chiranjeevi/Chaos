import React, { useEffect, useState } from 'react'
import { ArrowRight, ClipboardList, HeartPulse } from 'lucide-react'
import { PatternDetectionView } from '../components/PatternDetectionView.jsx'
import { UrgentCareBanner } from '../components/UrgentCareBanner.jsx'
import { PersonalizedInsights } from '../components/PersonalizedInsights.jsx'
import { readLocalData, STORAGE_KEYS } from '../services/localStorage.js'
import { detectRedFlags } from '../services/safetyRules.js'
import { validateOutput } from '../services/outputValidator.js'

function InsightState({ title, children, action, onAction, tone = 'neutral' }) {
  return <div className={`insight-state insight-state-${tone}`} role={tone === 'error' ? 'alert' : 'status'}><strong>{title}</strong><p>{children}</p>{action && <button className="button button-secondary" type="button" onClick={onAction}>{action}</button>}<small className="mt-2 block font-semibold">This is information, not a diagnosis.</small></div>
}

export function InsightsPage({ onNavigate, healthEntry, refreshKey }) {
  const [state, setState] = useState({ loading: true, entry: null, error: null })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = readLocalData(STORAGE_KEYS.latestEntry, null)
      const entry = healthEntry || result.value
      setState({ loading: false, entry, error: healthEntry ? null : result.error })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [healthEntry, refreshKey])

  const entry = state.entry
  const safetyWarnings = entry ? detectRedFlags({
    rawTranscript: entry.rawTranscript,
    notes: entry.notes,
    symptoms: entry.symptoms,
    assessment: entry.assessment,
  }) : []
  const legacyUrgent = entry?.assessment?.urgency === 'urgent' || entry?.assessment?.isUrgent
  if (legacyUrgent && safetyWarnings.length === 0) {
    safetyWarnings.push({
      id: 'saved_urgent_follow_up',
      severity: 'urgent',
      title: 'Your saved note was marked for urgent follow-up',
      message: 'Please seek urgent medical care.',
      matchedTerms: [],
    })
  }
  const assessmentValidation = entry?.assessment ? validateOutput(entry.assessment) : { valid: true }
  return <div className="page-stack"><UrgentCareBanner warnings={safetyWarnings} /><header className="page-heading"><p className="eyebrow">Your saved notes</p><h1 data-page-heading tabIndex="-1">Early warnings and insights</h1><p>Review what you have written down. These notes cannot tell you what is causing a change.</p></header>
    {state.loading ? <InsightState title="Loading your notes">Please wait while we look for notes saved on this device.</InsightState> : state.error ? <InsightState title="We could not open your saved notes" tone="error">{state.error}</InsightState> : !entry ? <div className="empty-panel"><span className="empty-icon"><HeartPulse size={26} aria-hidden="true" /></span><h2>No saved notes yet</h2><p>When you save a note, you can review it here. There is nothing you need to track.</p><button className="button button-primary" type="button" onClick={() => onNavigate('talk')}>Describe something I notice <ArrowRight size={17} aria-hidden="true" /></button></div> : <>
      <div className="insight-note"><div className="insight-note-heading"><ClipboardList size={21} aria-hidden="true" /><div><strong>Your latest note</strong><small>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Saved on this device'}</small></div></div><p>{entry.rawTranscript || entry.notes || 'A saved note is ready to review.'}</p></div>
      {!assessmentValidation.valid ? <InsightState title="Automated guidance was hidden" tone="error">This result did not pass safety checks. Please speak with a qualified healthcare professional about your concerns. This is information, not a diagnosis.</InsightState> : safetyWarnings.length ? <InsightState title="Please seek urgent help" tone="urgent">The safety check found a symptom that may need urgent attention. Contact local emergency help or a trusted health worker now.</InsightState> : <InsightState title="No urgent warning in this saved note" tone="calm">This only describes the note you saved. It does not rule out a health concern. If you feel very unwell or unsafe, seek local urgent help.</InsightState>}
      {entry.symptoms?.length > 0 && <section className="surface-card"><h2>Details from your note</h2><ul className="detail-list">{entry.symptoms.map((item) => <li key={item.id || item.symptom}><strong>{item.symptom}</strong><span>{[item.duration, item.frequency, item.severity !== 'Unspecified' ? item.severity : null].filter(Boolean).join(' · ') || 'No extra details saved'}</span></li>)}</ul></section>}
      <button className="button button-primary" type="button" onClick={() => onNavigate('doctor')}>Prepare for a doctor visit <ArrowRight size={17} aria-hidden="true" /></button>
    </>}
    <section className="surface-card"><h2>Patterns you may want to discuss</h2><p className="muted">Add dates or observations to see possible patterns. This tool does not diagnose a condition.</p><PatternDetectionView /></section>
    <section className="surface-card" style={{ marginTop: '20px' }}>
      <PersonalizedInsights
        currentPeriodLogs={[]}
        currentSymptomLogs={entry?.symptoms || []}
        userLanguage={entry?.language === 'hi' ? 'Hindi' : 'English'}
      />
    </section>
  </div>
}
