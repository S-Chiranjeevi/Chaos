import { assessSymptoms } from '../engine.js'

const DAY_MS = 86400000
const PAIN_RANK = { None: 0, Mild: 1, Moderate: 2, Severe: 3 }
const FLOW_RANK = { Spotting: 0, Light: 1, Moderate: 2, Heavy: 3, 'Very heavy': 4 }

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

export function daysBetweenDates(first, second) {
  if (!validDate(first) || !validDate(second)) return null
  return Math.round((Date.parse(`${second}T00:00:00Z`) - Date.parse(`${first}T00:00:00Z`)) / DAY_MS)
}

function getSeverityTrend(entries, field, ranks) {
  const scored = entries.filter((entry) => Object.hasOwn(ranks, entry[field])).map((entry) => ({ date: entry.startDate, value: ranks[entry[field]], level: entry[field] }))
  const last = scored.slice(-3)
  if (last.length < 2 || last.at(-1).value <= last.at(-2).value) return null
  const steadilyIncreasing = last.length === 3 && last[1].value > last[0].value && last[2].value > last[1].value
  return { field, from: last.at(-2).level, to: last.at(-1).level, steadilyIncreasing }
}

export function analyzeCycles(cycleEntries = [], healthEntries = []) {
  const entries = (Array.isArray(cycleEntries) ? cycleEntries : [])
    .filter((entry) => entry && validDate(entry.startDate))
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate))

  const intervals = entries.slice(1).map((entry, index) => {
    const days = daysBetweenDates(entries[index].startDate, entry.startDate)
    return { from: entries[index].startDate, to: entry.startDate, days, below21Days: days < 21, above35Days: days > 35, above45Days: days > 45 }
  }).filter((interval) => interval.days > 0)

  const lengths = intervals.map((interval) => interval.days)
  const longest = lengths.length ? Math.max(...lengths) : null
  const shortest = lengths.length ? Math.min(...lengths) : null
  const average = lengths.length ? lengths.reduce((sum, value) => sum + value, 0) / lengths.length : null
  let trailingLongCycles = 0
  for (let index = intervals.length - 1; index >= 0 && intervals[index].above35Days; index -= 1) trailingLongCycles += 1

  const symptomCounts = new Map()
  for (const entry of entries) {
    const values = Array.isArray(entry.symptoms) ? entry.symptoms : []
    for (const value of values) {
      const label = typeof value === 'string' ? value.trim() : value?.symptom?.trim()
      if (label) symptomCounts.set(label, (symptomCounts.get(label) || 0) + 1)
    }
  }
  for (const entry of Array.isArray(healthEntries) ? healthEntries : []) {
    for (const value of Array.isArray(entry?.symptoms) ? entry.symptoms : []) {
      const label = typeof value === 'string' ? value.trim() : value?.symptom?.trim()
      if (label) symptomCounts.set(label, (symptomCounts.get(label) || 0) + 1)
    }
  }

  const repeatedSymptoms = [...symptomCounts.entries()]
    .filter(([, count]) => count >= 2)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count || a.symptom.localeCompare(b.symptom))

  const painTrend = getSeverityTrend(entries, 'painLevel', PAIN_RANK)
  const flowTrend = getSeverityTrend(entries, 'flowLevel', FLOW_RANK)
  const missingData = {
    endDate: entries.filter((entry) => !entry.endDate).length,
    flowLevel: entries.filter((entry) => !entry.flowLevel).length,
    painLevel: entries.filter((entry) => !entry.painLevel).length,
    symptoms: entries.filter((entry) => !Array.isArray(entry.symptoms) || entry.symptoms.length === 0).length,
    mood: entries.filter((entry) => !entry.mood).length,
    energyLevel: entries.filter((entry) => !entry.energyLevel).length,
  }
  const missingCount = Object.values(missingData).reduce((sum, count) => sum + count, 0)

  const redFlags = []
  for (const entry of entries) {
    const symptoms = Array.isArray(entry.symptoms) ? entry.symptoms : []
    const text = `${entry.notes || ''} ${symptoms.join(' ')}`
    const flags = assessSymptoms(text).redFlags
    redFlags.push(...flags.map((flag) => ({ date: entry.startDate, flag })))
    if (entry.painLevel === 'Severe' && !flags.includes('Severe pain')) redFlags.push({ date: entry.startDate, flag: 'Severe pain' })
    if (entry.flowLevel === 'Very heavy' && !flags.includes('Very heavy bleeding')) redFlags.push({ date: entry.startDate, flag: 'Very heavy bleeding' })
    if (Array.isArray(entry.redFlags)) redFlags.push(...entry.redFlags.map((flag) => ({ date: entry.startDate, flag })))
  }
  for (const entry of Array.isArray(healthEntries) ? healthEntries : []) {
    const flags = assessSymptoms(entry?.notes || entry?.text || '').redFlags
    const savedFlags = entry?.assessment?.redFlags || []
    for (const flag of new Set([...flags, ...savedFlags])) redFlags.push({ date: entry?.recordedAt?.slice?.(0, 10) || '', flag })
  }

  const discussionPrompts = []
  if (intervals.some((interval) => interval.above35Days)) discussionPrompts.push('Your recent cycle lengths may be irregular. At least one logged cycle was longer than 35 days. Cycle patterns vary by age and individual health; consider discussing this pattern with a healthcare professional.')
  if (intervals.some((interval) => interval.below21Days)) discussionPrompts.push('At least one logged cycle was shorter than 21 days. Cycle patterns vary by age and individual health; consider discussing it if this repeats or concerns you.')
  if (intervals.some((interval) => interval.above45Days)) discussionPrompts.push('There is a gap above 45 days between logged period starts. Consider booking a healthcare visit to discuss it.')
  if (lengths.length >= 2 && longest - shortest > 9) discussionPrompts.push('Your recent cycle lengths vary by more than 9 days. Cycle patterns vary by age and individual health; consider discussing this pattern with a healthcare professional, especially if it continues.')
  if (trailingLongCycles >= 3) discussionPrompts.push('Three logged cycles in a row are above 35 days. Consider booking a visit with a healthcare professional.')
  if (painTrend) discussionPrompts.push(`Your logged pain level has increased from ${painTrend.from.toLowerCase()} to ${painTrend.to.toLowerCase()}. Consider arranging care earlier.`)
  if (flowTrend) discussionPrompts.push(`Your logged flow level has increased from ${flowTrend.from.toLowerCase()} to ${flowTrend.to.toLowerCase()}. Consider arranging care earlier.`)
  if (redFlags.length) discussionPrompts.unshift('A logged symptom may need urgent attention. Please seek urgent medical care or contact local emergency services.')

  return {
    isEmpty: entries.length === 0,
    periodCount: entries.length,
    intervals,
    cycleLengths: lengths,
    averageCycleLength: average === null ? null : Math.round(average),
    shortestCycle: shortest,
    longestCycle: longest,
    cycleVariation: shortest === null ? null : longest - shortest,
    cyclesAbove35Days: intervals.filter((interval) => interval.above35Days).length,
    cyclesBelow21Days: intervals.filter((interval) => interval.below21Days).length,
    gapsAbove45Days: intervals.filter((interval) => interval.above45Days).length,
    trailingLongCycles,
    repeatedSymptoms,
    painTrend,
    flowTrend,
    increasingSeverity: Boolean(painTrend || flowTrend),
    missingData,
    missingCount,
    redFlags,
    urgentGuidance: redFlags.length > 0,
    discussionPrompts,
  }
}

export function explainCyclePatterns(analysis) {
  if (!analysis || analysis.isEmpty) return ['Your tracker is ready when you are. Add a period start date to begin.']
  if (analysis.urgentGuidance) return ['A symptom you logged may need urgent attention. Seek urgent medical care now or contact local emergency services. This tracker cannot assess an emergency.']
  if (!analysis.intervals.length) return ['Log another period start to see the number of days between starts.']
  if (analysis.discussionPrompts.length) return analysis.discussionPrompts
  return ['Your logged dates do not currently show the patterns highlighted by this tracker. Keep recording entries if it is useful to you.']
}
