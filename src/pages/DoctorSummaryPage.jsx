import React, { useEffect, useState } from 'react'
import { FileText, MessageSquareText } from 'lucide-react'
import { DoctorSummary } from '../components/DoctorSummary.jsx'
import { UrgentCareBanner } from '../components/UrgentCareBanner.jsx'
import { detectRedFlags } from '../services/safetyRules.js'
import { readLocalData, STORAGE_KEYS } from '../services/localStorage.js'

function createSummaryData(entry) {
  return {
    narrative: `I would like to talk about: “${entry.rawTranscript || entry.notes || 'the changes I have noticed'}”.`,
    mainSymptoms: (entry.symptoms || []).map((symptom) => ({
      symptom: symptom.symptom,
      duration: symptom.duration || 'Not added',
      frequency: symptom.frequency || 'Not added',
      severity: symptom.severity || 'Not added',
    })),
    cycleHistory: [],
    averageCycleLength: 'No cycle dates have been added to this summary.',
    repeatedPatterns: [],
    redFlags: entry.assessment?.redFlags || [],
    suggestedSpecialist: '',
    questionsForDoctor: entry.assessment?.questionsForDoctor || [],
    personalizedInsights: [],
    userNotes: '',
    disclaimer: 'This is information, not a diagnosis.',
  }
}

export function DoctorSummaryPage({ healthEntry, refreshKey, onNavigate, currentLanguage = 'en' }) {
  const [state, setState] = useState({ loading: true, entry: null, error: null })
  const [notification, setNotification] = useState('')
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const result = readLocalData(STORAGE_KEYS.latestEntry, null)
      setState({ loading: false, entry: healthEntry || result.value, error: healthEntry ? null : result.error })
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
  if ((entry?.assessment?.urgency === 'urgent' || entry?.assessment?.isUrgent) && safetyWarnings.length === 0) {
    safetyWarnings.push({
      id: 'saved_urgent_follow_up',
      severity: 'urgent',
      title: 'Your saved note was marked for urgent follow-up',
      message: 'Please seek urgent medical care.',
      matchedTerms: [],
    })
  }
  return <div className="page-stack"><UrgentCareBanner warnings={safetyWarnings} /><header className="page-heading"><p className="eyebrow">You choose what to share</p><h1 data-page-heading tabIndex="-1">Doctor summary</h1><p>Use your own words to help remember what you want to discuss at a health visit.</p></header>
    {state.loading ? <div className="state-card" role="status"><span className="loading-spinner" aria-hidden="true" />Loading your saved note. Please wait.</div> : state.error ? <div className="state-card state-card-error" role="alert"><strong>We could not open your saved note</strong><p>{state.error}</p><button className="button button-secondary" type="button" onClick={() => onNavigate('talk')}>Write a new note</button></div> : entry ? <><div className="summary-intro"><FileText size={21} aria-hidden="true" /><p>Check your notes before sharing. The summary tools can help you prepare a clear copy.</p></div>{notification && <p className="summary-notice" role="status">{notification}</p>}<DoctorSummary key={entry.id} initialData={createSummaryData(entry)} currentLanguage={currentLanguage} onCopySuccess={() => setNotification('Your summary is copied. You can paste it into your notes.')} /></> : <div className="empty-panel"><span className="empty-icon"><MessageSquareText size={26} aria-hidden="true" /></span><h2>No note to summarize yet</h2><p>First, describe what you have noticed. You can review and save it before making a summary.</p><button className="button button-primary" type="button" onClick={() => onNavigate('talk')}>Describe my symptoms</button></div>}
  </div>
}

export default DoctorSummaryPage
