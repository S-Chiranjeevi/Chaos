/**
 * SakhiCare Shared HealthEntry Format
 * 
 * Standardized data contract for symptom descriptions, extracted clinical features,
 * and non-diagnostic educational guidance for PCOS and women's health.
 */
import { clearLocalHealthData, readLocalData, STORAGE_KEYS, writeLocalData } from '../services/localStorage.js'

export const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe', 'Unspecified']

export const createHealthEntry = ({
  id = `sakhi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  timestamp = new Date().toISOString(),
  language = 'en',
  inputMode = 'text', // 'text' | 'speech'
  rawTranscript = '',
  symptoms = [],
  assessment = null,
  disclaimerAcknowledged = true,
  notes = '',
} = {}) => {
  return {
    id,
    timestamp,
    version: '1.0.0',
    language,
    inputMode,
    rawTranscript,
    symptoms: symptoms.map((s, index) => ({
      id: s.id || `sym-${index}-${Date.now()}`,
      symptom: s.symptom || s.label || 'Unspecified symptom',
      duration: s.duration || 'Not specified',
      frequency: s.frequency || 'Not specified',
      severity: SEVERITY_LEVELS.includes(s.severity) ? s.severity : 'Unspecified',
      category: s.category || 'General',
      isCustom: Boolean(s.isCustom),
    })),
    assessment: assessment || {
      statement: 'These symptoms can sometimes occur with PCOS, but they can also have other causes.',
      urgency: 'routine',
      topics: [],
      questionsForDoctor: [],
      redFlags: [],
    },
    disclaimerAcknowledged,
    notes,
    metadata: {
      source: 'SakhiCare Talk or Type',
      appVersion: '2.4.0',
      exportedAt: new Date().toISOString(),
    },
  }
}

/**
 * Exposes the HealthEntry to the global scope and notifies listeners
 */
export const publishHealthEntry = (entry) => {
  if (typeof window === 'undefined') return

  // Keep the entry in this page and notify first-party UI components.
  // Health data is never sent to a server, analytics tool, or external API.
  try {
    const event = new CustomEvent('sakhicare:healthEntryUpdate', {
      detail: entry,
      bubbles: true,
    })
    window.dispatchEvent(event)
  } catch { /* The page can still save locally if events are unavailable. */ }

  // Save only on this device. The UI handles storage failures without losing the note in memory.
  return writeLocalData(STORAGE_KEYS.latestEntry, entry)
}

/**
 * Reads the latest persisted HealthEntry
 */
export const getLatestHealthEntry = () => {
  if (typeof window === 'undefined') return null
  return readLocalData(STORAGE_KEYS.latestEntry, null).value
}

export const deleteAllLocalHealthData = () => {
  if (typeof window === 'undefined') return
  return clearLocalHealthData()
}
