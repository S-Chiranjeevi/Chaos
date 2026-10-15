import test from 'node:test'
import assert from 'node:assert/strict'
import { createPersonalizedInsights, INSIGHT_DISCLAIMER } from '../src/services/personalizedInsights.js'

const cycleHistory = [
  { id: 'cycle-1', startDate: '2026-01-01' },
  { id: 'cycle-2', startDate: '2026-02-12' },
  { id: 'cycle-3', startDate: '2026-03-23' },
  { id: 'cycle-4', startDate: '2026-05-06' },
]

test('creates an explainable insight for three long cycles', () => {
  const insights = createPersonalizedInsights({ periodLogs: cycleHistory })
  const insight = insights.find((item) => item.id === 'insight-repeated-irregular-cycles')
  assert.ok(insight)
  assert.equal(insight.urgency, 'soon')
  assert.equal(insight.source, 'rule_based')
  assert.equal(insight.dismissed, false)
  assert.equal(insight.evidence.length, 3)
  assert.match(insight.suggestedAction, /gynecologist/i)
  assert.ok(insight.whyItAppeared)
})

test('removes duplicate insights while retaining complete evidence', () => {
  const insights = createPersonalizedInsights({
    symptomLogs: [
      { id: 'p1', symptom: 'pelvic discomfort', date: '2026-01-01', severity: 'mild' },
      { id: 'p2', symptom: 'pelvic discomfort', date: '2026-01-20', severity: 'mild' },
      { id: 'p3', symptom: 'pelvic discomfort', date: '2026-02-12', severity: 'moderate' },
      { id: 'p4', symptom: 'pelvic discomfort', date: '2026-02-15', severity: 'moderate' },
    ],
  })
  const repeated = insights.filter((item) => item.id === 'insight-repeated-pelvic-discomfort')
  assert.equal(repeated.length, 1)
  assert.equal(repeated[0].evidence.length, 4)
})

test('keeps dismissed insights marked as dismissed', () => {
  const insights = createPersonalizedInsights({ periodLogs: cycleHistory, dismissedInsightIds: ['insight-repeated-irregular-cycles'] })
  assert.equal(insights.find((item) => item.id === 'insight-repeated-irregular-cycles')?.dismissed, true)
})

test('urgent early warnings override routine insight cards', () => {
  const insights = createPersonalizedInsights({
    periodLogs: cycleHistory,
    symptomLogs: [{ id: 'red-1', symptom: 'very heavy bleeding', date: '2026-05-10', severity: 'severe', note: 'dizzy and soaking pads' }],
  })
  assert.ok(insights.some((item) => item.urgency === 'urgent'))
  assert.ok(insights.every((item) => item.urgency !== 'routine'))
  assert.match(insights.find((item) => item.urgency === 'urgent').suggestedAction, /urgent medical care now/i)
})

test('uses an explainable no-data state', () => {
  const insights = createPersonalizedInsights()
  assert.equal(insights.length, 1)
  assert.equal(insights[0].id, 'insight-not-enough-information')
  assert.match(insights[0].message, /not enough information/i)
  assert.match(insights[0].education, /This is information, not a diagnosis\./)
  assert.equal(INSIGHT_DISCLAIMER, 'This is information, not a diagnosis.')
})

test('insight output avoids diagnoses and medication instructions', () => {
  const serialized = JSON.stringify(createPersonalizedInsights({ periodLogs: cycleHistory }))
  assert.doesNotMatch(serialized, /you have pcos|diagnos(?:is|ed)|\b\d+\s*mg\b|prescription/i)
})
