import React, { useState, useMemo } from 'react'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Calendar,
  Activity,
  Plus,
  Trash2,
  FileText,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Download,
} from 'lucide-react'
import { analyzeHealthPatterns, DISCLAIMER } from '../services/patternDetectionService.js'

// Pre-packaged test scenarios for hackathon judges and users to test immediately
export const TEST_PRESETS = [
  {
    id: 'preset-irregular-cycles',
    label: '1. Three Irregular Cycles',
    description: 'Cycles of 62, 71, and 58 days',
    data: {
      periodLogs: [
        { startDate: '2026-01-01', endDate: '2026-01-05' },
        { startDate: '2026-03-04', endDate: '2026-03-08' },
        { startDate: '2026-05-14', endDate: '2026-05-18' },
        { startDate: '2026-07-11', endDate: '2026-07-15' },
      ],
      symptomLogs: [],
    },
  },
  {
    id: 'preset-repeated-acne',
    label: '2. Repeated Acne Entries',
    description: 'Acne logged across 3 consecutive months',
    data: {
      periodLogs: [],
      symptomLogs: [
        { symptom: 'acne', date: '2026-05-01', severity: 'moderate', duration: 'ongoing', note: 'Breakouts on cheeks' },
        { symptom: 'acne', date: '2026-06-01', severity: 'moderate', duration: 'ongoing', note: 'Persistent pimples' },
        { symptom: 'acne', date: '2026-07-01', severity: 'moderate', duration: 'ongoing', note: 'New breakouts' },
      ],
    },
  },
  {
    id: 'preset-increasing-severity',
    label: '3. Increasing Severity (Mild → Severe)',
    description: 'Symptom progressing from mild to severe over time',
    data: {
      periodLogs: [],
      symptomLogs: [
        { symptom: 'fatigue', date: '2026-05-10', severity: 'mild', duration: 'few days', note: 'Slight sluggishness' },
        { symptom: 'fatigue', date: '2026-06-10', severity: 'moderate', duration: '1 week', note: 'Struggling to wake up' },
        { symptom: 'fatigue', date: '2026-07-10', severity: 'severe', duration: '2 weeks', note: 'Exhausted throughout day' },
      ],
    },
  },
  {
    id: 'preset-severe-pain',
    label: '4. Severe Pelvic Pain (Red Flag)',
    description: 'Acute severe pelvic pain needing immediate care',
    data: {
      periodLogs: [],
      symptomLogs: [
        { symptom: 'pelvic pain', date: '2026-07-15', severity: 'severe', note: 'Sudden unbearable pelvic cramping' },
      ],
    },
  },
  {
    id: 'preset-bleeding-dizziness',
    label: '5. Heavy Bleeding with Dizziness (Red Flag)',
    description: 'Flooding flow with lightheadedness',
    data: {
      periodLogs: [],
      symptomLogs: [
        { symptom: 'heavy bleeding', date: '2026-07-15', severity: 'severe', note: 'Soaking pad hourly' },
        { symptom: 'dizziness', date: '2026-07-15', severity: 'moderate', note: 'Felt lightheaded standing up' },
      ],
    },
  },
  {
    id: 'preset-single-period',
    label: '6. Only One Period Entry',
    description: 'Incomplete cycle history prompting more entries',
    data: {
      periodLogs: [{ startDate: '2026-06-01', endDate: '2026-06-05' }],
      symptomLogs: [],
    },
  },
  {
    id: 'preset-no-data',
    label: '7. No Data (Empty State)',
    description: 'Clean blank state',
    data: {
      periodLogs: [],
      symptomLogs: [],
    },
  },
  {
    id: 'preset-incomplete',
    label: '8. Incomplete Entries',
    description: 'Missing dates or severity information',
    data: {
      periodLogs: [],
      symptomLogs: [
        { symptom: '', note: 'felt strange' },
        { symptom: 'cramp', date: '', severity: '' },
      ],
    },
  },
]

