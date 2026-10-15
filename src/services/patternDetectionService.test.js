import test from 'node:test'
import assert from 'node:assert/strict'
import { analyzeHealthPatterns, DISCLAIMER } from './patternDetectionService.js'

test('Test Case 1: Three irregular cycles', () => {
  const input = {
    periodLogs: [
      { startDate: '2026-01-01', endDate: '2026-01-05' },
      { startDate: '2026-03-04', endDate: '2026-03-08' }, // 62 days
      { startDate: '2026-05-14', endDate: '2026-05-18' }, // 71 days
      { startDate: '2026-07-11', endDate: '2026-07-15' }, // 58 days
    ],
    symptomLogs: [],
  }

  const result = analyzeHealthPatterns(input)

  assert.equal(result.disclaimer, DISCLAIMER)
  assert.notEqual(result.urgency, 'urgent')
  assert.ok(result.patterns.some((p) => p.type === 'irregular_cycles'))

  const irregularPattern = result.patterns.find((p) => p.type === 'irregular_cycles')
  assert.equal(irregularPattern.title, 'Your recent cycles appear irregular')
  assert.match(irregularPattern.description, /Your recent cycles appear irregular/)
  assert.match(irregularPattern.evidence, /62.*71.*58/)
  assert.equal(irregularPattern.suggestedAction, 'Consider discussing this pattern with a gynecologist.')
  assert.doesNotMatch(JSON.stringify(result), /You have PCOS/i)
})

test('Test Case 2: Three repeated acne entries', () => {
  const input = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'acne', date: '2026-05-01', severity: 'moderate' },
      { symptom: 'acne', date: '2026-06-01', severity: 'moderate' },
      { symptom: 'acne', date: '2026-07-01', severity: 'moderate' },
    ],
  }

  const result = analyzeHealthPatterns(input)

  assert.equal(result.disclaimer, DISCLAIMER)
  const pattern = result.patterns.find((p) => p.type === 'repeated_symptoms')
  assert.ok(pattern, 'Repeated symptoms pattern must be detected')
  assert.match(pattern.description, /You have logged acne several times recently/i)
  assert.match(pattern.suggestedAction, /Consider mentioning this pattern during your next doctor visit/i)
  assert.doesNotMatch(JSON.stringify(result), /You have PCOS/i)
})

test('Test Case 3: A symptom increasing from mild to severe', () => {
  const input = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'pelvic pain', date: '2026-05-10', severity: 'mild' },
      { symptom: 'pelvic pain', date: '2026-06-10', severity: 'moderate' },
      { symptom: 'pelvic pain', date: '2026-07-10', severity: 'severe' },
    ],
  }

  const result = analyzeHealthPatterns(input)

  assert.equal(result.disclaimer, DISCLAIMER)
  const pattern = result.patterns.find((p) => p.type === 'increasing_severity')
  assert.ok(pattern, 'Increasing severity pattern must be detected')
  assert.match(pattern.description, /This symptom appears to be becoming more severe/i)
  assert.match(pattern.suggestedAction, /Consider contacting a healthcare professional/i)
  assert.match(pattern.evidence, /mild to severe/i)
})

test('Test Case 4: Severe pelvic pain (Red Flag)', () => {
  const input = {
    periodLogs: [],
    symptomLogs: [
      {
        symptom: 'pelvic pain',
        date: '2026-07-15',
        severity: 'severe',
        note: 'sudden unbearable pelvic pain',
      },
    ],
  }

  const result = analyzeHealthPatterns(input)

  assert.equal(result.urgency, 'urgent')
  assert.equal(result.title, 'Please seek urgent medical care')
  assert.match(result.description, /Severe pain or very heavy bleeding can require immediate medical attention/i)
  assert.match(result.action, /Contact local emergency services or visit an urgent care facility/i)
  assert.equal(result.disclaimer, DISCLAIMER)
})

