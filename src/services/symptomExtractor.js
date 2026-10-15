/**
 * Multilingual Clinical Symptom Extractor for Luna Her
 * 
 * Analyzes conversational descriptions (in English, Hindi, Kannada, Tamil, Malayalam)
 * and extracts structured symptom cards containing:
 * - Symptom
 * - Duration
 * - Frequency
 * - Severity (Mild / Moderate / Severe / Unspecified)
 * 
 * Provides careful, non-diagnostic guidance framing:
 * "These symptoms can sometimes occur with PCOS, but they can also have other causes."
 */

export const SYMPTOM_DEFINITIONS = [
  {
    id: 'irregular_periods',
    label: 'Irregular or infrequent periods',
    category: 'Menstrual & Hormonal',
    patterns: [
      /\b(irregular|infrequent|missed|late|skipped|unpredictable|delay(?:ed)?)\s+(periods?|menstrual cycles?|cycles?|menses)\b/i,
      /\b(periods?|cycles?)\s+(?:come\s+|arrive\s+|are\s+)?(?:every\s+)?(?:2[\s–-]3|two[\s–-]three|\d+)\s+months?\b/i,
      /\b(periods?|cycles?)\b.{0,45}\b(irregular|infrequent|late|unpredictable|der se|nahi|ruk)\b/i,
      /\b(no\s+period|period.{0,20}(?:three|3|two|2|several)\s+months?)\b/i,
      /\b(periods?\s+late|mahina\s+late|cycle\s+late|time\s+pe\s+nahi|time\s+par\s+nahi)\b/i,
      /अनियमित|महीनों से पीरियड|पीरियड नहीं|माहवारी में देरी|मासिक धर्म|पीरियड्स.*(?:2[\s–-]3|महीने|देरी)/i,
      /అపరిమిత|క్రమం తప్పి|నెలసరి.*ఆలస్యం|పీరియడ్స్.*రావడం లేదు|సమయానికి రావడం లేదు/i,
      /ಅನಿಯಮಿತ|ಮುಟ್ಟು.*ತಡ|ಋತುಚಕ್ರ.*ಆಲಸ್ಯ|ತಿಂಗಳು.*ಬರಲಿಲ್ಲ|ಮುಟ್ಟು.*(?:2[\s–-]3|ತಿಂಗಳು)/i,
      /ஒழுங்கற்ற|மாதவிடாய்.*தாமதம்|மாதவிடாய்.*வரவில்லை|மாதவிடாய்.*(?:2[\s–-]3|மாதம்)/i,
      /ക്രമരഹിതമായ|ആർത്തവം.*വൈക|മാസമുറ.*തടസ്സം|ആർത്തവം.*(?:2[\s–-]3|മാസം)/i,
      /मासिक पाळी.*उशीर|अनियमित पाळी/i,
      /অনিয়মিত পিরিয়ড|মাসিক অনিয়ম/i,
    ],
    defaultDuration: '2–3 months',
    defaultFrequency: 'Every 2–3 months',
    defaultSeverity: 'Moderate',
  },
  {
    id: 'acne',
    label: 'Acne and skin breakouts',
    category: 'Dermatological & Androgenic',
    patterns: [
      /\b(acne|pimples?|breakouts?|zits|cystic acne|jawline acne)\b/i,
      /मुंहासे|कील-मुंहासे|दाने|चेहरे के दाने/i,
      /మొటిమలు/i,
      /ಮೊಡವೆಗಳು|ಮುಖದಲ್ಲಿ ಮೊಡವೆ/i,
      /பருக்கள்|முகப்பரு/i,
      /മുഖക്കുരു|കുരുക്കൾ/i,
      /पिंपल्स|पुरळ/i,
      /ব্রণ/i,
    ],
    defaultDuration: 'Recent months',
    defaultFrequency: 'Persistent',
    defaultSeverity: 'Moderate',
  },
  {
    id: 'increased_hair',
    label: 'Increased facial or body hair (Hirsutism)',
    category: 'Dermatological & Androgenic',
    patterns: [
      /\b(increased|extra|excess|more|unwanted)\s+(?:facial|body|face|chin|jawline)\s+hair\b/i,
      /\b(facial\s+hair|hair\s+growth\s+(?:on|around)\s+(?:my\s+)?(?:face|chin|jawline|chest))\b/i,
      /\b(chin\s+par\s+baal|chehre\s+pe\s+baal|unwanted\s+baal)\b/i,
      /चेहरे पर बाल|अनचाहे बाल|दाढ़ी पर बाल|ठुड्डी पर बाल/i,
      /ముఖంపై వెంట్రుకలు|గడ్డంపై వెంట్రుకలు|అవాంఛిత రోమాలు/i,
      /ಮುಖದ ಮೇಲೆ ಕೂದಲು|ಅನಗತ್ಯ ಕೂದಲು|ಗಲ್ಲದ ಕೂದಲು/i,
      /முகத்தில் முடி|தேவையற்ற முடி வளர்ச்சி/i,
      /മുഖത്തെ രോമം|താടിയിൽ രോമം/i,
      /हनुवटीवर केस|चेहऱ्यावर केस|नको असलेले केस/i,
      /মুখের লোম|থুতনিতে লোম|অবাঞ্ছিত লোম/i,
    ],
    defaultDuration: 'Gradual onset',
    defaultFrequency: 'Continuous',
    defaultSeverity: 'Moderate',
  },
  {
    id: 'severe_pain',
    label: 'Severe pelvic or menstrual pain (Dysmenorrhea)',
    category: 'Pain & Discomfort',
    patterns: [
      /\b(severe|intense|unbearable|excruciating|terrible|sharp)\s+(pain|cramps?|pelvic pain|belly pain)\b/i,
      /\b(pain|cramps?)\s+(?:is|are)\s+(?:very\s+)?(severe|unbearable|intense)\b/i,
      /बहुत तेज़ दर्द|असहनीय दर्द|पेट में भीषण दर्द|ऐंठन/i,
      /ತೀವ್ರವಾದ ನೋವು|ಅಸಹನೀಯ ನೋವು|ಹೊಟ್ಟೆ ನೋವು/i,
      /கடுமையான வலி|தாங்க முடியாத வலி|வயிற்று வலி/i,
      /അതികഠിനമായ വേദന|സഹിക്കാനാവാത്ത വേദന/i,
    ],
    defaultDuration: 'During menstrual cycle',
    defaultFrequency: 'Recurrent with menses',
    defaultSeverity: 'Severe',
    isRedFlag: true,
  },
  {
    id: 'heavy_bleeding',
    label: 'Very heavy menstrual bleeding (Menorrhagia)',
    category: 'Menstrual & Bleeding',
    patterns: [
      /\b(very heavy|heavy|excessive|soaking|flooding)\s+(?:vaginal\s+|menstrual\s+)?bleeding\b/i,
      /\b(bleeding|periods?)\s+(?:is|are)\s+(?:very\s+)?heavy\b/i,
      /\b(soaking|soak(?:ing)? through)\s+(?:a\s+)?(?:pad|tampon)s?\b/i,
      /बहुत ज़्यादा खून|भारी रक्तस्राव|ब्लीडिंग बहुत तेज़/i,
      /ಅಧಿಕ ರಕ್ತಸ್ರಾವ|ವಿಪರೀತ ರಕ್ತಸ್ರಾವ/i,
      /அதிக உதிரப்போக்கு|அதிக ரத்தப்போக்கு/i,
      /അമിത രക്തസ്രാവം|കനത്ത ബ്ലീഡിങ്/i,
    ],
    defaultDuration: 'Past few cycles',
    defaultFrequency: 'Throughout period days',
    defaultSeverity: 'Severe',
    isRedFlag: true,
  },
  {
    id: 'weight_changes',
    label: 'Weight gain or difficulty losing weight',
    category: 'Metabolic & Endocrine',
    patterns: [
      /\b(weight\s+gain|gained\s+weight|trouble\s+losing\s+weight|unexplained\s+weight|weight\s+changes?)\b/i,
      /वजन बढ़|वज़न में बदलाव|मोटापा बढ़ रहा/i,
      /ತೂಕ ಹೆಚ್ಚಳ|ತೂಕ ಏರಿಕೆ/i,
      /எடை அதிகரிப்பு|உடல் எடை கூடுதல்/i,
      /ശരീരഭാരം കൂടുക|തടി കൂടുന്നു/i,
    ],
    defaultDuration: 'Last 3–6 months',
    defaultFrequency: 'Gradual',
    defaultSeverity: 'Moderate',
  },
  {
    id: 'acanthosis_nigricans',
    label: 'Dark velvety patches on neck or skin folds (Acanthosis Nigricans)',
    category: 'Metabolic & Endocrine',
    patterns: [
      /\b(dark\s+neck|dark\s+skin\s+around\s+neck|velvety\s+patches?|acanthosis(?:\s+nigricans)?|dark\s+armpits)\b/i,
      /\b(gale\s+pe\s+kaalapan|gardan\s+kali|gardan\s+par\s+kala)\b/i,
      /गर्दन पर कालापन|काली गर्दन/i,
      /మెడ నల్లబడటం|మెడపై నల్లటి మచ్చలు/i,
      /ಕುತ್ತಿಗೆ ಕಪ್ಪಾಗುವುದು/i,
      /கழுத்தில் கருமை/i,
      /मानेवर काळे डाग/i,
      /ঘাড়ের কালো দাগ/i,
    ],
    defaultDuration: 'Persistent over months',
    defaultFrequency: 'Constant; resistant to washing/scrubbing',
    defaultSeverity: 'Moderate',
  },
  {
    id: 'hair_thinning',
    label: 'Scalp hair thinning or hair loss',
    category: 'Dermatological & Androgenic',
    patterns: [
      /\b(hair\s+thinning|thinning\s+hair|hair\s+loss|hair\s+fall|bald\s+spots?)\b/i,
      /बाल झड़ना|बाल पतले होना|गंजापन/i,
      /ಕೂದಲು ಉದುರುವುದು|ಕೂದಲು ತೆಳುವಾಗುವುದು/i,
      /முடி உதிர்தல்|முடி கொட்டுதல்/i,
      /മുടി കൊഴിച്ചിൽ|മുടി നേർത്തുപോകുന്നത്/i,
    ],
    defaultDuration: 'Last few months',
    defaultFrequency: 'Daily when washing/combing',
    defaultSeverity: 'Mild',
  },
  {
    id: 'pelvic_discomfort',
    label: 'Mild to moderate pelvic discomfort or fullness',
    category: 'Pain & Discomfort',
    patterns: [
      /\b(pelvic|lower\s+abdominal|lower\s+belly)\s+(?:discomfort|cramps?|ache|pressure|fullness)\b/i,
      /पेट के निचले हिस्से में दर्द|पेल्विक में भारीपन/i,
      /ಕಿಬ್ಬೊಟ್ಟೆ ನೋವು|ಕಟಿ ಭಾಗದಲ್ಲಿ ಭಾರ/i,
      /அடிவயிற்று வலி|இடுப்பு வலி/i,
      /അടിവയറ്റിലെ വേദന|പെൽവിക് അസ്വസ്ഥത/i,
    ],
    defaultDuration: 'Intermittent',
    defaultFrequency: 'Few days a week',
    defaultSeverity: 'Mild',
  },
  {
    id: 'dizziness_fainting',
    label: 'Dizziness, lightheadedness, or feeling faint',
    category: 'Systemic & Vital',
    patterns: [
      /\b(dizz(?:y|iness)|lightheaded(?:ness)?|faint(?:ed|ing)?|blackout|passed\s+out)\b/i,
      /चक्कर आना|बेहोशी|सिर घूमना/i,
      /ತಲೆ ತಿರುಗುವುದು|ಮೂರ್ಛೆ/i,
      /தலைச்சுற்றல்|மயக்கம்/i,
      /തലകറക്കം|ബോധക്ഷയം/i,
    ],
    defaultDuration: 'Brief episodes',
    defaultFrequency: 'During heavy flow or standing',
    defaultSeverity: 'Severe',
    isRedFlag: true,
  },
  {
    id: 'pregnancy_warning',
    label: 'Possible pregnancy-related warning signs',
    category: 'Pregnancy-related warning signs',
    patterns: [
      /\b(pregnan(?:t|cy)|might be pregnant|possible pregnancy)\b.{0,70}\b(bleeding|spotting|pain|cramps?|dizz(?:y|iness)|faint(?:ed|ing)?)\b/i,
      /\b(bleeding|spotting|pain|cramps?|dizz(?:y|iness)|faint(?:ed|ing)?)\b.{0,70}\b(pregnan(?:t|cy)|might be pregnant|possible pregnancy)\b/i,
      /गर्भवती|गर्भावस्था.{0,30}(दर्द|खून|चक्कर)/i,
    ],
    defaultDuration: 'Not specified',
    defaultFrequency: 'Not specified',
    defaultSeverity: 'Severe',
    isRedFlag: true,
  },
]

