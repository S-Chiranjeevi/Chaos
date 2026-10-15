import React, { useState, useEffect, useMemo } from 'react'
import {
  FileText,
  Copy,
  Printer,
  Download,
  Edit3,
  Check,
  X,
  Plus,
  RotateCcw,
  AlertTriangle,
  Stethoscope,
  Sparkles,
  Calendar,
  Activity,
  Heart,
  HelpCircle,
  Share2,
} from 'lucide-react'
import { t } from '../data/translations.js'
import { getLatestHealthEntry } from '../models/healthEntry.js'
import { analyzeHealthPatterns, DISCLAIMER } from '../services/patternDetectionService.js'

function savedPersonalizedInsights() {
  try {
    const saved = JSON.parse(localStorage.getItem('sakhicare_doctor_insights') || '[]')
    return Array.isArray(saved) ? saved.map((insight) => `${insight.title}: ${insight.message}`).filter(Boolean) : []
  } catch {
    return []
  }
}

export const DEFAULT_DOCTOR_SUMMARY = {
  narrative: 'Over the last three months, I recorded periods occurring approximately every 40–45 days. I also noticed acne and increased facial hair. Pelvic discomfort was recorded twice. I would like to discuss possible causes and whether further evaluation is appropriate.',
  mainSymptoms: [
    { symptom: 'Irregular or infrequent periods', duration: '3 months', frequency: 'Every 40–45 days', severity: 'Moderate' },
    { symptom: 'Acne and skin breakouts', duration: '2 months', frequency: 'Persistent', severity: 'Moderate' },
    { symptom: 'Increased facial hair', duration: 'Gradual over 6 months', frequency: 'Continuous', severity: 'Moderate' },
    { symptom: 'Pelvic discomfort', duration: 'Recent', frequency: 'Recorded twice with cycle', severity: 'Mild' }
  ],
  cycleHistory: [
    { startDate: '2026-04-10', endDate: '2026-04-14', length: 44 },
    { startDate: '2026-05-24', endDate: '2026-05-28', length: 42 },
    { startDate: '2026-07-05', endDate: '2026-07-09', length: 45 }
  ],
  averageCycleLength: '43.7 days (Range: 42–45 days)',
  repeatedPatterns: [
    'Recent cycles are longer than normal window (>35 days)',
    'Co-occurrence of cycle irregularity and androgenic skin/hair changes',
    'Repeated pelvic discomfort recorded across multiple cycles'
  ],
  redFlags: [],
  suggestedSpecialist: 'Consultation with a Gynecologist is recommended. An evaluation with an Endocrinologist may also provide helpful hormonal insights.',
  questionsForDoctor: [
    'What clinical evaluations (such as pelvic ultrasound or hormone panel) are recommended for my cycle pattern?',
    'Could my symptoms be linked to PCOS, thyroid function, or another underlying hormonal balance?',
    'What tracking parameters or symptom diary would be most useful for you to see over the next 2–3 cycles?',
    'Are there specific lifestyle or nutritional adjustments that support cycle regularity in my situation?'
  ],
  personalizedInsights: [
    'International guidelines (such as Rotterdam criteria) require ruling out thyroid or prolactin conditions before confirming a hormonal diagnosis.',
    'Tracking cycle start dates alongside flow intensity helps distinguish ovulatory delays from other causes.'
  ],
  userNotes: 'Family history of thyroid imbalance on maternal side. Currently taking a daily multivitamin.',
  disclaimer: 'This is information, not a diagnosis.'
}

const AVAILABLE_INSIGHTS = [
  'Requesting an ultrasound in the early follicular phase gives clearer baseline ovarian morphology.',
  'Evaluating Fasting Glucose and Fasting Insulin can screen for metabolic insulin resistance.',
  'Checking Free Testosterone and DHEA-S helps distinguish adrenal versus ovarian androgen sources.',
  'TSH and Free T4 blood tests help rule out subclinical hypothyroidism.',
  'Serum Prolactin testing evaluates pituitary-ovarian signaling.'
]

