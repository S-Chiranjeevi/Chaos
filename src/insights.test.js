import test from 'node:test'
import assert from 'node:assert/strict'
import {
  generatePersonalizedInsights,
  generateAiInsightsWithFallback,
  validateSafety,
  DISCLAIMER,
  INSIGHT_CATEGORIES,
} from './services/aiInsightsEngine.js'
import {
  getInsightRecords,
  recordInsightShown,
  dismissInsight,
  addToDoctorSummary,
  removeFromDoctorSummary,
  getDoctorSummary,
  saveUserPreferences,
  deleteMyInsights,
  computeDataFingerprint,
} from './models/insightsStorage.js'
import { deleteAllLocalHealthData } from './models/healthEntry.js'

// Setup mock localStorage for Node.js test environment
function setupMockLocalStorage() {
  const store = new Map()
  globalThis.window = {}
  globalThis.localStorage = {
    get length() {
      return store.size
    },
    key(index) {
      return [...store.keys()][index] ?? null
    },
    getItem(key) {
      return store.has(key) ? store.get(key) : null
    },
    setItem(key, value) {
      store.set(key, String(value))
    },
    removeItem(key) {
      store.delete(key)
    },
    clear() {
      store.clear()
    },
  }
  globalThis.window.localStorage = globalThis.localStorage
  return store
}

function cleanupMockLocalStorage() {
  delete globalThis.window
  delete globalThis.localStorage
}

// ============================================================================
// TEST 1: New user with no data
// ============================================================================
test('Test 1: New user with no data returns missing_information insight and disclaimer', () => {
  const input = {
    userLanguage: 'English',
    periodLogs: [],
    symptomLogs: [],
    previousInsights: [],
    userPreferences: {
      preferredDoctor: 'female doctor',
      communicationStyle: 'simple',
    },
  }

  const result = generatePersonalizedInsights(input)
  assert.ok(result.insights.length > 0)
  assert.ok(result.insights.length <= 3)
  assert.equal(result.disclaimer, DISCLAIMER)

  const missingInfo = result.insights.find((i) => i.category === INSIGHT_CATEGORIES.MISSING_INFORMATION)
  assert.ok(missingInfo, 'Should generate a missing_information insight')
  assert.match(missingInfo.message, /not have enough recent period data/i)
  assert.match(missingInfo.whyThisAppeared, /currently only 0 period entry/i)
  assert.equal(missingInfo.urgency, 'routine')

  // Message must be under 40 words
  const words = missingInfo.message.trim().split(/\s+/).length
  assert.ok(words <= 40, `Message word count (${words}) must be under 40`)
})

// ============================================================================
// TEST 2: User with three irregular cycles
// ============================================================================
test('Test 2: User with three irregular cycles generates cycle_pattern insight with evidence', () => {
  const input = {
    userLanguage: 'English',
    periodLogs: [
      { id: 'period-001', date: '2026-03-01', cycleLengthDays: 58 },
      { id: 'period-002', date: '2026-04-28', cycleLengthDays: 64 },
      { id: 'period-003', date: '2026-07-01', cycleLengthDays: 71 },
    ],
    symptomLogs: [],
    previousInsights: [],
    userPreferences: {
      preferredDoctor: 'female doctor',
      communicationStyle: 'detailed',
    },
  }

  const result = generatePersonalizedInsights(input)
  assert.ok(result.insights.length <= 3)

  const cycleInsight = result.insights.find((i) => i.category === INSIGHT_CATEGORIES.CYCLE_PATTERN)
  assert.ok(cycleInsight, 'Should detect cycle_pattern')
  assert.match(cycleInsight.suggestedAction, /female gynecologist/i)
  assert.match(cycleInsight.whyThisAppeared, /58, 64, and 71 days/i)
  assert.deepEqual(cycleInsight.sourceEntries, ['period-001', 'period-002', 'period-003'])
  assert.equal(cycleInsight.urgency, 'routine')

  // Check word count constraint
  const words = cycleInsight.message.trim().split(/\s+/).length
  assert.ok(words <= 40, `Message word count (${words}) must be under 40`)
})

