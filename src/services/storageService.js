const KEYS = {
  healthEntries: 'sakhicare_health_entries_v1',
  cycleEntries: 'sakhicare_cycle_entries_v1',
  insights: 'sakhicare_insights_v1',
  doctorSummary: 'sakhicare_doctor_summary_v1',
  legacyTracker: 'sakhicare_health_tracker_v1',
}

const uid = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`

function readJson(key, fallback) {
  try {
    const raw = globalThis.localStorage?.getItem(key)
    if (raw === null || raw === undefined) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    if (!globalThis.localStorage) throw new Error('Local storage is unavailable in this browser.')
    globalThis.localStorage.setItem(key, JSON.stringify(value))
    return value
  } catch (error) {
    throw new Error(`Could not save data on this device. ${error.message || 'Check browser storage settings and try again.'}`)
  }
}

function list(key) {
  const value = readJson(key, [])
  return Array.isArray(value) ? value : []
}

function upsert(key, entry, prefix) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new TypeError('An entry is required.')
  const record = { ...entry, id: entry.id || uid(prefix) }
  const current = list(key)
  const index = current.findIndex((item) => item?.id === record.id)
  if (index < 0) current.push(record)
  else current[index] = record
  writeJson(key, current)
  return record
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function localDateString(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function saveHealthEntry(entry) {
  return upsert(KEYS.healthEntries, entry, 'health')
}

export function loadHealthEntries() {
  return list(KEYS.healthEntries)
}

export function deleteHealthEntry(id) {
  const current = list(KEYS.healthEntries)
  const remaining = current.filter((entry) => entry?.id !== id)
  writeJson(KEYS.healthEntries, remaining)
  return current.length !== remaining.length
}

export function saveCycleEntry(entry) {
  if (!entry || !isValidDate(entry.startDate)) throw new TypeError('Enter a valid period start date.')
  const today = localDateString()
  if (entry.startDate > today) throw new RangeError('A period start date can’t be in the future.')
  if (entry.endDate && !isValidDate(entry.endDate)) throw new TypeError('Enter a valid period end date.')
  if (entry.endDate && entry.endDate > today) throw new RangeError('A period end date can’t be in the future.')
  if (entry.endDate && entry.endDate < entry.startDate) throw new RangeError('The end date must be the same as or after the start date.')

  const current = loadCycleEntries()
  if (current.some((item) => item.startDate === entry.startDate && item.id !== entry.id)) {
    const error = new Error('A period already starts on that date. Edit its existing entry instead.')
    error.code = 'DUPLICATE_CYCLE_DATE'
    throw error
  }
  return upsert(KEYS.cycleEntries, entry, 'cycle')
}

export function loadCycleEntries() {
  const saved = readJson(KEYS.cycleEntries, null)
  if (Array.isArray(saved)) return saved

  // Preserve records saved by the first tracker version on this device.
  const legacy = readJson(KEYS.legacyTracker, [])
  if (!Array.isArray(legacy) || legacy.length === 0) return []
  const migrated = legacy.filter((entry) => entry && isValidDate(entry.startDate)).map((entry) => ({
    id: entry.id || uid('cycle'),
    startDate: entry.startDate,
    endDate: entry.endDate || '',
    flowLevel: entry.flowLevel || '',
    painLevel: entry.painLevel || entry.severity || '',
    symptoms: Array.isArray(entry.symptoms) ? entry.symptoms : [],
    mood: entry.mood || '',
    energyLevel: entry.energyLevel || '',
    notes: entry.notes || entry.note || '',
  }))
  if (migrated.length) writeJson(KEYS.cycleEntries, migrated)
  return migrated
}

export function saveInsight(insight) {
  return upsert(KEYS.insights, insight, 'insight')
}

export function loadInsights() {
  return list(KEYS.insights)
}

export function saveDoctorSummary(summary) {
  if (summary === null || summary === undefined) {
    try { globalThis.localStorage?.removeItem(KEYS.doctorSummary) } catch { /* storage may be unavailable */ }
    return null
  }
  return writeJson(KEYS.doctorSummary, summary)
}

export function loadDoctorSummary() {
  return readJson(KEYS.doctorSummary, null)
}

export function exportAllLocalData() {
  return {
    app: 'SakhiCare',
    exportedAt: new Date().toISOString(),
    storage: 'This export was assembled from data stored locally in this browser.',
    healthEntries: loadHealthEntries(),
    cycleEntries: loadCycleEntries(),
    insights: loadInsights(),
    doctorSummary: loadDoctorSummary(),
  }
}

export function deleteAllLocalData() {
  try {
    for (const key of Object.values(KEYS)) globalThis.localStorage?.removeItem(key)
    return true
  } catch (error) {
    throw new Error(`Could not delete all local data. ${error.message || 'Check browser storage settings and try again.'}`)
  }
}
