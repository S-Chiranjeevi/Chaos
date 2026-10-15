/**
 * SakhiCare Early Warning and Repeated Pattern Detection Service
 *
 * Rules-based, deterministic analysis of menstrual cycle and symptom history.
 *
 * Strict Medical & Safety Guardrails:
 * - Does not diagnose any medical condition.
 * - Does not label or call patterns "PCOS".
 * - Never produces warnings from a single isolated entry.
 * - Explains when more tracking data is required.
 * - Always includes transparent, verifiable evidence for every warning.
 * - Allows dismissing non-urgent warnings while keeping urgent notices visible.
 * - Fully functional offline without external AI/cloud APIs.
 */

export const URGENCY_LEVELS = {
  URGENT: 'urgent', // Red
  SOON: 'soon',     // Amber
  INFO: 'info',     // Blue or green
}

export const WARNING_TYPES = {
  CYCLE_PATTERN: 'cycle_pattern',
  CYCLE_GAP: 'cycle_gap',
  REPEATED_SYMPTOM: 'repeated_symptom',
  INCREASING_PAIN: 'increasing_pain',
  INCREASING_BLEEDING: 'increasing_bleeding',
  MULTIPLE_SYMPTOMS: 'multiple_symptoms',
  INSUFFICIENT_DATA: 'insufficient_data',
}

// Local storage keys
const STORAGE_KEY_DISMISSED = 'sakhicare_dismissed_warnings'
const STORAGE_KEY_DOCTOR_SUMMARY = 'sakhicare_doctor_summary_warnings'

/**
 * Normalizes input entries into structured cycle logs and symptom logs
 * Supports multiple formats: raw cycles array, symptom list, or generic HealthEntry list.
 */
export function normalizeHealthData(data = {}) {
  const result = {
    cycles: [],
    symptoms: [],
    rawEntries: [],
  }

  if (Array.isArray(data)) {
    // Array of HealthEntry objects
    result.rawEntries = data
    data.forEach((entry) => {
      const cat = (entry.category || '').toLowerCase()
      if (cat === 'cycle' || entry.cycleLength || entry.periodDays) {
        result.cycles.push(normalizeCycleEntry(entry))
      } else if (cat === 'symptom' || entry.symptom || entry.severity) {
        result.symptoms.push(normalizeSymptomEntry(entry))
      }
    })
  } else if (typeof data === 'object' && data !== null) {
    // Object with cycles/periodLogs and symptoms/symptomLogs
    const cycleList = data.cycles || data.periodLogs || []
    const symptomList = data.symptoms || data.symptomLogs || []

    result.cycles = cycleList.map(normalizeCycleEntry)
    result.symptoms = symptomList.map(normalizeSymptomEntry)
    result.rawEntries = [...(data.entries || []), ...cycleList, ...symptomList]
  }

  // Sort chronologically if dates are provided
  result.cycles.sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
  result.symptoms.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))

  return result
}

function normalizeCycleEntry(entry) {
  let length = entry.cycleLength || entry.lengthDays || entry.days || null
  const startDate = entry.startDate || entry.date || entry.timestamp || null
  const endDate = entry.endDate || null

  return {
    id: entry.id || `cycle-${startDate || Math.random()}`,
    startDate,
    endDate,
    cycleLength: length,
    notes: entry.notes || '',
  }
}

function normalizeSymptomEntry(entry) {
  const name = (entry.symptom || entry.title || entry.name || '').toLowerCase().trim()
  const severity = (entry.severity || 'mild').toLowerCase().trim()
  const date = entry.date || entry.timestamp || null

  return {
    id: entry.id || `symptom-${date || Math.random()}`,
    symptom: name,
    severity,
    date,
    duration: entry.duration || '',
    notes: entry.notes || '',
  }
}

/**
 * Calculates cycle lengths in days between consecutive period start dates
 */
export function computeCycleIntervals(cycles = []) {
  const intervals = []

  for (let i = 0; i < cycles.length; i++) {
    const current = cycles[i]
    if (current.cycleLength && typeof current.cycleLength === 'number' && current.cycleLength > 0) {
      intervals.push({
        cycleIndex: i + 1,
        startDate: current.startDate,
        lengthDays: current.cycleLength,
      })
    } else if (i > 0 && current.startDate && cycles[i - 1].startDate) {
      const prevDate = new Date(cycles[i - 1].startDate)
      const currDate = new Date(current.startDate)
      const diffMs = currDate - prevDate
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

      if (diffDays > 0 && diffDays < 365) {
        intervals.push({
          cycleIndex: i,
          startDate: current.startDate,
          priorDate: cycles[i - 1].startDate,
          lengthDays: diffDays,
        })
      }
    }
  }

  return intervals
}

