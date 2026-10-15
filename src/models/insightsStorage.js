/**
 * Luna Her - Local Insights Storage & Tracking Model
 * 
 * Manages local persistence for personalized insights, doctor summaries,
 * user preferences, and feedback while respecting strict privacy rules.
 * No data is ever sent to third parties without consent.
 */

const STORAGE_KEYS = {
  INSIGHTS: 'lunaher_ai_insights',
  RECORDS: 'lunaher_insight_records',
  DOCTOR_SUMMARY: 'lunaher_doctor_summary',
  PREFERENCES: 'lunaher_user_preferences',
  FEEDBACK: 'lunaher_insights_feedback',
}

const LEGACY_STORAGE_KEYS = {
  INSIGHTS: 'sakhicare_ai_insights',
  RECORDS: 'sakhicare_insight_records',
  DOCTOR_SUMMARY: 'sakhicare_doctor_summary',
  PREFERENCES: 'sakhicare_user_preferences',
  FEEDBACK: 'sakhicare_insights_feedback',
}

function getStorage() {
  if (typeof localStorage !== 'undefined') return localStorage
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage
  return null
}

function safeGet(key, fallback, legacyKey = null) {
  const storage = getStorage()
  if (!storage) return fallback
  try {
    const val = storage.getItem(key) || (legacyKey ? storage.getItem(legacyKey) : null)
    return val ? JSON.parse(val) : fallback
  } catch {
    return fallback
  }
}

function safeSet(key, value) {
  const storage = getStorage()
  if (!storage) return
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {
    // Gracefully handle storage quotas or private browsing restrictions
  }
}

/**
 * Creates a unique deterministic fingerprint of current input data
 * to determine whether new data has been added since the last generation.
 */
export function computeDataFingerprint(periodLogs = [], symptomLogs = []) {
  const pStr = periodLogs
    .map((p) => `${p.id || ''}:${p.date || ''}:${p.cycleLengthDays || ''}:${p.note || ''}`)
    .sort()
    .join('|')
  const sStr = symptomLogs
    .map((s) => `${s.id || ''}:${s.date || ''}:${s.symptom || ''}:${s.severity || ''}`)
    .sort()
    .join('|')
  return `${pStr}__${sStr}`
}

/**
 * Reads all stored insight tracking records
 */
export function getInsightRecords() {
  return safeGet(STORAGE_KEYS.RECORDS, [])
}

/**
 * Records or updates that an insight was shown to the user
 */
export function recordInsightShown(insight, dataFingerprint = '', sourceCount = 0) {
  const records = getInsightRecords()
  const today = new Date().toISOString().split('T')[0]
  const existingIndex = records.findIndex((r) => r.insightId === insight.id)
  const count = sourceCount || insight?.sourceEntries?.length || 0

  if (existingIndex >= 0) {
    records[existingIndex].lastShownAt = today
    records[existingIndex].dataFingerprint = dataFingerprint
    records[existingIndex].sourceCount = count
  } else {
    records.push({
      insightId: insight.id,
      firstShownAt: today,
      lastShownAt: today,
      dismissed: false,
      addedToSummary: false,
      dataFingerprint,
      sourceCount: count,
    })
  }

  safeSet(STORAGE_KEYS.RECORDS, records)
  return records
}

/**
 * Marks an insight as dismissed
 */
export function dismissInsight(insightId) {
  const records = getInsightRecords()
  const today = new Date().toISOString().split('T')[0]
  const existing = records.find((r) => r.insightId === insightId)

  if (existing) {
    existing.dismissed = true
    existing.lastShownAt = today
  } else {
    records.push({
      insightId,
      firstShownAt: today,
      lastShownAt: today,
      dismissed: true,
      addedToSummary: false,
    })
  }

  safeSet(STORAGE_KEYS.RECORDS, records)

  // Also remove from cached insights
  const currentInsights = safeGet(STORAGE_KEYS.INSIGHTS, [])
  const updated = currentInsights.filter((i) => i.id !== insightId)
  safeSet(STORAGE_KEYS.INSIGHTS, updated)

  return records
}

/**
 * Adds an insight to the user's Doctor Summary list
 */
export function addToDoctorSummary(insight) {
  const summary = safeGet(STORAGE_KEYS.DOCTOR_SUMMARY, [])
  if (!summary.some((item) => item.id === insight.id)) {
    summary.push({
      ...insight,
      addedAt: new Date().toISOString(),
    })
    safeSet(STORAGE_KEYS.DOCTOR_SUMMARY, summary)
  }

  // Update or create insight record
  const records = getInsightRecords()
  const existing = records.find((r) => r.insightId === insight.id)
  const today = new Date().toISOString().split('T')[0]
  if (existing) {
    existing.addedToSummary = true
  } else {
    records.push({
      insightId: insight.id,
      firstShownAt: today,
      lastShownAt: today,
      dismissed: false,
      addedToSummary: true,
    })
  }
  safeSet(STORAGE_KEYS.RECORDS, records)

  return summary
}

/**
 * Removes an insight from Doctor Summary
 */
export function removeFromDoctorSummary(insightId) {
  const summary = safeGet(STORAGE_KEYS.DOCTOR_SUMMARY, [])
  const updated = summary.filter((item) => item.id !== insightId)
  safeSet(STORAGE_KEYS.DOCTOR_SUMMARY, updated)

  const records = getInsightRecords()
  const existing = records.find((r) => r.insightId === insightId)
  if (existing) {
    existing.addedToSummary = false
    safeSet(STORAGE_KEYS.RECORDS, records)
  }

  return updated
}

/**
 * Gets Doctor Summary items
 */
export function getDoctorSummary() {
  return safeGet(STORAGE_KEYS.DOCTOR_SUMMARY, [])
}

/**
 * Reads user preferences
 */
export function getUserPreferences() {
  return safeGet(STORAGE_KEYS.PREFERENCES, {
    preferredDoctor: 'female doctor',
    communicationStyle: 'simple',
    cloudAiConsent: false,
    showFewer: false,
    userLanguage: 'English',
  })
}

/**
 * Saves user preferences
 */
export function saveUserPreferences(prefs) {
  const current = getUserPreferences()
  const updated = { ...current, ...prefs }
  safeSet(STORAGE_KEYS.PREFERENCES, updated)
  return updated
}

/**
 * Records user feedback (e.g., "This is not helpful") locally
 */
export function recordInsightFeedback(insightId, feedbackType) {
  const feedback = safeGet(STORAGE_KEYS.FEEDBACK, [])
  feedback.push({
    insightId,
    type: feedbackType,
    date: new Date().toISOString(),
  })
  safeSet(STORAGE_KEYS.FEEDBACK, feedback)
}

/**
 * Deletes all Luna Her insights, records, doctor summary, and preferences
 * Complete local data deletion for user privacy.
 */
export function deleteMyInsights() {
  const storage = getStorage()
  if (!storage) return
  const allKeys = [...Object.values(STORAGE_KEYS), ...Object.values(LEGACY_STORAGE_KEYS)]
  allKeys.forEach((key) => {
    try {
      storage.removeItem(key)
    } catch {
      // Ignore
    }
  })
}