// ============================================================================
// TEST 3: User with repeated acne entries
// ============================================================================
test('Test 3: User with repeated acne entries generates repeated_symptom insight', () => {
  const input = {
    userLanguage: 'English',
    periodLogs: [
      { id: 'period-001', date: '2026-06-01' },
      { id: 'period-002', date: '2026-07-01' },
    ],
    symptomLogs: [
      { id: 'symp-001', date: '2026-06-15', symptom: 'Acne', severity: 'Moderate' },
      { id: 'symp-002', date: '2026-07-14', symptom: 'Acne', severity: 'Moderate' },
      { id: 'symp-003', date: '2026-08-12', symptom: 'Acne', severity: 'Mild' },
    ],
    previousInsights: [],
    userPreferences: {
      preferredDoctor: 'gynecologist',
      communicationStyle: 'simple',
    },
  }

  const result = generatePersonalizedInsights(input)
  const acneInsight = result.insights.find((i) => i.category === INSIGHT_CATEGORIES.REPEATED_SYMPTOM)
  assert.ok(acneInsight, 'Should detect repeated acne symptom')
  assert.match(acneInsight.message, /recorded acne during three recent cycles/i)
  assert.match(acneInsight.whyThisAppeared, /Recorded across 3 entries/i)
  assert.deepEqual(acneInsight.sourceEntries, ['symp-001', 'symp-002', 'symp-003'])
})

// ============================================================================
// TEST 4: User with severe pain (Safety warning / Urgent)
// ============================================================================
test('Test 4: User with severe pain generates safety_warning as highest priority with urgent status', () => {
  const input = {
    userLanguage: 'English',
    periodLogs: [{ id: 'p1', date: '2026-10-01' }],
    symptomLogs: [
      { id: 'symp-severe', date: '2026-10-02', symptom: 'Severe pain', severity: 'Severe' },
      { id: 'symp-acne', date: '2026-10-02', symptom: 'Acne', severity: 'Mild' },
    ],
    previousInsights: [],
    userPreferences: {
      preferredDoctor: 'female doctor',
      communicationStyle: 'simple',
    },
  }

  const result = generatePersonalizedInsights(input)
  assert.ok(result.insights.length > 0)

  // Safety warning must be first in list
  const firstInsight = result.insights[0]
  assert.equal(firstInsight.category, INSIGHT_CATEGORIES.SAFETY_WARNING)
  assert.equal(firstInsight.urgency, 'urgent')
  assert.match(firstInsight.suggestedAction, /seek urgent medical care/i)
  assert.ok(firstInsight.sourceEntries.includes('symp-severe'))
})

