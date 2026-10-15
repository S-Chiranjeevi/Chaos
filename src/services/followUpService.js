/**
 * Follow-Up Question & Suggestion Synthesis Service for Luna Her
 * 
 * When a user enters symptoms, this service generates empathetic, clinically-sound,
 * non-diagnostic follow-up questions to understand:
 * - Timeline and duration
 * - Cycle intervals and variability
 * - Associated hyperandrogenic, metabolic, or dermatological signs
 * - Severity and functional impact of pain
 * 
 * Once answered, it synthesizes personalized, nuanced suggestions, doctor questions,
 * and self-care recommendations based on BOTH the initial description AND the follow-up answers.
 */

export const DISCLAIMER = 'This is information, not a diagnosis.'

/**
 * Question catalog organized by symptom domains
 */
export const FOLLOW_UP_CATALOG = {
  cycle_duration: {
    id: 'cycle_duration',
    domain: 'cycle',
    title: 'Duration of Irregularity',
    question: 'How long have your menstrual cycles been irregular, delayed, or unpredictable?',
    hint: 'Helps distinguish between temporary cycle disruption (stress, travel) and recurring patterns.',
    allowMultiple: false,
    options: [
      { id: 'under_2m', label: 'Recent (Last 1–2 months)', detail: 'Often linked to recent stress, acute illness, or lifestyle shifts.' },
      { id: '3_to_6m', label: '3 to 6 months', detail: 'A clinically meaningful window for healthcare professionals to review.' },
      { id: 'over_6m', label: 'Over 6 months / 1+ year', detail: 'Persistent cycle infrequency warrants an evaluation with a doctor.' },
      { id: 'since_puberty', label: 'Irregular since my teenage years', detail: 'Longstanding cycle variability worth investigating.' },
    ],
  },
  cycle_gap: {
    id: 'cycle_gap',
    domain: 'cycle',
    title: 'Typical Cycle Length',
    question: 'When periods do arrive, what is the typical gap from the start of one period to the next?',
    hint: 'A standard menstrual cycle is usually 21 to 35 days.',
    allowMultiple: false,
    options: [
      { id: 'gap_normal', label: '21 to 35 days (Regular range)', detail: 'Standard cycle length.' },
      { id: 'gap_long', label: '36 to 50 days (Longer cycles)', detail: 'Known as oligomenorrhea (infrequent ovulation).' },
      { id: 'gap_very_long', label: 'More than 50–60 days or skips completely', detail: 'Significant ovulatory delay to discuss with a clinician.' },
      { id: 'gap_random', label: 'Completely unpredictable / random spotting', detail: 'Variable cycle timing with no predictable pattern.' },
    ],
  },
  androgen_signs: {
    id: 'androgen_signs',
    domain: 'androgen',
    title: 'Skin & Hair Changes',
    question: 'Have you noticed any of these skin or hair changes recently?',
    hint: 'Under the Rotterdam guidelines, clinicians look for signs of elevated androgen (male-type hormone) activity.',
    allowMultiple: true,
    options: [
      { id: 'jawline_acne', label: 'Deep or cystic acne along jawline & chin', detail: 'Often hormonal and resistant to standard topical washes.' },
      { id: 'facial_hair', label: 'Coarse dark hair on chin, upper lip, chest, or belly', detail: 'Known clinically as hirsutism.' },
      { id: 'hair_thinning', label: 'Hair thinning or widening part line on scalp', detail: 'Female pattern hair shedding.' },
      { id: 'dark_patches', label: 'Dark, velvety skin patches (neck, underarms, groin)', detail: 'Known as Acanthosis Nigricans, a classic insulin sensitivity marker.' },
      { id: 'no_skin_hair', label: 'None of these apply to me', detail: 'No noticeable dermatological or hair changes.' },
    ],
  },
  pain_profile: {
    id: 'pain_profile',
    domain: 'pain',
    title: 'Pain & Discomfort Severity',
    question: 'How would you describe any pelvic cramps or discomfort you experience?',
    hint: 'Helps determine whether pain is typical menstrual cramping or may need evaluation for endometriosis or pelvic balance.',
    allowMultiple: false,
    options: [
      { id: 'pain_mild', label: 'Mild to moderate cramps (Relieved by rest or hot pack)', detail: 'Common menstrual cramping (dysmenorrhea).' },
      { id: 'pain_severe', label: 'Severe pain that interrupts work, school, or daily activities', detail: 'Significant functional impact that doctors should assess.' },
      { id: 'pain_throughout', label: 'Pelvic aching throughout the month, not just during periods', detail: 'Could indicate pelvic congestion, cysts, or endometriosis.' },
      { id: 'pain_none', label: 'I do not have significant cramps or pelvic pain', detail: 'Cycle changes without notable pain.' },
    ],
  },
  metabolic_energy: {
    id: 'metabolic_energy',
    domain: 'metabolic',
    title: 'Energy, Weight & Metabolism',
    question: 'Have you noticed any of these metabolic or daily energy patterns?',
    hint: 'Up to 70% of women with hormonal cycle irregularities have underlying insulin resistance.',
    allowMultiple: true,
    options: [
      { id: 'fatigue_afternoon', label: 'Frequent afternoon energy crashes or brain fog', detail: 'Fluctuating blood sugar levels.' },
      { id: 'sugar_cravings', label: 'Intense cravings for sweets or refined carbs shortly after meals', detail: 'A classic sign of reactive insulin elevation.' },
      { id: 'weight_difficulty', label: 'Unexplained weight gain or difficulty losing weight', detail: 'Metabolic shifts can make weight management challenging.' },
      { id: 'steady_energy', label: 'My energy and weight feel stable and normal', detail: 'No notable metabolic shifts.' },
    ],
  },
}