test('Test Case 5: Heavy bleeding with dizziness (Red Flag)', () => {
  const input = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'heavy bleeding', date: '2026-07-15', severity: 'severe' },
      { symptom: 'dizziness', date: '2026-07-15', severity: 'moderate', note: 'feeling faint while bleeding heavily' },
    ],
  }

  const result = analyzeHealthPatterns(input)

  assert.equal(result.urgency, 'urgent')
  assert.equal(result.title, 'Please seek urgent medical care')
  assert.match(result.action, /Contact local emergency services or visit an urgent care facility/i)
  assert.equal(result.disclaimer, DISCLAIMER)
})

test('Test Case 6: Only one period entry', () => {
  const input = {
    periodLogs: [{ startDate: '2026-06-01', endDate: '2026-06-05' }],
    symptomLogs: [],
  }

  const result = analyzeHealthPatterns(input)

  assert.notEqual(result.urgency, 'urgent')
  const pattern = result.patterns.find((p) => p.type === 'missing_period_entries')
  assert.ok(pattern, 'Missing entries guidance should be returned')
  assert.match(pattern.description, /We do not have enough information about your recent cycle/i)
  assert.equal(result.disclaimer, DISCLAIMER)
})

test('Test Case 7: No data (Empty state)', () => {
  const input = {
    periodLogs: [],
    symptomLogs: [],
  }

  const result = analyzeHealthPatterns(input)

  assert.equal(result.urgency, 'none')
  assert.equal(result.patterns.length, 0)
  assert.equal(result.warnings.length, 0)
  assert.match(result.explanation, /Keep logging periods and symptoms/i)
  assert.equal(result.disclaimer, DISCLAIMER)
})

test('Test Case 8: Unclear or incomplete entries', () => {
  const input = {
    periodLogs: [],
    symptomLogs: [
      { symptom: '', note: '' },
      { symptom: 'cramp', date: '', severity: '' },
    ],
  }

  const result = analyzeHealthPatterns(input)

  assert.notEqual(result.urgency, 'urgent')
  assert.ok(result.warnings.some((w) => w.type === 'unclear_entries'))
  assert.equal(result.disclaimer, DISCLAIMER)
})

test('Combinations: Irregular cycles + Acne', () => {
  const input = {
    periodLogs: [
      { startDate: '2026-01-01', endDate: '2026-01-05' },
      { startDate: '2026-03-05', endDate: '2026-03-09' },
      { startDate: '2026-05-15', endDate: '2026-05-19' },
    ],
    symptomLogs: [
      { symptom: 'acne', date: '2026-03-10', severity: 'moderate' },
      { symptom: 'acne', date: '2026-05-20', severity: 'moderate' },
    ],
  }

  const result = analyzeHealthPatterns(input)

  const combo = result.patterns.find((p) => p.type === 'multiple_related_symptoms')
  assert.ok(combo, 'Combo pattern should be detected')
  assert.match(combo.description, /These symptoms can have several possible causes/i)
  assert.doesNotMatch(JSON.stringify(result), /You have PCOS/i)
})

test('Safety: Never recommends medications, dosages, or claims certainty', () => {
  const result = analyzeHealthPatterns({
    periodLogs: [
      { startDate: '2026-01-01' },
      { startDate: '2026-03-01' },
      { startDate: '2026-05-01' },
    ],
    symptomLogs: [
      { symptom: 'acne', severity: 'severe', duration: '3 months' },
      { symptom: 'increased facial hair', severity: 'moderate' },
    ],
  })

  const jsonStr = JSON.stringify(result)
  const jsonWithoutDisclaimer = jsonStr.replace(DISCLAIMER, '')
  assert.doesNotMatch(jsonWithoutDisclaimer, /you have pcos/i)
  assert.doesNotMatch(jsonWithoutDisclaimer, /diagnos(?:ed|is)/i)
  assert.doesNotMatch(jsonWithoutDisclaimer, /take \d+\s*mg/i)
  assert.doesNotMatch(jsonStr, /medication/i)
  assert.doesNotMatch(jsonStr, /prescription/i)
  assert.equal(result.disclaimer, DISCLAIMER)
})
