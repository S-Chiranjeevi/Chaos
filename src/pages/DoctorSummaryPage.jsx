import React, { useEffect, useState } from 'react'
import { FileText, MessageSquareText } from 'lucide-react'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'
import { HealthEntryExport } from '../components/HealthEntryExport.jsx'
import { readLocalData, STORAGE_KEYS } from '../services/localStorage.js'

export function DoctorSummaryPage({ healthEntry, refreshKey, onNavigate }) {
  const [state, setState] = useState({ loading: true, entry: null, error: null })
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = readLocalData(STORAGE_KEYS.latestEntry, null)
      setState({ loading: false, entry: healthEntry || result.value, error: healthEntry ? null : result.error })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [healthEntry, refreshKey])

  return <div className="page-stack"><header className="page-heading"><p className="eyebrow">You choose what to share</p><h1 data-page-heading tabIndex="-1">Doctor summary</h1><p>Use your own words to help remember what you want to discuss at a health visit.</p></header><DisclaimerBanner />
    {state.loading ? <div className="state-card" role="status"><span className="loading-spinner" aria-hidden="true" />Loading your saved note. Please wait.</div> : state.error ? <div className="state-card state-card-error" role="alert"><strong>We could not open your saved note</strong><p>{state.error}</p><button className="button button-secondary" type="button" onClick={() => onNavigate('talk')}>Write a new note</button></div> : state.entry ? <><div className="summary-intro"><FileText size={21} aria-hidden="true" /><p>Check your notes before sharing. You can download a plain text summary to bring with you.</p></div><HealthEntryExport healthEntry={state.entry} /></> : <div className="empty-panel"><span className="empty-icon"><MessageSquareText size={26} aria-hidden="true" /></span><h2>No note to summarize yet</h2><p>First, describe what you have noticed. You can review and save it before making a summary.</p><button className="button button-primary" type="button" onClick={() => onNavigate('talk')}>Describe my symptoms</button></div>}
  </div>
}
