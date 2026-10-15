import test from 'node:test'
import assert from 'node:assert/strict'
import {
  detectEarlyWarnings,
  computeCycleIntervals,
  normalizeHealthData,
  URGENCY_LEVELS,
  WARNING_TYPES,
} from '../src/services/earlyWarning.js'

test('detectEarlyWarnings: Insufficient tracking data on empty input', () => {
  const warnings = detectEarlyWarnings({})
  assert.equal(warnings.length, 1)
  assert.equal(warnings[0].type, WARNING_TYPES.INSUFFICIENT_DATA)
  assert.equal(warnings[0].urgency, URGENCY_LEVELS.INFO)
  assert.ok(warnings[0].title.toLowerCase().includes('no cycle') || warnings[0].title.toLowerCase().includes('data'))
  assert.ok(warnings[0].evidence)
  assert.ok(warnings[0].whyAmISeeingThis)
  assert.ok(!warnings[0].message.toLowerCase().includes('pcos'))
})

test('detectEarlyWarnings: Do not produce a warning from one isolated entry', () => {
  const singleEntryData = {
    periodLogs: [{ startDate: '2026-01-01', endDate: '2026-01-05' }],
    symptomLogs: [],
  }
  const warnings = detectEarlyWarnings(singleEntryData)
  assert.equal(warnings.length, 1)
  assert.equal(warnings[0].type, WARNING_TYPES.INSUFFICIENT_DATA)
  assert.equal(warnings[0].urgency, URGENCY_LEVELS.INFO)
  assert.ok(warnings[0].message.toLowerCase().includes('more tracking') || warnings[0].title.toLowerCase().includes('more tracking'))
  assert.ok(warnings[0].evidence)
  // Ensure it never diagnoses or calls it PCOS
  assert.ok(!JSON.stringify(warnings).toLowerCase().includes('you have pcos'))
})

test('detectEarlyWarnings: Repeated irregular cycles (>35 days) matching requested format', () => {
  const data = {
    periodLogs: [
      { startDate: '2026-01-01', endDate: '2026-01-05' },
      { startDate: '2026-02-12', endDate: '2026-02-16' }, // 42 days
      { startDate: '2026-03-26', endDate: '2026-03-30' }, // 42 days
      { startDate: '2026-05-07', endDate: '2026-05-11' }, // 42 days
    ],
    symptomLogs: [],
  }

  const warnings = detectEarlyWarnings(data)
  const cycleWarn = warnings.find((w) => w.type === WARNING_TYPES.CYCLE_PATTERN)

  assert.ok(cycleWarn, 'Should detect cycle pattern')
  assert.equal(cycleWarn.type, 'cycle_pattern')
  assert.equal(cycleWarn.title, 'Your recent cycles have been longer than usual')
  assert.ok(cycleWarn.message.includes('longer than 35 days'))
  assert.equal(cycleWarn.urgency, 'soon')
  assert.ok(cycleWarn.suggestedAction.includes('gynecologist'))
  assert.ok(cycleWarn.whyAmISeeingThis)
  assert.ok(cycleWarn.evidence.cyclesChecked >= 3)
  assert.ok(cycleWarn.evidence.longCycles >= 2)
  assert.ok(cycleWarn.evidence.averageDays > 35)

  // Safety constraint: Never call the pattern PCOS
  assert.ok(!cycleWarn.title.toLowerCase().includes('pcos'))
  assert.ok(!cycleWarn.message.toLowerCase().includes('pcos'))
})

test('detectEarlyWarnings: Long gap between periods (>45 days)', () => {
  const data = {
    periodLogs: [
      { startDate: '2026-01-01', endDate: '2026-01-05' },
      { startDate: '2026-03-15', endDate: '2026-03-20' }, // 73 day gap
    ],
    symptomLogs: [],
  }

  const warnings = detectEarlyWarnings(data)
  const gapWarn = warnings.find((w) => w.type === WARNING_TYPES.CYCLE_GAP || w.type === WARNING_TYPES.CYCLE_PATTERN)
  assert.ok(gapWarn, 'Should flag long gap between periods')
  assert.equal(gapWarn.urgency, 'soon')
  assert.ok(gapWarn.evidence.gapDays >= 45)
  assert.ok(gapWarn.suggestedAction)
  assert.ok(gapWarn.whyAmISeeingThis)
})

