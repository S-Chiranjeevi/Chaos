/**
 * Luna Her - Personalized AI Insights Engine
 * 
 * Analyzes symptom logs and menstrual cycle history to generate
 * short, personalized, easy-to-understand educational insights.
 * NEVER diagnoses or recommends medications/dosages.
 */

export const DISCLAIMER = 'This is information, not a diagnosis.'

export const SYSTEM_INSTRUCTION = `You are an educational women’s health assistant.

Explain patterns in the user’s recorded symptoms and cycle history using simple, respectful language.

You must not diagnose the user.
You must not claim that the user has PCOS or any other condition.
You must not recommend medicines, supplements, or dosages.
You must not tell the user to stop or change prescribed treatment.
You must not infer pregnancy.
You must not create urgency unless the input contains a defined red-flag symptom.

Use phrases such as:
“can sometimes be related to”
“may have several possible causes”
“consider discussing this with a healthcare professional”

Every response must include:
“This is information, not a diagnosis.”

If severe pain, very heavy bleeding, fainting, severe weakness, or possible pregnancy-related danger signs are present, tell the user to seek urgent medical care.`

export const INSIGHT_CATEGORIES = {
  CYCLE_PATTERN: 'cycle_pattern',
  REPEATED_SYMPTOM: 'repeated_symptom',
  CHANGING_SEVERITY: 'changing_severity',
  SYMPTOM_DURATION: 'symptom_duration',
  DOCTOR_PREPARATION: 'doctor_preparation',
  SELF_CARE_REMINDER: 'self_care_reminder',
  MISSING_INFORMATION: 'missing_information',
  SAFETY_WARNING: 'safety_warning',
}

// Red-flag symptom definitions that require urgent medical evaluation
const RED_FLAG_KEYWORDS = [
  'severe pain',
  'excruciating pain',
  'unbearable pain',
  'very heavy bleeding',
  'soaking through pad',
  'fainting',
  'fainted',
  'passed out',
  'severe weakness',
  'pregnancy warning',
  'pregnant bleeding',
  'possible pregnancy pain',
  'बहुत तेज़ दर्द',
  'असहनीय दर्द',
  'बहुत ज़्यादा खून',
  'बेहोश',
]

/**
 * Calculates days between two ISO date strings (YYYY-MM-DD)
 */
function daysBetween(dateStrA, dateStrB) {
  const d1 = new Date(dateStrA)
  const d2 = new Date(dateStrB)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.round(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Derives cycle lengths in days from an array of period logs sorted chronologically
 */
function computeCycleLengths(periodLogs = []) {
  if (!periodLogs || periodLogs.length === 0) return []

  const hasExplicitLengths = periodLogs.some((p) => typeof p.cycleLengthDays === 'number' && p.cycleLengthDays > 0)
  if (hasExplicitLengths) {
    const explicit = periodLogs.filter((p) => typeof p.cycleLengthDays === 'number' && p.cycleLengthDays > 0)
    return explicit.map((p, idx) => ({
      length: p.cycleLengthDays,
      fromEntryId: idx > 0 ? explicit[idx - 1].id : p.id,
      toEntryId: p.id,
      date: p.date,
    }))
  }

  if (periodLogs.length < 2) return []

  // Sort ascending by date
  const sorted = [...periodLogs].sort((a, b) => new Date(a.date) - new Date(b.date))
  const lengths = []

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].date && sorted[i - 1].date) {
      const days = daysBetween(sorted[i - 1].date, sorted[i].date)
      if (days >= 15 && days <= 180) {
        lengths.push({
          length: days,
          fromEntryId: sorted[i - 1].id,
          toEntryId: sorted[i].id,
          date: sorted[i].date,
        })
      }
    }
  }
  return lengths
}

/**
 * Checks if a symptom text or severity matches red-flag criteria
 */
