/**
 * Early Warning and Pattern Detection Service for Luna Her
 * 
 * Analyzes period logs and symptom logs to detect repeated patterns,
 * increasing severity, prolonged duration, and critical red flags.
 * 
 * Safety Guarantees:
 * - Deterministic, rules-based, explainable
 * - Does not diagnose PCOS or any other condition
 * - Does not recommend medications or dosages
 * - Does not infer pregnancy or certainty
 * - Local analysis only (no external telemetry)
 */

export const DISCLAIMER = 'This is information, not a diagnosis.'

const SEVERITY_RANK = {
  mild: 1,
  moderate: 2,
  severe: 3,
}

// Red flag keywords and patterns that warrant immediate medical evaluation
const RED_FLAG_RULES = [
  {
    id: 'fever_with_pelvic_pain',
    test: (symptoms, notes) => {
      const hasPelvicPain = symptoms.some((s) => /pelvic.*pain|severe.*cramp/i.test(s.symptom || s.note))
      const hasFever = symptoms.some((s) => /fever|high temperature|chills/i.test(s.symptom || s.note)) || notes.some((n) => /fever|temperature/i.test(n))
      return hasPelvicPain && hasFever
    },
    title: 'Fever with pelvic pain',
    description: 'Pelvic pain accompanied by fever can indicate an acute infection requiring prompt clinical assessment.',
    action: 'Contact local emergency services or visit an urgent care facility.',
  },
  {
    id: 'pregnancy_with_bleeding_or_pain',
    test: (symptoms, notes) => {
      const text = [...symptoms.map((s) => `${s.symptom} ${s.note}`), ...notes].join(' ')
      const hasPregnancyMention = /\b(pregnant|possible pregnancy|pregnancy|might be pregnant)\b/i.test(text)
      const hasBleedingOrPain = /\b(bleeding|spotting|severe pain|pain|cramps?)\b/i.test(text)
      return hasPregnancyMention && hasBleedingOrPain
    },
    title: 'Possible pregnancy warning signs',
    description: 'Pain or bleeding when pregnancy is possible needs immediate medical evaluation.',
    action: 'Contact local emergency services or visit an urgent care facility.',
  },
  {
    id: 'fainting_with_bleeding',
    test: (symptoms, notes) => {
      const hasFainting = symptoms.some((s) => /faint|dizz|lightheaded|blackout|passed out/i.test(s.symptom || s.note)) || notes.some((n) => /faint|dizz/i.test(n))
      const hasBleeding = symptoms.some((s) => /bleeding|heavy flow|period/i.test(s.symptom || s.note)) || notes.some((n) => /bleeding/i.test(n))
      return hasFainting && hasBleeding
    },
    title: 'Fainting or dizziness with bleeding',
    description: 'Feeling dizzy, faint, or passing out while experiencing bleeding requires urgent medical care.',
    action: 'Contact local emergency services or visit an urgent care facility.',
  },
  {
    id: 'very_heavy_bleeding',
    test: (symptoms) => {
      return symptoms.some((s) => {
        const text = `${s.symptom || ''} ${s.note || ''}`
        const isHeavy = /very heavy bleeding|heavy bleeding|soaking|flooding|excessive bleeding/i.test(text)
        const isSevere = s.severity?.toLowerCase() === 'severe' || /very heavy|soak|flood/i.test(text)
        return isHeavy && isSevere
      })
    },
    title: 'Very heavy menstrual bleeding',
    description: 'Severe or very heavy bleeding can lead to rapid blood loss and requires immediate evaluation.',
    action: 'Contact local emergency services or visit an urgent care facility.',
  },
  {
    id: 'severe_pelvic_pain',
    test: (symptoms) => {
      return symptoms.some((s) => {
        const text = `${s.symptom || ''} ${s.note || ''}`
        const isPelvic = /pelvic|abdominal|cramp|belly/i.test(text)
        const isSevere = s.severity?.toLowerCase() === 'severe' || /severe|sudden|excruciating|unbearable/i.test(text)
        return isPelvic && isSevere
      })
    },
    title: 'Severe or sudden pelvic pain',
    description: 'Severe or sudden pelvic pain can require immediate medical attention to rule out acute causes.',
    action: 'Contact local emergency services or visit an urgent care facility.',
  },
  {
    id: 'severe_weakness',
    test: (symptoms) => {
      return symptoms.some((s) => {
        const text = `${s.symptom || ''} ${s.note || ''}`
        return /severe weakness|extreme weakness|unable to stand/i.test(text)
      })
    },
    title: 'Severe weakness',
    description: 'Sudden or severe weakness can be a sign of acute physiological distress.',
    action: 'Contact local emergency services or visit an urgent care facility.',
  },
]