// ============================================================================
// TEST 5: User with unchanged data after reopening the app
// ============================================================================
test('Test 5: User with unchanged data after reopening does not show duplicate or modified messages', () => {
  setupMockLocalStorage()
  try {
    const periodLogs = [
      { id: 'p1', date: '2026-01-01', cycleLengthDays: 58 },
      { id: 'p2', date: '2026-03-01', cycleLengthDays: 64 },
      { id: 'p3', date: '2026-05-05', cycleLengthDays: 71 },
      { id: 'p4', date: '2026-07-15', cycleLengthDays: 71 },
    ]
    const fingerprint = computeDataFingerprint(periodLogs, [])

    const firstRun = generatePersonalizedInsights({
      periodLogs,
      symptomLogs: [],
      previousInsights: [],
      userPreferences: { communicationStyle: 'simple' },
    })

    const initialCycleInsight = firstRun.insights.find((i) => i.category === INSIGHT_CATEGORIES.CYCLE_PATTERN)
    assert.ok(initialCycleInsight)

    // Record it as shown with fingerprint
    recordInsightShown(initialCycleInsight, fingerprint)

    const records = getInsightRecords()
    assert.equal(records.length, 1)
    assert.equal(records[0].insightId, initialCycleInsight.id)

    // Second run with same unchanged data:
    const secondRun = generatePersonalizedInsights({
      periodLogs,
      symptomLogs: [],
      previousInsights: records,
      userPreferences: { communicationStyle: 'simple' },
    })

    const secondCycleInsight = secondRun.insights.find((i) => i.category === INSIGHT_CATEGORIES.CYCLE_PATTERN)
    assert.ok(secondCycleInsight)
    assert.equal(secondCycleInsight.isContinuation, false)
    assert.match(secondCycleInsight.message, /last three logged cycles were longer than usual/i)

    // Third run with a new 5th irregular cycle added (new info changes pattern):
    const updatedPeriodLogs = [
      ...periodLogs,
      { id: 'p5', date: '2026-09-20', cycleLengthDays: 67 },
    ]
    const thirdRun = generatePersonalizedInsights({
      periodLogs: updatedPeriodLogs,
      symptomLogs: [],
      previousInsights: records,
      userPreferences: { communicationStyle: 'simple' },
    })
    const thirdCycleInsight = thirdRun.insights.find((i) => i.category === INSIGHT_CATEGORIES.CYCLE_PATTERN)
    assert.ok(thirdCycleInsight)
    assert.equal(thirdCycleInsight.isContinuation, true)
    assert.match(thirdCycleInsight.message, /previous pattern has continued for another month/i)
  } finally {
    cleanupMockLocalStorage()
  }
})

// ============================================================================
// TEST 6: User who dismisses an insight
// ============================================================================
test('Test 6: User who dismisses an insight prevents it from being re-generated', () => {
  setupMockLocalStorage()
  try {
    const insightId = 'insight-cycle-pattern-irregular'
    dismissInsight(insightId)

    const records = getInsightRecords()
    assert.ok(records.some((r) => r.insightId === insightId && r.dismissed === true))

    const result = generatePersonalizedInsights({
      periodLogs: [
        { id: 'p1', date: '2026-01-01', cycleLengthDays: 58 },
        { id: 'p2', date: '2026-03-01', cycleLengthDays: 64 },
        { id: 'p3', date: '2026-05-05', cycleLengthDays: 71 },
        { id: 'p4', date: '2026-07-15', cycleLengthDays: 71 },
      ],
      symptomLogs: [],
      previousInsights: records,
      userPreferences: {},
    })

    const cycleInsight = result.insights.find((i) => i.id === insightId)
    assert.equal(cycleInsight, undefined, 'Dismissed insight must NOT be generated')
  } finally {
    cleanupMockLocalStorage()
  }
})

// ============================================================================
// TEST 7: User who adds an insight to the doctor summary
// ============================================================================
test('Test 7: User who adds an insight to doctor summary persists it and updates records', () => {
  setupMockLocalStorage()
  try {
    const insight = {
      id: 'insight-test-01',
      category: 'cycle_pattern',
      title: 'Cycle irregularity',
      message: 'Your cycles have been longer than usual.',
      whyThisAppeared: 'Lengths: 58, 64, 71 days.',
      suggestedAction: 'Discuss with gynecologist.',
    }

    addToDoctorSummary(insight)

    const summary = getDoctorSummary()
    assert.equal(summary.length, 1)
    assert.equal(summary[0].id, 'insight-test-01')

    const records = getInsightRecords()
    const rec = records.find((r) => r.insightId === 'insight-test-01')
    assert.ok(rec, 'Insight record should be tracked')
    assert.equal(rec.addedToSummary, true)

    // Remove from doctor summary
    removeFromDoctorSummary('insight-test-01')
    assert.equal(getDoctorSummary().length, 0)
  } finally {
    cleanupMockLocalStorage()
  }
})

