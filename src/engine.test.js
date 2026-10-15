import test from 'node:test'
import assert from 'node:assert/strict'
import { assessSymptoms, examples, DISCLAIMER } from './engine.js'
import { extractSymptoms } from './services/symptomExtractor.js'
import { deleteAllLocalHealthData } from './models/healthEntry.js'

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

test('privacy control deletes only Luna Her local data', () => {
  const items = new Map([
    ['sakhicare_latest_entry', 'private health entry'],
    ['sakhicare_cycle_tracker', 'private cycle data'],
    ['unrelated_preference', 'keep me'],
  ])
  globalThis.window = {}
  globalThis.localStorage = {
    get length() { return items.size },
    key(index) { return [...items.keys()][index] ?? null },
    removeItem(key) { items.delete(key) },
  }
  deleteAllLocalHealthData()
  assert.equal(items.has('sakhicare_latest_entry'), false)
  assert.equal(items.has('sakhicare_cycle_tracker'), false)
  assert.equal(items.get('unrelated_preference'), 'keep me')
  delete globalThis.window
  delete globalThis.localStorage
})

test('extractSymptoms parses Hinglish descriptions into structured cards and Rotterdam pillars', () => {
  const parsed = extractSymptoms('Mere periods 2-3 mahine late aate hain aur chin par unwanted baal aa rahe hain.')
  assert.ok(parsed.hasPcosIndicators)
  assert.equal(parsed.rotterdamPillars.ovulatory, true)
  assert.equal(parsed.rotterdamPillars.androgenic, true)
  assert.ok(parsed.symptoms.length >= 2)
  assert.ok(parsed.recommendedTests.length > 0)
  assert.ok(parsed.questionsForDoctor.length > 0)
})

test('extractSymptoms identifies metabolic insulin resistance marker (Acanthosis Nigricans / Dark Neck)', () => {
  const parsed = extractSymptoms('Gale pe kaalapan hai aur pet par charbi badh rahi hai')
  assert.equal(parsed.rotterdamPillars.metabolic, true)
  const acanthosis = parsed.symptoms.find((s) => s.defId === 'acanthosis_nigricans')
  assert.ok(acanthosis)
})

test('extractSymptoms identifies Tamil regional inputs', () => {
  const parsed = extractSymptoms('எனக்கு மாதவிடாய் தாமதம் மற்றும் முகத்தில் முடி வளர்கிறது')
  assert.equal(parsed.rotterdamPillars.ovulatory, true)
  assert.equal(parsed.rotterdamPillars.androgenic, true)
})