/**
 * Severity ranking helper
 */
const SEVERITY_SCORES = {
  mild: 1,
  low: 1,
  moderate: 2,
  medium: 2,
  severe: 3,
  high: 3,
  critical: 4,
}

function getSeverityScore(sev) {
  return SEVERITY_SCORES[(sev || '').toLowerCase()] || 1
}

/**
 * Main Analyzer function
 * Evaluates tracking data and produces structured warnings with evidence.
 */
export function detectEarlyWarnings(inputData = {}, options = {}) {
  const { includeDismissed = false } = options
  const normalized = normalizeHealthData(inputData)
  const { cycles, symptoms } = normalized
  const warnings = []

  const dismissedIds = getDismissedWarningIds()
  const doctorSummaryIds = getDoctorSummaryWarningIds()

  const totalEntriesCount = cycles.length + symptoms.length

  // Rule 0: Insufficient Tracking Data
  // Never produce clinical warnings from one isolated entry or zero data
  if (totalEntriesCount === 0) {
    warnings.push({
      id: 'warn-insufficient-data-empty',
      type: WARNING_TYPES.INSUFFICIENT_DATA,
      title: 'No cycle or symptom data logged yet',
      message: 'Start by recording your cycle start dates or any noticeable symptoms. Regular logging helps reveal patterns over time.',
      evidence: {
        cyclesChecked: 0,
        symptomsLogged: 0,
        minimumRecommendedCycles: 3,
      },
      urgency: URGENCY_LEVELS.INFO,
      suggestedAction: 'Log your current or most recent period to begin tracking your personal health baseline.',
      whyAmISeeingThis: 'SakhiCare uses repeated, multi-entry patterns rather than single occurrences to provide meaningful health observations.',
      canDismiss: true,
    })
    return finalizeWarnings(warnings, dismissedIds, doctorSummaryIds, includeDismissed)
  }

  if (totalEntriesCount === 1) {
    warnings.push({
      id: 'warn-insufficient-data-single',
      type: WARNING_TYPES.INSUFFICIENT_DATA,
      title: 'More tracking data needed to identify patterns',
      message: 'You have only one recorded entry. At least 2 to 3 completed cycles or recurring entries are needed before patterns can be evaluated reliably.',
      evidence: {
        entriesRecorded: 1,
        cyclesRecorded: cycles.length,
        symptomsRecorded: symptoms.length,
        minimumRecommended: 3,
      },
      urgency: URGENCY_LEVELS.INFO,
      suggestedAction: 'Continue tracking your start and end dates and any symptoms over the coming months.',
      whyAmISeeingThis: 'A single entry cannot establish whether a variation is an isolated event or an ongoing physiological pattern.',
      canDismiss: true,
    })
    return finalizeWarnings(warnings, dismissedIds, doctorSummaryIds, includeDismissed)
  }

  // Rule 1: Cycle Pattern Analysis (Repeated Irregular Cycles & Long Gaps)
  const intervals = computeCycleIntervals(cycles)

  if (intervals.length >= 1) {
    const recentIntervals = intervals.slice(-4) // Look at the last up to 4 cycles
    const veryLongGap = recentIntervals.find((c) => c.lengthDays >= 45)

    if (recentIntervals.length >= 2) {
      const longCycles = recentIntervals.filter((c) => c.lengthDays > 35)
      const shortCycles = recentIntervals.filter((c) => c.lengthDays < 21)
      const totalDays = recentIntervals.reduce((sum, c) => sum + c.lengthDays, 0)
      const avgDays = Math.round(totalDays / recentIntervals.length)

      // Check for repeated longer than 35 days (matching prompt example)
      if (longCycles.length >= 2) {
        warnings.push({
          id: 'warn-repeated-long-cycles',
          type: WARNING_TYPES.CYCLE_PATTERN,
          title: 'Your recent cycles have been longer than usual',
          message: `${longCycles.length} of your last ${recentIntervals.length} recorded cycles were longer than 35 days.`,
          evidence: {
            cyclesChecked: recentIntervals.length,
            averageDays: avgDays,
            longCycles: longCycles.length,
            cycleLengths: recentIntervals.map((c) => c.lengthDays),
          },
          urgency: URGENCY_LEVELS.SOON,
          suggestedAction: 'Consider discussing this pattern with a gynecologist.',
          whyAmISeeingThis: 'A typical menstrual cycle interval is between 21 and 35 days. Cycles consistently exceeding 35 days (oligomenorrhea) often indicate delayed or irregular ovulation.',
          canDismiss: true,
        })
      } else if (shortCycles.length >= 2) {
        warnings.push({
          id: 'warn-repeated-short-cycles',
          type: WARNING_TYPES.CYCLE_PATTERN,
          title: 'Frequent or unusually short cycles observed',
          message: `${shortCycles.length} of your recent cycles were shorter than 21 days apart.`,
          evidence: {
            cyclesChecked: recentIntervals.length,
            averageDays: avgDays,
            shortCycles: shortCycles.length,
            cycleLengths: recentIntervals.map((c) => c.lengthDays),
          },
          urgency: URGENCY_LEVELS.SOON,
          suggestedAction: 'Discuss this short interval pattern with a healthcare provider to assess luteal phase stability or thyroid function.',
          whyAmISeeingThis: 'Cycles under 21 days (polymenorrhea) can lead to iron loss and may reflect anovulatory bleeding or shortened follicular phases.',
          canDismiss: true,
        })
      } else {
        // Check for high variability (difference between min and max > 10 days)
        const lengths = recentIntervals.map((c) => c.lengthDays)
        const minLength = Math.min(...lengths)
        const maxLength = Math.max(...lengths)
        const variance = maxLength - minLength

        if (variance >= 12 && recentIntervals.length >= 3) {
          warnings.push({
            id: 'warn-cycle-variability',
            type: WARNING_TYPES.CYCLE_PATTERN,
            title: 'Noticed variability in cycle length',
            message: `Your recorded cycle lengths vary by ${variance} days (ranging from ${minLength} to ${maxLength} days).`,
            evidence: {
              cyclesChecked: recentIntervals.length,
              varianceDays: variance,
              shortestCycle: minLength,
              longestCycle: maxLength,
            },
            urgency: URGENCY_LEVELS.INFO,
            suggestedAction: 'Keep logging your cycles to observe whether variability continues or stabilizes.',
            whyAmISeeingThis: 'Variability greater than 8–10 days from month to month can occur with ovulatory shifts, stress, or lifestyle changes.',
            canDismiss: true,
          })
        }
      }
    }

    // Long gaps between periods (>= 45 days in any recent cycle)
    if (veryLongGap && !warnings.some((w) => w.id === 'warn-repeated-long-cycles')) {
      warnings.push({
        id: 'warn-single-long-gap',
        type: WARNING_TYPES.CYCLE_GAP,
        title: 'Long gap observed between periods',
        message: `A gap of ${veryLongGap.lengthDays} days was recorded between consecutive menstrual periods.`,
        evidence: {
          gapDays: veryLongGap.lengthDays,
          expectedRange: '21-35 days',
          recordedDate: veryLongGap.startDate,
        },
        urgency: URGENCY_LEVELS.SOON,
        suggestedAction: 'A gynecologist can evaluate whether ovulation paused or was significantly delayed.',
        whyAmISeeingThis: 'Gaps of 45 days or more suggest a skipped or delayed ovulatory cycle.',
        canDismiss: true,
      })
    } else if (intervals.length === 1 && !veryLongGap) {
      warnings.push({
        id: 'warn-insufficient-cycle-data',
        type: WARNING_TYPES.INSUFFICIENT_DATA,
        title: 'Additional cycle records needed for cycle analysis',
        message: 'You have recorded 1 completed cycle interval. Tracking 2 or 3 completed cycles allows the system to calculate your average cycle length and regularity.',
        evidence: {
          cycleIntervalsRecorded: 1,
          cyclesNeeded: 3,
        },
        urgency: URGENCY_LEVELS.INFO,
        suggestedAction: 'Add your next period start date when it begins to unlock automated cycle pattern detection.',
        whyAmISeeingThis: 'At least 2 to 3 completed cycle intervals are required to assess recurring cycle patterns.',
        canDismiss: true,
      })
    }
  } else if (cycles.length === 1 && intervals.length === 0) {
    // Only 1 cycle logged while there might be symptoms
    warnings.push({
      id: 'warn-insufficient-cycle-data',
      type: WARNING_TYPES.INSUFFICIENT_DATA,
      title: 'Additional cycle records needed for cycle analysis',
      message: 'You have recorded 1 period date. Tracking 2 or 3 completed cycles allows the system to calculate your average cycle length and regularity.',
      evidence: {
        cyclesRecorded: 1,
        cyclesNeeded: 3,
      },
      urgency: URGENCY_LEVELS.INFO,
      suggestedAction: 'Add your next period start date when it begins to unlock automated cycle pattern detection.',
      whyAmISeeingThis: 'Cycle length is calculated as the interval between consecutive start dates; at least two start dates are required for a single interval.',
      canDismiss: true,
    })
  }

  // Group symptoms by category
  const symptomGroups = {
    pelvic: [],
    pain: [],
    acne: [],
    hair: [],
    bleeding: [],
    other: [],
  }

  symptoms.forEach((s) => {
    const text = `${s.symptom} ${s.notes}`.toLowerCase()
    if (text.includes('pelvic') || text.includes('cramp') || text.includes('lower belly') || text.includes('ovary')) {
      symptomGroups.pelvic.push(s)
    }
    if (text.includes('pain') || text.includes('dard') || text.includes('ache') || text.includes('cramp')) {
      symptomGroups.pain.push(s)
    }
    if (text.includes('acne') || text.includes('pimple') || text.includes('breakout') || text.includes('mohase')) {
      symptomGroups.acne.push(s)
    }
    if (text.includes('hair') || text.includes('baal') || text.includes('hirsutism') || text.includes('chin') || text.includes('facial hair') || text.includes('thinning')) {
      symptomGroups.hair.push(s)
    }
    if (text.includes('bleed') || text.includes('flow') || text.includes('heavy') || text.includes('clot') || text.includes('spotting')) {
      symptomGroups.bleeding.push(s)
    }
  })

  // Rule 2: Repeated Pelvic Discomfort
  if (symptomGroups.pelvic.length >= 2) {
    const severities = symptomGroups.pelvic.map((s) => s.severity)
    const hasSevere = severities.includes('severe') || severities.includes('critical')

    warnings.push({
      id: 'warn-repeated-pelvic-discomfort',
      type: WARNING_TYPES.REPEATED_SYMPTOM,
      title: 'Repeated pelvic discomfort recorded',
      message: `Pelvic discomfort or lower abdominal cramping was logged across ${symptomGroups.pelvic.length} separate entries.`,
      evidence: {
        symptom: 'pelvic discomfort',
        occurrences: symptomGroups.pelvic.length,
        severities,
        datesLogged: symptomGroups.pelvic.map((s) => s.date).filter(Boolean),
      },
      urgency: hasSevere ? URGENCY_LEVELS.URGENT : URGENCY_LEVELS.SOON,
      suggestedAction: hasSevere
        ? 'Seek prompt clinical medical care to rule out acute causes like ovarian cyst rupture or pelvic infection.'
        : 'Consult a gynecologist to explore potential causes such as ovulatory pain, endometriosis, or pelvic congestion.',
      whyAmISeeingThis: 'Occasional mild cramping during menses is common, but recurrent discomfort outside menstruation or across cycles warrants evaluation.',
      canDismiss: !hasSevere,
    })
  }

  // Rule 3: Repeated Acne
  if (symptomGroups.acne.length >= 2) {
    warnings.push({
      id: 'warn-repeated-acne',
      type: WARNING_TYPES.REPEATED_SYMPTOM,
      title: 'Persistent or recurring acne entries',
      message: `Acne or facial breakouts have been logged across ${symptomGroups.acne.length} separate entries.`,
      evidence: {
        symptom: 'acne',
        occurrences: symptomGroups.acne.length,
        severities: symptomGroups.acne.map((s) => s.severity),
      },
      urgency: URGENCY_LEVELS.INFO,
      suggestedAction: 'A dermatologist or gynecologist can determine whether hormonal balance or topical factors are contributing.',
      whyAmISeeingThis: 'Acne that persists or flares cyclically (especially around the chin and jawline) can be linked with androgen stimulation of sebaceous glands.',
      canDismiss: true,
    })
  }

  // Rule 4: Repeated Hair Changes
  if (symptomGroups.hair.length >= 2) {
    warnings.push({
      id: 'warn-repeated-hair-changes',
      type: WARNING_TYPES.REPEATED_SYMPTOM,
      title: 'Recurring hair changes logged',
      message: `Hair-related symptoms (unwanted facial/body hair or scalp thinning) were recorded across ${symptomGroups.hair.length} entries.`,
      evidence: {
        symptom: 'hair changes',
        occurrences: symptomGroups.hair.length,
        details: symptomGroups.hair.map((s) => s.notes || s.symptom),
      },
      urgency: URGENCY_LEVELS.SOON,
      suggestedAction: 'Consider consulting an endocrinologist or gynecologist to evaluate serum androgens (such as total and free testosterone).',
      whyAmISeeingThis: 'Androgens stimulate coarse terminal hair on the face/body while potentially shortening the growth phase of scalp hair.',
      canDismiss: true,
    })
  }

  // Rule 5: Increasing Pain Severity
  if (symptomGroups.pain.length >= 2) {
    const scores = symptomGroups.pain.map((s) => getSeverityScore(s.severity))
    const firstScore = scores[0]
    const lastScore = scores[scores.length - 1]
    const severities = symptomGroups.pain.map((s) => s.severity)

    // Check if severity increased over time
    const isStrictlyWorsening = lastScore > firstScore
    const reachedSevere = lastScore >= 3

    if (isStrictlyWorsening) {
      warnings.push({
        id: 'warn-increasing-pain',
        type: WARNING_TYPES.INCREASING_PAIN,
        title: 'Pain severity has shown an increasing trend',
        message: `Your recorded pain severity progressed from ${severities[0]} to ${severities[severities.length - 1]} across recent entries.`,
        evidence: {
          initialSeverity: severities[0],
          currentSeverity: severities[severities.length - 1],
          progression: severities,
          entriesChecked: symptomGroups.pain.length,
        },
        urgency: reachedSevere ? URGENCY_LEVELS.URGENT : URGENCY_LEVELS.SOON,
        suggestedAction: reachedSevere
          ? 'Please seek urgent clinical evaluation for acute or rapidly worsening pain.'
          : 'Discuss this escalating pain pattern with a physician rather than relying only on over-the-counter painkillers.',
        whyAmISeeingThis: 'Progressive pain intensity may signal changing physiological conditions such as ovarian cyst enlargement, fibroids, or endometriosis.',
        canDismiss: !reachedSevere,
      })
    }
  }

  // Rule 6: Increasing Bleeding Severity / Red Flag Bleeding
  if (symptomGroups.bleeding.length >= 2) {
    const severities = symptomGroups.bleeding.map((s) => s.severity)
    const hasDizziness = symptomGroups.bleeding.some((s) => {
      const text = `${s.symptom} ${s.notes}`.toLowerCase()
      return text.includes('dizz') || text.includes('faint') || text.includes('lightheaded') || text.includes('chakkar')
    })
    const lastSeverity = severities[severities.length - 1]

    if (hasDizziness || lastSeverity === 'severe' || lastSeverity === 'heavy') {
      warnings.push({
        id: 'warn-increasing-bleeding',
        type: WARNING_TYPES.INCREASING_BLEEDING,
        title: hasDizziness ? 'Heavy bleeding accompanied by dizziness' : 'Heavier bleeding pattern observed',
        message: hasDizziness
          ? 'Heavy menstrual bleeding logged with symptoms of dizziness or lightheadedness.'
          : `Bleeding severity has increased over recent entries, reaching ${lastSeverity}.`,
        evidence: {
          initialSeverity: severities[0],
          currentSeverity: lastSeverity,
          accompaniedByDizziness: hasDizziness,
          entriesChecked: symptomGroups.bleeding.length,
        },
        urgency: hasDizziness ? URGENCY_LEVELS.URGENT : URGENCY_LEVELS.SOON,
        suggestedAction: hasDizziness
          ? 'Seek urgent medical attention. Significant blood loss combined with dizziness requires immediate clinical care.'
          : 'Schedule a visit with an OB-GYN to check complete blood count (CBC) and evaluate uterine lining thickness.',
        whyAmISeeingThis: 'Heavy bleeding that impairs hemodynamics (causing dizziness or fatigue) carries risk of anemia and requires prompt evaluation.',
        canDismiss: !hasDizziness,
      })
    }
  }

  // Rule 7: Multiple Symptoms Together
  const activeCategories = []
  if (intervals.some((c) => c.lengthDays > 35) || cycles.length >= 2) activeCategories.push('cycle patterns')
  if (symptomGroups.acne.length >= 1) activeCategories.push('acne/skin')
  if (symptomGroups.hair.length >= 1) activeCategories.push('hair changes')
  if (symptomGroups.pelvic.length >= 1 || symptomGroups.pain.length >= 1) activeCategories.push('pelvic discomfort')

  if (activeCategories.length >= 2 && totalEntriesCount >= 3) {
    // Check if we don't already have a generic multiple-symptom warning
    warnings.push({
      id: 'warn-multiple-symptoms-cluster',
      type: WARNING_TYPES.MULTIPLE_SYMPTOMS,
      title: 'Cluster of multiple co-occurring symptoms',
      message: `You have logged symptoms across multiple areas: ${activeCategories.join(', ')}.`,
      evidence: {
        categoriesIdentified: activeCategories,
        totalCategoryCount: activeCategories.length,
        totalEntriesAnalyzed: totalEntriesCount,
      },
      urgency: URGENCY_LEVELS.SOON,
      suggestedAction: 'Bring this complete multi-symptom record to a gynecologist or endocrinologist for holistic hormonal and metabolic screening.',
      whyAmISeeingThis: 'Hormonal and ovulatory processes interconnect across the cycle, skin, and metabolism; evaluating them together offers clinicians a complete picture.',
      canDismiss: true,
    })
  }

  return finalizeWarnings(warnings, dismissedIds, doctorSummaryIds, includeDismissed)
}

