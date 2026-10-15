import test from 'node:test'
import assert from 'node:assert/strict'
import { detectRedFlags, getSafetyDisclaimer } from '../src/services/safetyRules.js'
import { prepareOutputForDisplay, validateOutput } from '../src/services/outputValidator.js'

const warningIds = (input) => detectRedFlags(input).map((warning) => warning.id)

test('detects soaking a pad every hour as heavy bleeding', () => {
  assert.ok(warningIds('I am soaking a pad every hour.').includes('heavy_bleeding'))
})

test('detects repeated bleeding through clothes', () => {
  assert.ok(warningIds('I keep bleeding through my clothes repeatedly.').includes('heavy_bleeding'))
})

test('detects very large clots together with weakness', () => {
  assert.ok(warningIds('Very large blood clots and weakness.').includes('heavy_bleeding'))
})

test('does not treat large clots without weakness as this specific flag', () => {
  assert.ok(!warningIds('I passed a very large clot.').includes('heavy_bleeding'))
})

test('detects unbearable pain', () => {
  assert.ok(warningIds('The pain is unbearable.').includes('severe_pain'))
})

test('detects sudden severe pelvic pain', () => {
  assert.ok(warningIds('I have sudden severe pelvic pain.').includes('severe_pain'))
})

test('detects pain preventing normal movement', () => {
  assert.ok(warningIds('Pain prevents me from walking normally.').includes('severe_pain'))
})

test('detects pain described as preventing normal movement', () => {
  assert.ok(warningIds('Pain preventing normal movement.').includes('severe_pain'))
})

test('detects fainting', () => {
  assert.ok(warningIds('I fainted earlier.').includes('fainting_weakness'))
})

test('detects nearly fainting', () => {
  assert.ok(warningIds('I nearly fainted.').includes('fainting_weakness'))
})

test('detects severe dizziness', () => {
  assert.ok(warningIds('I have severe dizziness.').includes('fainting_weakness'))
})

test('detects confusion', () => {
  assert.ok(warningIds('I feel confused.').includes('fainting_weakness'))
})

test('detects severe weakness without fainting', () => {
  assert.ok(warningIds('I have severe weakness.').includes('fainting_weakness'))
})

test('detects possible pregnancy with bleeding', () => {
  assert.ok(warningIds('Possible pregnancy and I have bleeding.').includes('pregnancy_concern'))
})

test('detects possible pregnancy with severe pain', () => {
  assert.ok(warningIds('I might be pregnant and have sudden severe pelvic pain.').includes('pregnancy_concern'))
})

test('detects pregnancy with fainting or dizziness', () => {
  assert.ok(warningIds('I am pregnant and feel dizzy.').includes('pregnancy_concern'))
})

test('detects chest pain', () => {
  assert.ok(warningIds('I have chest pain.').includes('other_urgent_concern'))
})

test('detects trouble breathing', () => {
  assert.ok(warningIds('I am having trouble breathing.').includes('other_urgent_concern'))
})

test('detects sudden vision loss', () => {
  assert.ok(warningIds('I suddenly lost my vision.').includes('other_urgent_concern'))
})

test('detects a sudden severe headache', () => {
  assert.ok(warningIds('I have a sudden severe headache.').includes('other_urgent_concern'))
})

test('detects self-harm concerns', () => {
  assert.ok(warningIds('I want to hurt myself.').includes('other_urgent_concern'))
})

test('detects suicidal statements', () => {
  assert.ok(warningIds('I want to die.').includes('other_urgent_concern'))
})

test('detects immediate danger', () => {
  assert.ok(warningIds('I am in immediate danger.').includes('other_urgent_concern'))
})

test('does not mistake feeling safe for an immediate danger report', () => {
  assert.deepEqual(detectRedFlags('I am safe right now.'), [])
})

test('detects feeling unsafe right now', () => {
  assert.ok(warningIds("I don't feel safe.").includes('other_urgent_concern'))
})

test('returns warning fields and urgent severity in a stable shape', () => {
  const warning = detectRedFlags('Soaking a pad every hour.')[0]
  assert.deepEqual(Object.keys(warning), ['id', 'severity', 'title', 'message', 'matchedTerms'])
  assert.equal(warning.id, 'heavy_bleeding')
  assert.equal(warning.severity, 'urgent')
  assert.deepEqual(warning.matchedTerms, ['Soaking a pad every hour'])
})