test('detectEarlyWarnings: Repeated pelvic discomfort across entries', () => {
  const data = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'pelvic pain and cramping', date: '2026-04-01', severity: 'moderate' },
      { symptom: 'lower pelvic discomfort', date: '2026-04-20', severity: 'moderate' },
      { symptom: 'pelvic ache', date: '2026-05-15', severity: 'moderate' },
    ],
  }

  const warnings = detectEarlyWarnings(data)
  const pelvicWarn = warnings.find((w) => w.id === 'warn-repeated-pelvic-discomfort')
  assert.ok(pelvicWarn, 'Should detect repeated pelvic discomfort')
  assert.equal(pelvicWarn.type, WARNING_TYPES.REPEATED_SYMPTOM)
  assert.equal(pelvicWarn.urgency, 'soon')
  assert.equal(pelvicWarn.evidence.occurrences, 3)
  assert.ok(pelvicWarn.suggestedAction.toLowerCase().includes('gynecologist'))
  assert.ok(pelvicWarn.whyAmISeeingThis)
})

test('detectEarlyWarnings: Repeated acne entries across multiple months', () => {
  const data = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'cystic acne on chin', date: '2026-04-01', severity: 'moderate' },
      { symptom: 'facial breakouts', date: '2026-05-01', severity: 'moderate' },
      { symptom: 'jawline acne', date: '2026-06-01', severity: 'moderate' },
    ],
  }

  const warnings = detectEarlyWarnings(data)
  const acneWarn = warnings.find((w) => w.id === 'warn-repeated-acne')
  assert.ok(acneWarn, 'Should detect repeated acne')
  assert.equal(acneWarn.type, WARNING_TYPES.REPEATED_SYMPTOM)
  assert.equal(acneWarn.urgency, 'info')
  assert.equal(acneWarn.evidence.occurrences, 3)
  assert.ok(acneWarn.suggestedAction.toLowerCase().includes('dermatologist') || acneWarn.suggestedAction.toLowerCase().includes('gynecologist'))
  assert.ok(!acneWarn.message.toLowerCase().includes('pcos'))
})

test('detectEarlyWarnings: Repeated hair changes (facial hirsutism or shedding)', () => {
  const data = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'unwanted chin hair', notes: 'coarse hair', date: '2026-04-01', severity: 'moderate' },
      { symptom: 'scalp hair thinning', notes: 'part line widening', date: '2026-05-01', severity: 'moderate' },
    ],
  }

  const warnings = detectEarlyWarnings(data)
  const hairWarn = warnings.find((w) => w.id === 'warn-repeated-hair-changes')
  assert.ok(hairWarn, 'Should detect repeated hair changes')
  assert.equal(hairWarn.type, WARNING_TYPES.REPEATED_SYMPTOM)
  assert.equal(hairWarn.urgency, 'soon')
  assert.equal(hairWarn.evidence.occurrences, 2)
  assert.ok(hairWarn.whyAmISeeingThis)
})

test('detectEarlyWarnings: Increasing pain severity progressing to severe (Urgent Red Warning)', () => {
  const data = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'pelvic pain', date: '2026-04-01', severity: 'mild' },
      { symptom: 'lower abdominal pain', date: '2026-04-15', severity: 'moderate' },
      { symptom: 'sharp pelvic pain', date: '2026-04-30', severity: 'severe' },
    ],
  }

  const warnings = detectEarlyWarnings(data)
  const painWarn = warnings.find((w) => w.id === 'warn-increasing-pain')
  assert.ok(painWarn, 'Should flag increasing pain trend')
  assert.equal(painWarn.type, WARNING_TYPES.INCREASING_PAIN)
  assert.equal(painWarn.urgency, URGENCY_LEVELS.URGENT, 'Escalation to severe must be urgent')
  assert.equal(painWarn.canDismiss, false, 'Urgent warnings should not be dismissible')
  assert.equal(painWarn.evidence.initialSeverity, 'mild')
  assert.equal(painWarn.evidence.currentSeverity, 'severe')
  assert.deepEqual(painWarn.evidence.progression, ['mild', 'moderate', 'severe'])
})