export function detectLanguage(text = '', preferredLanguage = 'en') {
  if (/\p{Script=Devanagari}/u.test(text)) return 'hi'
  if (/\p{Script=Kannada}/u.test(text)) return 'kn'
  if (/\p{Script=Tamil}/u.test(text)) return 'ta'
  if (/\p{Script=Malayalam}/u.test(text)) return 'ml'
  return preferredLanguage || 'en'
}

/**
 * Extracts duration phrase from user note (e.g. "2-3 months", "past 6 months", "1 year")
 */
function extractDurationFromText(text) {
  const match = text.match(/\b(?:for|since|over|past|around|last)\s+([0-9]+(?:\s*[–-]\s*[0-9]+)?\s*(?:months?|weeks?|years?|days?))\b/i)
  if (match) return match[1]

  const monthMatch = text.match(/([0-9]+(?:\s*[–-]\s*[0-9]+)?\s*months?)/i)
  if (monthMatch) return monthMatch[1]

  if (/2[\s–-]3\s*महीने|महीनों/i.test(text)) return '2–3 महीने'
  if (/2[\s–-]3\s*ತಿಂಗಳು/i.test(text)) return '2–3 ತಿಂಗಳು'
  if (/2[\s–-]3\s*மாதங்கள்/i.test(text)) return '2–3 மாதங்கள்'
  if (/2[\s–-]3\s*മാസങ്ങൾ/i.test(text)) return '2–3 മാസങ്ങൾ'

  return null
}

