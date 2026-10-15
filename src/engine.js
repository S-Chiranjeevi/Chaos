export const DISCLAIMER = 'This is information, not a diagnosis.'

const SYMPTOMS = [
  { id: 'irregular_periods', label: 'Irregular or infrequent periods', patterns: [/\b(irregular|infrequent|missed|late|skipped|unpredictable)\s+(periods?|menstrual cycles?|cycles?)\b/i, /\b(periods?|cycles?)\s+(?:(?:are|have been|have become)\s+)?(irregular|infrequent|late|unpredictable)\b/i, /\b(periods?|cycles?)\b.{0,45}\b(irregular|infrequent|late|unpredictable)\b/i, /\b(no period|period.{0,20}(?:three|3)\s+months?)\b/i, /अनियमित|पीरियड.*अनियमित|महीनों से पीरियड|पीरियड नहीं/i, /క్రమం తప్పి|నెలసరి.*ఆలస్యం|పీరియడ్స్.*రావడం లేదు/i] },
  { id: 'acne', label: 'Acne', patterns: [/\b(acne|pimples?|breakouts?)\b/i, /मुंहासे|दाने/i, /మొటిమలు/i] },
  { id: 'increased_hair', label: 'Increased facial or body hair', patterns: [/\b(increased|extra|excess|more|unwanted)\s+(facial|body|face)\s+hair\b/i, /\b(hair\s+growth\s+(?:on|around)\s+(?:my\s+)?(?:face|chin|body)|new\s+hair\s+(?:on|around)\s+(?:my\s+)?(?:face|chin))\b/i, /चेहरे पर बाल|अनचाहे बाल/i, /ముఖంపై వెంట్రుకలు|అవాంఛిత రోమాలు/i] },
  { id: 'weight_changes', label: 'Weight changes', patterns: [/\b(weight|weighing)\s+(?:gain|loss|change|changes|increased|decreased)\b/i, /\b(gained|lost|put on)\s+weight\b/i, /वज़न में बदलाव|वजन बढ़|वजन घट/i, /బరువు పెరిగ|బరువు తగ్గ|బరువులో మార్పు/i] },
  { id: 'hair_thinning', label: 'Hair thinning', patterns: [/\b(hair\s+thinning|thinning\s+hair|hair\s+loss|hair\s+fall)\b/i, /बाल झड़|बाल पतले/i, /జుట్టు రాలడం|జుట్టు పలుచబడ/i] },
  { id: 'pelvic_discomfort', label: 'Pelvic discomfort', patterns: [/\b(pelvic|lower\s+abdominal|lower\s+belly)\s+(pain|discomfort|cramps?)\b/i, /\b(discomfort|pain|cramps?)\s+in\s+(?:my\s+)?pelvis\b/i, /पेल्विक दर्द|पेट के निचले हिस्से में दर्द/i, /కటి నొప్పి|క్రింది పొత్తికడుపు నొప్పి/i] },
  { id: 'severe_pain', label: 'Severe pain', patterns: [/\b(severe|intense|unbearable|excruciating)\s+(pain|cramps?|pelvic pain)\b/i, /\b(pain|cramps?)\s+(?:is|are)\s+(?:very\s+)?(severe|unbearable|intense)\b/i, /बहुत तेज़ दर्द|असहनीय दर्द/i, /తీవ్రమైన నొప్పి|భరించలేని నొప్పి/i] },
  { id: 'heavy_bleeding', label: 'Very heavy bleeding', patterns: [/\b(very heavy|heavy|excessive|soaking)\s+(?:vaginal\s+|menstrual\s+)?bleeding\b/i, /\b(bleeding|periods?)\s+(?:is|are)\s+(?:very\s+)?heavy\b/i, /\b(soaking|soak(?:ing)? through)\s+(?:a\s+)?(?:pad|tampon)s?\b/i, /बहुत ज़्यादा खून|भारी रक्तस्राव/i, /అధిక రక్తస్రావం|చాలా ఎక్కువ రక్తస్రావం/i] },
  { id: 'dizziness_fainting', label: 'Dizziness or fainting', patterns: [/\b(dizz(?:y|iness)|lightheaded|faint(?:ed|ing)?|passed out)\b/i, /चक्कर|बेहोश/i, /తల తిరగ|మూర్ఛ/i] },
  { id: 'pregnancy_warning', label: 'Possible pregnancy-related warning signs', patterns: [/\b(pregnan(?:t|cy)|might be pregnant|possible pregnancy)\b.{0,70}\b(bleeding|spotting|pain|cramps?|dizz(?:y|iness)|faint(?:ed|ing)?)\b/i, /\b(bleeding|spotting|pain|cramps?|dizz(?:y|iness)|faint(?:ed|ing)?)\b.{0,70}\b(pregnan(?:t|cy)|might be pregnant|possible pregnancy)\b/i, /गर्भवती|गर्भावस्था.{0,30}(दर्द|खून|चक्कर)/i, /గర్భం|గర్భవతి.{0,30}(నొప్పి|రక్తస్రావం|తల తిరగ)/i] },
]

