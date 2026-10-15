import { useMemo, useState } from 'react'
import { Activity, CalendarDays, Download, Pencil, ShieldCheck, Trash2 } from 'lucide-react'
import './HealthTracker.css'

const STORAGE_KEY = 'sakhicare_health_tracker_v1'
const SYMPTOMS = ['Acne', 'Cramps', 'Hair growth', 'Fatigue', 'Mood changes', 'Headache', 'Pelvic pain']
const SEVERITIES = ['Mild', 'Moderate', 'Severe']
const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function readEntries() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    const parsed = saved ? JSON.parse(saved) : []
    return Array.isArray(parsed) ? parsed.filter((entry) => entry && entry.id && entry.startDate) : []
  } catch {
    return []
  }
}

function formatDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`))
}

function cycleDays(first, second) {
  return Math.round((Date.parse(`${second}T00:00:00Z`) - Date.parse(`${first}T00:00:00Z`)) / 86400000)
}

function download(contents, filename, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function HealthTracker() {
  const [entries, setEntries] = useState(readEntries)
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [severity, setSeverity] = useState('Moderate')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [storageError, setStorageError] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)

  const ordered = useMemo(() => [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate)), [entries])
  const oldestFirst = useMemo(() => [...entries].sort((a, b) => a.startDate.localeCompare(b.startDate)), [entries])
  const intervals = useMemo(() => oldestFirst.slice(1).map((entry, index) => cycleDays(oldestFirst[index].startDate, entry.startDate)), [oldestFirst])
  const averageCycle = intervals.length ? Math.round(intervals.reduce((total, days) => total + days, 0) / intervals.length) : null
  const recentStarts = oldestFirst.slice(-4)
  const recentIntervals = recentStarts.slice(1).map((entry, index) => cycleDays(recentStarts[index].startDate, entry.startDate))
  const hasThreeMonthPattern = recentStarts.length === 4 && cycleDays(recentStarts[0].startDate, recentStarts[3].startDate) >= 90
  const variedForThreeMonths = hasThreeMonthPattern && Math.max(...recentIntervals) - Math.min(...recentIntervals) > 7
  const repeatedSymptoms = SYMPTOMS.filter((symptom) => entries.filter((entry) => entry.symptoms.includes(symptom)).length >= 3)
  const missingEnds = entries.filter((entry) => !entry.endDate).length
  const noSymptoms = entries.filter((entry) => !entry.symptoms.length).length

  function persist(next) {
    setEntries(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  function toggleSymptom(symptom) {
    setSymptoms((selected) => selected.includes(symptom) ? selected.filter((item) => item !== symptom) : [...selected, symptom])
  }

  function resetForm() {
    setStartDate(today())
    setEndDate('')
    setSymptoms([])
    setSeverity('Moderate')
    setNote('')
    setEditingId(null)
    setError('')
  }

  function submit(event) {
    event.preventDefault()
    if (!startDate) return setError('Choose the first day of your period.')
    if (startDate > today()) return setError('The first day can’t be in the future.')
    if (endDate && endDate < startDate) return setError('The last day must be the same as or after the first day.')
    if (endDate && endDate > today()) return setError('The last day can’t be in the future.')
    if (entries.some((entry) => entry.startDate === startDate && entry.id !== editingId)) return setError('A period starting on this date is already in your timeline. Edit that entry to add details.')

    const previous = entries.find((entry) => entry.id === editingId)
    const nextEntry = { id: editingId || `period-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, startDate, endDate, symptoms, severity: symptoms.length ? severity : '', note: note.trim() }
    const next = previous ? entries.map((entry) => entry.id === editingId ? nextEntry : entry) : [...entries, nextEntry]
    persist(next)
    resetForm()
  }

  function editEntry(entry) {
    setEditingId(entry.id)
    setStartDate(entry.startDate)
    setEndDate(entry.endDate || '')
    setSymptoms(entry.symptoms || [])
    setSeverity(entry.severity || 'Moderate')
    setNote(entry.note || '')
    setError('')
    document.getElementById('tracker-form-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function exportJson() {
    download(JSON.stringify({ app: 'SakhiCare', exportedAt: new Date().toISOString(), entries }, null, 2), 'sakhicare-health-tracker.json', 'application/json')
  }

  function exportText() {
    const lines = ['SakhiCare health tracker export', `Exported: ${new Date().toLocaleString()}`, '', 'This is a personal record, not a diagnosis.', '']
    if (!ordered.length) lines.push('No entries recorded.')
    ordered.forEach((entry, index) => {
      lines.push(`${index + 1}. Period started: ${formatDate(entry.startDate)}`)
      lines.push(`   Period ended: ${entry.endDate ? formatDate(entry.endDate) : 'Not recorded'}`)
      lines.push(`   Symptoms: ${entry.symptoms.length ? entry.symptoms.join(', ') : 'None recorded'}`)
      if (entry.severity) lines.push(`   Severity: ${entry.severity}`)
      if (entry.note) lines.push(`   Note: ${entry.note}`)
      lines.push('')
    })
    download(lines.join('\n'), 'sakhicare-health-tracker.txt', 'text/plain;charset=utf-8')
  }

  function clearAll() {
    persist([])
    setConfirmClear(false)
    resetForm()
  }

  return (
    <section className="tracker-section" id="health-tracker" aria-labelledby="tracker-title">
      <div className="tracker-heading">
        <p className="eyebrow">Your private health journal</p>
        <h2 id="tracker-title">Health tracker</h2>
        <p>A gentle way to notice patterns in your periods and symptoms over time.</p>
        <div className="tracker-privacy"><ShieldCheck size={16} aria-hidden="true" /> Your entries stay in this browser. No account needed.</div>
      </div>

      <div className="tracker-layout">
        <form className="tracker-form" onSubmit={submit} noValidate>
          <div className="tracker-form-heading"><span className="tracker-form-icon"><CalendarDays size={18} aria-hidden="true" /></span><div><h3 id="tracker-form-title">{editingId ? 'Update an entry' : 'Log a period'}</h3><p>Dates are saved only on this device.</p></div></div>
          <div className="tracker-date-grid">
            <div className="tracker-field"><label htmlFor="period-start">First day of period <span aria-hidden="true">*</span></label><input id="period-start" type="date" value={startDate} max={today()} onChange={(event) => setStartDate(event.target.value)} required aria-describedby="date-help" /></div>
            <div className="tracker-field"><label htmlFor="period-end">Last day <span className="optional-label">(optional)</span></label><input id="period-end" type="date" value={endDate} min={startDate || undefined} max={today()} onChange={(event) => setEndDate(event.target.value)} aria-describedby="date-help" /></div>
          </div>
          <p id="date-help" className="tracker-help">If your period is still ongoing, you can add its last day later by editing this entry.</p>

          <fieldset className="tracker-symptoms"><legend>Symptoms <span className="optional-label">(optional)</span></legend><p className="tracker-help">Choose any you noticed during this period.</p><div className="symptom-chip-list">{SYMPTOMS.map((symptom) => <button className={`tracker-chip ${symptoms.includes(symptom) ? 'selected' : ''}`} type="button" key={symptom} aria-pressed={symptoms.includes(symptom)} onClick={() => toggleSymptom(symptom)}>{symptoms.includes(symptom) && <span aria-hidden="true">✓ </span>}{symptom}</button>)}</div></fieldset>

          <fieldset className="tracker-severity" disabled={!symptoms.length}><legend>How did they feel? <span className="optional-label">(choose one)</span></legend><div className="severity-options">{SEVERITIES.map((level) => <label className={`severity-option ${severity === level ? 'selected' : ''}`} key={level}><input type="radio" name="severity" value={level} checked={severity === level} onChange={() => setSeverity(level)} />{level}</label>)}</div><p className="tracker-help">Select symptoms first to add a severity.</p></fieldset>

          <div className="tracker-field"><label htmlFor="tracker-note">A short note <span className="optional-label">(optional)</span></label><textarea id="tracker-note" value={note} onChange={(event) => setNote(event.target.value)} maxLength={240} rows={3} placeholder="Anything else you’d like to remember?" /><div className="tracker-note-count" aria-live="polite">{note.length} / 240</div></div>
          {error && <p className="tracker-error" role="alert">{error}</p>}
          {storageError && <p className="tracker-error" role="alert">This browser couldn’t save your entry. Check that local storage is available, then try again.</p>}
          <div className="tracker-form-actions"><button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Save entry'} <span aria-hidden="true">→</span></button>{editingId && <button className="tracker-text-button" type="button" onClick={resetForm}>Cancel editing</button>}</div>
        </form>

        <div className="tracker-insights" aria-label="Your tracker summary">
          <div className="tracker-insights-title"><span className="tracker-form-icon"><Activity size={18} aria-hidden="true" /></span><div><h3>Your patterns</h3><p>Based only on entries you’ve logged.</p></div></div>
          <div className="tracker-stat-grid"><article className="tracker-stat"><span>Approx. cycle length</span><strong>{averageCycle === null ? '—' : `${averageCycle} days`}</strong><small>{intervals.length ? 'Average time between logged period starts' : 'Log two period starts to see an estimate'}</small></article><article className="tracker-stat"><span>Logged cycles</span><strong>{entries.length}</strong><small>{entries.length === 1 ? 'period start recorded' : 'period starts recorded'}</small></article></div>
          <div className="tracker-patterns">
            <div className="tracker-pattern"><span className={`pattern-dot ${variedForThreeMonths ? 'pattern-dot-warm' : ''}`} aria-hidden="true" /><div><strong>Cycle pattern</strong><p>{variedForThreeMonths ? 'Your recent cycles appear irregular.' : hasThreeMonthPattern ? 'Your recent cycle lengths have been fairly consistent.' : 'Log at least four period starts across three months to check for a pattern.'}</p><small>We compare your last three logged cycle lengths. A difference over 7 days is highlighted as a pattern to discuss, not a medical threshold.</small></div></div>
            <div className="tracker-pattern"><span className="pattern-dot" aria-hidden="true" /><div><strong>Repeated symptoms</strong>{repeatedSymptoms.length ? <><p>You have logged this symptom several times: {repeatedSymptoms.join(', ')}.</p><small>Consider discussing this pattern with a healthcare professional.</small></> : <p>Symptoms logged three or more times will appear here.</p>}</div></div>
            <div className="tracker-pattern"><span className="pattern-dot pattern-dot-muted" aria-hidden="true" /><div><strong>Missing data</strong><p>{missingEnds ? `${missingEnds} period ${missingEnds === 1 ? 'entry has' : 'entries have'} no last day recorded.` : 'All logged periods have a last day.'}{noSymptoms ? ` ${noSymptoms} ${noSymptoms === 1 ? 'entry has' : 'entries have'} no symptoms recorded.` : ''}</p><small>It’s okay to leave details blank; add what feels useful to you.</small></div></div>
          </div>
          <p className="tracker-disclaimer">These observations describe your log only. They do not diagnose a condition. A healthcare professional can help you understand concerns about your cycle or symptoms.</p>
        </div>
      </div>

      <section className="tracker-timeline" aria-labelledby="timeline-title">
        <div className="timeline-heading"><div><p className="eyebrow">Your records</p><h3 id="timeline-title">Previous entries</h3></div>{entries.length > 0 && <div className="timeline-actions"><button className="tracker-export-button" type="button" onClick={exportJson}><Download size={15} aria-hidden="true" /> Export JSON</button><button className="tracker-export-button" type="button" onClick={exportText}><Download size={15} aria-hidden="true" /> Export text</button><button className="tracker-delete-button" type="button" onClick={() => setConfirmClear(true)}><Trash2 size={15} aria-hidden="true" /> Clear all</button></div>}</div>
        {ordered.length === 0 ? <div className="tracker-empty"><span className="empty-calendar"><CalendarDays size={23} aria-hidden="true" /></span><h4>Your timeline starts here</h4><p>When you log a period, it will appear here. Your entries are stored locally on this device.</p></div> : <ol className="timeline-list">{ordered.map((entry) => <li className="timeline-entry" key={entry.id}><span className="timeline-marker" aria-hidden="true" /><article className="timeline-card"><div className="timeline-card-head"><div><time dateTime={entry.startDate}>{formatDate(entry.startDate)}</time><p className="timeline-end">{entry.endDate ? `Period ended ${formatDate(entry.endDate)}` : 'Last day not recorded'}</p></div><button className="edit-entry-button" type="button" onClick={() => editEntry(entry)} aria-label={`Edit entry for ${formatDate(entry.startDate)}`}><Pencil size={14} aria-hidden="true" /> Edit</button></div>{entry.symptoms.length > 0 ? <div className="timeline-symptoms"><div className="symptom-chip-list">{entry.symptoms.map((symptom) => <span className="tracker-chip timeline-chip" key={symptom}>{symptom}</span>)}</div><span className="timeline-severity">{entry.severity}</span></div> : <p className="timeline-no-symptoms">No symptoms recorded</p>}{entry.note && <p className="timeline-note">“{entry.note}”</p>}</article></li>)}</ol>}
      </section>

      {confirmClear && <div className="tracker-dialog-backdrop"><section className="tracker-dialog" role="dialog" aria-modal="true" aria-labelledby="clear-dialog-title" aria-describedby="clear-dialog-description"><span className="dialog-icon"><Trash2 size={20} aria-hidden="true" /></span><h3 id="clear-dialog-title">Clear all tracker data?</h3><p id="clear-dialog-description">This will permanently remove all period and symptom entries saved in this browser. You can export your data first if you’d like to keep a copy.</p><div className="dialog-actions"><button className="tracker-text-button" type="button" onClick={() => setConfirmClear(false)}>Keep my data</button><button className="dialog-delete-button" type="button" onClick={clearAll}>Clear all data</button></div></section></div>}
    </section>
  )
}

export default HealthTracker
