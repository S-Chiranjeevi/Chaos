/**
 * Local, explainable insight generator. It never diagnoses, recommends
 * medication, or sends health data anywhere.
 */
const SEVERITY = { mild: 1, moderate: 2, severe: 3 }
const DISCLAIMER = 'This is information, not a diagnosis.'

function dateValue(value) {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function daysBetween(first, second) {
  const start = dateValue(first)
  const end = dateValue(second)
  return start && end ? Math.round(Math.abs(end - start) / 86400000) : null
}

function symptomKey(value = '') {
  const text = value.toLowerCase()
  if (/pelvic|cramp|lower abdominal/.test(text)) return 'pelvic discomfort'
  if (/acne|pimple|breakout/.test(text)) return 'acne'
  if (/hair.*thin|hair loss|hair fall/.test(text)) return 'hair thinning'
  if (/bleed/.test(text)) return 'bleeding'
  return text.trim()
}

function entriesFromHistory(history = []) {
  return history.flatMap((entry) => (entry?.symptoms || []).map((symptom, index) => ({
    id: symptom.id || `${entry.id || 'entry'}-${index}`,
    symptom: symptom.symptom || symptom.label || '',
    date: entry.timestamp || entry.date,
    severity: symptom.severity || 'unspecified',
    note: symptom.note || '',
  })))
}

function newInsight(values) {
  return { source: 'rule_based', dismissed: false, createdAt: new Date().toISOString(), ...values }
}

function dedupe(insights) {
  const seen = new Set()
  return insights.filter((insight) => {
    const key = `${insight.title}|${insight.relatedEntryIds.slice().sort().join('|')}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Builds insight cards from device-local cycle and symptom history.
 * @param {Object} input
 * @param {Array} input.healthHistory HealthEntry-compatible records
 * @param {Array} input.periodLogs [{ id?, startDate }]
 * @param {Array} input.symptomLogs [{ id?, symptom, date, severity, note? }]
 * @param {string[]} input.dismissedInsightIds
 */
export function createPersonalizedInsights({ healthHistory = [], periodLogs = [], symptomLogs = [], dismissedInsightIds = [] } = {}) {
  const symptoms = [...entriesFromHistory(healthHistory), ...symptomLogs]
    .filter((entry) => entry?.symptom)
    .map((entry, index) => ({ ...entry, id: entry.id || `symptom-${index}`, severity: String(entry.severity || 'unspecified').toLowerCase() }))
  const insights = []
  const dismissed = new Set(dismissedInsightIds)

  const sortedPeriods = periodLogs
    .filter((entry) => entry?.startDate && dateValue(entry.startDate))
    .slice()
    .sort((a, b) => dateValue(a.startDate) - dateValue(b.startDate))
  const cycleLengths = sortedPeriods.slice(1).map((entry, index) => ({
    days: daysBetween(sortedPeriods[index].startDate, entry.startDate),
    id: entry.id || `period-${index + 1}`,
  })).filter((cycle) => cycle.days)

  if (cycleLengths.length >= 3 && cycleLengths.slice(-3).every((cycle) => cycle.days > 35)) {
    const latest = cycleLengths.slice(-3)
    insights.push(newInsight({
      id: 'insight-repeated-irregular-cycles',
      title: 'Repeated irregular cycles',
      message: 'Your last three recorded cycles were longer than 35 days.',
      evidence: latest.map((cycle, index) => `Cycle ${index + 1}: ${cycle.days} days`),
      urgency: 'soon',
      suggestedAction: 'Consider discussing this pattern with a gynecologist.',
      relatedEntryIds: latest.map((cycle) => cycle.id),
      whyItAppeared: 'Three recent cycle lengths were longer than 35 days.',
      education: 'Cycle length can vary. Tracking dates helps a clinician understand your pattern.',
    }))
  }

  const grouped = new Map()
  symptoms.forEach((entry) => {
    const key = symptomKey(entry.symptom)
    if (!key) return
    grouped.set(key, [...(grouped.get(key) || []), entry])
  })

  for (const [key, entries] of grouped) {
    const dated = entries.filter((entry) => dateValue(entry.date)).sort((a, b) => dateValue(a.date) - dateValue(b.date))
    if (entries.length >= 3) {
      const span = dated.length >= 2 ? daysBetween(dated[0].date, dated[dated.length - 1].date) : null
      insights.push(newInsight({
        id: `insight-repeated-${key.replace(/\s+/g, '-')}`,
        title: `Repeated ${key}`,
        message: span ? `${key[0].toUpperCase()}${key.slice(1)} appears in ${entries.length} entries over ${span} days.` : `${key[0].toUpperCase()}${key.slice(1)} appears in ${entries.length} entries.`,
        evidence: dated.map((entry) => `${entry.date ? new Date(entry.date).toLocaleDateString() : 'Date not recorded'}: ${entry.symptom}`),
        urgency: 'routine',
        suggestedAction: 'Consider mentioning this repeated pattern at your next doctor visit.',
        relatedEntryIds: entries.map((entry) => entry.id),
        whyItAppeared: `This symptom was recorded ${entries.length} times.`,
        education: 'Repeated notes can help a clinician see timing and changes over time.',
      }))
    }

    if (dated.length >= 2) {
      const first = SEVERITY[dated[0].severity] || 0
      const last = SEVERITY[dated[dated.length - 1].severity] || 0
      if (first && last > first) {
        const urgent = last === SEVERITY.severe
        insights.push(newInsight({
          id: `insight-severity-${key.replace(/\s+/g, '-')}`,
          title: `Increasing severity in ${key}`,
          message: `Your ${key} severity changed from ${dated[0].severity} to ${dated[dated.length - 1].severity}.`,
          evidence: [`Earlier entry: ${dated[0].severity}`, `Most recent entry: ${dated[dated.length - 1].severity}`],
          urgency: urgent ? 'urgent' : 'soon',
          suggestedAction: urgent ? 'Please seek urgent medical care now or contact local emergency services.' : 'Consider discussing this change with a healthcare professional soon.',
          relatedEntryIds: [dated[0].id, dated[dated.length - 1].id],
          whyItAppeared: 'The latest logged severity was higher than the first logged severity.',
          education: 'Changes in severity can be useful context for a clinician.',
        }))
      }
    }
  }

  const urgentText = symptoms.filter((entry) => /severe pain|unbearable|very heavy bleeding|soaking|faint|dizz|pregnan.*(bleed|pain)/i.test(`${entry.symptom} ${entry.note}`) || entry.severity === 'severe')
  if (urgentText.length) {
    insights.push(newInsight({
      id: 'insight-early-warning',
      title: 'Symptoms needing urgent attention',
      message: 'A recent entry includes a symptom that may need urgent medical attention.',
      evidence: urgentText.map((entry) => `${entry.symptom}${entry.date ? ` (${new Date(entry.date).toLocaleDateString()})` : ''}`),
      urgency: 'urgent',
      suggestedAction: 'Please seek urgent medical care now or contact local emergency services.',
      relatedEntryIds: urgentText.map((entry) => entry.id),
      whyItAppeared: 'A logged symptom or severity matched an early-warning rule.',
      education: 'Severe pain, very heavy bleeding, dizziness, fainting, or possible pregnancy warning signs deserve prompt care.',
    }))
  }

  const visible = dedupe(insights).map((insight) => ({ ...insight, dismissed: dismissed.has(insight.id) }))
  const hasUrgent = visible.some((insight) => insight.urgency === 'urgent')
  const prioritized = hasUrgent ? visible.filter((insight) => insight.urgency === 'urgent' || insight.urgency === 'soon') : visible

  if (!prioritized.length) {
    return [newInsight({
      id: 'insight-not-enough-information',
      title: 'More entries will help',
      message: 'There is not enough information yet to identify a reliable pattern.',
      evidence: ['Add period dates or symptom notes over time.'],
      urgency: 'routine',
      suggestedAction: 'Continue logging periods and symptoms when you are ready.',
      relatedEntryIds: [],
      whyItAppeared: 'There are not yet enough repeated or dated entries for a reliable pattern.',
      education: `Patterns are based on your own records. ${DISCLAIMER}`,
    })]
  }
  return prioritized
}

export const INSIGHT_DISCLAIMER = DISCLAIMER