/**
 * Detects domain relevance from raw text and matched symptoms
 */
export function identifyRelevantDomains(text = '', symptoms = []) {
  const lower = (text || '').toLowerCase()
  const symptomIds = new Set((symptoms || []).map((s) => (s.id || s.defId || '').toLowerCase()))

  const hasCycle =
    symptomIds.has('irregular_periods') ||
    symptomIds.has('cycle_delay') ||
    /\b(period|periods|cycle|cycles|menses|menstrual|mahina|mahavari|late|delay|missed|gap)\b/i.test(lower)

  const hasAndrogen =
    symptomIds.has('acne') ||
    symptomIds.has('increased_hair') ||
    symptomIds.has('hair_thinning') ||
    /\b(acne|pimple|pimples|breakout|breakouts|hair|chin|jawline|facial hair|hirsutism|thinning|baal|chehre)\b/i.test(lower)

  const hasPain =
    symptomIds.has('severe_pain') ||
    symptomIds.has('pelvic_discomfort') ||
    /\b(pain|cramp|cramps|cramping|pelvic|belly|dard|pet)\b/i.test(lower)

  const hasMetabolic =
    symptomIds.has('weight_changes') ||
    /\b(weight|gain|fatigue|tired|energy|sugar|cravings|neck|dark|bhook)\b/i.test(lower)

  return { hasCycle, hasAndrogen, hasPain, hasMetabolic }
}

/**
 * Generates 2–4 targeted follow-up questions tailored to the user's initial input
 */
