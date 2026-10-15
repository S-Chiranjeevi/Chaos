const LUNA_PREFIX = 'lunaher_'
const SAKHI_PREFIX = 'sakhicare_'

export const STORAGE_KEYS = {
  latestEntry: `${LUNA_PREFIX}latest_entry`,
  cycleTracker: `${LUNA_PREFIX}cycle_tracker`,
}

export function readLocalData(key, fallback = null) {
  try {
    let stored = window.localStorage.getItem(key)
    if (!stored && key.startsWith(LUNA_PREFIX)) {
      const legacyKey = key.replace(LUNA_PREFIX, SAKHI_PREFIX)
      stored = window.localStorage.getItem(legacyKey)
    }
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
    if (key.startsWith(LUNA_PREFIX)) {
      const legacyKey = key.replace(LUNA_PREFIX, SAKHI_PREFIX)
      window.localStorage.setItem(legacyKey, JSON.stringify(value))
    }
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
      if (key?.startsWith(LUNA_PREFIX) || key?.startsWith(SAKHI_PREFIX)) {
        window.localStorage.removeItem(key)
      }
    }
    return { ok: true, error: null }
  } catch {
    return { ok: false, error: 'Your browser could not remove the saved information. Please try again.' }
  }
}