/**
 * Normalizes symptom strings for consistent grouping
 */
function normalizeSymptomName(name = '') {
  const lower = name.toLowerCase().trim()
  if (/acne|pimple|breakout/i.test(lower)) return 'acne'
  if (/facial hair|body hair|chin hair|hirsutism/i.test(lower)) return 'increased facial hair'
  if (/hair loss|hair thinning|scalp/i.test(lower)) return 'hair thinning'
  if (/pelvic pain|cramp|lower abdominal pain/i.test(lower)) return 'pelvic pain'
  if (/heavy bleeding|excessive bleeding|flooding/i.test(lower)) return 'heavy bleeding'
  if (/irregular bleeding|spotting/i.test(lower)) return 'irregular bleeding'
  if (/fatigue|tired|exhaust/i.test(lower)) return 'fatigue'
  if (/weight|gain/i.test(lower)) return 'weight changes'
  if (/dizz|faint/i.test(lower)) return 'dizziness'
  return lower
}

/**
 * Parses duration string to see if it represents prolonged time (weeks/months/chronic)
 */
function isLongDuration(durationStr = '') {
  if (!durationStr) return false
  const text = durationStr.toLowerCase()
  if (/months?|weeks?|years?|ongoing|chronic|constant/i.test(text)) {
    // If it mentions 1-2 days, that's not long
    if (/\b(?:1|2)\s+days?\b/i.test(text)) return false
    return true
  }
  return false
}

/**
 * Calculates day difference between two ISO/date strings
 */
function getDayDiff(d1, d2) {
  const t1 = new Date(d1).getTime()
  const t2 = new Date(d2).getTime()
  if (isNaN(t1) || isNaN(t2)) return null
  return Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24))
}

/**
 * Main Pattern Detection and Early Warning Engine
 * 
 * @param {Object} input
 * @param {Array} input.periodLogs - Array of { startDate, endDate }
 * @param {Array} input.symptomLogs - Array of { symptom, date, severity, duration, note }
 * @returns {Object} { patterns, warnings, urgency, explanation, suggestedAction, disclaimer }
 */