export function generateFollowUpQuestions({ text = '', symptoms = [], _language = 'en' } = {}) {
  const { hasCycle, hasAndrogen, hasPain, hasMetabolic } = identifyRelevantDomains(text, symptoms)
  const questions = []

  // 1. If cycle symptoms are present (or if no specific symptom was detected yet)
  if (hasCycle || (!hasAndrogen && !hasPain && !hasMetabolic)) {
    questions.push(FOLLOW_UP_CATALOG.cycle_duration)
    questions.push(FOLLOW_UP_CATALOG.cycle_gap)
  }

  // 2. Always explore skin/hair signs if cycle is irregular (Rotterdam hyperandrogenism check) or if user mentioned acne/hair
  if (hasAndrogen || hasCycle) {
    questions.push(FOLLOW_UP_CATALOG.androgen_signs)
  }

  // 3. If pain was mentioned, ask about severity profile
  if (hasPain) {
    questions.push(FOLLOW_UP_CATALOG.pain_profile)
  }

  // 4. If metabolic/weight was mentioned, or if cycle + androgen were both present, check insulin signs
  if (hasMetabolic || (hasCycle && hasAndrogen && questions.length < 4)) {
    if (questions.length < 4) {
      questions.push(FOLLOW_UP_CATALOG.metabolic_energy)
    }
  }

  // Fallback safe minimum: always provide at least 2 questions
  if (questions.length < 2) {
    if (!questions.find((q) => q.id === 'cycle_duration')) questions.push(FOLLOW_UP_CATALOG.cycle_duration)
    if (!questions.find((q) => q.id === 'androgen_signs')) questions.push(FOLLOW_UP_CATALOG.androgen_signs)
  }

  // Cap at 4 questions to avoid cognitive burden
  return questions.slice(0, 4)
}

/**
 * Synthesizes comprehensive suggestions based on initial symptoms AND follow-up answers
 */