// ============================================================================
// TEST 8: AI API failure falls back gracefully to rules engine
// ============================================================================
test('Test 8: AI API failure falls back gracefully to rules engine with friendly message', async () => {
  const input = {
    userLanguage: 'English',
    periodLogs: [
      { id: 'p1', date: '2026-01-01', cycleLengthDays: 58 },
      { id: 'p2', date: '2026-03-01', cycleLengthDays: 64 },
      { id: 'p3', date: '2026-05-05', cycleLengthDays: 71 },
      { id: 'p4', date: '2026-07-15', cycleLengthDays: 71 },
    ],
    symptomLogs: [],
    previousInsights: [],
    userPreferences: {},
  }

  // Force AI failure
  const result = await generateAiInsightsWithFallback(input, {
    enableCloudAi: true,
    forceFailure: true,
  })

  assert.equal(result.engineUsed, 'rules_fallback')
  assert.equal(
    result.fallbackNotice,
    'We could not generate a personalized explanation right now. Your saved information is still available.'
  )
  assert.ok(result.insights.length > 0)
  assert.equal(result.disclaimer, DISCLAIMER)
})

// ============================================================================
// TEST 9: Mixed-language and Hindi input
// ============================================================================
test('Test 9: Mixed-language and Hindi requests return properly localized insights and disclaimer', () => {
  const input = {
    userLanguage: 'Hindi',
    periodLogs: [
      { id: 'p1', date: '2026-01-01', cycleLengthDays: 58 },
      { id: 'p2', date: '2026-03-01', cycleLengthDays: 64 },
      { id: 'p3', date: '2026-05-05', cycleLengthDays: 71 },
      { id: 'p4', date: '2026-07-15', cycleLengthDays: 71 },
    ],
    symptomLogs: [],
    previousInsights: [],
    userPreferences: { communicationStyle: 'simple' },
  }

  const result = generatePersonalizedInsights(input)
  assert.ok(result.insights.length > 0)
  const cycleInsight = result.insights.find((i) => i.category === INSIGHT_CATEGORIES.CYCLE_PATTERN)
  assert.ok(cycleInsight)
  assert.match(cycleInsight.title, /माहवारी चक्र/i)
  assert.match(cycleInsight.suggestedAction, /महिला रोग विशेषज्ञ/i)
  assert.equal(result.disclaimer, DISCLAIMER)
})

// ============================================================================
// TEST 10: Data deletion
// ============================================================================
test('Test 10: Data deletion removes all insights, records, doctor summaries and preferences', () => {
  const store = setupMockLocalStorage()
  try {
    saveUserPreferences({ preferredDoctor: 'endocrinologist' })
    addToDoctorSummary({ id: 'ins-1', title: 'Test' })
    recordInsightShown({ id: 'ins-1' }, 'fp-1')

    assert.ok(store.size > 0)

    // Delete my insights
    deleteMyInsights()

    assert.equal(getDoctorSummary().length, 0)
    assert.equal(getInsightRecords().length, 0)

    // Also test SakhiCare global privacy deleteAllLocalHealthData
    store.set('sakhicare_latest_entry', 'entry')
    store.set('unrelated_key', 'keep')
    deleteAllLocalHealthData()

    assert.equal(store.has('sakhicare_latest_entry'), false)
    assert.equal(store.get('unrelated_key'), 'keep')
  } finally {
    cleanupMockLocalStorage()
  }
})

// ============================================================================
// SAFETY VALIDATION TEST
// ============================================================================
test('Safety Validator strictly rejects diagnostic assertions or prescription recommendations', () => {
  assert.throws(() => {
    validateSafety({
      title: 'Diagnosis',
      message: 'You have PCOS and must take birth control.',
      suggestedAction: 'Take metformin 500mg.',
    })
  }, /Safety violation/)

  assert.throws(() => {
    validateSafety({
      title: 'Pregnancy',
      message: 'You are pregnant right now.',
      suggestedAction: 'Rest.',
    })
  }, /Safety violation/)
})