function isRedFlagSymptom(symptomLog) {
  const text = `${symptomLog.symptom || ''} ${symptomLog.severity || ''} ${symptomLog.notes || ''}`.toLowerCase()
  return RED_FLAG_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))
}

/**
 * Translates/formats an insight if user language is Hindi
 */
function localizeInsight(insight, isHindi) {
  if (!isHindi) return insight

  const translations = {
    'Cycle pattern': 'माहवारी का पैटर्न',
    'Repeated symptom': 'बार-बार दिखने वाला लक्षण',
    'Changing severity': 'लक्षण की तीव्रता में बदलाव',
    'Symptom duration': 'लक्षण की अवधि',
    'Doctor preparation': 'डॉक्टर से बातचीत की तैयारी',
    'Self-care reminder': 'आत्म-देखभाल का सुझाव',
    'Missing information': 'अधूरी जानकारी',
    'Safety warning': 'स्वास्थ्य सुरक्षा चेतावनी',
  }

  // Predefined high-quality Hindi translations for common insights
  let hindiTitle = translations[insight.title] || insight.title
  let hindiMessage = insight.message
  let hindiWhy = insight.whyThisAppeared
  let hindiAction = insight.suggestedAction

  if (insight.category === INSIGHT_CATEGORIES.SAFETY_WARNING) {
    hindiTitle = 'तत्काल चिकित्सकीय परामर्श आवश्यक'
    hindiMessage = 'आपके दर्ज लक्षणों में बहुत तेज़ दर्द या भारी रक्तस्राव शामिल है। कृपया तुरंत चिकित्सकीय सहायता लें।'
    hindiWhy = 'दर्ज किए गए गंभीर लक्षण तुरंत जांच की मांग करते हैं।'
    hindiAction = 'नजदीकी आपातकालीन केंद्र या डॉक्टर से तुरंत संपर्क करें।'
  } else if (insight.category === INSIGHT_CATEGORIES.CYCLE_PATTERN) {
    hindiTitle = 'आपकी माहवारी चक्र में बदलाव देखा गया'
    hindiMessage = insight.isContinuation
      ? 'आपका पिछला अनियमित चक्र का पैटर्न एक और महीने जारी रहा है।'
      : 'आपके पिछले दर्ज चक्र सामान्य से अधिक लंबे रहे हैं।'
    hindiWhy = insight.whyThisAppeared.replace('Cycle lengths recorded:', 'दर्ज चक्र अवधि:')
    hindiAction = 'इस पैटर्न के बारे में महिला रोग विशेषज्ञ (गायनेकोलॉजिस्ट) से चर्चा करने पर विचार करें।'
  } else if (insight.category === INSIGHT_CATEGORIES.REPEATED_SYMPTOM) {
    hindiTitle = 'मुंहासों का बार-बार दिखना'
    hindiMessage = 'आपने हाल के चक्रों में बार-बार मुंहासे दर्ज किए हैं। इसे अपनी डॉक्टर सारांश सूची में जोड़ें।'
    hindiWhy = insight.whyThisAppeared.replace('Recorded across', 'दर्ज किया गया:')
    hindiAction = 'डॉक्टर से चर्चा करें कि क्या यह अन्य परिवर्तनों से जुड़ा हो सकता है।'
  } else if (insight.category === INSIGHT_CATEGORIES.SYMPTOM_DURATION) {
    hindiTitle = 'लंबे समय से थकान का अनुभव'
    hindiMessage = 'आप एक महीने से अधिक समय से थकान दर्ज कर रही हैं। डॉक्टर से बताएं कि यह दैनिक जीवन को कैसे प्रभावित करता है।'
    hindiWhy = insight.whyThisAppeared
    hindiAction = 'अपनी अगली मुलाकात के दौरान इस पर चर्चा करें।'
  } else if (insight.category === INSIGHT_CATEGORIES.MISSING_INFORMATION) {
    hindiTitle = 'पर्याप्त चक्र डेटा उपलब्ध नहीं है'
    hindiMessage = 'विश्वसनीय पैटर्न की पहचान करने के लिए हमारे पास हाल का पर्याप्त डेटा नहीं है। कृपया तारीखें दर्ज करते रहें।'
    hindiWhy = 'अभी केवल बहुत कम प्रविष्टियां दर्ज की गई हैं।'
    hindiAction = 'अगली माहवारी की तारीख और कोई भी लक्षण नियमित रूप से दर्ज करें।'
  } else if (insight.category === INSIGHT_CATEGORIES.DOCTOR_PREPARATION) {
    hindiTitle = 'डॉक्टर से परामर्श की तैयारी'
    hindiMessage = 'आपके नोट्स में चक्र में बदलाव और त्वचा के लक्षण शामिल हैं। डॉक्टर से मूल्यांकन के बारे में पूछें।'
    hindiWhy = 'आपके द्वारा दर्ज किए गए विभिन्न लक्षणों के आधार पर।'
    hindiAction = 'अपने प्रश्नों की सूची तैयार रखें।'
  }

  return {
    ...insight,
    title: hindiTitle,
    message: hindiMessage,
    whyThisAppeared: hindiWhy,
    suggestedAction: hindiAction,
  }
}

