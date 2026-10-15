import { detectRedFlags, getSafetyDisclaimer } from './safetyRules.js'
import { validateOutput } from './outputValidator.js'

const DISCLAIMER = getSafetyDisclaimer()

const TOPIC_RESPONSES = [
  {
    matches: [/irregular|late period|missed period|cycle/],
    message: 'Cycle changes can have several causes. Tracking start dates, flow, pain, and other changes can make a health visit easier to discuss. If a change continues or worries you, consider arranging a visit with a qualified healthcare professional.',
    suggestions: ['How can I track my cycle?', 'What should I ask at a health visit?'],
  },
  {
    matches: [/pcos|acne|facial hair|hair growth/],
    message: 'These changes can be useful to record for a health visit. A qualified healthcare professional can consider your full history and decide whether any evaluation is appropriate. I can help you organize what you have noticed or prepare questions.',
    suggestions: ['Help me prepare questions', 'What details should I track?'],
  },
  {
    matches: [/pain|cramp|cramps|bleeding|spotting/],
    message: 'It can help to note when the symptom started, where you feel it, how it affects daily activities, and any bleeding changes. If pain or bleeding becomes severe, seek urgent medical care.',
    suggestions: ['What details should I track?', 'Help me prepare questions'],
  },
  {
    matches: [/track|journal|log|record/],
    message: 'You can track period start dates, flow changes, pain, mood, skin or hair changes, sleep, and anything that affects daily life. Bring the notes that feel relevant to a health visit.',
    suggestions: ['Open cycle tracker', 'Help me prepare questions'],
  },
  {
    matches: [/doctor|clinician|appointment|question|visit/],
    message: 'You could ask: “What information would help you understand these changes?”, “What should I continue tracking?”, and “When should I seek urgent care?” You can also use the Doctor Summary page to organize your notes.',
    suggestions: ['Open doctor summary', 'What details should I track?'],
  },
]

const DEFAULT_RESPONSE = {
  message: 'I can help you organize symptoms, think of questions for a health visit, or explain how to use SakhiCare’s tracking tools. Tell me what you have noticed in your own words.',
  suggestions: ['What details should I track?', 'Help me prepare questions', 'Open cycle tracker'],
}

function addDisclaimer(message) {
  return `${message}\n\n${DISCLAIMER}`
}

function urgentReply(warnings) {
  return {
    kind: 'urgent',
    message: addDisclaimer('Your message includes a symptom that may need urgent attention. Please seek urgent medical care.'),
    warnings,
    suggestions: [],
  }
}

/**
 * Creates a local, non-diagnostic chatbot reply. Safety screening happens before
 * topic matching, so an urgent message never depends on a backend or AI model.
 */
export function createChatReply(input) {
  const text = String(input || '').trim()
  if (!text) {
    return {
      kind: 'help',
      message: addDisclaimer('Share what you would like help with, such as cycle tracking, preparing questions, or organizing your notes.'),
      warnings: [],
      suggestions: DEFAULT_RESPONSE.suggestions,
    }
  }

  const warnings = detectRedFlags(text)
  if (warnings.length) return urgentReply(warnings)

  const response = TOPIC_RESPONSES.find((topic) => topic.matches.some((pattern) => pattern.test(text))) || DEFAULT_RESPONSE
  const candidate = {
    kind: 'guidance',
    message: addDisclaimer(response.message),
    warnings: [],
    suggestions: response.suggestions,
  }
  const validation = validateOutput(candidate)

  if (validation.valid) return validation.output
  return {
    kind: 'help',
    message: addDisclaimer('I can help you organize what you have noticed and prepare for a conversation with a qualified healthcare professional.'),
    warnings: [],
    suggestions: DEFAULT_RESPONSE.suggestions,
  }
}

export const CHAT_STARTER = {
  id: 'assistant-welcome',
  sender: 'assistant',
  kind: 'help',
  text: addDisclaimer('Hi, I’m SakhiCare’s guide. I can help you organize symptoms, use the tracker, and prepare questions for a health visit.'),
  suggestions: DEFAULT_RESPONSE.suggestions,
}
