import { detectRedFlags, getSafetyDisclaimer } from './safetyRules.js'

const UNSAFE_RULES = [
  ['diagnosis_claim', /\b(?:you\s+)?(?:definitely\s+|probably\s+|likely\s+|may\s+|might\s+)?have\s+(?:(?:a|an)\s+)?(?:pcos|polycystic\s+ovary\s+syndrome|endometriosis|fibroids?|ovarian\s+cysts?|anemia|anaemia|hypothyroidism|hyperthyroidism|thyroid\s+disease|cancer|diabetes|asthma|infection|hypertension|depression|migraine|sti|std|hiv|a\s+condition|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b|\b(?:you\s+do\s+not|you\s+don't)\s+have\s+(?:pcos|endometriosis|fibroids?|ovarian\s+cysts?|anemia|anaemia|cancer|diabetes|asthma|infection|hypertension|depression|migraine|sti|std|hiv|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b|\b(?:you\s+are|you're|you've\s+been)\s+diagnosed\s+with\b|\bdiagnosis\s*(?:is|:|-)\s*(?!not\b|unknown\b|unclear\b|uncertain\b)[a-z]|\b(?:this|that|these\s+symptoms)\s+(?:is|are|means|mean|indicate|indicates|confirm|confirms)\s+(?:definitely\s+)?(?:pcos|polycystic\s+ovary\s+syndrome|endometriosis|fibroids?|ovarian\s+cysts?|anemia|anaemia|cancer|diabetes|asthma|infection|hypertension|depression|migraine|sti|std|hiv|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b|\b(?:your\s+)?symptoms?\s+(?:are|is)\s+(?:caused\s+by|due\s+to)\s+(?:pcos|endometriosis|fibroids?|anemia|anaemia|cancer|diabetes|asthma|infection|hypertension|depression|migraine|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b/i],
  ['medicine_instruction', /\b(?:take|start|stop|use|increase|decrease|skip|avoid|continue|prescribe)\s+(?:(?:your|the|a|an|this)\s+)?(?:[\w-]+\s+){0,2}(?:medicine|medication|drug|pills?|tablets?|capsules?)\b|\b(?:take|start|stop|use|increase|decrease|skip|avoid|continue)\s+(?:[“"']?[\w-]+[”"']?\s+){0,2}(?:ibuprofen|aspirin|paracetamol|acetaminophen|metformin|hormones?|antibiotics?|painkillers?)\b|\b(?:don't|do\s+not|never|shouldn't|should\s+not)\s+(?:take|start|stop|use|increase|decrease|skip|avoid|continue)\s+(?:(?:your|the|a|an|this)\s+)?(?:[\w-]+\s+){0,2}(?:medicine|medication|drug|pills?|tablets?|capsules?|ibuprofen|aspirin|paracetamol|acetaminophen|metformin|antibiotics?)\b/i],
  ['dosage_instruction', /\b\d+(?:\.\d+)?\s*(?:mg|mcg|μg|g|ml|mL|units?|tablets?|capsules?)\b|\b(?:dose|dosage)\s*(?:of\s*)?\d+(?:\.\d+)?\b|\b(?:take|use|change|adjust|increase|decrease)\s+(?:your\s+|the\s+)?(?:dose|dosage)\b/i],
  ['cure_promise', /\b(?:will|can|could|guarantee(?:s|d)?\s+to|promise(?:s)?\s+to)\s+(?:completely\s+)?cure\b|\b(?:will|can|could)\s+be\s+cured\b|\bguaranteed?\s+(?:to\s+)?cure\b|\bguarantees?\s+(?:a\s+)?cure\b|\b(?:this|it)\s+is\s+(?:a\s+)?(?:complete\s+)?cure\b|\bpermanent\s+cure\b|\bcures?\s+(?:pcos|endometriosis|fibroids?|any\s+condition)\b/i],
  ['false_reassurance', /\b(?:nothing\s+to\s+worry\s+about|no\s+cause\s+for\s+concern|you\s+(?:don't|do\s+not)\s+need\s+to\s+worry|don't\s+worry|do\s+not\s+worry|you(?:'re|\s+are)\s+(?:completely\s+)?fine|your\s+symptoms?\s+(?:are\s+(?:harmless|not\s+serious)|aren't\s+serious|aren't\s+anything\s+serious)|this\s+is\s+harmless|(?:probably|likely)\s+nothing\s+serious|definitely\s+not\s+serious|there\s+is\s+nothing\s+wrong|you\s+are\s+not\s+at\s+risk|(?:this\s+is\s+)?not\s+urgent)\b/i],
  ['delay_urgent_care', /\b(?:(?<!do not )(?<!don't )(?<!should not )(?<!shouldn't )(?<!never )(?:wait|waiting)\s+(?:and\s+see|until\s+(?:tomorrow|next\s+week|later)|a\s+few\s+days|for\s+(?:a\s+)?(?:routine|regular|scheduled)\s+(?:appointment|visit)|(?:to\s+)?(?:seek|get|receive|obtain)\s+(?:urgent\s+|medical\s+)?(?:care|help)|(?:a\s+day|a\s+week|several\s+days|\d+\s*(?:hours?|days?))\s+before\s+(?:seeking|getting|going\s+for|seeing)\s+(?:medical\s+)?(?:care|help|a\s+doctor|doctor|hospital)|before\s+(?:seeking|getting|going\s+for|seeing)\s+(?:medical\s+)?(?:care|help|a\s+doctor|doctor|hospital)|to\s+(?:see|visit|contact)\s+(?:a\s+)?doctor)|(?:this\s+)?(?:can|could|may)\s+wait|(?<!do not )(?<!don't )(?<!should not )(?<!shouldn't )(?<!never )delay\s+(?:seeking\s+)?(?:urgent\s+)?(?:medical\s+)?care|(?<!do not )(?<!don't )(?<!should not )(?<!shouldn't )(?<!never )put\s+off\s+(?:seeing\s+a\s+)?(?:doctor|medical\s+care)|(?:doesn't|does\s+not|no)\s+(?:need|require)\s+(?:urgent\s+|medical\s+)?(?:care|attention)|(?:don't|do\s+not|shouldn't|should\s+not|no\s+need\s+to)\s+(?:seek|get|go\s+for|visit|contact)\s+(?:urgent\s+|medical\s+)?(?:care|help|a\s+doctor|the\s+hospital)|no\s+need\s+to\s+see\s+(?:a\s+)?doctor)\b/i],
]

function flattenStrings(value, path = '$', output = [], seen = new Set()) {
  if (typeof value === 'string') {
    output.push({ text: value, path })
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => flattenStrings(item, `${path}[${index}]`, output, seen))
  } else if (value && typeof value === 'object' && !seen.has(value)) {
    seen.add(value)
    Object.entries(value).forEach(([key, item]) => flattenStrings(item, `${path}.${key}`, output, seen))
  }
  return output
}

function withDisclaimer(value) {
  const disclaimer = getSafetyDisclaimer()
  if (typeof value === 'string') return value.includes(disclaimer) ? value : `${value.trim()}\n\n${disclaimer}`
  if (Array.isArray(value)) return value.map(withDisclaimer)
  if (!value || typeof value !== 'object') return { value, disclaimer }

  const copy = Array.isArray(value) ? value.map(withDisclaimer) : { ...value }
  copy.disclaimer = disclaimer
  for (const key of ['message', 'response', 'text', 'explanation', 'education']) {
    if (typeof copy[key] === 'string' && !copy[key].includes(disclaimer)) {
      copy[key] = `${copy[key].trim()} ${disclaimer}`.trim()
      break
    }
  }
  return copy
}

/** Validate generated text before it reaches a view. Unsafe output is blocked. */
export function validateOutput(value) {
  const fields = flattenStrings(value)
  const issues = []
  if (value == null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0) || (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0)) {
    issues.push('empty_output')
  }
  for (const [code, pattern] of UNSAFE_RULES) {
    if (fields.some(({ text }) => pattern.test(text))) issues.push(code)
  }

  return {
    valid: issues.length === 0,
    blocked: issues.length > 0,
    issues,
    output: issues.length ? null : withDisclaimer(value),
  }
}

/** Shared gate for any backend/AI response before a UI renders it. */
export function prepareOutputForDisplay({ input, output } = {}) {
  const urgentWarnings = input == null ? [] : detectRedFlags(input)
  const validation = validateOutput(output)
  return {
    ...validation,
    urgentWarnings,
  }
}