test('detectEarlyWarnings: Increasing bleeding severity with dizziness (Urgent Red Warning)', () => {
  const data = {
    periodLogs: [],
    symptomLogs: [
      { symptom: 'menstrual bleeding', date: '2026-04-01', severity: 'moderate' },
      { symptom: 'heavy bleeding', notes: 'feeling dizzy and weak', date: '2026-05-01', severity: 'severe' },
    ],
  }

  const warnings = detectEarlyWarnings(data)
  const bleedingWarn = warnings.find((w) => w.id === 'warn-increasing-bleeding')
  assert.ok(bleedingWarn, 'Should flag heavy bleeding with dizziness')
  assert.equal(bleedingWarn.urgency, URGENCY_LEVELS.URGENT)
  assert.equal(bleedingWarn.canDismiss, false)
  assert.ok(bleedingWarn.evidence.accompaniedByDizziness)
  assert.ok(bleedingWarn.suggestedAction.toLowerCase().includes('urgent'))
})

test('detectEarlyWarnings: Multiple symptoms together across cycle and skin/hair', () => {
  const data = {
    periodLogs: [
      { startDate: '2026-01-01', endDate: '2026-01-05' },
      { startDate: '2026-02-15', endDate: '2026-02-20' }, // 45 days
      { startDate: '2026-03-30', endDate: '2026-04-04' }, // 43 days
    ],
    symptomLogs: [
      { symptom: 'cystic acne on jawline', date: '2026-02-15', severity: 'moderate' },
      { symptom: 'excess facial hair', date: '2026-03-30', severity: 'moderate' },
    ],
  }

  const warnings = detectEarlyWarnings(data)
  const clusterWarn = warnings.find((w) => w.type === WARNING_TYPES.MULTIPLE_SYMPTOMS)
  assert.ok(clusterWarn, 'Should detect cluster of multiple symptoms')
  assert.equal(clusterWarn.urgency, 'soon')
  assert.ok(clusterWarn.evidence.categoriesIdentified.length >= 2)
  assert.ok(!clusterWarn.title.toLowerCase().includes('pcos'))
})

test('Safety Constraints: Never diagnose or prescribe dosages in any warning output', () => {
  const comprehensiveData = {
    periodLogs: [
      { startDate: '2026-01-01', endDate: '2026-01-05' },
      { startDate: '2026-03-04', endDate: '2026-03-08' },
      { startDate: '2026-05-14', endDate: '2026-05-18' },
    ],
    symptomLogs: [
      { symptom: 'acne', date: '2026-02-01', severity: 'severe' },
      { symptom: 'pelvic pain', date: '2026-03-01', severity: 'severe' },
      { symptom: 'facial hair', date: '2026-04-01', severity: 'moderate' },
    ],
  }

  const warnings = detectEarlyWarnings(comprehensiveData)
  const allJson = JSON.stringify(warnings).toLowerCase()

  assert.ok(!allJson.includes('you have pcos'), 'Must not claim user has PCOS')
  assert.ok(!allJson.includes('prescribe'), 'Must not prescribe')
  assert.ok(!allJson.includes('mg/day'), 'Must not recommend dosages')
  assert.ok(!allJson.includes('take metformin'), 'Must not recommend specific prescription drugs')

  // Verify all warnings have required fields
  warnings.forEach((warn) => {
    assert.ok(warn.title, 'Every warning must have a title')
    assert.ok(warn.message, 'Every warning must have a plain-language message')
    assert.ok(warn.evidence, 'Every warning must have evidence')
    assert.ok(['urgent', 'soon', 'info'].includes(warn.urgency), 'Urgency must be urgent, soon, or info')
    assert.ok(warn.suggestedAction, 'Every warning must have a suggestedAction')
    assert.ok(warn.whyAmISeeingThis, 'Every warning must have whyAmISeeingThis')
  })
})