/**
 * Extracts frequency phrase from user note (e.g. "every 2-3 months", "daily", "every month")
 */
function extractFrequencyFromText(text) {
  const match = text.match(/\b(every\s+[0-9]+(?:\s*[–-]\s*[0-9]+)?\s*(?:months?|weeks?|days?)|daily|constantly|every\s+cycle|rarely)\b/i)
  if (match) return match[1]

  if (/हर\s+2[\s–-]3\s+महीने/i.test(text)) return 'हर 2-3 महीने'
  if (/ಪ್ರತಿ\s+2[\s–-]3\s+ತಿಂಗಳು/i.test(text)) return 'ಪ್ರತಿ 2-3 ತಿಂಗಳು'
  if (/2[\s–-]3\s*மாதங்களுக்கு\s*ஒருமுறை/i.test(text)) return '2-3 மாதங்களுக்கு ஒருமுறை'
  if (/2[\s–-]3\s*മാസത്തിൽ\s*ഒരിക്കൽ/i.test(text)) return '2-3 മാസത്തിൽ ഒരിക്കൽ'

  return null
}

/**
 * Parses severity level from text
 */
function extractSeverityFromText(text, fallback = 'Moderate') {
  if (/\b(severe|intense|unbearable|excruciating|very heavy|extreme|बहुत तेज़|असहनीय|ತೀವ್ರ|கடுமையான|കഠിനമായ)\b/i.test(text)) {
    return 'Severe'
  }
  if (/\b(mild|slight|little|a bit|हल्का|ಸ್ವಲ್ಪ|லேசான|നേരിയ)\b/i.test(text)) {
    return 'Mild'
  }
  if (/\b(moderate|noticeable|quite|medium|मध्यम|ಸಾಧಾರಣ|மிதமான|ഇടത്തരം)\b/i.test(text)) {
    return 'Moderate'
  }
  return fallback
}

