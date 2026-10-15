import { validateOutput } from './outputValidator.js'
import { detectRedFlags } from './safetyRules.js'

/** Gemini transport for general health questions and symptom guidance. The API key
 * stays on the server; local rules remain available when the service is unavailable.
 */
export class AnalysisUnavailableError extends Error {}

export async function requestSymptomAnalysis({ text, language, followUpAnswers, signal } = {}) {
  if (detectRedFlags(text).length) {
    throw new AnalysisUnavailableError('Urgent symptoms were detected before contacting the online service.')
  }
  const endpoint = import.meta.env?.VITE_SYMPTOM_API_URL || '/api/analyze-symptoms'
  let response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language, follow_up_answers: followUpAnswers }),
      signal,
    })
  } catch {
    throw new AnalysisUnavailableError('The symptom-analysis service could not be reached.')
  }
  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}))
    throw new AnalysisUnavailableError(errorPayload.error || 'The Gemini service is temporarily unavailable.')
  }
  let payload
  try { payload = await response.json() } catch { throw new AnalysisUnavailableError('The symptom-analysis service returned an invalid response.') }
  const validation = validateOutput(payload)
  if (!validation.valid) throw new AnalysisUnavailableError('The online response did not pass safety checks.')
  const safePayload = validation.output
  if (!safePayload || typeof safePayload.answer !== 'string' || !safePayload.answer.trim() || !['routine', 'soon', 'urgent'].includes(safePayload.urgency)) {
    throw new AnalysisUnavailableError('Gemini returned an incomplete response.')
  }
  return safePayload
}
