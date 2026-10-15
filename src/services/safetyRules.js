const DISCLAIMER = 'This is information, not a diagnosis.'

const DEFINITIONS = [
  {
    id: 'heavy_bleeding',
    title: 'Heavy bleeding may need urgent attention',
    message: 'Please seek urgent medical care.',
    patterns: [
      /\b(?:soak(?:s|ed|ing)?|saturat(?:e|es|ed|ing))\s+(?:through\s+)?(?:a|one|1)\s+(?:sanitary\s+)?pad\s+(?:every|per)\s+(?:single\s+)?hour\b/i,
      /\bbleed(?:ing)?\s+through\s+(?:my\s+)?(?:clothes|clothing)\b.{0,35}\b(?:repeatedly|over\s+and\s+over|again\s+and\s+again|multiple\s+times)\b|\b(?:repeatedly|over\s+and\s+over|again\s+and\s+again)\b.{0,35}\bbleed(?:ing)?\s+through\s+(?:my\s+)?(?:clothes|clothing)\b/i,
      /\bvery\s+large\s+(?:blood\s+)?clots?\b.{0,60}\bweak(?:ness|ening|ens)?\b|\bweak(?:ness|ening|ens)?\b.{0,60}\bvery\s+large\s+(?:blood\s+)?clots?\b/i,
    ],
  },
  {
    id: 'severe_pain',
    title: 'Severe pain may need urgent attention',
    message: 'Please seek urgent medical care.',
    patterns: [
      /\bunbearable\s+(?:(?:pelvic|abdominal|stomach)\s+)?pain\b|\bpain\b.{0,25}\bunbearable\b/i,
      /\bsudden(?:ly)?\s+(?:and\s+)?severe\s+(?:pelvic\s+)?pain\b|\bsudden(?:ly)?\s+severe\s+pain\s+(?:in|around)\s+(?:my\s+)?pelvis\b/i,
      /\bpain\b.{0,80}\b(?:prevent(?:s|ing)?|stops?|unable\s+to|cannot|can't)\s+(?:me\s+)?(?:from\s+)?(?:moving|move|walking|walk|normal\s+movement)\b|\b(?:unable|can't|cannot)\s+(?:to\s+)?(?:move|walk)\b.{0,50}\b(?:because\s+of|from|due\s+to)\s+(?:the\s+)?pain\b/i,
    ],
  },
  {
    id: 'fainting_weakness',
    title: 'Fainting or serious weakness may need urgent attention',
    message: 'Please seek urgent medical care.',
    patterns: [
      /\b(?:faint(?:ed|ing)?|passed\s+out|black(?:ed)?\s+out|nearly\s+faint(?:ed|ing)?|almost\s+faint(?:ed|ing)?)\b/i,
      /\bsevere\s+dizz(?:y|iness)|\b(?:confus(?:ed|ion)|disoriented)\b/i,
      /\b(?:severe|serious|extreme)\s+weakness\b|\b(?:very|extremely)\s+weak\b/i,
    ],
  },
  {
    id: 'other_urgent_concern',
    title: 'A symptom may need urgent attention',
    message: 'Please seek urgent medical care now. If you are in immediate danger, contact local emergency services or a trusted person now.',
    patterns: [
      /\bchest\s+pain\b/i,
      /\b(?:trouble|difficulty)\s+breathing\b|\b(?:can't|cannot|unable\s+to)\s+breathe\b|\bshortness\s+of\s+breath\b/i,
      /\b(?:sudden|suddenly)\s+(?:complete\s+)?vision\s+loss\b|\b(?:suddenly\s+)?lost\s+(?:all\s+)?(?:my\s+)?vision\b|\bsudden\s+blindness\b/i,
      /\bsudden(?:ly)?\s+severe\s+headache\b/i,
      /\b(?:self[- ]harm|suicidal|suicide|hurt\s+myself|harm\s+myself|kill\s+myself|end\s+my\s+life|want\s+to\s+die|wish\s+i\s+were\s+dead)\b/i,
      /\b(?:in\s+)?immediate\s+danger\b|\bin\s+danger\b|\b(?:not\s+safe|unsafe)\s+right\s+now\b|\b(?:don't|do\s+not)\s+feel\s+safe\b|\bfeel(?:ing)?\s+unsafe\b|\bsomeone\s+(?:is\s+)?(?:threatening|trying\s+to\s+hurt)\s+me\b/i,
    ],
  },
]

const PREGNANCY_PATTERNS = [
  /\b(?:possible\s+pregnancy|possibly\s+pregnant|might\s+be\s+pregnant|may\s+be\s+pregnant|could\s+be\s+pregnant|pregnan(?:t|cy))\b/i,
]
const PREGNANCY_SYMPTOM_PATTERNS = [
  /\b(?:heavy\s+)?bleeding\b|\bspotting\b/i,
  /\b(?:sudden(?:ly)?\s+)?severe\s+(?:pelvic\s+)?pain\b|\bunbearable\s+(?:pelvic\s+)?pain\b/i,
  /\b(?:faint(?:ed|ing)?|passed\s+out|severe\s+dizz(?:y|iness)|dizz(?:y|iness))\b/i,
]

function stringsFrom(value, seen = new Set()) {
  if (typeof value === 'string') return [value]
  if (!value || typeof value !== 'object' || seen.has(value)) return []
  seen.add(value)
  if (Array.isArray(value)) return value.flatMap((item) => stringsFrom(item, seen))
  return Object.values(value).flatMap((item) => stringsFrom(item, seen))
}

function isNegated(text, index) {
  const prefix = text.slice(Math.max(0, index - 45), index)
  return /\b(?:no|not|never|without|denies|denied|don't|do\s+not|isn't|aren't)(?:\s+\w+){0,3}\s*$/i.test(prefix)
}

function matches(text, patterns) {
  const found = []
  for (const pattern of patterns) {
    const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
    for (const match of text.matchAll(new RegExp(pattern.source, flags))) {
      if (isNegated(text, match.index)) continue
      found.push((match.groups?.term || match[0]).trim())
    }
  }
  return [...new Set(found)]
}

function hasPregnancyConcern(text) {
  const pregnancies = matches(text, PREGNANCY_PATTERNS)
  if (!pregnancies.length) return []
  const pregnancyLocations = []
  for (const pattern of PREGNANCY_PATTERNS) {
    for (const match of text.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))) {
      if (!isNegated(text, match.index)) pregnancyLocations.push(match.index)
    }
  }
  const symptoms = []
  for (const pattern of PREGNANCY_SYMPTOM_PATTERNS) {
    for (const match of text.matchAll(new RegExp(pattern.source, `${pattern.flags}g`))) {
      if (!isNegated(text, match.index)) symptoms.push({ index: match.index, term: match[0] })
    }
  }
  return symptoms
    .filter((symptom) => pregnancyLocations.some((index) => Math.abs(index - symptom.index) <= 120))
    .map((symptom) => symptom.term)
}

/** Detects urgent symptoms from free text or structured records without a backend. */
export function detectRedFlags(input) {
  const text = stringsFrom(input).join(' ').replace(/\s+/g, ' ').trim()
  if (!text) return []

  const warnings = []
  for (const definition of DEFINITIONS) {
    const matchedTerms = matches(text, definition.patterns)
    if (matchedTerms.length) {
      warnings.push({
        id: definition.id,
        severity: 'urgent',
        title: definition.title,
        message: definition.message,
        matchedTerms,
      })
    }
  }

  const pregnancyTerms = hasPregnancyConcern(text)
  if (pregnancyTerms.length) {
    warnings.push({
      id: 'pregnancy_concern',
      severity: 'urgent',
      title: 'Pregnancy-related symptoms may need urgent attention',
      message: 'Please seek urgent medical care now.',
      matchedTerms: [...new Set(pregnancyTerms)],
    })
  }

  return warnings
}

export function getSafetyDisclaimer() {
  return DISCLAIMER
}

export function hasUrgentRedFlags(input) {
  return detectRedFlags(input).length > 0
}
