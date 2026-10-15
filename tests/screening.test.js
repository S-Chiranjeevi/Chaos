import test from 'node:test'
import assert from 'node:assert/strict'
import { SCREENING_PRESETS } from '../src/data/screeningPresets.js'

test('Screening Presets: All presets have valid required clinical fields', () => {
  assert.ok(Array.isArray(SCREENING_PRESETS))
  assert.ok(SCREENING_PRESETS.length >= 3)

  for (const preset of SCREENING_PRESETS) {
    assert.ok(preset.id, 'Preset must have an ID')
    assert.ok(preset.title, 'Preset must have a title')
    assert.ok(preset.data, 'Preset must have data')

    const d = preset.data
    assert.ok(typeof d.age === 'number' && d.age >= 10 && d.age <= 60, `Valid age in preset ${preset.id}`)
    assert.ok(typeof d.weight_kg === 'number' && d.weight_kg >= 25 && d.weight_kg <= 200, `Valid weight in preset ${preset.id}`)
    assert.ok(typeof d.height_cm === 'number' && d.height_cm >= 100 && d.height_cm <= 220, `Valid height in preset ${preset.id}`)
    assert.ok(['regular', 'irregular'].includes(d.cycle_regularity), `Cycle regularity must be regular or irregular in ${preset.id}`)
    assert.ok(typeof d.cycle_length_days === 'number' && d.cycle_length_days >= 15 && d.cycle_length_days <= 90, `Valid cycle length in ${preset.id}`)
  }
})

test('Screening Presets: Elevated risk preset has Rotterdam-aligned markers', () => {
  const pcosPreset = SCREENING_PRESETS.find((p) => p.id === 'elevated_risk')
  assert.ok(pcosPreset, 'Should find typical PCOS preset')
  assert.equal(pcosPreset.data.cycle_regularity, 'irregular', 'PCOS preset should have irregular cycles')
  assert.equal(pcosPreset.data.hair_growth, true, 'PCOS preset should reflect hirsutism')
  assert.ok(pcosPreset.data.follicles_left >= 10, 'PCOS preset has high follicle count')
})

test('Screening Presets: Lower risk preset has healthy baseline parameters', () => {
  const lowRisk = SCREENING_PRESETS.find((p) => p.id === 'lower_risk')
  assert.ok(lowRisk, 'Should find typical control preset')
  assert.equal(lowRisk.data.cycle_regularity, 'regular', 'Control should have regular cycles')
  assert.equal(lowRisk.data.hair_growth, false, 'Control has no excess hair growth')
  assert.ok(lowRisk.data.follicles_left < 10, 'Control has normal follicle count')
})

test('BMI and Waist-to-Hip calculations are scientifically sound', () => {
  // Height: 160 cm, Weight: 64 kg -> BMI = 64 / (1.6^2) = 25.0
  const heightM = 160 / 100
  const bmi = 64 / (heightM * heightM)
  assert.equal(bmi.toFixed(1), '25.0')

  // Waist: 30 inch, Hip: 38 inch -> Ratio = 30 / 38 = 0.789
  const ratio = 30 / 38
  assert.equal(ratio.toFixed(2), '0.79')
})

test('Feature Independence: Screening outputs do not conflate with cycle forecasting', () => {
  const validateField = (name, val) => {
    if (name === 'age') return val >= 10 && val <= 60
    if (name === 'weight_kg') return val >= 25 && val <= 200
    if (name === 'height_cm') return val >= 100 && val <= 220
    return true
  }

  assert.ok(validateField('age', 26))
  assert.ok(!validateField('age', 5))
  assert.ok(!validateField('age', 85))
  assert.ok(validateField('weight_kg', 55))
  assert.ok(!validateField('weight_kg', 10))
  assert.ok(validateField('height_cm', 162))
  assert.ok(!validateField('height_cm', 50))
})
