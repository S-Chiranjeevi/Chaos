export async function analyzeSymptomsWithGemini(text, language = 'auto', { signal } = {}) {
  const response = await fetch('/api/analyze-symptoms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, language }),
    signal,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.error || 'Gemini could not analyze this note right now.')
  return payload
}