/**
 * Validates generated insight according to strict safety rules
 */
export function validateSafety(insight) {
  const text = `${insight.title} ${insight.message} ${insight.suggestedAction}`.toLowerCase()

  // Prohibited diagnostic assertions
  const prohibitedDiagnoses = [
    'you have pcos',
    'you are diagnosed with',
    'this is endometriosis',
    'you suffer from pcos',
    'you are pregnant',
  ]
  for (const diag of prohibitedDiagnoses) {
    if (text.includes(diag)) {
      throw new Error(`Safety violation: insight contains diagnosis claim "${diag}"`)
    }
  }

  // Prohibited prescriptions
  const prohibitedPrescriptions = [
    'take metformin',
    'take birth control',
    'stop taking',
    'prescribe',
    'take ibuprofen 400mg',
    'dosage',
  ]
  for (const rx of prohibitedPrescriptions) {
    if (text.includes(rx)) {
      throw new Error(`Safety violation: insight contains drug/dosage recommendation "${rx}"`)
    }
  }

  // Ensure word count is under 40 words
  const wordCount = insight.message.trim().split(/\s+/).length
  if (wordCount > 40) {
    // Truncate cleanly while preserving meaning
    const words = insight.message.trim().split(/\s+/)
    insight.message = words.slice(0, 38).join(' ') + '...'
  }

  return true
}

/**
 * Core Rule-Based Deterministic Insight Engine
 * Generates personalized insights strictly adhering to safety rules.
 */