/**
 * Main parser: takes a text note and returns structured symptom cards and non-diagnostic guidance
 */
export function extractSymptoms(rawText = '', { preferredLanguage = 'en' } = {}) {
  const text = (rawText || '').trim()
  const detectedLanguage = detectLanguage(text, preferredLanguage)
  if (!text) {
    return {
      symptoms: [],
      hasPcosIndicators: false,
      isUrgent: false,
      redFlags: [],
      disclaimer: 'These symptoms can sometimes occur with PCOS, but they can also have other causes. This is information, not a diagnosis.',
      urgency: 'routine',
      topics: [],
      questionsForDoctor: [],
      lifestyleTips: [],
      detectedLanguage,
      possibleRelationships: [],
      recommendedSpecialist: 'Consider booking an appointment with a gynecologist.',
    }
  }

  const detectedDuration = extractDurationFromText(text)
  const detectedFrequency = extractFrequencyFromText(text)

  const matchedSymptoms = []
  const redFlags = []

  for (const def of SYMPTOM_DEFINITIONS) {
    const isMatched = def.patterns.some((pattern) => pattern.test(text))
    if (isMatched) {
      const severity = extractSeverityFromText(text, def.defaultSeverity)
      const duration = detectedDuration || def.defaultDuration
      const frequency = detectedFrequency || def.defaultFrequency

      const symptomCard = {
        id: `sym-${def.id}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        defId: def.id,
        symptom: def.label,
        category: def.category,
        duration,
        frequency,
        severity,
        isRedFlag: Boolean(def.isRedFlag && severity === 'Severe'),
      }

      matchedSymptoms.push(symptomCard)

      if (symptomCard.isRedFlag) {
        redFlags.push(def.label)
      }
    }
  }

  // Fallback: If no predefined patterns matched but user entered text
  if (matchedSymptoms.length === 0 && text.length > 3) {
    matchedSymptoms.push({
      id: `sym-custom-${Date.now()}`,
      defId: 'custom',
      symptom: text.length > 60 ? `${text.substring(0, 57)}...` : text,
      category: 'User Described',
      duration: detectedDuration || 'Not specified',
      frequency: detectedFrequency || 'Not specified',
      severity: extractSeverityFromText(text, 'Unspecified'),
      isCustom: true,
      isRedFlag: false,
    })
  }

  const ids = new Set(matchedSymptoms.map((s) => s.defId))
  const hasHormonalSigns = ['irregular_periods', 'acne', 'increased_hair', 'weight_changes', 'hair_thinning'].some((id) => ids.has(id))
  const isUrgent = redFlags.length > 0 || ids.has('severe_pain') || ids.has('heavy_bleeding')

  // Carefully framed questions for the doctor
  const questionsForDoctor = [
    'What evaluations, such as a pelvic ultrasound or hormone panel, might be appropriate for my symptoms?',
    'Could these symptoms be linked to PCOS, thyroid function, or another underlying hormonal balance?',
    'What symptom diary or tracking parameters should I keep over the next few cycles?',
  ]

  if (ids.has('irregular_periods')) {
    questionsForDoctor.unshift('What might be causing my menstrual cycle irregularity, and how can we support cycle regularity?')
  }
  if (ids.has('severe_pain') || ids.has('heavy_bleeding')) {
    questionsForDoctor.unshift('What signs should prompt me to go to an urgent care or emergency room immediately?')
  }

  const possibleRelationships = []
  if (hasHormonalSigns) possibleRelationships.push('This could be related to hormone changes, including PCOS, but there can be many possible causes.')
  if (ids.has('pelvic_discomfort') || ids.has('severe_pain')) possibleRelationships.push('Pelvic discomfort can have many possible causes and may be worth discussing with a clinician.')
  if (ids.has('heavy_bleeding')) possibleRelationships.push('A change in bleeding can have many possible causes and may be worth discussing with a clinician.')
  if (!possibleRelationships.length) possibleRelationships.push('This pattern may be worth discussing with a healthcare professional because there can be many possible causes.')

  // Educational topics
  const topics = [
    ...possibleRelationships,
    'Self-advocacy tips: Preparing for your consultation and tracking symptoms',
  ]

  const lifestyleTips = [
    'Track your cycle days, flow heaviness, and symptoms using a simple journal or app.',
    'Focus on nourishing, balanced meals with adequate protein, fiber, and healthy fats to support insulin sensitivity.',
    'Prioritize 7–8 hours of restorative sleep and gentle movement (like walking or yoga) to reduce cortisol stress.',
    'Stay well hydrated and note any triggers related to caffeine or high-stress days.',
  ]

  const hasOvulatory = ids.has('irregular_periods')
  const hasAndrogenic = ids.has('acne') || ids.has('increased_hair') || ids.has('hair_thinning')
  const hasMetabolic = ids.has('weight_changes') || ids.has('acanthosis_nigricans')

  const recommendedTests = []
  if (hasOvulatory) {
    recommendedTests.push({ test: 'Pelvic / Transvaginal Ultrasound', reason: 'To evaluate ovarian antral follicle count and morphology' })
    recommendedTests.push({ test: 'Serum TSH & Prolactin', reason: 'To rule out thyroid disorder or hyperprolactinemia' })
  }
  if (hasAndrogenic) {
    recommendedTests.push({ test: 'Total & Free Testosterone', reason: 'Measures bioavailable circulating androgens' })
    recommendedTests.push({ test: 'DHEA-Sulfate (DHEA-S)', reason: 'Assesses adrenal androgen contribution' })
  }
  if (hasMetabolic) {
    recommendedTests.push({ test: 'Fasting Glucose & Fasting Insulin (HOMA-IR)', reason: 'Identifies hidden insulin resistance early' })
    recommendedTests.push({ test: 'HbA1c & Fasting Lipid Profile', reason: 'Screens for pre-diabetes and cardiometabolic balance' })
  }
  if (!recommendedTests.length) {
    recommendedTests.push({ test: 'Well-Woman Routine Panel (CBC, TSH, HbA1c)', reason: 'General baseline hormonal and metabolic assessment' })
  }

  return {
    symptoms: matchedSymptoms,
    hasPcosIndicators: hasHormonalSigns || hasOvulatory || hasAndrogenic || hasMetabolic,
    isUrgent,
    redFlags,
    disclaimer: 'These symptoms can sometimes occur with PCOS, but they can also have other causes. This is information, not a diagnosis.',
    urgency: isUrgent ? 'urgent' : hasHormonalSigns ? 'soon' : 'routine',
    topics,
    questionsForDoctor,
    lifestyleTips,
    recommendedTests,
    rotterdamPillars: {
      ovulatory: hasOvulatory,
      androgenic: hasAndrogenic,
      metabolic: hasMetabolic,
    },
    detectedLanguage,
    possibleRelationships,
    recommendedSpecialist: isUrgent
      ? 'Please seek urgent medical care now or contact local emergency services.'
      : hasHormonalSigns
        ? 'Consider booking an appointment with a gynecologist. An endocrinologist may also be helpful.'
        : 'Consider booking an appointment with a gynecologist.',
  }
}
