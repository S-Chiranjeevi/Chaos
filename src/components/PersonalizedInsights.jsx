import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Sparkles,
  AlertTriangle,
  Calendar,
  Stethoscope,
  HelpCircle,
  Check,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Shield,
  ThumbsDown,
  SlidersHorizontal,
  RefreshCw,
  Printer,
  Copy,
  ShieldAlert,
  HeartHandshake,
  Activity,
  Layers,
} from 'lucide-react'
import {
  generatePersonalizedInsights,
  generateAiInsightsWithFallback,
  INSIGHT_CATEGORIES,
  DISCLAIMER,
} from '../services/aiInsightsEngine.js'
import {
  getInsightRecords,
  recordInsightShown,
  dismissInsight,
  addToDoctorSummary,
  removeFromDoctorSummary,
  getDoctorSummary,
  getUserPreferences,
  saveUserPreferences,
  deleteMyInsights,
  recordInsightFeedback,
  computeDataFingerprint,
} from '../models/insightsStorage.js'
import { PRESETS } from '../data/insightPresets.js'

export function PersonalizedInsights({
  currentPeriodLogs = [],
  currentSymptomLogs = [],
  userLanguage = 'English',
}) {
  // Preferences State
  const [preferences, setPreferences] = useState(() => getUserPreferences())
  const [showPreferences, setShowPreferences] = useState(false)
  const [showPlayground, setShowPlayground] = useState(false)
  const [activePresetId, setActivePresetId] = useState(null)

  // Doctor Summary Modal State
  const [doctorSummary, setDoctorSummary] = useState(() => getDoctorSummary())
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [summaryCopied, setSummaryCopied] = useState(false)

  // Insights State
  const [insights, setInsights] = useState([])
  const [fallbackNotice, setFallbackNotice] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [expandedWhyId, setExpandedWhyId] = useState(null)
  const [feedbackGiven, setFeedbackGiven] = useState({})
  const [deleteNotice, setDeleteNotice] = useState(false)
  const [simulateAiFailure, setSimulateAiFailure] = useState(false)

  // Determine current effective logs (either from live tracker or selected preset)
  const effectiveData = useMemo(() => {
    if (activePresetId) {
      const preset = PRESETS.find((p) => p.id === activePresetId)
      if (preset) return preset.data
    }

    // Adapt cycle tracker logs format
    const adaptedPeriods = (currentPeriodLogs || []).map((entry, idx) => ({
      id: entry.id || `period-${idx}`,
      date: entry.date,
      cycleLengthDays: entry.cycleLengthDays,
      note: entry.note,
    }))

    // Adapt symptom logs
    const adaptedSymptoms = (currentSymptomLogs || []).map((entry, idx) => ({
      id: entry.id || `symptom-${idx}`,
      date: entry.date || entry.timestamp || '2026-10-15',
      symptom: entry.symptom || entry.label,
      severity: entry.severity || 'Moderate',
      duration: entry.duration,
      notes: entry.notes,
    }))

    return {
      userLanguage: preferences.userLanguage || userLanguage,
      periodLogs: adaptedPeriods,
      symptomLogs: adaptedSymptoms,
      userPreferences: preferences,
    }
  }, [activePresetId, currentPeriodLogs, currentSymptomLogs, userLanguage, preferences])

  // Run insight generation
  const runGeneration = useCallback(async () => {
    setIsGenerating(true)
    const records = getInsightRecords()
    const fingerprint = computeDataFingerprint(effectiveData.periodLogs, effectiveData.symptomLogs)

    const payload = {
      ...effectiveData,
      previousInsights: records,
      dataFingerprint: fingerprint,
    }

    try {
      const result = await generateAiInsightsWithFallback(payload, {
        enableCloudAi: preferences.cloudAiConsent || simulateAiFailure,
        forceFailure: simulateAiFailure,
      })

      // Record shown insights in history
      result.insights.forEach((ins) => {
        recordInsightShown(ins, fingerprint, ins.sourceEntries?.length || 0)
      })

      // Filter by 'showFewer' preference if active (limits to max 2)
      let displayed = result.insights
      if (preferences.showFewer && displayed.length > 2) {
        displayed = displayed.slice(0, 2)
      }

      setInsights(displayed)
      setFallbackNotice(result.fallbackNotice)
    } catch {
      // In case of unexpected JS error, fallback to deterministic rules
      const fallbackResult = generatePersonalizedInsights(payload)
      setInsights(fallbackResult.insights)
      setFallbackNotice('We could not generate a personalized explanation right now. Your saved information is still available.')
    } finally {
      setIsGenerating(false)
    }
  }, [effectiveData, preferences, simulateAiFailure])

  // Generate on load or data changes
  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      if (!cancelled) {
        runGeneration()
      }
    }, 0)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [runGeneration])

  // User Actions
  const handleDismiss = (insightId) => {
    dismissInsight(insightId)
    setInsights((prev) => prev.filter((i) => i.id !== insightId))
  }

  const handleAddToSummary = (insight) => {
    const updated = addToDoctorSummary(insight)
    setDoctorSummary(updated)
  }

  const handleRemoveFromSummary = (insightId) => {
    const updated = removeFromDoctorSummary(insightId)
    setDoctorSummary(updated)
  }

  const handleFeedback = (insightId) => {
    recordInsightFeedback(insightId, 'not_helpful')
    setFeedbackGiven((prev) => ({ ...prev, [insightId]: true }))
    setTimeout(() => {
      setInsights((prev) => prev.filter((i) => i.id !== insightId))
    }, 1200)
  }

  const handleToggleWhy = (insightId) => {
    setExpandedWhyId((prev) => (prev === insightId ? null : insightId))
  }

  const handleUpdatePreferences = (changes) => {
    const updated = saveUserPreferences(changes)
    setPreferences(updated)
  }

  const handleDeleteAllInsights = () => {
    deleteMyInsights()
    setInsights([])
    setDoctorSummary([])
    setDeleteNotice(true)
    setTimeout(() => setDeleteNotice(false), 4000)
  }

  const copyDoctorSummaryText = () => {
    const lines = [
      'Luna Her — Doctor Consultation Preparation Notes',
      `Date: ${new Date().toLocaleDateString()}`,
      `Communication Style: ${preferences.communicationStyle}`,
      '--------------------------------------------------',
      ...doctorSummary.map((item, idx) => (
        `[${idx + 1}] ${item.title}\nObservation: ${item.message}\nUser Data Context: ${item.whyThisAppeared}\nSuggested Discussion: ${item.suggestedAction}\n`
      )),
      '--------------------------------------------------',
      `Notice: ${DISCLAIMER}`,
    ]
    navigator.clipboard?.writeText(lines.join('\n\n'))
    setSummaryCopied(true)
    setTimeout(() => setSummaryCopied(false), 2500)
  }

  // Find actual raw entries for "Why am I seeing this?" modal/accordion
  const getSourceEntriesDetails = (sourceIds = []) => {
    if (!sourceIds.length) return []
    const periodMap = new Map((effectiveData.periodLogs || []).map((p) => [p.id, { type: 'Period Log', ...p }]))
    const symptomMap = new Map((effectiveData.symptomLogs || []).map((s) => [s.id, { type: 'Symptom Log', ...s }]))

    return sourceIds.map((id) => {
      const match = periodMap.get(id) || symptomMap.get(id)
      if (match) return match
      return { id, type: 'Recorded Log', date: 'Tracked Date', detail: 'User entry data point' }
    })
  }

  return (
    <div className="insights-container" id="ai-insights-section">
      {/* Header with Title and Control Buttons */}
      <div className="insights-header">
        <div className="insights-title-group">
          <div className="insights-pill">
            <Sparkles size={14} className="sparkle-spin" />
            <span>Personalized Health Insights</span>
          </div>
          <h2 className="insights-heading">Your Cycle & Symptom Patterns</h2>
          <p className="insights-subheading">
            Easy-to-understand patterns identified directly from your own logged history.
            Always educational, non-diagnostic, and ready for your doctor discussion.
          </p>
        </div>

        <div className="insights-top-actions">
          <button
            type="button"
            className="insights-btn summary-btn"
            onClick={() => setShowSummaryModal(true)}
            title="View saved doctor discussion summary"
          >
            <Stethoscope size={16} />
            <span>Doctor Summary</span>
            {doctorSummary.length > 0 && (
              <span className="summary-badge">{doctorSummary.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`insights-btn prefs-btn ${showPreferences ? 'active' : ''}`}
            onClick={() => setShowPreferences(!showPreferences)}
            title="Personalization preferences & privacy settings"
          >
            <SlidersHorizontal size={16} />
            <span>Preferences</span>
          </button>

          <button
            type="button"
            className={`insights-btn test-btn ${showPlayground ? 'active' : ''}`}
            onClick={() => setShowPlayground(!showPlayground)}
            title="Test presets for all 10 feature requirements"
          >
            <Activity size={16} />
            <span>Test Scenarios</span>
          </button>
        </div>
      </div>

      {/* Fallback Notice when AI API fails */}
      {fallbackNotice && (
        <div className="insights-fallback-banner" role="alert">
          <AlertTriangle size={18} className="fallback-icon" />
          <div className="fallback-copy">
            <strong>Service Notice:</strong> {fallbackNotice}
          </div>
        </div>
      )}

      {/* Delete confirmation banner */}
      {deleteNotice && (
        <div className="insights-delete-banner" role="status">
          <Check size={18} />
          <span>All saved insights, history, and doctor summary data have been deleted from this device.</span>
        </div>
      )}

      {/* Interactive Testing & Scenario Playground */}
      {showPlayground && (
        <div className="insights-playground-panel">
          <div className="playground-header">
            <div className="playground-title">
              <Layers size={16} />
              <h4>Feature Testing Playground (10 Requirements)</h4>
            </div>
            <button
              type="button"
              className="playground-close"
              onClick={() => setShowPlayground(false)}
            >
              ×
            </button>
          </div>
          <p className="playground-desc">
            Click any scenario to instantly test how the engine processes user history, language, and edge cases:
          </p>
          <div className="preset-buttons-grid">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`preset-btn ${activePresetId === p.id ? 'active' : ''}`}
                onClick={() => {
                  setActivePresetId(p.id)
                  setSimulateAiFailure(false)
                }}
              >
                <strong>{p.label}</strong>
                <span>{p.description}</span>
              </button>
            ))}
            <button
              type="button"
              className={`preset-btn ${simulateAiFailure ? 'active failure-mode' : ''}`}
              onClick={() => {
                setSimulateAiFailure(!simulateAiFailure)
                setActivePresetId(null)
              }}
            >
              <strong>8. Simulate AI API Failure</strong>
              <span>Forces API failure to test rule engine fallback</span>
            </button>
            <button
              type="button"
              className="preset-btn reset-btn"
              onClick={() => {
                setActivePresetId(null)
                setSimulateAiFailure(false)
              }}
            >
              <strong>Live Tracker Data</strong>
              <span>Reset to your real browser logs</span>
            </button>
          </div>
        </div>
      )}

      {/* Preferences & Privacy Controls Dropdown Panel */}
      {showPreferences && (
        <div className="insights-preferences-card">
          <div className="pref-section-title">
            <SlidersHorizontal size={16} />
            <span>Insight Personalization & Privacy Controls</span>
          </div>

          <div className="pref-grid">
            <div className="pref-item">
              <label>Communication Style</label>
              <select
                value={preferences.communicationStyle}
                onChange={(e) => handleUpdatePreferences({ communicationStyle: e.target.value })}
              >
                <option value="simple">Simple (Plain, everyday phrasing)</option>
                <option value="detailed">Detailed (Includes metrics & cycle counts)</option>
              </select>
            </div>

            <div className="pref-item">
              <label>Preferred Doctor Consultation</label>
              <select
                value={preferences.preferredDoctor}
                onChange={(e) => handleUpdatePreferences({ preferredDoctor: e.target.value })}
              >
                <option value="female doctor">Female Doctor / Gynecologist</option>
                <option value="a gynecologist">General Gynecologist</option>
                <option value="an endocrinologist">Endocrinologist (Hormone Specialist)</option>
              </select>
            </div>

            <div className="pref-item">
              <label>Language Preference</label>
              <select
                value={preferences.userLanguage}
                onChange={(e) => handleUpdatePreferences({ userLanguage: e.target.value })}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिन्दी)</option>
              </select>
            </div>

            <div className="pref-item checkbox-item">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={preferences.showFewer}
                  onChange={(e) => handleUpdatePreferences({ showFewer: e.target.checked })}
                />
                <span>Show fewer insights (Limit to 1-2 cards)</span>
              </label>
            </div>

            <div className="pref-item checkbox-item ai-consent">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={preferences.cloudAiConsent}
                  onChange={(e) => handleUpdatePreferences({ cloudAiConsent: e.target.checked })}
                />
                <span>
                  <strong>Optional Cloud AI Consent:</strong> Allow secure AI explanations.
                  (When unchecked, 100% runs on your device locally via private rule engine.)
                </span>
              </label>
            </div>
          </div>

          <div className="pref-footer">
            <button
              type="button"
              className="delete-insights-btn"
              onClick={handleDeleteAllInsights}
            >
              <Trash2 size={14} />
              <span>Delete my insights & summary history</span>
            </button>
          </div>
        </div>
      )}

      {/* Insights Cards List (Max 3) */}
      <div className="insights-cards-grid">
        {isGenerating ? (
          <div className="insights-loading-card">
            <RefreshCw size={24} className="spin-icon" />
            <p>Analyzing cycle intervals and symptom logs...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="insights-empty-state">
            <HeartHandshake size={32} />
            <h3>No insights to display</h3>
            <p>You have dismissed all previous insights, or new entries are needed to detect patterns.</p>
            <button
              type="button"
              className="insights-refresh-btn"
              onClick={() => {
                deleteMyInsights()
                runGeneration()
              }}
            >
              <RefreshCw size={14} />
              <span>Reset & Re-evaluate</span>
            </button>
          </div>
        ) : (
          insights.map((insight) => {
            const isUrgent = insight.urgency === 'urgent'
            const isSoon = insight.urgency === 'soon'
            const isWhyExpanded = expandedWhyId === insight.id
            const isAdded = doctorSummary.some((s) => s.id === insight.id)
            const feedbackSubmitted = feedbackGiven[insight.id]
            const sourceDetails = getSourceEntriesDetails(insight.sourceEntries)

            return (
              <div
                key={insight.id}
                className={`insight-card ${isUrgent ? 'card-urgent' : isSoon ? 'card-soon' : 'card-routine'}`}
              >
                {/* Top Badge & Urgency Tag */}
                <div className="card-top-bar">
                  <div className="category-tag">
                    {isUrgent ? (
                      <ShieldAlert size={15} className="urgent-icon" />
                    ) : insight.category === INSIGHT_CATEGORIES.CYCLE_PATTERN ? (
                      <Calendar size={15} />
                    ) : (
                      <Activity size={15} />
                    )}
                    <span className="category-name">{formatCategoryLabel(insight.category)}</span>
                  </div>

                  <div className="card-meta">
                    {isUrgent && <span className="urgency-badge urgent">Seek Urgent Care</span>}
                    {isSoon && <span className="urgency-badge soon">Discuss Soon</span>}
                    {insight.confidence && (
                      <span className="confidence-pill">{insight.confidence} confidence</span>
                    )}
                  </div>
                </div>

                {/* Card Title & Educational Message (< 40 words) */}
                <h3 className="insight-title">{insight.title}</h3>
                <p className="insight-message">{insight.message}</p>

                {/* Suggested Action */}
                <div className="insight-action-box">
                  <Stethoscope size={15} className="action-icon" />
                  <span className="action-text">{insight.suggestedAction}</span>
                </div>

                {/* Interactive User Controls */}
                <div className="card-controls">
                  <button
                    type="button"
                    className={`control-btn why-btn ${isWhyExpanded ? 'active' : ''}`}
                    onClick={() => handleToggleWhy(insight.id)}
                    aria-expanded={isWhyExpanded}
                  >
                    <HelpCircle size={14} />
                    <span>Why am I seeing this?</span>
                    {isWhyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <button
                    type="button"
                    className={`control-btn summary-add-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => (isAdded ? handleRemoveFromSummary(insight.id) : handleAddToSummary(insight))}
                  >
                    {isAdded ? (
                      <>
                        <Check size={14} />
                        <span>Added to Summary</span>
                      </>
                    ) : (
                      <>
                        <FileText size={14} />
                        <span>Add to doctor summary</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="control-btn dismiss-btn"
                    onClick={() => handleDismiss(insight.id)}
                    title="Dismiss this insight"
                  >
                    <span>Dismiss</span>
                  </button>

                  <button
                    type="button"
                    className={`control-btn unhelpful-btn ${feedbackSubmitted ? 'submitted' : ''}`}
                    onClick={() => handleFeedback(insight.id)}
                    title="Mark as not helpful"
                    disabled={feedbackSubmitted}
                  >
                    <ThumbsDown size={13} />
                    <span>{feedbackSubmitted ? 'Feedback saved' : 'Not helpful'}</span>
                  </button>
                </div>

                {/* Explainability Panel ("Why am I seeing this?") */}
                {isWhyExpanded && (
                  <div className="why-panel">
                    <div className="why-explanation">
                      <strong>AI Explanation:</strong> {insight.whyThisAppeared}
                    </div>

                    <div className="why-evidence-section">
                      <div className="evidence-header">
                        <Clock size={13} />
                        <span>Actual user data entries used as evidence:</span>
                      </div>
                      {sourceDetails.length > 0 ? (
                        <ul className="evidence-list">
                          {sourceDetails.map((entry, idx) => (
                            <li key={idx} className="evidence-item">
                              <span className="evidence-date">
                                {entry.date ? new Date(`${entry.date}T12:00:00`).toLocaleDateString() : 'Recorded Log'}
                              </span>
                              <span className="evidence-detail">
                                {entry.cycleLengthDays
                                  ? `Cycle length: ${entry.cycleLengthDays} days`
                                  : entry.symptom
                                    ? `${entry.symptom} (${entry.severity || 'Logged'})`
                                    : entry.note || 'Logged timeline event'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="evidence-fallback">Based on overall timeline pattern and lack of recent entries.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Non-Diagnostic Medical Disclaimer Footer */}
      <div className="insights-disclaimer-box">
        <Shield size={16} className="disclaimer-shield" />
        <span>{DISCLAIMER} Luna Her helps you prepare for doctor conversations; it does not provide diagnoses or prescriptions.</span>
      </div>

      {/* Doctor Summary Modal */}
      {showSummaryModal && (
        <div className="summary-modal-backdrop" onClick={() => setShowSummaryModal(false)}>
          <div className="summary-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <Stethoscope size={20} className="modal-icon" />
                <h3>Doctor Discussion Summary</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowSummaryModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="summary-intro">
                Review and take these observed patterns to your appointment with <strong>{preferences.preferredDoctor}</strong>.
              </p>

              {doctorSummary.length === 0 ? (
                <div className="summary-empty">
                  <FileText size={32} />
                  <p>No insights added to your summary yet. Click <strong>"Add to doctor summary"</strong> on any insight card above.</p>
                </div>
              ) : (
                <div className="summary-items-list">
                  {doctorSummary.map((item, idx) => (
                    <div key={item.id || idx} className="summary-item-card">
                      <div className="summary-item-top">
                        <span className="summary-item-idx">#{idx + 1}</span>
                        <h4>{item.title}</h4>
                        <button
                          type="button"
                          className="summary-item-remove"
                          onClick={() => handleRemoveFromSummary(item.id)}
                          title="Remove from summary"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="summary-item-msg">"{item.message}"</p>
                      <div className="summary-item-why">
                        <strong>Evidence:</strong> {item.whyThisAppeared}
                      </div>
                      <div className="summary-item-action">
                        <strong>Suggested topic:</strong> {item.suggestedAction}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <div className="modal-disclaimer">{DISCLAIMER}</div>
              <div className="modal-actions">
                {doctorSummary.length > 0 && (
                  <>
                    <button
                      type="button"
                      className="modal-copy-btn"
                      onClick={copyDoctorSummaryText}
                    >
                      {summaryCopied ? <Check size={16} /> : <Copy size={16} />}
                      <span>{summaryCopied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                    </button>
                    <button
                      type="button"
                      className="modal-print-btn"
                      onClick={() => window.print()}
                    >
                      <Printer size={16} />
                      <span>Print Sheet</span>
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="modal-done-btn"
                  onClick={() => setShowSummaryModal(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function formatCategoryLabel(category) {
  switch (category) {
    case INSIGHT_CATEGORIES.SAFETY_WARNING:
      return 'Safety Warning'
    case INSIGHT_CATEGORIES.CYCLE_PATTERN:
      return 'Cycle Pattern'
    case INSIGHT_CATEGORIES.REPEATED_SYMPTOM:
      return 'Repeated Symptom'
    case INSIGHT_CATEGORIES.CHANGING_SEVERITY:
      return 'Changing Severity'
    case INSIGHT_CATEGORIES.SYMPTOM_DURATION:
      return 'Symptom Duration'
    case INSIGHT_CATEGORIES.DOCTOR_PREPARATION:
      return 'Doctor Preparation'
    case INSIGHT_CATEGORIES.MISSING_INFORMATION:
      return 'Missing Information'
    case INSIGHT_CATEGORIES.SELF_CARE_REMINDER:
      return 'Self-Care Reminder'
    default:
      return 'Health Insight'
  }
}