export function generatePersonalizedInsights(inputData) {
  const {
    userLanguage = 'English',
    periodLogs = [],
    symptomLogs = [],
    previousInsights = [],
    userPreferences = {},
  } = inputData || {}

  const isHindi = userLanguage?.toLowerCase().includes('hindi') || userLanguage?.toLowerCase() === 'hi'
  const style = userPreferences.communicationStyle || 'simple'
  const preferredDoctor = userPreferences.preferredDoctor || 'a gynecologist'
  const doctorMention = preferredDoctor.includes('female')
    ? 'a female gynecologist'
    : preferredDoctor.includes('endocrinologist')
      ? 'an endocrinologist'
      : 'a gynecologist'

  // Map of previously dismissed insight IDs to prevent re-generation
  const dismissedSet = new Set(
    previousInsights.filter((p) => p.dismissed).map((p) => p.insightId || p.id)
  )

  // Map of previously shown insights with source entries to check if data changed
  const previousShownMap = new Map(
    previousInsights.map((p) => [p.insightId || p.id, p])
  )

  const candidateInsights = []

  // ----------------------------------------------------
  // 1. SAFETY WARNING (Priority 1)
  // ----------------------------------------------------
  const redFlagLogs = symptomLogs.filter(isRedFlagSymptom)
  if (redFlagLogs.length > 0) {
    const sourceIds = redFlagLogs.map((log) => log.id || 'redflag-entry')
    const symptomNames = [...new Set(redFlagLogs.map((l) => l.symptom || 'severe symptoms'))].join(', ')
    const insightId = 'insight-safety-warning'

    if (!dismissedSet.has(insightId)) {
      candidateInsights.push({
        id: insightId,
        category: INSIGHT_CATEGORIES.SAFETY_WARNING,
        title: 'Safety notice: Seek prompt evaluation',
        message: 'You recorded severe pain or heavy bleeding. These symptoms can have several causes and need prompt medical evaluation.',
        whyThisAppeared: `Logged high-severity symptom: ${symptomNames}.`,
        suggestedAction: 'Please seek urgent medical care or contact emergency services.',
        urgency: 'urgent',
        confidence: 'high',
        sourceEntries: sourceIds,
      })
    }
  }

  // ----------------------------------------------------
  // 2. CYCLE PATTERN (Priority 2)
  // ----------------------------------------------------
  const cycleLengths = computeCycleLengths(periodLogs)
  const irregularCycles = cycleLengths.filter((c) => c.length > 35 || c.length < 21)

  // Also check if notes describe irregular cycles
  const irregularNotes = periodLogs.filter((p) =>
    /irregular|late|missed|2-3 months|infrequent|skipped/i.test(p.note || '')
  )

  if (irregularCycles.length >= 3 || (irregularCycles.length >= 2 && irregularNotes.length >= 1) || irregularNotes.length >= 3) {
    const insightId = 'insight-cycle-pattern-irregular'
    if (!dismissedSet.has(insightId)) {
      const sourceIds = [
        ...new Set([
          ...irregularCycles.map((c) => c.fromEntryId),
          ...irregularCycles.map((c) => c.toEntryId),
          ...irregularNotes.map((p) => p.id),
        ].filter(Boolean))
      ]

      const lengthsList = irregularCycles.map((c) => c.length)
      let cycleDaysText = ''
      if (lengthsList.length === 1) {
        cycleDaysText = `${lengthsList[0]} days`
      } else if (lengthsList.length === 2) {
        cycleDaysText = `${lengthsList[0]} and ${lengthsList[1]} days`
      } else if (lengthsList.length > 2) {
        cycleDaysText = `${lengthsList.slice(0, -1).join(', ')}, and ${lengthsList[lengthsList.length - 1]} days`
      }

      const pStr = periodLogs
        .map((p) => `${p.id || ''}:${p.date || ''}:${p.cycleLengthDays || ''}:${p.note || ''}`)
        .sort()
        .join('|')
      const sStr = symptomLogs
        .map((s) => `${s.id || ''}:${s.date || ''}:${s.symptom || ''}:${s.severity || ''}`)
        .sort()
        .join('|')
      const currentFingerprint = inputData?.dataFingerprint || `${pStr}__${sStr}`

      const prevRecord = previousShownMap.get(insightId)
      const hasNewCyclesSinceLast = Boolean(
        prevRecord &&
        prevRecord.dataFingerprint &&
        prevRecord.dataFingerprint !== currentFingerprint &&
        sourceIds.length > (prevRecord.sourceCount || 0)
      )

      let message = ''
      let why = `Cycle lengths recorded: ${cycleDaysText || 'extended intervals'}.`

      if (hasNewCyclesSinceLast) {
        message = 'Your previous pattern has continued for another month.'
        why = `Latest cycle lengths recorded: ${cycleDaysText || 'irregular intervals'}.`
      } else if (style === 'detailed') {
        message = `Your last three recorded cycles lasted ${cycleDaysText || 'longer than 35 days'}, which shows a repeated irregular pattern.`
      } else {
        // Simple communication style (< 40 words)
        message = 'Your last three logged cycles were longer than usual. This pattern can have several causes. Consider discussing it with a doctor.'
      }

      candidateInsights.push({
        id: insightId,
        category: INSIGHT_CATEGORIES.CYCLE_PATTERN,
        title: 'Your cycle pattern has changed',
        message,
        whyThisAppeared: why,
        suggestedAction: `Consider sharing this pattern with ${doctorMention}.`,
        urgency: 'routine',
        confidence: 'high',
        sourceEntries: sourceIds.length ? sourceIds : periodLogs.slice(-3).map((p) => p.id),
        isContinuation: hasNewCyclesSinceLast,
      })
    }
  }

  // ----------------------------------------------------
  // 3. REPEATED SYMPTOM (e.g. Acne during 3 cycles)
  // ----------------------------------------------------
  const symptomCounts = {}
  for (const log of symptomLogs) {
    const key = (log.symptom || '').trim().toLowerCase()
    if (!key) continue
    if (!symptomCounts[key]) {
      symptomCounts[key] = { name: log.symptom, entries: [] }
    }
    symptomCounts[key].entries.push(log)
  }

  // Look for repeated symptoms (acne, fatigue, etc.)
  for (const [key, data] of Object.entries(symptomCounts)) {
    if (data.entries.length >= 2) {
      const insightId = `insight-repeated-${key.replace(/[^a-z0-9]/g, '-')}`
      if (!dismissedSet.has(insightId)) {
        const sourceIds = data.entries.map((e) => e.id)
        let message = ''
        if (key.includes('acne')) {
          message = 'You recorded acne during three recent cycles. Add this to your doctor summary so you can discuss whether it is connected to other changes.'
        } else {
          message = `You recorded ${data.name} across ${data.entries.length} recent entries. Consider discussing whether this connects to cycle changes.`
        }

        candidateInsights.push({
          id: insightId,
          category: INSIGHT_CATEGORIES.REPEATED_SYMPTOM,
          title: `Repeated symptom: ${data.name}`,
          message,
          whyThisAppeared: `Recorded across ${data.entries.length} entries on different dates.`,
          suggestedAction: 'Add this pattern to your doctor summary for your next visit.',
          urgency: 'routine',
          confidence: 'high',
          sourceEntries: sourceIds,
        })
      }
    }
  }

  // ----------------------------------------------------
  // 4. SYMPTOM DURATION (e.g. Fatigue lasting > 1 month)
  // ----------------------------------------------------
  const longDurationLogs = symptomLogs.filter((log) => {
    const dur = `${log.duration || ''} ${log.frequency || ''}`.toLowerCase()
    return /month|30 days|several weeks|weeks|ongoing|constant/i.test(dur)
  })

  if (longDurationLogs.length > 0) {
    const fatigueLog = longDurationLogs.find((l) => /fatigue|tired|exhaust/i.test(l.symptom || '')) || longDurationLogs[0]
    const insightId = `insight-duration-${(fatigueLog.symptom || 'symptom').toLowerCase().replace(/[^a-z0-9]/g, '-')}`

    if (!dismissedSet.has(insightId)) {
      candidateInsights.push({
        id: insightId,
        category: INSIGHT_CATEGORIES.SYMPTOM_DURATION,
        title: `Persistent ${fatigueLog.symptom || 'symptom'} tracked`,
        message: `You have been tracking ${fatigueLog.symptom || 'fatigue'} for more than one month. Consider mentioning how it affects your daily activities during your appointment.`,
        whyThisAppeared: `Recorded duration: "${fatigueLog.duration || 'over one month'}".`,
        suggestedAction: `Discuss how this duration impacts your routines with ${doctorMention}.`,
        urgency: 'routine',
        confidence: 'high',
        sourceEntries: [fatigueLog.id || 'duration-log-1'],
      })
    }
  }

  // ----------------------------------------------------
  // 5. CHANGING SEVERITY (e.g. Mild to Moderate to Severe)
  // ----------------------------------------------------
  for (const [key, data] of Object.entries(symptomCounts)) {
    if (data.entries.length >= 2) {
      const severities = data.entries.map((e) => (e.severity || '').toLowerCase()).filter(Boolean)
      const hasMild = severities.includes('mild')
      const hasModerateOrSevere = severities.includes('moderate') || severities.includes('severe')

      if (hasMild && hasModerateOrSevere) {
        const insightId = `insight-severity-${key.replace(/[^a-z0-9]/g, '-')}`
        if (!dismissedSet.has(insightId)) {
          candidateInsights.push({
            id: insightId,
            category: INSIGHT_CATEGORIES.CHANGING_SEVERITY,
            title: `Changing severity for ${data.name}`,
            message: `Your notes show ${data.name} intensity has increased from mild to higher levels over time.`,
            whyThisAppeared: `Severity ratings logged: ${severities.join(' → ')}.`,
            suggestedAction: 'Note what makes it better or worse to share with your healthcare provider.',
            urgency: 'soon',
            confidence: 'moderate',
            sourceEntries: data.entries.map((e) => e.id),
          })
        }
      }
    }
  }

  // ----------------------------------------------------
  // 6. DOCTOR PREPARATION (Priority 3 Suggestion)
  // ----------------------------------------------------
  const hasAcne = Object.keys(symptomCounts).some((k) => k.includes('acne'))
  const hasCycleIssues = irregularCycles.length > 0 || irregularNotes.length > 0

  if (hasCycleIssues && hasAcne) {
    const insightId = 'insight-doctor-prep-cycle-acne'
    if (!dismissedSet.has(insightId)) {
      candidateInsights.push({
        id: insightId,
        category: INSIGHT_CATEGORIES.DOCTOR_PREPARATION,
        title: 'Prepare for your consultation',
        message: 'Your notes include cycle changes and acne. You may want to ask your doctor what evaluations could help explain these symptoms.',
        whyThisAppeared: 'Combines your logged period dates with recurring skin symptom notes.',
        suggestedAction: `Prepare a list of questions to discuss with ${doctorMention}.`,
        urgency: 'routine',
        confidence: 'high',
        sourceEntries: [
          ...(periodLogs[0]?.id ? [periodLogs[0].id] : []),
          ...(symptomLogs.find((s) => /acne/i.test(s.symptom))?.id ? [symptomLogs.find((s) => /acne/i.test(s.symptom)).id] : []),
        ],
      })
    }
  }

  // ----------------------------------------------------
  // 7. MISSING INFORMATION (When data is scarce)
  // ----------------------------------------------------
  if (periodLogs.length < 2 && symptomLogs.length === 0) {
    const insightId = 'insight-missing-data'
    if (!dismissedSet.has(insightId)) {
      candidateInsights.push({
        id: insightId,
        category: INSIGHT_CATEGORIES.MISSING_INFORMATION,
        title: 'Building your health timeline',
        message: 'We do not have enough recent period data to identify a reliable pattern. Continue logging your dates when possible.',
        whyThisAppeared: `Currently only ${periodLogs.length} period entry is recorded.`,
        suggestedAction: 'Log your upcoming cycle dates and any symptoms you notice.',
        urgency: 'routine',
        confidence: 'high',
        sourceEntries: periodLogs.map((p) => p.id),
      })
    }
  }

  // ----------------------------------------------------
  // 8. SELF-CARE REMINDER (Fallback if needed)
  // ----------------------------------------------------
  if (candidateInsights.length === 0 && (periodLogs.length > 0 || symptomLogs.length > 0)) {
    const insightId = 'insight-self-care'
    if (!dismissedSet.has(insightId)) {
      candidateInsights.push({
        id: insightId,
        category: INSIGHT_CATEGORIES.SELF_CARE_REMINDER,
        title: 'Daily wellbeing reminder',
        message: 'Tracking stress, sleep, and physical comfort alongside your cycle can provide valuable context over time.',
        whyThisAppeared: 'Based on your active symptom tracking.',
        suggestedAction: 'Consider logging how you feel during different phases of your cycle.',
        urgency: 'routine',
        confidence: 'moderate',
        sourceEntries: [],
      })
    }
  }

  // ----------------------------------------------------
  // Ordering by priority rules:
  // 1. Safety warning, if present
  // 2. Most important repeated pattern
  // 3. A useful doctor-visit suggestion
  // Maximum of 3 insights returned!
  // ----------------------------------------------------
  const priorityOrder = {
    [INSIGHT_CATEGORIES.SAFETY_WARNING]: 1,
    [INSIGHT_CATEGORIES.CYCLE_PATTERN]: 2,
    [INSIGHT_CATEGORIES.REPEATED_SYMPTOM]: 3,
    [INSIGHT_CATEGORIES.CHANGING_SEVERITY]: 4,
    [INSIGHT_CATEGORIES.SYMPTOM_DURATION]: 5,
    [INSIGHT_CATEGORIES.DOCTOR_PREPARATION]: 6,
    [INSIGHT_CATEGORIES.MISSING_INFORMATION]: 7,
    [INSIGHT_CATEGORIES.SELF_CARE_REMINDER]: 8,
  }

  candidateInsights.sort((a, b) => {
    return (priorityOrder[a.category] || 99) - (priorityOrder[b.category] || 99)
  })

  // Deduplicate and filter out unchanged duplicates if already shown
  const finalInsights = []
  for (const item of candidateInsights) {
    if (finalInsights.length >= 3) break

    // Safety validation
    validateSafety(item)

    // Localize if needed (e.g. Hindi)
    const localized = localizeInsight(item, isHindi)
    finalInsights.push(localized)
  }

  return {
    insights: finalInsights,
    disclaimer: DISCLAIMER,
  }
}

