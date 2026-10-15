import test from 'node:test';
import assert from 'node:assert/strict';

import {
  isValidDateString,
  calculateDayDifference,
  addDaysToDate,
  computeCycleIntervals,
  computeCycleStats,
  validateCycleEntryInput,
  sortCycleEntries,
} from '../src/services/cycleCalculations.js';

import {
  BaselineCyclePredictionService,
  XGBoostCyclePredictionService,
  MEDICAL_SAFETY_DISCLAIMER,
} from '../src/services/cyclePredictionService.js';

test('1. Date calculation & consecutive cycle length calculations', () => {
  const dates = [
    { startDate: '2026-01-01' },
    { startDate: '2026-02-10' },
    { startDate: '2026-03-25' },
  ];

  const intervals = computeCycleIntervals(dates);
  assert.equal(intervals.length, 2);

  // Interval 1: Jan 1 to Feb 10 (31 days in Jan + 10 = 40 days (non-leap 2026))
  assert.equal(intervals[0].startDate, '2026-01-01');
  assert.equal(intervals[0].endDate, '2026-02-10');
  assert.equal(intervals[0].cycleLengthDays, 40);

  // Interval 2: Feb 10 to Mar 25 (Feb has 28 days -> 18 + 25 = 43 days)
  assert.equal(intervals[1].startDate, '2026-02-10');
  assert.equal(intervals[1].endDate, '2026-03-25');
  assert.equal(intervals[1].cycleLengthDays, 43);

  const stats = computeCycleStats(intervals);
  assert.equal(stats.totalCycles, 2);
  assert.equal(stats.averageCycleLength, 41.5);
  assert.equal(stats.shortestCycle, 40);
  assert.equal(stats.longestCycle, 43);
  assert.equal(stats.variationDays, 3);
});

test('2. Insufficient history empty states and warnings', () => {
  const service = new BaselineCyclePredictionService();

  // Test with 0 entries
  const emptyRes = service.predict([]);
  assert.equal(emptyRes.status, 'insufficient_history');
  assert.equal(emptyRes.irregularityCategory, 'insufficient_data');
  assert.equal(emptyRes.estimatedIrregularity, null);
  assert.equal(emptyRes.confidenceScore, null);
  assert.equal(emptyRes.stats.totalCycles, 0);
  assert.ok(emptyRes.dataQualityWarnings.length > 0);

  // Test with only 1 period entry
  const singleRes = service.predict([{ startDate: '2026-03-01' }]);
  assert.equal(singleRes.status, 'insufficient_history');
  assert.equal(singleRes.irregularityCategory, 'insufficient_data');
  assert.equal(singleRes.stats.totalCycles, 0);
  // Provides preliminary standard 28-day window without claiming precision
  assert.ok(singleRes.expectedNextPeriod);
  assert.equal(singleRes.expectedNextPeriod.isStandardEstimate, true);
  assert.ok(singleRes.dataQualityWarnings.some((w) => w.includes('Only 1 period start date recorded')));
});

test('3. Large gap / missing period detection', () => {
  const service = new BaselineCyclePredictionService();
  const logsWithGap = [
    { startDate: '2026-01-01' },
    { startDate: '2026-05-15' }, // > 120 days gap
  ];

  const res = service.predict(logsWithGap);
  assert.ok(res.dataQualityWarnings.some((w) => w.includes('exceed 90 days')));
});

test('4. Date validation & duplicate entry prevention', () => {
  const existing = [
    { id: 'cy-1', startDate: '2026-01-01' },
    { id: 'cy-2', startDate: '2026-02-10' },
  ];

  // Disallow blank date
  const blankCheck = validateCycleEntryInput({ startDate: '' }, existing);
  assert.equal(blankCheck.isValid, false);

  // Disallow invalid date strings
  const invalidDate = validateCycleEntryInput({ startDate: '2026-02-31' }, existing);
  assert.equal(invalidDate.isValid, false);

  const nonDate = validateCycleEntryInput({ startDate: 'not-a-date' }, existing);
  assert.equal(nonDate.isValid, false);

  // Duplicate prevention
  const dupCheck = validateCycleEntryInput({ startDate: '2026-01-01' }, existing);
  assert.equal(dupCheck.isValid, false);
  assert.ok(dupCheck.error.includes('already exists'));

  // Editing existing entry allowed with same date
  const editCheck = validateCycleEntryInput({ startDate: '2026-01-01' }, existing, 'cy-1');
  assert.equal(editCheck.isValid, true);

  // Valid new date
  const validCheck = validateCycleEntryInput({ startDate: '2026-03-25' }, existing);
  assert.equal(validCheck.isValid, true);
});

