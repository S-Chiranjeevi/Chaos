import { useEffect, useMemo, useState } from 'react'
import { Activity, CalendarDays, Download, ShieldCheck, Trash2 } from 'lucide-react'
import PatternTimeline from './PatternTimeline.jsx'
import { analyzeCycles } from '../services/cycleAnalysis.js'
import { deleteAllLocalData, exportAllLocalData, loadCycleEntries, loadDoctorSummary, loadHealthEntries, saveCycleEntry, saveDoctorSummary, saveInsight } from '../services/storageService.js'
import './CycleTracker.css'

const SYMPTOMS = ['Acne', 'Cramps', 'Hair growth', 'Fatigue', 'Mood changes', 'Headache', 'Pelvic pain', 'Dizziness or fainting', 'Severe pain', 'Very heavy bleeding', 'Possible pregnancy with pain or bleeding']
const FLOW_LEVELS = ['Spotting', 'Light', 'Moderate', 'Heavy', 'Very heavy']
const PAIN_LEVELS = ['None', 'Mild', 'Moderate', 'Severe']
const MOODS = ['Calm', 'Okay', 'Low', 'Anxious', 'Irritable', 'Other']
const ENERGY_LEVELS = ['High', 'Usual', 'Low', 'Very low']

function today() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function downloadJson(data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'luna-her-local-health-data.json'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function CycleTracker() {
  const [entries, setEntries] = useState(loadCycleEntries)
  const [healthEntries, setHealthEntries] = useState(loadHealthEntries)
  const [summary, setSummary] = useState(loadDoctorSummary)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [flowLevel, setFlowLevel] = useState('')
  const [painLevel, setPainLevel] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [mood, setMood] = useState('')
  const [energyLevel, setEnergyLevel] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const analysis = useMemo(() => analyzeCycles(entries, healthEntries), [entries, healthEntries])
  const summaryIds = new Set((summary?.entries || []).map((item) => item.cycleEntryId))
  const hasLocalData = entries.length > 0 || healthEntries.length > 0 || Boolean(summary)

  useEffect(() => {
    const refreshHealthEntries = () => setHealthEntries(loadHealthEntries())
    window.addEventListener('sakhicare:health-entry-update', refreshHealthEntries)
    return () => window.removeEventListener('sakhicare:health-entry-update', refreshHealthEntries)
  }, [])

  function resetForm() {
    setStartDate(today())
    setEndDate('')
    setFlowLevel('')
    setPainLevel('')
    setSymptoms([])
    setMood('')
    setEnergyLevel('')
    setNotes('')
    setEditingId(null)
    setError('')
  }

  function toggleSymptom(symptom) {
    setSymptoms((current) => current.includes(symptom) ? current.filter((item) => item !== symptom) : [...current, symptom])
  }

  function submit(event) {
    event.preventDefault()
    try {
      const record = saveCycleEntry({ id: editingId || undefined, startDate, endDate, flowLevel, painLevel, symptoms, mood, energyLevel, notes: notes.trim() })
      setEntries((current) => {
        const existing = current.some((item) => item.id === record.id)
        return existing ? current.map((item) => item.id === record.id ? record : item) : [...current, record]
      })
      resetForm()
    } catch (saveError) {
      setError(saveError.message || 'This entry could not be saved. Please check the details and try again.')
    }
  }

  function editEntry(entry) {
    setEditingId(entry.id)
    setStartDate(entry.startDate)
    setEndDate(entry.endDate || '')
    setFlowLevel(entry.flowLevel || '')
    setPainLevel(entry.painLevel || '')
    setSymptoms(Array.isArray(entry.symptoms) ? entry.symptoms : [])
    setMood(entry.mood || '')
    setEnergyLevel(entry.energyLevel || '')
    setNotes(entry.notes || '')
    setError('')
    document.getElementById('cycle-form-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function addToDoctorSummary(entry) {
    const current = loadDoctorSummary() || { entries: [] }
    const list = Array.isArray(current.entries) ? current.entries : []
    if (list.some((item) => item.cycleEntryId === entry.id)) return
    const nextEntry = { cycleEntryId: entry.id, period: { ...entry }, addedAt: new Date().toISOString() }
    const next = { ...current, entries: [...list, nextEntry], updatedAt: new Date().toISOString() }
    try {
      saveDoctorSummary(next)
      saveInsight({ title: `Period record for ${entry.startDate}`, cycleEntryId: entry.id, summary: [entry.flowLevel && `Flow: ${entry.flowLevel}`, entry.painLevel && `Pain: ${entry.painLevel}`, entry.symptoms?.length && `Symptoms: ${entry.symptoms.join(', ')}`].filter(Boolean).join('. ') || 'Period start date recorded.', createdAt: new Date().toISOString() })
      setSummary(next)
    } catch (saveError) {
      setError(saveError.message || 'Could not update the doctor summary. Please try again.')
    }
  }

  function clearAll() {
    try {
      deleteAllLocalData()
      setEntries([])
      setHealthEntries([])
      setSummary(null)
      setConfirmDelete(false)
      resetForm()
    } catch (deleteError) {
      setError(deleteError.message || 'Could not delete local tracker data. Please try again.')
      setConfirmDelete(false)
    }
  }

  function exportData() {
    downloadJson(exportAllLocalData())
  }

  return (
    <section className="cycle-tracker-section" id="health-tracker" aria-labelledby="cycle-tracker-title">
      <div className="cycle-tracker-heading">
        <p className="eyebrow">Your private health journal</p>
        <h2 id="cycle-tracker-title">Health tracker</h2>
        <p>Keep period and symptom notes together, and review your own records over time.</p>
        <div className="cycle-privacy"><ShieldCheck size={16} aria-hidden="true" /> Saved in this browser only. No account or outside database.</div>
      </div>

      <div className="cycle-tracker-layout">
        <form className="cycle-entry-form" onSubmit={submit}>
          <div className="cycle-section-title"><span className="cycle-icon"><CalendarDays size={18} aria-hidden="true" /></span><div><h3 id="cycle-form-title">{editingId ? 'Edit period entry' : 'Log a period'}</h3><p>Start date is required. Other details can be added later.</p></div></div>
          <div className="cycle-date-grid">
            <div className="cycle-field"><label htmlFor="cycle-start">Period start date <span aria-hidden="true">*</span></label><input id="cycle-start" type="date" required max={today()} value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div>
            <div className="cycle-field"><label htmlFor="cycle-end">End date <span className="cycle-optional">(optional)</span></label><input id="cycle-end" type="date" min={startDate || undefined} max={today()} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div>
          </div>
          <p className="cycle-field-help">If your period is ongoing, leave the end date blank and add it later by editing this entry.</p>

          <div className="cycle-select-grid">
            <div className="cycle-field"><label htmlFor="cycle-flow">Flow level <span className="cycle-optional">(optional)</span></label><select id="cycle-flow" value={flowLevel} onChange={(event) => setFlowLevel(event.target.value)}><option value="">Choose a level</option>{FLOW_LEVELS.map((level) => <option key={level}>{level}</option>)}</select></div>
            <div className="cycle-field"><label htmlFor="cycle-pain">Pain level <span className="cycle-optional">(optional)</span></label><select id="cycle-pain" value={painLevel} onChange={(event) => setPainLevel(event.target.value)}><option value="">Choose a level</option>{PAIN_LEVELS.map((level) => <option key={level}>{level}</option>)}</select></div>
            <div className="cycle-field"><label htmlFor="cycle-mood">Mood <span className="cycle-optional">(optional)</span></label><select id="cycle-mood" value={mood} onChange={(event) => setMood(event.target.value)}><option value="">Choose a mood</option>{MOODS.map((value) => <option key={value}>{value}</option>)}</select></div>
            <div className="cycle-field"><label htmlFor="cycle-energy">Energy <span className="cycle-optional">(optional)</span></label><select id="cycle-energy" value={energyLevel} onChange={(event) => setEnergyLevel(event.target.value)}><option value="">Choose a level</option>{ENERGY_LEVELS.map((value) => <option key={value}>{value}</option>)}</select></div>
          </div>

          <fieldset className="cycle-symptoms"><legend>Symptoms <span className="cycle-optional">(optional)</span></legend><p className="cycle-field-help">Select anything you noticed.</p><div className="cycle-chip-list">{SYMPTOMS.map((symptom) => <button key={symptom} type="button" className={`cycle-chip ${symptoms.includes(symptom) ? 'selected' : ''}`} aria-pressed={symptoms.includes(symptom)} onClick={() => toggleSymptom(symptom)}>{symptoms.includes(symptom) && <span aria-hidden="true">✓ </span>}{symptom}</button>)}</div></fieldset>

          <div className="cycle-field cycle-notes-field"><label htmlFor="cycle-notes">Notes <span className="cycle-optional">(optional)</span></label><textarea id="cycle-notes" rows={3} maxLength={400} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add anything you’d like to remember." /><span className="cycle-note-count">{notes.length} / 400</span></div>
          {error && <p className="cycle-error" role="alert">{error}</p>}
          <div className="cycle-form-actions"><button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Save period entry'} <span aria-hidden="true">→</span></button>{editingId && <button className="cycle-cancel-button" type="button" onClick={resetForm}>Cancel</button>}</div>
        </form>

        <aside className="cycle-stat-card" aria-label="Cycle statistics">
          <div className="cycle-section-title"><span className="cycle-icon"><Activity size={18} aria-hidden="true" /></span><div><h3>Cycle statistics</h3><p>Calculated from your logged start dates.</p></div></div>
          <div className="cycle-stats-grid">
            <article className="cycle-stat"><span>Period starts logged</span><strong>{analysis.periodCount}</strong></article>
            <article className="cycle-stat"><span>Average cycle</span><strong>{analysis.averageCycleLength === null ? '—' : `${analysis.averageCycleLength} days`}</strong></article>
            <article className="cycle-stat"><span>Shortest cycle</span><strong>{analysis.shortestCycle === null ? '—' : `${analysis.shortestCycle} days`}</strong></article>
            <article className="cycle-stat"><span>Longest cycle</span><strong>{analysis.longestCycle === null ? '—' : `${analysis.longestCycle} days`}</strong></article>
            <article className="cycle-stat"><span>Cycle variation</span><strong>{analysis.cycleVariation === null ? '—' : `${analysis.cycleVariation} days`}</strong></article>
            <article className="cycle-stat"><span>Cycles above 35 days</span><strong>{analysis.cyclesAbove35Days}</strong></article>
            <article className="cycle-stat"><span>Cycles below 21 days</span><strong>{analysis.cyclesBelow21Days}</strong></article>
            <article className="cycle-stat"><span>Gaps above 45 days</span><strong>{analysis.gapsAbove45Days}</strong></article>
          </div>
          <p className="cycle-stat-footnote">Cycle length is the number of days between period start dates. These estimates reflect your entries only.</p>
          <div className="cycle-missing-data"><strong>Missing data</strong>{analysis.isEmpty ? <p>No entries yet.</p> : <p>{analysis.missingCount ? `${analysis.missingCount} optional detail${analysis.missingCount === 1 ? ' is' : 's are'} missing across ${analysis.periodCount} ${analysis.periodCount === 1 ? 'entry' : 'entries'}.` : 'No missing details in your logged entries.'} Missing fields: end date {analysis.missingData.endDate}, flow {analysis.missingData.flowLevel}, pain {analysis.missingData.painLevel}, symptoms {analysis.missingData.symptoms}, mood {analysis.missingData.mood}, energy {analysis.missingData.energyLevel}.</p>}</div>
          <p className="cycle-nondiagnostic-note">Cycle patterns vary by age and individual health. These observations do not diagnose PCOS or another condition.</p>
        </aside>
      </div>

      <div className="cycle-actions-bar"><div><strong>{summary?.entries?.length || 0} {summary?.entries?.length === 1 ? 'entry' : 'entries'} in doctor summary</strong><p>Add records from your timeline to keep notes for a healthcare conversation.</p></div><div className="cycle-global-actions"><button type="button" className="cycle-export-button" onClick={exportData}><Download size={15} aria-hidden="true" /> Export local data</button>{hasLocalData && <button type="button" className="cycle-delete-button" onClick={() => setConfirmDelete(true)}><Trash2 size={15} aria-hidden="true" /> Delete tracker data</button>}</div></div>

      <div className="cycle-lower-layout"><PatternTimeline entries={entries} analysis={analysis} summaryIds={summaryIds} onEdit={editEntry} onAddToSummary={addToDoctorSummary} />
        <aside className="cycle-warning-card" id="early-warning"><p className="eyebrow">When to seek help</p><h3>Listen to what feels urgent.</h3><p>If you have severe pain, very heavy bleeding, dizziness or fainting, or pain or bleeding when pregnancy is possible, seek urgent medical care or contact local emergency services.</p><p>For changes or concerns that are not urgent, consider discussing your notes with a healthcare professional.</p><span>This guidance is not a diagnosis and cannot assess an emergency.</span></aside>
      </div>

      {confirmDelete && <div className="cycle-dialog-backdrop"><section className="cycle-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description"><span className="cycle-dialog-icon"><Trash2 size={20} aria-hidden="true" /></span><h3 id="delete-title">Delete all local health data?</h3><p id="delete-description">This removes period entries, symptom notes, saved insights, and your doctor summary from this browser. Export your records first if you want to keep a copy.</p><div className="cycle-dialog-actions"><button type="button" className="cycle-cancel-button" onClick={() => setConfirmDelete(false)}>Keep my data</button><button type="button" className="cycle-confirm-delete" onClick={clearAll}>Delete all data</button></div></section></div>}
    </section>
  )
}

export default CycleTracker
