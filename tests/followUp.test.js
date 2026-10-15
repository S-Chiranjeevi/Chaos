import test from 'node:test'
import assert from 'node:assert/strict'
import {
  generateFollowUpQuestions,
  synthesizeSuggestions,
  identifyRelevantDomains,
  DISCLAIMER,
} from '../src/services/followUpService.js'

test('identifyRelevantDomains detects cycle, androgen, pain, and metabolic keywords', () => {
  const d1 = identifyRelevantDomains('My periods are late and irregular', [])
  assert.equal(d1.hasCycle, true)
  assert.equal(d1.hasPain, false)

  const d2 = identifyRelevantDomains('Severe cramps and pelvic pain', [])
  assert.equal(d2.hasPain, true)

  const d3 = identifyRelevantDomains('Breakouts on chin and facial hair', [])
  assert.equal(d3.hasAndrogen, true)

  const d4 = identifyRelevantDomains('Trouble losing weight and extreme fatigue', [])
  assert.equal(d4.hasMetabolic, true)
})

test('generateFollowUpQuestions generates cycle-specific questions for delayed periods', () => {
  const questions = generateFollowUpQuestions({
    text: 'My periods have been delayed and come every 2-3 months.',
    symptoms: [{ id: 'irregular_periods' }],
  })
  assert.ok(questions.length >= 2)
  const ids = questions.map((q) => q.id)
  assert.ok(ids.includes('cycle_duration'), 'Should ask about duration of irregular cycles')
  assert.ok(ids.includes('cycle_gap'), 'Should ask about typical cycle gap')
  assert.ok(ids.includes('androgen_signs'), 'Should explore androgen signs under Rotterdam guidelines')
})

test('generateFollowUpQuestions includes pain profile when cramps are described', () => {
  const questions = generateFollowUpQuestions({
    text: 'I get severe cramps in my lower belly during periods.',
    symptoms: [{ id: 'severe_pain' }],
  })
  const ids = questions.map((q) => q.id)
  assert.ok(ids.includes('pain_profile'), 'Should ask about pain intensity and functional impact')
})

test('generateFollowUpQuestions provides safe baseline questions for brief/unclear input', () => {
  const questions = generateFollowUpQuestions({
    text: 'feeling unwell lately',
    symptoms: [],
  })
  assert.ok(questions.length >= 2, 'Should provide at least 2 guiding questions')
  assert.ok(questions.length <= 4, 'Should not exceed 4 questions')
})

test('synthesizeSuggestions combines initial input with user follow-up answers', () => {
  const initialText = 'Periods are irregular and I have acne'
  const followUpAnswers = {
    cycle_duration: '3_to_6m',
    cycle_gap: 'gap_long',
    androgen_signs: ['jawline_acne', 'facial_hair'],
    metabolic_energy: ['fatigue_afternoon'],
  }

  const result = synthesizeSuggestions({
    inputText: initialText,
    symptoms: [{ id: 'irregular_periods' }, { id: 'acne' }],
    followUpAnswers,
  })

  // Narrative summary incorporates answers
  assert.match(result.summaryNarrative, /3 to 6 months/i)
  assert.match(result.summaryNarrative, /Typical interval/i)

  // Clinical pillars
  assert.equal(result.hasOvulatory, true)
  assert.equal(result.hasAndrogenic, true)
  assert.equal(result.hasMetabolic, true)
  assert.ok(result.pillarInsights.length >= 2)

  // Tailored doctor questions quote answers
  assert.ok(result.questionsForDoctor.some((q) => /3 to 6 months/i.test(q)))
  assert.ok(result.questionsForDoctor.some((q) => /Total and Free Testosterone/i.test(q)))
  assert.ok(result.questionsForDoctor.some((q) => /Fasting Insulin/i.test(q)))

  // Tailored tips
  assert.ok(result.tailoredTips.some((t) => t.category.includes('Blood Sugar') || t.category.includes('Nutrition')))
  assert.ok(result.tailoredTips.some((t) => t.category.includes('Skin') || t.category.includes('Androgen')))

  // Recommended specialist includes endocrinologist / gynecologist
  assert.match(result.recommendedSpecialist, /Gynecologist/i)
  assert.match(result.recommendedSpecialist, /Endocrinologist/i)
})

test('synthesizeSuggestions flags severe pain as urgent clinical priority', () => {
  const result = synthesizeSuggestions({
    inputText: 'Pain in lower belly',
    symptoms: [{ id: 'severe_pain' }],
    followUpAnswers: {
      pain_profile: 'pain_severe',
    },
  })
  assert.equal(result.urgency, 'urgent')
  assert.equal(result.hasSeverePain, true)
  assert.match(result.recommendedSpecialist, /pelvic pain|endometriosis/i)
})

test('synthesizeSuggestions maintains strict non-diagnostic medical framing', () => {
  const result = synthesizeSuggestions({
    inputText: 'Irregular cycles for months',
    symptoms: [{ id: 'irregular_periods' }],
    followUpAnswers: {
      cycle_duration: 'over_6m',
      cycle_gap: 'gap_very_long',
    },
  })

  // Mandatory non-diagnostic disclaimer
  assert.equal(result.disclaimer, DISCLAIMER)
  assert.match(result.disclaimer, /This is information, not a diagnosis\./)

  // Never makes definitive diagnostic claim
  const fullText = JSON.stringify(result)
  assert.doesNotMatch(fullText, /you have PCOS/i)
  assert.doesNotMatch(fullText, /diagnosed with PCOS/i)

  // Never prescribes medication or dosages
  assert.doesNotMatch(fullText, /\b(take|prescribe)\s+\d+\s*(mg|ml|tablets?)\b/i)
  assert.doesNotMatch(fullText, /\bmetformin\s+\d+/i)
  assert.doesNotMatch(fullText, /\bspironolactone\s+\d+/i)
})

test('synthesizeSuggestions handles empty follow-up (skipped) safely', () => {
  const result = synthesizeSuggestions({
    inputText: 'My periods are late',
    symptoms: [{ id: 'irregular_periods' }],
    followUpAnswers: {},
  })

  assert.ok(result.summaryNarrative)
  assert.ok(result.questionsForDoctor.length >= 2)
  assert.ok(result.tailoredTips.length >= 2)
  assert.match(result.disclaimer, /This is information, not a diagnosis\./)
})