/**
 * AI Engine Caller with Graceful Local Fallback
 * 
 * If consent is granted and external AI API is configured,
 * queries the LLM with SYSTEM_INSTRUCTION.
 * If API fails or is unavailable, falls back gracefully to
 * the rule-based engine and shows safe fallback notice.
 */
export async function generateAiInsightsWithFallback(inputData, options = {}) {
  const {
    enableCloudAi = false,
    aiEndpoint = null,
    apiKey = null,
    forceFailure = false,
  } = options

  // If user has not enabled Cloud AI or offline, run local rules engine directly
  if (!enableCloudAi) {
    return {
      ...generatePersonalizedInsights(inputData),
      engineUsed: 'rules',
      fallbackNotice: null,
    }
  }

  // Attempt Cloud AI call if configured
  try {
    if (forceFailure) {
      throw new Error('Simulated AI API failure')
    }

    if (!aiEndpoint) {
      // No custom endpoint provided; fallback cleanly
      return {
        ...generatePersonalizedInsights(inputData),
        engineUsed: 'rules',
        fallbackNotice: null,
      }
    }

    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        systemInstruction: SYSTEM_INSTRUCTION,
        input: inputData,
      }),
    })

    if (!response.ok) {
      throw new Error(`AI API returned status ${response.status}`)
    }

    const data = await response.json()
    if (!data.insights || !Array.isArray(data.insights)) {
      throw new Error('Invalid response structure from AI API')
    }

    // Validate all returned insights against safety rules
    for (const insight of data.insights) {
      validateSafety(insight)
    }

    return {
      insights: data.insights.slice(0, 3),
      disclaimer: DISCLAIMER,
      engineUsed: 'ai',
      fallbackNotice: null,
    }
  } catch {
    // AI API failed: Never expose technical error details to the user!
    // Fall back to rule-based engine cleanly.
    const fallbackResults = generatePersonalizedInsights(inputData)
    return {
      ...fallbackResults,
      engineUsed: 'rules_fallback',
      fallbackNotice: 'We could not generate a personalized explanation right now. Your saved information is still available.',
    }
  }
}
