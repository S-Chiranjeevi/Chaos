/**
 * PCOS Saathi - Canonical Shared Data Models & Storage Keys
 * 
 * Strict architectural contracts for all 9 project members.
 * Guarantees zero remote database dependencies, offline persistence,
 * and reliable inter-module data compatibility.
 */

// ============================================================================
// 1. CANONICAL STORAGE KEYS (Strictly Enforced)
// ============================================================================
export const STORAGE_KEYS = {
  HEALTH_ENTRIES: 'pcos_saathi_health_entries',
  CYCLE_ENTRIES: 'pcos_saathi_cycle_entries',
  INSIGHTS: 'pcos_saathi_insights',
  DOCTOR_SUMMARY: 'pcos_saathi_doctor_summary',
  PREFERENCES: 'pcos_saathi_preferences',
  AI_CONSENT: 'pcos_saathi_ai_consent',
  APIVERVE_FORECASTS: 'pcos_saathi_apiverve_forecasts',
};

// Global disclaimer string required across non-diagnostic medical surfaces
export const MEDICAL_DISCLAIMER =
  'PCOS Saathi provides educational, non-diagnostic guidance to support clinical conversations. It does not provide medical diagnosis, prescriptions, or treatment plans.';

// ============================================================================
// 2. SHARED OBJECT: RedFlag
// ============================================================================
/**
 * @typedef {Object} RedFlag
 * @property {string} id - Unique identifier (e.g. "rf-fever-pelvic-1729000000")
 * @property {string} ruleId - Rule identifier triggering this alert
 * @property {string} title - Short clinical concern title
 * @property {string} description - Objective explanation of why this requires urgent evaluation
 * @property {'emergency' | 'urgent_clinical' | 'routine_followup'} urgencyLevel - Triage urgency
 * @property {string} actionPrompt - Direct directive (e.g. "Contact 108 immediately or visit nearest ER")
 * @property {string} [emergencyHelpline] - Default '108'
 * @property {string} detectedAt - ISO 8601 timestamp
 * @property {string[]} triggerKeywords - Keywords that triggered this flag
 */
