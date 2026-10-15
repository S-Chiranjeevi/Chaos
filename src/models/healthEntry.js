/**
 * PCOS Saathi & SakhiCare Shared HealthEntry Bridge
 * 
 * Standardized data contract for symptom descriptions, extracted clinical features,
 * and non-diagnostic educational guidance for PCOS and women's health.
 * 
 * Bridges legacy format and canonical pcos_saathi schemas seamlessly.
 */
import { STORAGE_KEYS } from './pcosSaathiSchemas.js';
import { writeLocalData, readLocalData, clearLocalHealthData } from '../services/localStorage.js';

export const SEVERITY_LEVELS = ['Mild', 'Moderate', 'Severe', 'Unspecified'];

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
      symptom: s.symptom || s.label || s.name || 'Unspecified symptom',
      name: s.name || s.symptom || s.label || 'Unspecified symptom',
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
      source: 'PCOS Saathi Talk or Type',
      appVersion: '3.0.0',
      exportedAt: new Date().toISOString(),
    },
  };
};

/**
 * Exposes the HealthEntry to the global scope and notifies listeners
 */
export const publishHealthEntry = (entry) => {
  if (typeof window === 'undefined') return;

  // 1. Dispatch events for legacy and canonical listeners
  try {
    const legacyEvent = new CustomEvent('sakhicare:healthEntryUpdate', {
      detail: entry,
      bubbles: true,
    });
    window.dispatchEvent(legacyEvent);

    const canonicalEvent = new CustomEvent('pcos_saathi:data_change', {
      detail: { key: STORAGE_KEYS.HEALTH_ENTRIES, data: entry },
      bubbles: true,
    });
    window.dispatchEvent(canonicalEvent);
  } catch { /* The page can still save locally if events are unavailable. */ }

  // 2. Persist in legacy localStorage key
  writeLocalData('sakhicare_latest_entry', entry);

  // 3. Persist in canonical array key `pcos_saathi_health_entries`
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HEALTH_ENTRIES);
    const list = raw ? JSON.parse(raw) : [];
    const updated = [entry, ...list.filter((e) => e.id !== entry.id)];
    localStorage.setItem(STORAGE_KEYS.HEALTH_ENTRIES, JSON.stringify(updated));
  } catch { /* Storage quota or private browsing */ }

  return { ok: true, error: null };
};

/**
 * Reads the latest persisted HealthEntry
 */
export const getLatestHealthEntry = () => {
  if (typeof window === 'undefined') return null;
  try {
    // Check canonical first, then fallback to legacy
    const canonicalRaw = localStorage.getItem(STORAGE_KEYS.HEALTH_ENTRIES);
    if (canonicalRaw) {
      const list = JSON.parse(canonicalRaw);
      if (Array.isArray(list) && list.length > 0) return list[0];
    }
    const stored = readLocalData('sakhicare_latest_entry', null).value;
    return stored || null;
  } catch {
    return null;
  }
};

export const deleteAllLocalHealthData = () => {
  if (typeof window === 'undefined') return;
  clearLocalHealthData();
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith('sakhicare_') || key?.startsWith('pcos_saathi_')) {
      localStorage.removeItem(key);
    }
  }

  try {
    window.dispatchEvent(new CustomEvent('pcos_saathi:data_change', {
      detail: { key: 'all_purged', data: null },
      bubbles: true,
    }));
  } catch { /* Ignore */ }
};