/**
 * Attaches metadata, local storage states, and filters dismissed warnings
 */
function finalizeWarnings(warnings, dismissedIds, doctorSummaryIds, includeDismissed) {
  const processed = warnings.map((warn) => {
    const isDismissed = dismissedIds.includes(warn.id)
    const isAddedToDoctorSummary = doctorSummaryIds.includes(warn.id)

    return {
      ...warn,
      isDismissed,
      isAddedToDoctorSummary,
    }
  })

  if (!includeDismissed) {
    return processed.filter((w) => !w.isDismissed)
  }

  return processed
}

// ============================================================================
// LOCAL STORAGE MANAGEMENT
// ============================================================================

export function getDismissedWarningIds() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const raw = window.localStorage.getItem(STORAGE_KEY_DISMISSED)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Could not read dismissed warnings from localStorage:', err)
    return []
  }
}

export function dismissWarning(warningId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const current = getDismissedWarningIds()
    if (!current.includes(warningId)) {
      current.push(warningId)
      window.localStorage.setItem(STORAGE_KEY_DISMISSED, JSON.stringify(current))
    }
    return current
  } catch (err) {
    console.warn('Could not dismiss warning in localStorage:', err)
    return []
  }
}

export function undismissWarning(warningId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const current = getDismissedWarningIds().filter((id) => id !== warningId)
    window.localStorage.setItem(STORAGE_KEY_DISMISSED, JSON.stringify(current))
    return current
  } catch (err) {
    console.warn('Could not restore dismissed warning in localStorage:', err)
    return []
  }
}

export function getDoctorSummaryWarningIds() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const raw = window.localStorage.getItem(STORAGE_KEY_DOCTOR_SUMMARY)
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    console.warn('Could not read doctor summary warnings from localStorage:', err)
    return []
  }
}

export function toggleDoctorSummaryWarning(warningId) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    const current = getDoctorSummaryWarningIds()
    const index = current.indexOf(warningId)
    let added = false

    if (index >= 0) {
      current.splice(index, 1)
      added = false
    } else {
      current.push(warningId)
      added = true
    }

    window.localStorage.setItem(STORAGE_KEY_DOCTOR_SUMMARY, JSON.stringify(current))
    return added
  } catch (err) {
    console.warn('Could not toggle doctor summary warning in localStorage:', err)
    return false
  }
}

export function clearEarlyWarningStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return
    window.localStorage.removeItem(STORAGE_KEY_DISMISSED)
    window.localStorage.removeItem(STORAGE_KEY_DOCTOR_SUMMARY)
  } catch (err) {
    console.warn('Could not clear warning storage:', err)
  }
}
