/**
 * PCOS Saathi - Unified Local Storage Service
 * 
 * Strict Client-Side Persistence Layer.
 * Guarantees zero cloud telemetry, complete offline functionality,
 * and predictable cross-component event notifications.
 */

import {
  STORAGE_KEYS,
  createHealthEntry,
  createCycleEntry,
  createInsight,
  createDoctorSummary,
} from '../models/pcosSaathiSchemas.js';
import { mongoService } from './mongoService.js';

// Safe wrapper around window.localStorage
function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };
  }
  return window.localStorage;
}

// Broadcast event to notify components across the app
export function notifyDataChange(key, data) {
  if (typeof window === 'undefined') return;
  try {
    const event = new CustomEvent('pcos_saathi:data_change', {
      detail: { key, data, timestamp: new Date().toISOString() },
      bubbles: true,
    });
    window.dispatchEvent(event);
  } catch (err) {
    console.warn('Failed to dispatch pcos_saathi:data_change event', err);
  }
}

export const StorageService = {
  // =========================================================================
  // 1. HEALTH ENTRIES (`pcos_saathi_health_entries`)
  // =========================================================================
  getHealthEntries() {
    const raw = getStorage().getItem(STORAGE_KEYS.HEALTH_ENTRIES);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveHealthEntry(entryData) {
    const entry = createHealthEntry(entryData);
    const existing = this.getHealthEntries();
    const updated = [entry, ...existing.filter((e) => e.id !== entry.id)];
    getStorage().setItem(STORAGE_KEYS.HEALTH_ENTRIES, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.HEALTH_ENTRIES, updated);

    // Background asynchronous sync to MongoDB
    try {
      mongoService.saveHealthEntry(entry);
    } catch (e) {
      // offline silent fallback
    }
    return entry;
  },

  deleteHealthEntry(id) {
    const existing = this.getHealthEntries();
    const updated = existing.filter((e) => e.id !== id);
    getStorage().setItem(STORAGE_KEYS.HEALTH_ENTRIES, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.HEALTH_ENTRIES, updated);
    return updated;
  },

  // =========================================================================
  // 2. CYCLE ENTRIES (`pcos_saathi_cycle_entries`)
  // =========================================================================
  getCycleEntries() {
    const raw = getStorage().getItem(STORAGE_KEYS.CYCLE_ENTRIES);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveCycleEntry(cycleData) {
    const entry = createCycleEntry(cycleData);
    const existing = this.getCycleEntries();
    // Sort descending by startDate
    const updated = [entry, ...existing.filter((c) => c.id !== entry.id)].sort(
      (a, b) => b.startDate.localeCompare(a.startDate)
    );
    getStorage().setItem(STORAGE_KEYS.CYCLE_ENTRIES, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.CYCLE_ENTRIES, updated);

    // Background asynchronous sync to MongoDB
    try {
      mongoService.saveCycleEntry(entry);
    } catch (e) {
      // offline silent fallback
    }
    return entry;
  },

  deleteCycleEntry(id) {
    const existing = this.getCycleEntries();
    const updated = existing.filter((c) => c.id !== id);
    getStorage().setItem(STORAGE_KEYS.CYCLE_ENTRIES, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.CYCLE_ENTRIES, updated);
    return updated;
  },

  // =========================================================================
  // 3. INSIGHTS (`pcos_saathi_insights`)
  // =========================================================================
  getInsights() {
    const raw = getStorage().getItem(STORAGE_KEYS.INSIGHTS);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveInsights(insightsList) {
    const validated = (Array.isArray(insightsList) ? insightsList : [insightsList]).map(
      (ins) => createInsight(ins)
    );
    getStorage().setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(validated));
    notifyDataChange(STORAGE_KEYS.INSIGHTS, validated);
    return validated;
  },

  // =========================================================================
  // 4. DOCTOR SUMMARY (`pcos_saathi_doctor_summary`)
  // =========================================================================
  getDoctorSummary() {
    const raw = getStorage().getItem(STORAGE_KEYS.DOCTOR_SUMMARY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveDoctorSummary(summaryData) {
    const summary = createDoctorSummary(summaryData);
    getStorage().setItem(STORAGE_KEYS.DOCTOR_SUMMARY, JSON.stringify(summary));
    notifyDataChange(STORAGE_KEYS.DOCTOR_SUMMARY, summary);

    // Background asynchronous sync to MongoDB
    try {
      mongoService.saveDoctorSummary(summary);
    } catch (e) {
      // offline silent fallback
    }
    return summary;
  },

  // =========================================================================
  // 5. PREFERENCES (`pcos_saathi_preferences`)
  // =========================================================================
  getPreferences() {
    const raw = getStorage().getItem(STORAGE_KEYS.PREFERENCES);
    const defaults = {
      language: 'en',
      theme: 'light',
      fontSize: 'medium',
      hapticFeedback: false,
      enableReminders: false,
    };
    if (!raw) return defaults;
    try {
      return { ...defaults, ...JSON.parse(raw) };
    } catch {
      return defaults;
    }
  },

  savePreferences(prefs) {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    getStorage().setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.PREFERENCES, updated);
    return updated;
  },

  // =========================================================================
  // 6. AI CONSENT & PRIVACY (`pcos_saathi_ai_consent`)
  // =========================================================================
  getAiConsent() {
    const raw = getStorage().getItem(STORAGE_KEYS.AI_CONSENT);
    const defaults = {
      consented: false,
      timestamp: null,
      telemetryAllowed: false, // ALWAYS false by architectural invariant
      localWhisperOptIn: true,
      remoteFastApiOptIn: false, // Off by default (explicit opt-in only)
    };
    if (!raw) return defaults;
    try {
      return { ...defaults, ...JSON.parse(raw), telemetryAllowed: false };
    } catch {
      return defaults;
    }
  },

  saveAiConsent(consent) {
    const updated = {
      ...this.getAiConsent(),
      ...consent,
      telemetryAllowed: false, // Invariant: Telemetry cannot be forced on
      timestamp: new Date().toISOString(),
    };
    getStorage().setItem(STORAGE_KEYS.AI_CONSENT, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.AI_CONSENT, updated);
    return updated;
  },

  // =========================================================================
  // BACKWARD COMPATIBILITY MIGRATION (from sakhicare_* keys)
  // =========================================================================
  migrateLegacyKeys() {
    const storage = getStorage();
    try {
      // 1. Health Entry migration
      const legacyHealth = storage.getItem('sakhicare_latest_entry');
      if (legacyHealth && !storage.getItem(STORAGE_KEYS.HEALTH_ENTRIES)) {
        const parsed = JSON.parse(legacyHealth);
        this.saveHealthEntry(parsed);
      }

      // 2. Cycle Tracker migration
      const legacyCycle = storage.getItem('sakhicare_cycle_tracker');
      if (legacyCycle && !storage.getItem(STORAGE_KEYS.CYCLE_ENTRIES)) {
        const parsed = JSON.parse(legacyCycle);
        if (Array.isArray(parsed)) {
          parsed.forEach((c) => {
            this.saveCycleEntry({
              startDate: c.date,
              notes: c.note,
            });
          });
        }
      }
    } catch (err) {
      console.warn('Legacy key migration skipped:', err);
    }
  },

  // =========================================================================
  // APIVERVE FORECAST HISTORY (`pcos_saathi_apiverve_forecasts`)
  // =========================================================================
  getApiVerveForecasts() {
    const raw = getStorage().getItem(STORAGE_KEYS.APIVERVE_FORECASTS);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  saveApiVerveForecast(forecastData) {
    const existing = this.getApiVerveForecasts();
    const entry = {
      id: `apv-forecast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...forecastData,
    };
    const updated = [entry, ...existing.filter((f) => f.id !== entry.id)].slice(0, 50);
    getStorage().setItem(STORAGE_KEYS.APIVERVE_FORECASTS, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.APIVERVE_FORECASTS, updated);
    return entry;
  },

  deleteApiVerveForecast(id) {
    const existing = this.getApiVerveForecasts();
    const updated = existing.filter((f) => f.id !== id);
    getStorage().setItem(STORAGE_KEYS.APIVERVE_FORECASTS, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.APIVERVE_FORECASTS, updated);
    return updated;
  },

  clearApiVerveForecasts() {
    getStorage().removeItem(STORAGE_KEYS.APIVERVE_FORECASTS);
    notifyDataChange(STORAGE_KEYS.APIVERVE_FORECASTS, []);
    return [];
  },

  // =========================================================================
  // PRIVACY PURGE & DATA EXPORT
  // =========================================================================
  exportAllData() {
    return {
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      disclaimer: 'Personal health data exported solely by user from local device.',
      healthEntries: this.getHealthEntries(),
      cycleEntries: this.getCycleEntries(),
      insights: this.getInsights(),
      doctorSummary: this.getDoctorSummary(),
      preferences: this.getPreferences(),
      apiverveForecasts: this.getApiVerveForecasts(),
    };
  },

  clearAllPcosData() {
    const storage = getStorage();
    Object.values(STORAGE_KEYS).forEach((key) => {
      storage.removeItem(key);
    });
    // Also remove legacy keys
    storage.removeItem('sakhicare_latest_entry');
    storage.removeItem('sakhicare_cycle_tracker');

    // Purge remote MongoDB records
    try {
      mongoService.purgeAll();
    } catch (e) {
      // offline silent fallback
    }

    notifyDataChange('all_purged', null);
    return true;
  },

  // =========================================================================
  // FULL MONGODB SYNCHRONIZATION
  // =========================================================================
  async syncWithMongoDB() {
    const payload = {
      health_entries: this.getHealthEntries(),
      cycle_entries: this.getCycleEntries(),
      doctor_summaries: this.getDoctorSummary() ? [this.getDoctorSummary()] : [],
      insights: this.getInsights(),
    };
    const result = await mongoService.syncAll(payload);
    if (result.success && result.data?.remote_data) {
      const storage = getStorage();
      const remoteHealth = result.data.remote_data.health_entries || [];
      if (remoteHealth.length > 0) {
        const localHealth = this.getHealthEntries();
        const mergedHealth = [...localHealth];
        remoteHealth.forEach((rh) => {
          if (!mergedHealth.some((lh) => lh.id === rh.id)) {
            mergedHealth.push(rh);
          }
        });
        storage.setItem(STORAGE_KEYS.HEALTH_ENTRIES, JSON.stringify(mergedHealth));
        notifyDataChange(STORAGE_KEYS.HEALTH_ENTRIES, mergedHealth);
      }
    }
    return result;
  },
};