test('5. Irregular historical cycle classifications (Oligomenorrhea & Variable)', () => {
  const service = new BaselineCyclePredictionService();

  // Scenario A: Oligomenorrhea (consistent long cycles > 35 days)
  const oligoLogs = [
    { startDate: '2026-01-01' },
    { startDate: '2026-02-12' }, // 42 days
    { startDate: '2026-03-28' }, // 44 days
    { startDate: '2026-05-10' }, // 43 days
  ];
  const oligoRes = service.predict(oligoLogs);
  assert.equal(oligoRes.irregularityCategory, 'irregular');
  assert.equal(oligoRes.estimatedIrregularity, true);
  assert.ok(oligoRes.explanation.includes('oligomenorrhea'));
  assert.ok(oligoRes.expectedNextPeriod);
  assert.equal(oligoRes.confidenceScore, null); // NO fabricated confidence

  // Scenario B: Variable cycles (diff >= 8 days)
  const varLogs = [
    { startDate: '2026-01-01' },
    { startDate: '2026-01-25' }, // 24 days
    { startDate: '2026-02-28' }, // 34 days (diff: 10 days)
    { startDate: '2026-03-25' }, // 25 days
  ];
  const varRes = service.predict(varLogs);
  assert.equal(varRes.irregularityCategory, 'variable');
  assert.equal(varRes.estimatedIrregularity, true);

  // Scenario C: Regular cycles (21-35 days, <= 7 days variation)
  const regularLogs = [
    { startDate: '2026-01-01' },
    { startDate: '2026-01-29' }, // 28 days
    { startDate: '2026-02-27' }, // 29 days
    { startDate: '2026-03-28' }, // 29 days
  ];
  const regularRes = service.predict(regularLogs);
  assert.equal(regularRes.irregularityCategory, 'regular');
  assert.equal(regularRes.estimatedIrregularity, false);
});

test('6. Model-ready architecture: Baseline vs XGBoost stub verification', async () => {
  const baseline = new BaselineCyclePredictionService();
  const xgboost = new XGBoostCyclePredictionService();

  const sampleLogs = [
    { startDate: '2026-01-01' },
    { startDate: '2026-02-01' },
    { startDate: '2026-03-03' },
  ];

  // Baseline evaluation
  const bRes = baseline.predict(sampleLogs);
  assert.equal(bRes.engineType, 'rule_based');
  assert.equal(bRes.confidenceScore, null);
  assert.equal(bRes.modelVersion, 'baseline-clinical-rules-v1.0');

  // XGBoost evaluation when unconfigured
  assert.equal(xgboost.isModelConfigured(), false);
  const xRes = await xgboost.predict(sampleLogs);

  // Must NOT claim that an active trained model executed
  assert.ok(xRes.dataQualityWarnings.some((w) => w.includes('Real XGBoost model endpoint is not configured')));
  assert.equal(xRes.engineType, 'rule_based');
  assert.equal(xRes.confidenceScore, null);
});

test('7. Medical safety & non-diagnostic guarantees', () => {
  const service = new BaselineCyclePredictionService();
  const sampleLogs = [
    { startDate: '2026-01-01' },
    { startDate: '2026-02-20' }, // 50 days
    { startDate: '2026-04-15' }, // 54 days
  ];

  const res = service.predict(sampleLogs);

  // Never diagnoses PCOS
  const serialized = JSON.stringify(res).toLowerCase();
  assert.equal(serialized.includes('you have pcos'), false);
  assert.equal(serialized.includes('confirms pcos'), false);
  assert.equal(serialized.includes('take '), false);
  assert.equal(serialized.includes('prescription'), false);

  // Prominent disclaimer present
  assert.equal(res.disclaimer, MEDICAL_SAFETY_DISCLAIMER);
  assert.ok(res.clinicalReferences.length >= 3);
});