export function synthesizeSuggestions({
  inputText = '',
  symptoms = [],
  followUpAnswers = {},
  _language = 'en',
} = {}) {
  const answeredList = Object.entries(followUpAnswers).filter(
    ([_, val]) => val && (Array.isArray(val) ? val.length > 0 : true)
  )

  // 1. Synthesize plain-language summary of what the user reported + clarified
  const detailsNarrative = []
  
  const cycleDurVal = followUpAnswers['cycle_duration']
  if (cycleDurVal) {
    const opt = FOLLOW_UP_CATALOG.cycle_duration.options.find((o) => o.id === cycleDurVal)
    if (opt) detailsNarrative.push(`Cycle changes lasting ${opt.label.toLowerCase()}`)
  }

  const cycleGapVal = followUpAnswers['cycle_gap']
  if (cycleGapVal) {
    const opt = FOLLOW_UP_CATALOG.cycle_gap.options.find((o) => o.id === cycleGapVal)
    if (opt) detailsNarrative.push(`Typical interval: ${opt.label}`)
  }

  const androgenVals = Array.isArray(followUpAnswers['androgen_signs'])
    ? followUpAnswers['androgen_signs']
    : followUpAnswers['androgen_signs'] ? [followUpAnswers['androgen_signs']] : []
  const validAndrogenLabels = androgenVals
    .filter((id) => id !== 'no_skin_hair')
    .map((id) => FOLLOW_UP_CATALOG.androgen_signs.options.find((o) => o.id === id)?.label)
    .filter(Boolean)
  if (validAndrogenLabels.length > 0) {
    detailsNarrative.push(`Associated skin/hair signs: ${validAndrogenLabels.join(', ')}`)
  }

  const painVal = followUpAnswers['pain_profile']
  if (painVal && painVal !== 'pain_none') {
    const opt = FOLLOW_UP_CATALOG.pain_profile.options.find((o) => o.id === painVal)
    if (opt) detailsNarrative.push(`Pain profile: ${opt.label}`)
  }

  const metabolicVals = Array.isArray(followUpAnswers['metabolic_energy'])
    ? followUpAnswers['metabolic_energy']
    : followUpAnswers['metabolic_energy'] ? [followUpAnswers['metabolic_energy']] : []
  const validMetabolicLabels = metabolicVals
    .filter((id) => id !== 'steady_energy')
    .map((id) => FOLLOW_UP_CATALOG.metabolic_energy.options.find((o) => o.id === id)?.label)
    .filter(Boolean)
  if (validMetabolicLabels.length > 0) {
    detailsNarrative.push(`Metabolic patterns: ${validMetabolicLabels.join(', ')}`)
  }

  // Narrative lead
  const summaryNarrative = detailsNarrative.length > 0
    ? `You described: "${inputText}". Through your follow-up clarifications, you highlighted: ${detailsNarrative.join('; ')}.`
    : `You described: "${inputText}". Based on standard clinical patterns, here is what this information suggests.`

  // 2. Assess Rotterdam & Hormonal Pillars based on initial + follow-up
  const isOvulatoryDelayed =
    cycleDurVal === '3_to_6m' ||
    cycleDurVal === 'over_6m' ||
    cycleDurVal === 'since_puberty' ||
    cycleGapVal === 'gap_long' ||
    cycleGapVal === 'gap_very_long' ||
    cycleGapVal === 'gap_random' ||
    symptoms.some((s) => s.id === 'irregular_periods')

  const hasAndrogenFeatures =
    validAndrogenLabels.length > 0 ||
    symptoms.some((s) => s.id === 'acne' || s.id === 'increased_hair' || s.id === 'hair_thinning')

  const hasMetabolicFeatures =
    validMetabolicLabels.length > 0 ||
    androgenVals.includes('dark_patches') ||
    symptoms.some((s) => s.id === 'weight_changes')

  const hasSeverePain =
    painVal === 'pain_severe' ||
    symptoms.some((s) => s.id === 'severe_pain' || s.severity === 'Severe')

  // Rotterdam Pillar Insights
  const pillarInsights = []
  if (isOvulatoryDelayed) {
    pillarInsights.push({
      pillar: 'Ovulatory Pattern (Infrequent or Anovulatory Cycles)',
      badge: 'Cycle Health',
      explanation: 'Your described gaps (>35 days or irregular intervals) suggest that ovulation may not be occurring on a predictable monthly schedule. While common in PCOS, this can also occur with thyroid shifts, high stress (cortisol), or hyperprolactinemia.',
    })
  }
  if (hasAndrogenFeatures) {
    pillarInsights.push({
      pillar: 'Hyperandrogenic Signs (Skin & Hair)',
      badge: 'Hormonal Balance',
      explanation: 'Breakouts along the jawline, coarse chin/body hair, or scalp hair fall often point to heightened sensitivity to circulating androgen hormones (like testosterone and DHEA-S). Blood testing helps distinguish adrenal vs. ovarian sources.',
    })
  }
  if (hasMetabolicFeatures) {
    pillarInsights.push({
      pillar: 'Metabolic & Insulin Regulation',
      badge: 'Metabolism',
      explanation: 'Afternoon energy crashes, sugar cravings, or dark velvety neck patches (Acanthosis Nigricans) frequently reflect insulin resistance, which can stimulate ovaries to produce excess androgens.',
    })
  }

  // 3. Tailored Questions for Doctor based on answers
  const questionsForDoctor = []

  if (isOvulatoryDelayed) {
    questionsForDoctor.push(
      `"My cycles have been irregular for ${cycleDurVal === 'over_6m' ? 'over 6 months' : cycleDurVal === '3_to_6m' ? '3 to 6 months' : 'several months'} with gaps averaging ${cycleGapVal === 'gap_very_long' ? 'over 50 days' : 'longer than normal'}. Would you recommend a pelvic ultrasound to check ovarian morphology and endometrium thickness?"`
    )
    questionsForDoctor.push(
      '"Could we check a Day 2–3 hormone panel (FSH, LH, Estradiol, and TSH) to rule out thyroid imbalances or other reasons for missed ovulation?"'
    )
  } else {
    questionsForDoctor.push(
      '"What symptom diary or tracking parameters would be most informative for you to see over the next 2–3 cycles?"'
    )
  }

  if (hasAndrogenFeatures) {
    questionsForDoctor.push(
      '"Because I am noticing skin and hair changes, could we check Total and Free Testosterone, DHEA-S, and 17-OHP to evaluate androgen activity?"'
    )
  }

  if (hasMetabolicFeatures) {
    questionsForDoctor.push(
      '"Given my energy dips and metabolic signs, would checking Fasting Glucose, Fasting Insulin (HOMA-IR), and HbA1c help screen for underlying insulin resistance?"'
    )
  }

  if (hasSeverePain) {
    questionsForDoctor.push(
      '"My pelvic pain significantly interrupts my day-to-day activities. Could we investigate causes beyond primary dysmenorrhea, such as endometriosis or ovarian cysts?"'
    )
  }

  questionsForDoctor.push(
    '"Are there safe, evidence-backed lifestyle or nutrition changes you recommend while we wait for lab results?"'
  )

  // 4. Tailored Self-Care & Lifestyle Suggestions
  const tailoredTips = []

  if (hasMetabolicFeatures || isOvulatoryDelayed) {
    tailoredTips.push({
      category: 'Blood Sugar & Nutrition',
      tip: 'Pair carbohydrates with protein, healthy fats, or fiber (e.g. nuts, eggs, lentils) to prevent rapid glucose spikes and insulin surges that impact ovulation.',
    })
    tailoredTips.push({
      category: 'Post-Meal Movement',
      tip: 'A gentle 10–15 minute walk after meals helps skeletal muscles absorb glucose independently of insulin, supporting hormonal stability.',
    })
  }

  if (hasAndrogenFeatures) {
    tailoredTips.push({
      category: 'Skin & Androgen Support',
      tip: 'Use gentle, non-comedogenic cleansers with salicylic acid or benzoyl peroxide for jawline acne. Avoid aggressive physical scrubbing, which exacerbates barrier inflammation.',
    })
    tailoredTips.push({
      category: 'Spearmint & Herbal Care',
      tip: 'Mild spearmint tea has shown modest anti-androgenic effects in small clinical trials, though discuss with your doctor before adding concentrated supplements.',
    })
  }

  if (hasSeverePain) {
    tailoredTips.push({
      category: 'Pelvic Comfort',
      tip: 'Warm compresses, magnesium-rich foods (seeds, dark leafy greens), and gentle restorative yoga can ease uterine muscle tension during acute discomfort.',
    })
  } else {
    tailoredTips.push({
      category: 'Cycle Tracking',
      tip: 'Record cycle start dates, flow heaviness, cervical mucus shifts, and mood in a daily log to give your doctor clear longitudinal data.',
    })
  }

  tailoredTips.push({
    category: 'Sleep & Circadian Rhythm',
    tip: 'Aim for 7–9 hours of sleep with consistent sleep-wake times to regulate cortisol and luteinizing hormone (LH) pulsatility.',
  })

  // 5. Specialist Recommendation
  let recommendedSpecialist = 'Consider booking an appointment with a Gynecologist.'
  if (hasSeverePain) {
    recommendedSpecialist = 'A Gynecologist specializing in pelvic pain or endometriosis evaluation is recommended.'
  } else if (hasAndrogenFeatures && hasMetabolicFeatures) {
    recommendedSpecialist = 'A Gynecologist consultation is recommended, and a Reproductive Endocrinologist can provide deep hormonal and metabolic guidance.'
  } else if (hasAndrogenFeatures) {
    recommendedSpecialist = 'A Gynecologist consultation is recommended, and a Dermatologist can assist with persistent cystic breakouts.'
  }

  // 6. Urgency determination
  let urgency = 'routine'
  if (hasSeverePain) {
    urgency = 'urgent'
  } else if ((isOvulatoryDelayed && hasAndrogenFeatures) || hasMetabolicFeatures) {
    urgency = 'soon'
  }

  return {
    disclaimer: DISCLAIMER,
    summaryNarrative,
    answeredQuestionsCount: answeredList.length,
    pillarInsights,
    questionsForDoctor,
    tailoredTips,
    recommendedSpecialist,
    urgency,
    hasOvulatory: isOvulatoryDelayed,
    hasAndrogenic: hasAndrogenFeatures,
    hasMetabolic: hasMetabolicFeatures,
    hasSeverePain,
  }
}