export function PatternDetectionView({ initialPeriodLogs = [], initialSymptomLogs = [], onDoctorSummaryAdd }) {
  const [periodLogs, setPeriodLogs] = useState(initialPeriodLogs)
  const [symptomLogs, setSymptomLogs] = useState(initialSymptomLogs)
  const [dismissedWarningIds, setDismissedWarningIds] = useState(new Set())
  const [doctorSummaryItems, setDoctorSummaryItems] = useState([])
  const [activePresetId, setActivePresetId] = useState(null)

  // New period log form state
  const [newPeriodStart, setNewPeriodStart] = useState('')
  const [newPeriodEnd, setNewPeriodEnd] = useState('')

  // New symptom log form state
  const [newSymptomName, setNewSymptomName] = useState('')
  const [newSymptomDate, setNewSymptomDate] = useState('')
  const [newSymptomSeverity, setNewSymptomSeverity] = useState('moderate')
  const [newSymptomDuration, setNewSymptomDuration] = useState('')
  const [newSymptomNote, setNewSymptomNote] = useState('')

  // Run the rules-based pattern detection engine
  const analysis = useMemo(() => {
    return analyzeHealthPatterns({
      periodLogs,
      symptomLogs,
    })
  }, [periodLogs, symptomLogs])

  // Filter out user-dismissed warnings
  const visibleWarnings = useMemo(() => {
    return analysis.warnings.filter((w) => !dismissedWarningIds.has(w.id))
  }, [analysis.warnings, dismissedWarningIds])

  // Preset loader
  function loadPreset(preset) {
    setActivePresetId(preset.id)
    setPeriodLogs(preset.data.periodLogs)
    setSymptomLogs(preset.data.symptomLogs)
    setDismissedWarningIds(new Set())
  }

  function handleAddPeriod(e) {
    e.preventDefault()
    if (!newPeriodStart) return
    const newLog = {
      startDate: newPeriodStart,
      endDate: newPeriodEnd || newPeriodStart,
    }
    setPeriodLogs((prev) => [...prev, newLog])
    setNewPeriodStart('')
    setNewPeriodEnd('')
    setActivePresetId(null)
  }

  function handleAddSymptom(e) {
    e.preventDefault()
    if (!newSymptomName) return
    const newLog = {
      symptom: newSymptomName.trim(),
      date: newSymptomDate || new Date().toISOString().slice(0, 10),
      severity: newSymptomSeverity,
      duration: newSymptomDuration.trim(),
      note: newSymptomNote.trim(),
    }
    setSymptomLogs((prev) => [...prev, newLog])
    setNewSymptomName('')
    setNewSymptomDuration('')
    setNewSymptomNote('')
    setActivePresetId(null)
  }

  function handleDismiss(warningId) {
    setDismissedWarningIds((prev) => new Set([...prev, warningId]))
  }

  function handleAddToDoctorSummary(warning) {
    if (!doctorSummaryItems.some((item) => item.id === warning.id)) {
      const nextItems = [...doctorSummaryItems, warning]
      setDoctorSummaryItems(nextItems)
      if (onDoctorSummaryAdd) {
        onDoctorSummaryAdd(warning)
      }
    }
  }

  function handleClearAll() {
    setPeriodLogs([])
    setSymptomLogs([])
    setDismissedWarningIds(new Set())
    setDoctorSummaryItems([])
    setActivePresetId(null)
  }

  const getVisualLevelStyle = (level) => {
    switch (level) {
      case 'red':
        return 'warning-card-red'
      case 'amber':
        return 'warning-card-amber'
      case 'blue':
      default:
        return 'warning-card-blue'
    }
  }

  return (
    <div className="pattern-detection-module" id="pattern-detection">
      {/* SECTION HEADER */}
      <div className="pattern-header">
        <div className="pattern-title-group">
          <span className="subhead-pill">Early Warning & Pattern Detection</span>
          <h2>Health Pattern Insights</h2>
          <p>
            Local, rules-based pattern detection across your period dates, symptom duration, frequency, and severity.
            Private by design. Does not diagnose PCOS or any other condition.
          </p>
        </div>

        <button
          type="button"
          className="btn-clear-tracker"
          onClick={handleClearAll}
          title="Reset to blank"
        >
          <RotateCcw size={14} />
          <span>Reset Logs</span>
        </button>
      </div>

      {/* PRESET SCENARIO SELECTOR (FOR JUDGES & TESTING) */}
      <div className="presets-tray">
        <div className="presets-label">
          <Sparkles size={14} className="sparkle-icon" />
          <span>Try a Test Case Scenario:</span>
        </div>
        <div className="preset-buttons-grid">
          {TEST_PRESETS.map((p) => {
            const isActive = activePresetId === p.id
            return (
              <button
                key={p.id}
                type="button"
                className={`preset-btn ${isActive ? 'active' : ''}`}
                onClick={() => loadPreset(p)}
              >
                <span className="preset-title">{p.label}</span>
                <span className="preset-desc">{p.description}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* URGENT RED FLAG BANNER IF PRESENT */}
      {analysis.urgency === 'urgent' && (
        <div className="urgent-top-banner" role="alert">
          <div className="urgent-badge-row">
            <ShieldAlert size={22} className="urgent-icon" />
            <h3>Please seek urgent medical care</h3>
          </div>
          <p className="urgent-desc">
            Severe pain or very heavy bleeding can require immediate medical attention.
          </p>
          <div className="urgent-action-box">
            <strong>Recommended Action:</strong>
            <span>{analysis.action || 'Contact local emergency services or visit an urgent care facility.'}</span>
          </div>
        </div>
      )}

      {/* WARNING CARDS LIST */}
      <div className="warnings-section">
        {visibleWarnings.length === 0 ? (
          <div className="empty-patterns-card">
            <Info size={28} className="empty-icon" />
            <h4>Keep logging periods and symptoms. We’ll help you notice patterns over time.</h4>
            <p>
              When repeated cycles or symptoms are recorded, safe and understandable guidance cards will appear here.
            </p>
          </div>
        ) : (
          <div className="warning-cards-grid">
            {visibleWarnings.map((item) => {
              const cardClass = getVisualLevelStyle(item.level)
              const isAddedToSummary = doctorSummaryItems.some((s) => s.id === item.id)

              return (
                <article key={item.id} className={`warning-card ${cardClass}`}>
                  <div className="card-top-indicator">
                    <div className="level-badge-group">
                      {item.level === 'red' && <AlertCircle size={15} className="level-icon" />}
                      {item.level === 'amber' && <AlertTriangle size={15} className="level-icon" />}
                      {item.level === 'blue' && <Info size={15} className="level-icon" />}
                      <span className="level-label">
                        {item.level === 'red'
                          ? 'Seek Urgent Care'
                          : item.level === 'amber'
                          ? 'Consider Booking Appointment'
                          : 'Information'}
                      </span>
                    </div>
                    <span className="urgency-pill-tag">Urgency: {item.urgency}</span>
                  </div>

                  <h3 className="card-headline">{item.title}</h3>
                  <p className="card-explanation">{item.description}</p>

                  {item.evidence && (
                    <div className="card-evidence-box">
                      <span className="evidence-label">Evidence from your entries:</span>
                      <p className="evidence-text">“{item.evidence}”</p>
                    </div>
                  )}

                  <div className="card-next-step">
                    <strong>Suggested Next Step:</strong>
                    <span>{item.suggestedAction}</span>
                  </div>

                  <div className="card-footer-actions">
                    <button
                      type="button"
                      className={`btn-doctor-summary ${isAddedToSummary ? 'added' : ''}`}
                      onClick={() => handleAddToDoctorSummary(item)}
                    >
                      {isAddedToSummary ? <Check size={14} /> : <Plus size={14} />}
                      <span>{isAddedToSummary ? 'Added to Doctor Summary' : 'Add to Doctor Summary'}</span>
                    </button>

                    <button
                      type="button"
                      className="btn-dismiss-warning"
                      onClick={() => handleDismiss(item.id)}
                      aria-label="Dismiss warning"
                    >
                      <span>Dismiss</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* DOCTOR SUMMARY BASKET */}
      {doctorSummaryItems.length > 0 && (
        <div className="doctor-summary-basket">
          <div className="basket-header">
            <FileText size={18} className="basket-icon" />
            <h4>Doctor Discussion Summary ({doctorSummaryItems.length} patterns saved)</h4>
          </div>
          <ul className="basket-list">
            {doctorSummaryItems.map((item) => (
              <li key={item.id}>
                <strong>{item.title}:</strong> {item.evidence || item.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DATA INPUT FORMS (PERIODS & SYMPTOMS) */}
      <div className="data-input-split">
        {/* PERIOD LOG FORM */}
        <div className="input-box-card">
          <div className="box-title-row">
            <Calendar size={18} className="box-icon" />
            <h4>Period Date Entries ({periodLogs.length})</h4>
          </div>
          <form onSubmit={handleAddPeriod} className="inline-log-form">
            <div className="form-row-2col">
              <label>
                Start Date *
                <input
                  type="date"
                  value={newPeriodStart}
                  onChange={(e) => setNewPeriodStart(e.target.value)}
                  required
                />
              </label>
              <label>
                End Date (Optional)
                <input
                  type="date"
                  value={newPeriodEnd}
                  onChange={(e) => setNewPeriodEnd(e.target.value)}
                />
              </label>
            </div>
            <button type="submit" className="btn-add-log">
              <Plus size={14} />
              <span>Log Period Date</span>
            </button>
          </form>

          {periodLogs.length > 0 && (
            <div className="logged-chips-list">
              {periodLogs.map((p, idx) => (
                <span key={idx} className="logged-chip">
                  {p.startDate} {p.endDate && p.endDate !== p.startDate ? `to ${p.endDate}` : ''}
                  <button
                    type="button"
                    onClick={() => setPeriodLogs(periodLogs.filter((_, i) => i !== idx))}
                    aria-label="Remove period log"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* SYMPTOM LOG FORM */}
        <div className="input-box-card">
          <div className="box-title-row">
            <Activity size={18} className="box-icon" />
            <h4>Symptom Entries ({symptomLogs.length})</h4>
          </div>
          <form onSubmit={handleAddSymptom} className="inline-log-form">
            <div className="form-row-2col">
              <label>
                Symptom Name *
                <input
                  type="text"
                  placeholder="e.g. acne, pelvic pain, fatigue"
                  value={newSymptomName}
                  onChange={(e) => setNewSymptomName(e.target.value)}
                  required
                />
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={newSymptomDate}
                  onChange={(e) => setNewSymptomDate(e.target.value)}
                />
              </label>
            </div>
            <div className="form-row-2col">
              <label>
                Severity
                <select
                  value={newSymptomSeverity}
                  onChange={(e) => setNewSymptomSeverity(e.target.value)}
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </label>
              <label>
                Duration
                <input
                  type="text"
                  placeholder="e.g. 2 months, 3 weeks"
                  value={newSymptomDuration}
                  onChange={(e) => setNewSymptomDuration(e.target.value)}
                />
              </label>
            </div>
            <label>
              Note (Optional)
              <input
                type="text"
                placeholder="e.g. noticed with periods, sudden"
                value={newSymptomNote}
                onChange={(e) => setNewSymptomNote(e.target.value)}
              />
            </label>
            <button type="submit" className="btn-add-log">
              <Plus size={14} />
              <span>Log Symptom</span>
            </button>
          </form>

          {symptomLogs.length > 0 && (
            <div className="logged-chips-list">
              {symptomLogs.map((s, idx) => (
                <span key={idx} className="logged-chip">
                  <strong>{s.symptom}</strong> ({s.severity}) {s.date ? `· ${s.date}` : ''}
                  <button
                    type="button"
                    onClick={() => setSymptomLogs(symptomLogs.filter((_, i) => i !== idx))}
                    aria-label="Remove symptom log"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MANDATORY DISCLAIMER */}
      <div className="pattern-disclaimer-strip">
        <p>{DISCLAIMER}</p>
      </div>
    </div>
  )
}