const RED_FLAGS = new Set(['severe_pain', 'heavy_bleeding', 'dizziness_fainting', 'pregnancy_warning'])

export function assessSymptoms(input) {
  const text = typeof input === 'string' ? input : [input?.text, ...(Array.isArray(input?.symptoms) ? input.symptoms : [])].filter(Boolean).join(' ')
  const extracted = SYMPTOMS.filter(({ patterns }) => patterns.some((pattern) => pattern.test(text)))
  const extractedSymptoms = extracted.map(({ label }) => label)
  const ids = new Set(extracted.map(({ id }) => id))
  const hormonal = ['irregular_periods', 'acne', 'increased_hair', 'weight_changes', 'hair_thinning'].some((id) => ids.has(id))
  const redFlags = extracted.filter(({ id }) => RED_FLAGS.has(id)).map(({ label }) => label)
  const urgent = redFlags.length > 0
  const possibleTopics = []

  if (hormonal) possibleTopics.push('Hormone-related changes, including PCOS and other possible causes, to discuss with a clinician')
  if (ids.has('pelvic_discomfort') || ids.has('severe_pain')) possibleTopics.push('Pelvic or period-related discomfort and its possible causes')
  if (ids.has('heavy_bleeding')) possibleTopics.push('Changes in menstrual bleeding and possible causes')
  if (ids.has('pregnancy_warning')) possibleTopics.push('Pregnancy-related symptoms that need prompt clinical assessment')
  if (!possibleTopics.length && extractedSymptoms.length) possibleTopics.push('Changes in skin or hair and possible causes')

  const urgency = urgent ? 'urgent' : ids.has('pelvic_discomfort') ? 'soon' : 'routine'
  let explanation
  if (urgent) explanation = `Some symptoms you described can sometimes need prompt medical attention. They can have several causes, and a clinician can assess what is happening. ${DISCLAIMER}`
  else if (hormonal) explanation = `Changes in periods, skin, hair, or weight may be related to hormones, but can have several causes. A healthcare professional can help you explore what fits your situation. ${DISCLAIMER}`
  else if (ids.has('pelvic_discomfort')) explanation = `Pelvic discomfort can have several causes. A clinician can help assess it, especially if it is new, persistent, or getting worse. ${DISCLAIMER}`
  else if (extractedSymptoms.length) explanation = `The change you described can have several causes. A healthcare professional can help you understand what may be related and what care could help. ${DISCLAIMER}`
  else explanation = `I couldn’t confidently match your note to a symptom pattern. You can try describing what you feel, when it started, and how it affects you. A clinician can help if you’re concerned. ${DISCLAIMER}`

  const questionsForDoctor = []
  if (ids.has('irregular_periods')) questionsForDoctor.push('What could be causing my periods to be irregular, and what information should I track?')
  if (hormonal) questionsForDoctor.push('Could hormones be related to these changes, and what evaluation would you recommend?')
  if (ids.has('pelvic_discomfort') || ids.has('severe_pain')) questionsForDoctor.push('What might be causing this discomfort or pain, and when should I seek urgent care?')
  if (ids.has('heavy_bleeding') || ids.has('dizziness_fainting')) questionsForDoctor.push('Could the bleeding or dizziness need prompt assessment?')
  if (!questionsForDoctor.length && !extractedSymptoms.length) questionsForDoctor.push('What details about my symptoms would be helpful for you to know?')

  return {
    extractedSymptoms,
    possibleTopics,
    urgency,
    explanation,
    recommendedDoctor: urgent ? 'Please seek urgent medical care now or contact local emergency services.' : `Consider booking an appointment with a gynecologist.${hormonal ? ' An endocrinologist may also be helpful.' : ''}`,
    questionsForDoctor,
    redFlags,
  }
}

export const examples = [
  { name: 'Irregular periods for three months', input: 'My periods have been irregular for three months.', expectedUrgency: 'routine', expectedSymptoms: ['Irregular or infrequent periods'] },
  { name: 'Irregular periods plus acne', input: 'My periods are irregular and I have acne.', expectedUrgency: 'routine', expectedSymptoms: ['Irregular or infrequent periods', 'Acne'] },
  { name: 'Severe pain', input: 'I have severe pelvic pain.', expectedUrgency: 'urgent', expectedSymptoms: ['Pelvic discomfort', 'Severe pain'] },
  { name: 'Heavy bleeding plus dizziness', input: 'Very heavy bleeding and I feel dizzy.', expectedUrgency: 'urgent', expectedSymptoms: ['Very heavy bleeding', 'Dizziness or fainting'] },
  { name: 'Unclear text', input: 'Things feel a bit off lately.', expectedUrgency: 'routine', expectedSymptoms: [] },
]