test('keeps multiple urgent warnings in stable order', () => {
  assert.deepEqual(warningIds('Chest pain and sudden severe pelvic pain; I fainted.'), [
    'severe_pain', 'fainting_weakness', 'other_urgent_concern',
  ])
})

test('does not flag an explicitly denied symptom', () => {
  assert.deepEqual(detectRedFlags('I am not having chest pain.'), [])
})

test('scans structured health records without a server', () => {
  assert.ok(warningIds({ notes: 'Trouble breathing', symptoms: [{ symptom: 'chest pain' }] }).includes('other_urgent_concern'))
})

test('does not flag ordinary symptom notes', () => {
  assert.deepEqual(detectRedFlags('My periods are irregular and I have acne.'), [])
})

test('adds the required disclaimer to safe string output', () => {
  const result = validateOutput('Consider talking with a qualified healthcare professional.')
  assert.equal(result.valid, true)
  assert.match(result.output, /This is information, not a diagnosis\./)
})

test('blocks diagnosis claims', () => {
  assert.ok(validateOutput('You have PCOS.').blocked)
})

test('blocks diagnosis claims for other named conditions', () => {
  assert.ok(validateOutput('You have anemia.').issues.includes('diagnosis_claim'))
})

test('blocks diagnosis claims for additional serious conditions', () => {
  assert.ok(validateOutput('You have cancer.').issues.includes('diagnosis_claim'))
})

test('blocks medication instructions', () => {
  assert.ok(validateOutput('Take the medication each morning.').issues.includes('medicine_instruction'))
})

test('blocks named medicine instructions', () => {
  assert.ok(validateOutput('Start metformin today.').issues.includes('medicine_instruction'))
})

test('blocks dosage instructions', () => {
  assert.ok(validateOutput('Take 500 mg daily.').issues.includes('dosage_instruction'))
})

test('blocks cure promises', () => {
  assert.ok(validateOutput('This will completely cure PCOS.').issues.includes('cure_promise'))
})

test('blocks guaranteed cure promises', () => {
  assert.ok(validateOutput('This is a guaranteed cure.').issues.includes('cure_promise'))
})

test('blocks false reassurance', () => {
  assert.ok(validateOutput('There is nothing to worry about.').issues.includes('false_reassurance'))
})

test('blocks dismissive reassurance', () => {
  assert.ok(validateOutput("Don't worry about it.").issues.includes('false_reassurance'))
})

test('blocks advice to wait for routine care', () => {
  assert.ok(validateOutput('Wait for a routine appointment next week.').issues.includes('delay_urgent_care'))
})

test('blocks advice to wait before seeking care', () => {
  assert.ok(validateOutput('Wait a day before seeking medical care.').issues.includes('delay_urgent_care'))
})

test('allows instructions not to delay care', () => {
  assert.equal(validateOutput('Do not delay medical care.').valid, true)
})

test('blocks medication cautions as medicine instructions too', () => {
  assert.ok(validateOutput('Do not take the medication.').issues.includes('medicine_instruction'))
})

test('allows a non-diagnostic statement about clinical limits', () => {
  assert.equal(validateOutput("A clinician can help; I can't diagnose.").valid, true)
})

test('blocks unsafe phrases inside nested AI output', () => {
  assert.ok(validateOutput({ message: 'Possible causes vary.', details: ['You are fine.'] }).blocked)
})

test('adds the disclaimer to structured output and its visible message', () => {
  const result = validateOutput({ id: 'note', message: 'Talk with a health professional.' })
  assert.equal(result.output.disclaimer, getSafetyDisclaimer())
  assert.match(result.output.message, /This is information, not a diagnosis\./)
})

test('blocks unsafe AI output instead of returning any of it', () => {
  const result = validateOutput('You have PCOS and should take 500 mg. ​')
  assert.equal(result.valid, false)
  assert.equal(result.output, null)
  assert.ok(result.issues.includes('diagnosis_claim'))
  assert.ok(result.issues.includes('dosage_instruction'))
})

test('blocks empty output rather than creating a blank response', () => {
  assert.ok(validateOutput('').issues.includes('empty_output'))
})

test('prepares a validated output and runs urgent rules on the input first', () => {
  const result = prepareOutputForDisplay({ input: 'I am soaking a pad every hour.', output: 'Please contact a health professional.' })
  assert.equal(result.valid, true)
  assert.equal(result.urgentWarnings[0].id, 'heavy_bleeding')
})