export function createRedFlag({
  id = `rf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  ruleId = 'general_alert',
  title,
  description,
  urgencyLevel = 'urgent_clinical',
  actionPrompt = 'Please consult a gynecologist or urgent care provider.',
  emergencyHelpline = '108',
  detectedAt = new Date().toISOString(),
  triggerKeywords = [],
}) {
  return {
    id,
    ruleId,
    title,
    description,
    urgencyLevel,
    actionPrompt,
    emergencyHelpline,
    detectedAt,
    triggerKeywords,
  };
}

// ============================================================================
// 3. SHARED OBJECT: SafetyResult
// ============================================================================
/**
 * @typedef {Object} SafetyResult
 * @property {boolean} isSafe - True if text contains no prescription requests or unverified medical advice
 * @property {boolean} hasRedFlags - True if acute red flags detected
 * @property {RedFlag[]} redFlags - List of active red flags
 * @property {string[]} blockedPrescriptions - Any intercepted medication/dosage references
 * @property {string} sanitizedText - Cleaned text safe for presentation
 * @property {string} disclaimer - Mandatory non-diagnostic notice
 * @property {string} checkedAt - ISO 8601 timestamp
 */
export function createSafetyResult({
  isSafe = true,
  hasRedFlags = false,
  redFlags = [],
  blockedPrescriptions = [],
  sanitizedText = '',
  disclaimer = MEDICAL_DISCLAIMER,
  checkedAt = new Date().toISOString(),
} = {}) {
  return {
    isSafe,
    hasRedFlags,
    redFlags,
    blockedPrescriptions,
    sanitizedText,
    disclaimer,
    checkedAt,
  };
}

// ============================================================================
// 4. SHARED OBJECT: HealthEntry
// ============================================================================
/**
 * @typedef {Object} SymptomItem
 * @property {string} id - Symptom item id
 * @property {string} name - Common symptom name (e.g., "Irregular Period", "Facial Hair", "Acne")
 * @property {string} duration - Duration string (e.g. "3 months", "2 weeks")
 * @property {string} frequency - Frequency string (e.g. "Daily", "Occasional")
 * @property {'Mild' | 'Moderate' | 'Severe' | 'Unspecified'} severity - Symptom severity
 * @property {'Hormonal' | 'Cycle' | 'Pain' | 'Metabolic' | 'Mood' | 'General'} category
 * @property {boolean} [isCustom]
 */

/**
 * @typedef {Object} HealthEntry
 * @property {string} id - Unique entry ID
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {'en' | 'hi' | 'kn' | 'ta' | 'ml'} language - Language used during entry
 * @property {'speech' | 'text' | 'manual'} inputMode - Input modality
 * @property {string} rawTranscript - Verbatim user transcript or input text
 * @property {SymptomItem[]} symptoms - Structured extracted symptoms
 * @property {string} notes - Optional personal notes or reflections
 * @property {string[]} tags - Categorization tags
 * @property {Object} [vitals] - Optional physiological measurements
 * @property {SafetyResult} [safety] - Safety and triage verification
 * @property {Object} metadata - App version and timestamp metadata
 */
export function createHealthEntry({
  id = `he-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  timestamp = new Date().toISOString(),
  language = 'en',
  inputMode = 'text',
  rawTranscript = '',
  symptoms = [],
  notes = '',
  tags = [],
  vitals = {},
  safety = null,
  metadata = {},
} = {}) {
  return {
    id,
    timestamp,
    version: '1.0.0',
    language,
    inputMode,
    rawTranscript,
    symptoms: symptoms.map((s, idx) => ({
      id: s.id || `sym-${idx}-${Date.now()}`,
      name: s.name || s.symptom || 'Unspecified symptom',
      duration: s.duration || 'Not specified',
      frequency: s.frequency || 'Not specified',
      severity: ['Mild', 'Moderate', 'Severe'].includes(s.severity) ? s.severity : 'Unspecified',
      category: s.category || 'General',
      isCustom: Boolean(s.isCustom),
    })),
    notes,
    tags: tags.length > 0 ? tags : symptoms.map((s) => s.name || s.symptom).filter(Boolean),
    vitals: {
      weightKg: vitals.weightKg || null,
      bpSystolic: vitals.bpSystolic || null,
      bpDiastolic: vitals.bpDiastolic || null,
      sleepHours: vitals.sleepHours || null,
      stressLevel: vitals.stressLevel || null, // 1 to 5
    },
    safety: safety || createSafetyResult(),
    metadata: {
      source: 'PCOS Saathi Talk or Type',
      appVersion: '3.0.0',
      exportedAt: new Date().toISOString(),
      ...metadata,
    },
  };
}

// ============================================================================
// 5. SHARED OBJECT: CycleEntry
// ============================================================================
/**
 * @typedef {Object} CycleEntry
 * @property {string} id - Unique cycle entry ID
 * @property {string} startDate - Period start date (YYYY-MM-DD)
 * @property {string | null} endDate - Period end date (YYYY-MM-DD)
 * @property {number | null} cycleLengthDays - Days since previous cycle start
 * @property {number | null} periodDurationDays - Flow duration
 * @property {'spotting' | 'light' | 'medium' | 'heavy'} flowLevel
 * @property {number} painScore - 0 (no pain) to 10 (incapacitating)
 * @property {string[]} associatedSymptoms - e.g. ["severe cramps", "bloating", "migraine"]
 * @property {string} notes - Freeform observations
 * @property {string} timestamp - ISO 8601 creation time
 */
