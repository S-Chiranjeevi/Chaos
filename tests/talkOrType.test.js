import test from 'node:test'
import assert from 'node:assert/strict'
import { extractSymptoms } from '../src/services/symptomExtractor.js'
import { AnalysisUnavailableError, requestSymptomAnalysis } from '../src/services/apiClient.js'

test('Talk or Type local extraction detects language and safe results', () => {
  const result = extractSymptoms('मेरे पीरियड्स हर 2-3 महीने में आते हैं और मुझे मुंहासे हैं।', { preferredLanguage: 'en' })
  assert.equal(result.detectedLanguage, 'hi')
  assert.ok(result.symptoms.length >= 2)
  assert.equal(result.urgency, 'soon')
  assert.ok(result.possibleRelationships.every((item) => /could be related|may be worth discussing|many possible causes/i.test(item)))
  assert.match(result.disclaimer, /This is information, not a diagnosis\./)
})

test('Talk or Type local extraction raises an urgent warning for pelvic pain and dizziness', () => {
  const result = extractSymptoms('I have severe pelvic pain and feel dizzy.')
  assert.equal(result.urgency, 'urgent')
  assert.ok(result.redFlags.length > 0)
  assert.match(result.recommendedSpecialist, /urgent medical care now/i)
})

test('API client reports unavailable backend so the caller can use local guidance', async () => {
  await assert.rejects(requestSymptomAnalysis({ text: 'I have acne', language: 'en' }), AnalysisUnavailableError)
})
