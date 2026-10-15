import test from 'node:test'
import assert from 'node:assert/strict'
import { assessSymptoms, examples, DISCLAIMER } from './engine.js'

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