export function DoctorSummary({
  initialData = null,
  currentLanguage = 'en',
  onCopySuccess
}) {
  const [summaryData, setSummaryData] = useState(() => {
    const selectedInsights = savedPersonalizedInsights()
    // Check if initialData provided, or latest health entry, or default
    if (initialData) return initialData
    const savedEntry = getLatestHealthEntry()
    if (savedEntry && savedEntry.symptoms && savedEntry.symptoms.length > 0) {
      return {
        ...DEFAULT_DOCTOR_SUMMARY,
        narrative: `I am sharing a summary of symptoms recorded in SakhiCare: "${savedEntry.rawTranscript}". I would like to discuss possible causes and whether further evaluation is appropriate.`,
        mainSymptoms: savedEntry.symptoms.map((s) => ({
          symptom: s.symptom,
          duration: s.duration || 'Not specified',
          frequency: s.frequency || 'Not specified',
          severity: s.severity || 'Moderate',
        })),
        disclaimer: DISCLAIMER,
        personalizedInsights: [...new Set([...DEFAULT_DOCTOR_SUMMARY.personalizedInsights, ...selectedInsights])],
      }
    }
    return { ...DEFAULT_DOCTOR_SUMMARY, personalizedInsights: [...new Set([...DEFAULT_DOCTOR_SUMMARY.personalizedInsights, ...selectedInsights])] }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(summaryData)
  const [copied, setCopied] = useState(false)
  const [selectedInsightToAdd, setSelectedInsightToAdd] = useState('')
  const [newCustomQuestion, setNewCustomQuestion] = useState('')

  // Sync edit form if summaryData changes
  useEffect(() => {
    setEditForm(summaryData)
  }, [summaryData])

  function handleSaveEdit() {
    setSummaryData(editForm)
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditForm(summaryData)
    setIsEditing(false)
  }

  function handleClearSummary() {
    if (window.confirm('Are you sure you want to clear your current summary?')) {
      const reset = {
        narrative: '',
        mainSymptoms: [],
        cycleHistory: [],
        averageCycleLength: 'Not enough data logged yet',
        repeatedPatterns: [],
        redFlags: [],
        suggestedSpecialist: 'Gynecologist',
        questionsForDoctor: [
          'What diagnostic tests are appropriate for my symptoms?',
          'What information would be helpful for me to track?'
        ],
        personalizedInsights: [],
        userNotes: '',
        disclaimer: DISCLAIMER,
      }
      setSummaryData(reset)
      setEditForm(reset)
    }
  }

  // Format the complete summary as clean, legible text for sharing / printing
  const plainTextSummary = useMemo(() => {
    return `SAKHICARE — CLINICIAN DISCUSSION SUMMARY
Generated: ${new Date().toLocaleDateString()}
Storage: 100% On-Device / Local
Disclaimer: ${summaryData.disclaimer || DISCLAIMER}

PATIENT SUMMARY STATEMENT:
"${summaryData.narrative}"

1. MAIN SYMPTOMS (${summaryData.mainSymptoms?.length || 0}):
${summaryData.mainSymptoms?.map((s, i) => `   ${i + 1}. ${s.symptom}
      - Severity: ${s.severity}
      - Duration: ${s.duration}
      - Frequency: ${s.frequency}`).join('\n') || '   None recorded.'}

2. CYCLE HISTORY & REGULARITY:
   - Average Cycle Length: ${summaryData.averageCycleLength}
   - Recorded Periods:
${summaryData.cycleHistory?.map((c, i) => `      * ${c.startDate} to ${c.endDate || c.startDate} (${c.length ? `${c.length} days` : 'length logged'})`).join('\n') || '      No cycle dates recorded.'}

3. OBSERVED PATTERNS:
${summaryData.repeatedPatterns?.map((p, i) => `   - ${p}`).join('\n') || '   - No repeated patterns identified yet.'}

4. IMMEDIATE ATTENTION / RED FLAGS:
${summaryData.redFlags && summaryData.redFlags.length > 0 ? summaryData.redFlags.map((rf) => `   [!] ${rf}`).join('\n') : '   [OK] No emergency red flags reported.'}

5. SUGGESTED SPECIALIST:
   ${summaryData.suggestedSpecialist}

6. QUESTIONS FOR MY DOCTOR:
${summaryData.questionsForDoctor?.map((q, i) => `   [ ] ${i + 1}. ${q}`).join('\n') || '   None prepared.'}

7. PERSONALIZED CARE INSIGHTS:
${summaryData.personalizedInsights?.map((ins) => `   * ${ins}`).join('\n') || '   None selected.'}

8. PERSONAL NOTES:
   ${summaryData.userNotes || 'None added.'}

NOTE: SakhiCare is an educational self-advocacy tool and does not provide clinical diagnosis.`
  }, [summaryData])

  function handleCopy() {
    navigator.clipboard?.writeText(plainTextSummary)
    setCopied(true)
    if (onCopySuccess) onCopySuccess()
    setTimeout(() => setCopied(false), 2500)
  }

  function handlePrint() {
    window.print()
  }

  function handleDownloadText() {
    const blob = new Blob([plainTextSummary], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakhicare-doctor-summary-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleExportJson() {
    const exportObject = {
      schema: 'SakhiCareDoctorSummary_v1',
      generatedAt: new Date().toISOString(),
      language: currentLanguage,
      ...summaryData,
      metadata: {
        tool: 'SakhiCare Multilingual Doctor Summary',
        diagnosticClaim: false,
        source: 'Self-reported timeline & pattern detection',
      }
    }
    const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakhicare-doctor-summary-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleAddSelectedInsight() {
    if (!selectedInsightToAdd) return
    if (!summaryData.personalizedInsights.includes(selectedInsightToAdd)) {
      setSummaryData((prev) => ({
        ...prev,
        personalizedInsights: [...prev.personalizedInsights, selectedInsightToAdd]
      }))
    }
    setSelectedInsightToAdd('')
  }

  function handleAddCustomQuestion(e) {
    e.preventDefault()
    if (!newCustomQuestion.trim()) return
    setSummaryData((prev) => ({
      ...prev,
      questionsForDoctor: [...prev.questionsForDoctor, newCustomQuestion.trim()]
    }))
    setNewCustomQuestion('')
  }

  return (
    <div className="doctor-summary-container">
      {/* HEADER WITH TITLE & ACTION TOOLBAR */}
      <div className="summary-page-header">
        <div>
          <span className="subhead-pill">Doctor Visit Preparation</span>
          <h2>{t('summaryLabels.title', currentLanguage)}</h2>
          <p className="summary-subtitle">{t('summaryLabels.subtitle', currentLanguage)}</p>
        </div>

        {/* PRIMARY ACTION BUTTONS */}
        <div className="summary-actions-toolbar">
          <button
            type="button"
            className="btn-toolbar copy"
            onClick={handleCopy}
            title="Copy summary to clipboard"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t('buttons.copied', currentLanguage) : t('buttons.copySummary', currentLanguage)}</span>
          </button>

          <button
            type="button"
            className="btn-toolbar print"
            onClick={handlePrint}
            title="Print doctor summary report"
          >
            <Printer size={16} />
            <span>{t('buttons.printSummary', currentLanguage)}</span>
          </button>

          <button
            type="button"
            className="btn-toolbar download-txt"
            onClick={handleDownloadText}
            title="Download plain text file"
          >
            <Download size={16} />
            <span>{t('buttons.downloadText', currentLanguage)}</span>
          </button>

          <button
            type="button"
            className="btn-toolbar export-json"
            onClick={handleExportJson}
            title="Export standardized JSON"
          >
            <Share2 size={16} />
            <span>{t('buttons.exportJson', currentLanguage)}</span>
          </button>

          {!isEditing ? (
            <button
              type="button"
              className="btn-toolbar edit"
              onClick={() => setIsEditing(true)}
              title="Edit summary narrative and details"
            >
              <Edit3 size={16} />
              <span>{t('buttons.editSummary', currentLanguage)}</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-toolbar save"
              onClick={handleSaveEdit}
            >
              <Check size={16} />
              <span>{t('buttons.save', currentLanguage)}</span>
            </button>
          )}

          <button
            type="button"
            className="btn-toolbar clear"
            onClick={handleClearSummary}
            title="Reset to blank template"
          >
            <RotateCcw size={15} />
            <span>{t('buttons.clearSummary', currentLanguage)}</span>
          </button>
        </div>
      </div>

      {/* MANDATORY DISCLAIMER BANNER */}
      <div className="summary-disclaimer-banner" role="status">
        <Heart size={20} className="banner-icon" />
        <div className="disclaimer-text-group">
          <strong>{t('disclaimer.standard', currentLanguage)}</strong>
          <span>{t('disclaimer.pcosGuidance', currentLanguage)}</span>
          <small>{t('summaryLabels.rotterdamNote', currentLanguage)}</small>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY / OPENING STATEMENT */}
      <div className="summary-narrative-card">
        <div className="narrative-card-header">
          <FileText size={18} className="narrative-icon" />
          <h3>What to Say: Prepared Patient Statement</h3>
        </div>

        {!isEditing ? (
          <div className="narrative-quote-box">
            <p className="narrative-quote">“{summaryData.narrative}”</p>
            <span className="narrative-tip">
              Tip: You can read this opening paragraph directly to your doctor or nurse practitioner at the start of your consultation.
            </span>
          </div>
        ) : (
          <div className="narrative-edit-box">
            <label>Edit Patient Statement:</label>
            <textarea
              rows={4}
              value={editForm.narrative}
              onChange={(e) => setEditForm({ ...editForm, narrative: e.target.value })}
              className="narrative-textarea"
            />
          </div>
        )}
      </div>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <div className="summary-grid">
        {/* LEFT COLUMN: SYMPTOMS & CYCLE HISTORY */}
        <div className="summary-col">
          {/* MAIN SYMPTOMS */}
          <div className="summary-section-card">
            <div className="card-heading-row">
              <Activity size={18} className="section-icon" />
              <h4>{t('summaryLabels.mainSymptoms', currentLanguage)} ({summaryData.mainSymptoms?.length || 0})</h4>
            </div>

            {summaryData.mainSymptoms?.length === 0 ? (
              <p className="empty-subtext">No symptoms recorded yet.</p>
            ) : (
              <div className="symptoms-summary-table">
                {summaryData.mainSymptoms?.map((sym, idx) => (
                  <div key={idx} className="symptom-summary-row">
                    <div className="sym-col-main">
                      <span className="sym-name">{sym.symptom}</span>
                      <div className="sym-meta-tags">
                        <span className="sym-tag duration">Duration: {sym.duration}</span>
                        <span className="sym-tag frequency">Frequency: {sym.frequency}</span>
                      </div>
                    </div>
                    <span className={`severity-tag ${sym.severity?.toLowerCase()}`}>
                      {sym.severity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CYCLE HISTORY & REGULARITY */}
          <div className="summary-section-card">
            <div className="card-heading-row">
              <Calendar size={18} className="section-icon" />
              <h4>{t('summaryLabels.cycleHistory', currentLanguage)}</h4>
            </div>

            <div className="cycle-highlight-box">
              <span className="highlight-label">{t('summaryLabels.averageCycleLengthLabel', currentLanguage)}</span>
              <span className="highlight-val">{summaryData.averageCycleLength}</span>
            </div>

            {summaryData.cycleHistory && summaryData.cycleHistory.length > 0 && (
              <div className="cycle-history-list">
                <span className="list-label">Logged Period Cycles:</span>
                <ul>
                  {summaryData.cycleHistory.map((c, i) => (
                    <li key={i}>
                      <strong>{c.startDate}</strong> {c.endDate && c.endDate !== c.startDate ? `to ${c.endDate}` : ''}
                      {c.length && <span className="cycle-days-tag">({c.length} days)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* REPEATED PATTERNS */}
          <div className="summary-section-card">
            <div className="card-heading-row">
              <Sparkles size={18} className="section-icon" />
              <h4>{t('summaryLabels.repeatedPatterns', currentLanguage)}</h4>
            </div>

            {summaryData.repeatedPatterns && summaryData.repeatedPatterns.length > 0 ? (
              <ul className="patterns-bullet-list">
                {summaryData.repeatedPatterns.map((pat, i) => (
                  <li key={i}>{pat}</li>
                ))}
              </ul>
            ) : (
              <p className="empty-subtext">No repeated patterns identified yet.</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SPECIALIST, QUESTIONS & INSIGHTS */}
        <div className="summary-col">
          {/* SUGGESTED SPECIALIST */}
          <div className="summary-section-card highlight-specialist">
            <div className="card-heading-row">
              <Stethoscope size={18} className="section-icon" />
              <h4>{t('summaryLabels.suggestedSpecialist', currentLanguage)}</h4>
            </div>
            <p className="specialist-recommendation">{summaryData.suggestedSpecialist}</p>
          </div>

          {/* RED FLAGS IF PRESENT */}
          {summaryData.redFlags && summaryData.redFlags.length > 0 && (
            <div className="summary-section-card red-flags-card">
              <div className="card-heading-row">
                <AlertTriangle size={18} className="section-icon" />
                <h4>{t('summaryLabels.redFlags', currentLanguage)}</h4>
              </div>
              <ul className="red-flags-list">
                {summaryData.redFlags.map((rf, i) => (
                  <li key={i}>{rf}</li>
                ))}
              </ul>
            </div>
          )}

          {/* QUESTIONS FOR DOCTOR */}
          <div className="summary-section-card">
            <div className="card-heading-row">
              <HelpCircle size={18} className="section-icon" />
              <h4>{t('summaryLabels.questionsForDoctor', currentLanguage)}</h4>
            </div>

            <ul className="doctor-questions-checklist">
              {summaryData.questionsForDoctor?.map((q, i) => (
                <li key={i} className="question-item">
                  <input type="checkbox" id={`q-check-${i}`} defaultChecked={false} />
                  <label htmlFor={`q-check-${i}`}>{q}</label>
                </li>
              ))}
            </ul>

            {/* Add custom question inline */}
            <form onSubmit={handleAddCustomQuestion} className="add-question-form">
              <input
                type="text"
                placeholder="Add another question to your doctor list..."
                value={newCustomQuestion}
                onChange={(e) => setNewCustomQuestion(e.target.value)}
              />
              <button type="submit" className="btn-add-q">
                <Plus size={14} />
                <span>Add Question</span>
              </button>
            </form>
          </div>

          {/* PERSONALIZED CARE INSIGHTS & ADD INSIGHT ACTION */}
          <div className="summary-section-card">
            <div className="card-heading-row">
              <Sparkles size={18} className="section-icon" />
              <h4>{t('summaryLabels.personalizedInsights', currentLanguage)}</h4>
            </div>

            <ul className="insights-list">
              {summaryData.personalizedInsights?.map((ins, i) => (
                <li key={i}>
                  <span className="bullet">✦</span>
                  <span>{ins}</span>
                </li>
              ))}
            </ul>

            {/* ACTION: ADD SELECTED INSIGHT */}
            <div className="add-insight-tray">
              <label>Add evidence-based insight to summary:</label>
              <div className="insight-picker-row">
                <select
                  value={selectedInsightToAdd}
                  onChange={(e) => setSelectedInsightToAdd(e.target.value)}
                >
                  <option value="">-- Choose an insight to add --</option>
                  {AVAILABLE_INSIGHTS.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-add-insight"
                  onClick={handleAddSelectedInsight}
                  disabled={!selectedInsightToAdd}
                >
                  <Plus size={14} />
                  <span>{t('buttons.addInsight', currentLanguage)}</span>
                </button>
              </div>
            </div>
          </div>

          {/* USER NOTES */}
          <div className="summary-section-card">
            <div className="card-heading-row">
              <FileText size={18} className="section-icon" />
              <h4>{t('summaryLabels.userNotes', currentLanguage)}</h4>
            </div>

            {!isEditing ? (
              <p className="user-notes-text">{summaryData.userNotes || 'No additional notes added yet.'}</p>
            ) : (
              <textarea
                rows={3}
                value={editForm.userNotes}
                onChange={(e) => setEditForm({ ...editForm, userNotes: e.target.value })}
                className="narrative-textarea"
                placeholder="Add personal notes, questions, or medication history..."
              />
            )}
          </div>
        </div>
      </div>

      {/* EDIT ACTIONS BANNER WHEN IN EDIT MODE */}
      {isEditing && (
        <div className="edit-banner-actions">
          <span>Editing mode active. Click save to apply your updates to the summary.</span>
          <div className="edit-banner-btn-group">
            <button type="button" className="btn-save-edit" onClick={handleSaveEdit}>
              <Check size={16} />
              <span>{t('buttons.save', currentLanguage)}</span>
            </button>
            <button type="button" className="btn-cancel-edit" onClick={handleCancelEdit}>
              <X size={16} />
              <span>{t('buttons.cancel', currentLanguage)}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorSummary
