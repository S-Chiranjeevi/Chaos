import { validateOutput } from './outputValidator.js'
import { detectRedFlags } from './safetyRules.js'

/** Optional symptom-analysis transport.
 * No endpoint is assumed. When it is absent, slow, or returns an invalid payload,
 * callers use the local rules engine so care guidance remains available offline.
 */
export class AnalysisUnavailableError extends Error {}

export async function requestSymptomAnalysis({ text, language, followUpAnswers, signal } = {}) {
  if (detectRedFlags(text).length) {
    throw new AnalysisUnavailableError('Urgent symptoms were detected before contacting the online service.')
  }
  const endpoint = import.meta.env?.VITE_SYMPTOM_API_URL
  if (!endpoint) throw new AnalysisUnavailableError('No symptom-analysis service is configured.')
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
  if (!response.ok) throw new AnalysisUnavailableError('The symptom-analysis service is temporarily unavailable.')
  let payload
  try { payload = await response.json() } catch { throw new AnalysisUnavailableError('The symptom-analysis service returned an invalid response.') }
  const validation = validateOutput(payload)
  if (!validation.valid) throw new AnalysisUnavailableError('The online response did not pass safety checks.')
  const safePayload = validation.output
  if (!safePayload || !Array.isArray(safePayload.symptoms) || !['routine', 'soon', 'urgent', 'emergency'].includes(safePayload.urgency)) {
    throw new AnalysisUnavailableError('The symptom-analysis service returned an incomplete response.')
  }
  return safePayload
}