export function createCycleEntry({
  id = `cy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  startDate,
  endDate = null,
  cycleLengthDays = null,
  periodDurationDays = null,
  flowLevel = 'medium',
  painScore = 0,
  associatedSymptoms = [],
  notes = '',
  timestamp = new Date().toISOString(),
}) {
  return {
    id,
    startDate,
    endDate,
    cycleLengthDays,
    periodDurationDays,
    flowLevel,
    painScore: Math.min(10, Math.max(0, Number(painScore) || 0)),
    associatedSymptoms: Array.isArray(associatedSymptoms) ? associatedSymptoms : [],
    notes: notes || '',
    timestamp,
  };
}

// ============================================================================
// 6. SHARED OBJECT: Insight
// ============================================================================
/**
 * @typedef {Object} Insight
 * @property {string} id - Unique insight ID
 * @property {string} generatedAt - ISO 8601 timestamp
 * @property {'cycle_regularity' | 'symptom_progression' | 'cluster_correlation' | 'lifestyle'} category
 * @property {string} title - Human-readable insight title
 * @property {string} summary - Short 1-2 sentence explanation
 * @property {string[]} details - Bullet points supporting the observation
 * @property {string[]} evidenceEntries - IDs of triggering entries
 * @property {'high' | 'moderate' | 'exploratory'} confidence
 * @property {string} suggestedAction - Actionable next step (e.g. discuss timeline with doctor)
 * @property {string} disclaimer
 */
export function createInsight({
  id = `ins-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
  generatedAt = new Date().toISOString(),
  category = 'cycle_regularity',
  title,
  summary,
  details = [],
  evidenceEntries = [],
  confidence = 'moderate',
  suggestedAction = 'Note these dates to review with your gynecologist during your next appointment.',
  disclaimer = MEDICAL_DISCLAIMER,
}) {
  return {
    id,
    generatedAt,
    category,
    title,
    summary,
    details: Array.isArray(details) ? details : [details],
    evidenceEntries: Array.isArray(evidenceEntries) ? evidenceEntries : [],
    confidence,
    suggestedAction,
    disclaimer,
  };
}

// ============================================================================
// 7. SHARED OBJECT: DoctorSummary
// ============================================================================
/**
 * @typedef {Object} DoctorSummary
 * @property {string} id - Unique summary ID
 * @property {string} generatedAt - ISO 8601 timestamp
 * @property {Object} patientProfile - High-level demographic context
 * @property {Object} timeframe - Window covered by the summary
 * @property {Record<string, number>} symptomFrequency - Counts of logged symptoms
 * @property {Object} cycleMetrics - Computed cycle regularity stats
 * @property {RedFlag[]} activeRedFlags - Any active red flags
 * @property {Insight[]} keyInsights - Extracted insights
 * @property {string[]} questionsForClinician - Clinician questions checklist
 * @property {string} printableText - Pre-formatted plain text for clipboard/printing
 * @property {string} disclaimer
 */
export function createDoctorSummary({
  id = `doc-sum-${Date.now()}`,
  generatedAt = new Date().toISOString(),
  patientProfile = {},
  timeframe = { fromDate: '', toDate: '', totalEntriesCount: 0 },
  symptomFrequency = {},
  cycleMetrics = {
    averageCycleDays: null,
    longestCycle: null,
    shortestCycle: null,
    irregularityScore: 'unknown',
  },
  activeRedFlags = [],
  keyInsights = [],
  questionsForClinician = [],
  printableText = '',
  disclaimer = MEDICAL_DISCLAIMER,
} = {}) {
  return {
    id,
    generatedAt,
    patientProfile: {
      preferredLanguage: patientProfile.preferredLanguage || 'en',
      ageRange: patientProfile.ageRange || 'Not specified',
      primaryConcerns: patientProfile.primaryConcerns || [],
    },
    timeframe,
    symptomFrequency,
    cycleMetrics,
    activeRedFlags,
    keyInsights,
    questionsForClinician,
    printableText,
    disclaimer,
  };
}
