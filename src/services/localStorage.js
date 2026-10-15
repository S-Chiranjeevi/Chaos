const SAKHI_PREFIX = 'sakhicare_'

export const STORAGE_KEYS = {
  latestEntry: `${SAKHI_PREFIX}latest_entry`,
  cycleTracker: `${SAKHI_PREFIX}cycle_tracker`,
}

export function readLocalData(key, fallback = null) {
  try {
    const stored = window.localStorage.getItem(key)
    return { value: stored ? JSON.parse(stored) : fallback, error: null }
  } catch {
    return {
      value: fallback,
      error: 'Saved information could not be read on this device. You can still use the app without it.',
    }
  }
}

export function writeLocalData(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return { ok: true, error: null }
  } catch {
    return {
      ok: false,
      error: 'This device could not save your information. Check your browser storage settings and try again.',
    }
  }
}

export function clearLocalHealthData() {
  try {
    for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
      const key = window.localStorage.key(index)
      if (key?.startsWith(SAKHI_PREFIX)) window.localStorage.removeItem(key)
    }
    return { ok: true, error: null }
  } catch {
    return { ok: false, error: 'Your browser could not remove the saved information. Please try again.' }
  }
}