export function analyzeHealthPatterns(input = {}) {
  const periodLogs = Array.isArray(input?.periodLogs) ? input.periodLogs.filter(Boolean) : []
  const symptomLogs = Array.isArray(input?.symptomLogs) ? input.symptomLogs.filter(Boolean) : []

  // Check for completely empty data
  if (periodLogs.length === 0 && symptomLogs.length === 0) {
    return {
      patterns: [],
      warnings: [],
      urgency: 'none',
      explanation: 'Keep logging periods and symptoms. We’ll help you notice patterns over time.',
      suggestedAction: 'Log your next period start date or symptom note to begin tracking.',
      disclaimer: DISCLAIMER,
    }
  }

  // 1. RED-FLAG DETECTION (Must be evaluated FIRST before normal patterns)
  const allNotes = [
    ...symptomLogs.map((s) => s.note || ''),
    ...symptomLogs.map((s) => s.symptom || ''),
  ].filter(Boolean)

  const detectedRedFlags = []
  for (const rule of RED_FLAG_RULES) {
    if (rule.test(symptomLogs, allNotes)) {
      detectedRedFlags.push(rule)
    }
  }

  const patterns = []
  const warnings = []

  if (detectedRedFlags.length > 0) {
    for (const rf of detectedRedFlags) {
      warnings.push({
        id: `warn-rf-${rf.id}`,
        type: 'red_flag',
        level: 'red',
        urgency: 'urgent',
        title: rf.title,
        description: rf.description,
        evidence: rf.title,
        suggestedAction: rf.action,
      })
    }
  }

  // 2. PERIOD DATES & CYCLE LENGTH ANALYSIS
  // Sort period logs chronologically
  const validPeriodLogs = periodLogs
    .filter((p) => p && p.startDate && !isNaN(new Date(p.startDate).getTime()))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

  let hasIrregularCyclePattern = false
  const cycleLengths = []

  if (validPeriodLogs.length >= 2) {
    for (let i = 0; i < validPeriodLogs.length - 1; i++) {
      const days = getDayDiff(validPeriodLogs[i].startDate, validPeriodLogs[i + 1].startDate)
      if (days !== null && days > 0) {
        cycleLengths.push(days)
      }
    }
  }

  // PATTERN 1: Repeated irregular cycles
  // Detect when:
  // - The user has at least three period logs
  // - Recent cycle lengths vary significantly (e.g., diff >= 8 days) OR one or more are unusually long (>= 35-38 days, e.g., 62, 71, 58)
  if (validPeriodLogs.length >= 3 && cycleLengths.length >= 2) {
    const minLength = Math.min(...cycleLengths)
    const maxLength = Math.max(...cycleLengths)
    const hasLongCycle = cycleLengths.some((len) => len >= 35)
    const hasHighVariation = (maxLength - minLength) >= 8

    if (hasLongCycle || hasHighVariation) {
      hasIrregularCyclePattern = true
      const evidenceStr = `Cycle lengths: ${cycleLengths.join(', ')} days`
      const irregularPattern = {
        type: 'irregular_cycles',
        title: 'Your recent cycles appear irregular',
        description: 'Your recent cycles appear irregular. This can happen for several reasons. Consider discussing this pattern with a healthcare professional.',
        evidence: evidenceStr,
        severity: 'moderate',
        suggestedAction: 'Consider discussing this pattern with a gynecologist.',
      }
      patterns.push(irregularPattern)
      warnings.push({
        id: 'warn-irregular-cycles',
        type: 'irregular_cycles',
        level: 'amber',
        urgency: 'soon',
        title: irregularPattern.title,
        description: irregularPattern.description,
        evidence: irregularPattern.evidence,
        suggestedAction: irregularPattern.suggestedAction,
      })
    }
  }

  // PATTERN 2: Missing period entries
  // If the user has not logged a period for a long period, or has only 1 entry with no recent data,
  // do not assume they missed a period. Show informational guidance.
  if (validPeriodLogs.length === 1) {
    const singleLog = validPeriodLogs[0]
    const daysSince = getDayDiff(singleLog.startDate, new Date().toISOString().slice(0, 10))
    const missingPattern = {
      type: 'missing_period_entries',
      title: 'More cycle entries needed',
      description: 'We do not have enough information about your recent cycle. Add your period dates to improve tracking.',
      evidence: `Only 1 period entry logged (${singleLog.startDate})`,
      severity: 'mild',
      suggestedAction: 'Add your period dates to improve tracking.',
    }
    patterns.push(missingPattern)
    warnings.push({
      id: 'warn-missing-period-entries',
      type: 'missing_period_entries',
      level: 'blue',
      urgency: 'routine',
      title: missingPattern.title,
      description: missingPattern.description,
      evidence: missingPattern.evidence,
      suggestedAction: missingPattern.suggestedAction,
    })
  } else if (validPeriodLogs.length >= 2) {
    const latestLog = validPeriodLogs[validPeriodLogs.length - 1]
    const daysSinceLast = getDayDiff(latestLog.startDate, new Date().toISOString().slice(0, 10))
    // If over 75 days since last log and user hasn't logged recently
    if (daysSinceLast !== null && daysSinceLast > 75) {
      warnings.push({
        id: 'warn-missing-recent-log',
        type: 'missing_period_entries',
        level: 'blue',
        urgency: 'routine',
        title: 'Cycle tracking reminder',
        description: 'We do not have enough information about your recent cycle. Add your period dates to improve tracking.',
        evidence: `Last period was logged ${daysSinceLast} days ago (${latestLog.startDate})`,
        suggestedAction: 'Log your recent cycle dates when they occur.',
      })
    }
  }

  // 3. SYMPTOM ANALYSIS: Grouping by symptom
  const symptomGroups = {}
  for (const log of symptomLogs) {
    if (!log || !log.symptom) continue
    const key = normalizeSymptomName(log.symptom)
    if (!symptomGroups[key]) {
      symptomGroups[key] = []
    }
    symptomGroups[key].push(log)
  }

  // Sort each group chronologically
  for (const key of Object.keys(symptomGroups)) {
    symptomGroups[key].sort((a, b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0
      const tb = b.date ? new Date(b.date).getTime() : 0
      return ta - tb
    })
  }

  // PATTERN 3: Repeated symptoms (e.g. acne logged several times, pelvic pain, fatigue, facial hair)
  for (const [symKey, logs] of Object.entries(symptomGroups)) {
    if (logs.length >= 2) {
      const dates = logs.map((l) => l.date).filter(Boolean)
      const evidence = dates.length >= 2
        ? `Logged ${logs.length} times between ${dates[0]} and ${dates[dates.length - 1]}`
        : `Logged ${logs.length} times`

      const repeatedPattern = {
        type: 'repeated_symptoms',
        symptom: symKey,
        title: `Repeated ${symKey} logged`,
        description: `You have logged ${symKey} several times recently. Consider mentioning this pattern during your next doctor visit.`,
        evidence,
        severity: 'moderate',
        suggestedAction: 'Consider mentioning this pattern during your next doctor visit.',
      }
      patterns.push(repeatedPattern)
      warnings.push({
        id: `warn-repeated-${symKey}`,
        type: 'repeated_symptoms',
        level: 'amber',
        urgency: 'routine',
        title: repeatedPattern.title,
        description: repeatedPattern.description,
        evidence: repeatedPattern.evidence,
        suggestedAction: repeatedPattern.suggestedAction,
      })
    }
  }

  // PATTERN 4: Increasing severity (Mild -> Moderate, Moderate -> Severe, Mild -> Severe)
  for (const [symKey, logs] of Object.entries(symptomGroups)) {
    if (logs.length >= 2) {
      const ranks = logs.map((l) => SEVERITY_RANK[l.severity?.toLowerCase()] || 0)
      const firstValidIdx = ranks.findIndex((r) => r > 0)
      let lastValidIdx = -1
      for (let i = ranks.length - 1; i >= 0; i--) {
        if (ranks[i] > 0) {
          lastValidIdx = i
          break
        }
      }

      const hasIncreased = firstValidIdx !== -1 && lastValidIdx !== -1 && ranks[lastValidIdx] > ranks[firstValidIdx]
      const startSev = firstValidIdx !== -1 ? logs[firstValidIdx].severity : 'mild'
      const endSev = lastValidIdx !== -1 ? logs[lastValidIdx].severity : 'moderate'

      if (hasIncreased) {
        const severityPattern = {
          type: 'increasing_severity',
          symptom: symKey,
          title: `Increasing severity in ${symKey}`,
          description: 'This symptom appears to be becoming more severe. Consider contacting a healthcare professional.',
          evidence: `Severity shifted from ${startSev} to ${endSev}`,
          severity: endSev.toLowerCase() === 'severe' ? 'severe' : 'moderate',
          suggestedAction: 'Consider contacting a healthcare professional.',
        }
        patterns.push(severityPattern)
        warnings.push({
          id: `warn-severity-${symKey}`,
          type: 'increasing_severity',
          level: endSev.toLowerCase() === 'severe' ? 'amber' : 'amber',
          urgency: 'soon',
          title: severityPattern.title,
          description: severityPattern.description,
          evidence: severityPattern.evidence,
          suggestedAction: severityPattern.suggestedAction,
        })
      }
    }
  }

  // PATTERN 5: Long-lasting symptoms (continue for several weeks or months)
  for (const [symKey, logs] of Object.entries(symptomGroups)) {
    let longDurationEvidence = null

    // Check explicit duration field
    for (const log of logs) {
      if (isLongDuration(log.duration)) {
        longDurationEvidence = `Duration noted: ${log.duration}`
        break
      }
    }

    // Or check time span across entries
    if (!longDurationEvidence && logs.length >= 2) {
      const d1 = logs[0].date
      const d2 = logs[logs.length - 1].date
      const daySpan = getDayDiff(d1, d2)
      if (daySpan !== null && daySpan >= 21) {
        longDurationEvidence = `Logged across ${daySpan} days (${d1} to ${d2})`
      }
    }

    if (longDurationEvidence) {
      const longPattern = {
        type: 'long_lasting_symptoms',
        symptom: symKey,
        title: `Persistent ${symKey}`,
        description: 'This symptom has continued for a while. A healthcare professional can help you understand possible causes.',
        evidence: longDurationEvidence,
        severity: 'moderate',
        suggestedAction: 'A healthcare professional can help you understand possible causes.',
      }
      patterns.push(longPattern)
      warnings.push({
        id: `warn-long-${symKey}`,
        type: 'long_lasting_symptoms',
        level: 'amber',
        urgency: 'routine',
        title: longPattern.title,
        description: longPattern.description,
        evidence: longPattern.evidence,
        suggestedAction: longPattern.suggestedAction,
      })
    }
  }

  // PATTERN 6: Multiple related symptoms
  // Combinations:
  // - Irregular cycles + acne
  // - Irregular cycles + increased facial hair
  // - Irregular cycles + hair thinning
  // - Pelvic pain + irregular bleeding
  const loggedSymptomNames = new Set(Object.keys(symptomGroups))
  const comboDetections = []

  if (hasIrregularCyclePattern) {
    if (loggedSymptomNames.has('acne')) {
      comboDetections.push(['irregular cycles', 'acne'])
    }
    if (loggedSymptomNames.has('increased facial hair')) {
      comboDetections.push(['irregular cycles', 'increased facial hair'])
    }
    if (loggedSymptomNames.has('hair thinning')) {
      comboDetections.push(['irregular cycles', 'hair thinning'])
    }
  }

  if (loggedSymptomNames.has('pelvic pain') && (loggedSymptomNames.has('irregular bleeding') || loggedSymptomNames.has('heavy bleeding'))) {
    comboDetections.push(['pelvic pain', 'irregular bleeding'])
  }

  for (const combo of comboDetections) {
    const comboPattern = {
      type: 'multiple_related_symptoms',
      title: 'Multiple related symptoms observed',
      description: 'These symptoms can have several possible causes. Consider discussing the complete pattern with a gynecologist.',
      evidence: `Combination: ${combo.join(' + ')}`,
      severity: 'moderate',
      suggestedAction: 'Consider discussing the complete pattern with a gynecologist.',
    }
    patterns.push(comboPattern)
    warnings.push({
      id: `warn-combo-${combo.join('-').replace(/\s+/g, '_')}`,
      type: 'multiple_related_symptoms',
      level: 'amber',
      urgency: 'soon',
      title: comboPattern.title,
      description: comboPattern.description,
      evidence: comboPattern.evidence,
      suggestedAction: comboPattern.suggestedAction,
    })
  }

  // Handle unclear or incomplete entries (e.g. invalid dates, missing details)
  const hasIncompleteLogs = symptomLogs.some((s) => !s.symptom || (!s.date && !s.duration && !s.severity))
  if (hasIncompleteLogs) {
    warnings.push({
      id: 'warn-incomplete-logs',
      type: 'unclear_entries',
      level: 'blue',
      urgency: 'routine',
      title: 'Incomplete symptom notes',
      description: 'Some entries are missing dates or severity levels. Adding more details helps clarify patterns.',
      evidence: 'One or more entries lack date or severity',
      suggestedAction: 'Add dates and severity to help clarify symptom patterns.',
    })
  }

  // Determine overall urgency
  if (detectedRedFlags.length > 0) {
    const primary = detectedRedFlags[0]
    return {
      patterns,
      warnings,
      urgency: 'urgent',
      title: 'Please seek urgent medical care',
      description: 'Severe pain or very heavy bleeding can require immediate medical attention.',
      action: primary.action,
      explanation: 'Severe pain or very heavy bleeding can require immediate medical attention. Please seek urgent care without waiting.',
      suggestedAction: primary.action,
      disclaimer: DISCLAIMER,
    }
  }

  let overallUrgency = 'none'
  if (warnings.some((w) => w.urgency === 'soon' || w.level === 'amber')) {
    overallUrgency = 'soon'
  } else if (warnings.some((w) => w.urgency === 'routine' || w.level === 'blue')) {
    overallUrgency = 'routine'
  }

  let overallExplanation = ''
  let overallSuggestedAction = ''

  if (patterns.length === 0 && warnings.length === 0) {
    overallExplanation = 'Keep logging periods and symptoms. We’ll help you notice patterns over time.'
    overallSuggestedAction = 'Continue tracking your cycle and any symptoms that arise.'
  } else if (overallUrgency === 'soon') {
    overallExplanation = 'We noticed recurring or changing patterns in your logs. These can occur for several reasons.'
    overallSuggestedAction = 'Consider arranging a consultation with a gynecologist to review these patterns.'
  } else {
    overallExplanation = 'Your entries are recorded. Keep tracking to help build an informative timeline.'
    overallSuggestedAction = 'Add additional cycle and symptom dates when you are ready.'
  }

  return {
    patterns,
    warnings,
    urgency: overallUrgency,
    explanation: overallExplanation,
    suggestedAction: overallSuggestedAction,
    disclaimer: DISCLAIMER,
  }
}
