import test from 'node:test'
import assert from 'node:assert/strict'
import { assessSymptoms, examples, DISCLAIMER } from './engine.js'
import { extractSymptoms } from './services/symptomExtractor.js'

for (const example of examples) {
  test(example.name, () => {
    const result = assessSymptoms(example.input)
    assert.equal(result.urgency, example.expectedUrgency)
    assert.deepEqual(result.extractedSymptoms, example.expectedSymptoms)
    assert.ok(result.explanation.includes(DISCLAIMER))
    assert.ok(Array.isArray(result.possibleTopics))
    assert.ok(Array.isArray(result.questionsForDoctor))
    assert.ok(Array.isArray(result.redFlags))
    assert.ok(result.recommendedDoctor)
  })
}

test('suggests an endocrinologist for hormone-related patterns', () => {
  assert.match(assessSymptoms('My periods are irregular and I have acne.').recommendedDoctor, /endocrinologist/i)
})

test('shows an urgent care instruction for red flags', () => {
  assert.match(assessSymptoms('I have severe pelvic pain.').recommendedDoctor, /Please seek urgent medical care now/i)
})

test('recognizes basic Hindi and Telugu period descriptions', () => {
  assert.ok(assessSymptoms('मेरे पीरियड अनियमित हैं').extractedSymptoms.includes('Irregular or infrequent periods'))
  assert.ok(assessSymptoms('నా నెలసరి క్రమం తప్పింది').extractedSymptoms.includes('Irregular or infrequent periods'))
})

test('integrated extractor returns safe routine guidance for empty input', () => {
  const result = extractSymptoms('')
  assert.equal(result.urgency, 'routine')
  assert.deepEqual(result.symptoms, [])
  assert.match(result.disclaimer, /This is information, not a diagnosis\./)
})

test('integrated extractor flags severe pain and heavy bleeding with dizziness', () => {
  for (const input of ['I have severe pelvic pain.', 'I have very heavy bleeding and feel dizzy.']) {
    const result = extractSymptoms(input)
    assert.equal(result.urgency, 'urgent')
    assert.ok(result.redFlags.length > 0)
    assert.match(result.disclaimer, /This is information, not a diagnosis\./)
  }
})

test('integrated extractor reads a regional-language example', () => {
  const result = extractSymptoms('मेरे पीरियड्स हर 2-3 महीने में आते हैं।')
  assert.ok(result.symptoms.some((symptom) => symptom.defId === 'irregular_periods'))
})
