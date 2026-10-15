import test from 'node:test';
import assert from 'node:assert/strict';

import {
  validateForecastInputs,
  fetchLiveCycleForecast,
  APIVerveForecastError,
} from '../src/services/apiverveClient.js';

import { StorageService } from '../src/services/storageService.js';

test('1. APIVerve Input Validation - Accepts valid physiological parameters', () => {
  const result = validateForecastInputs({
    lastPeriod: '2026-03-01',
    cycleLength: 28,
    periodLength: 5,
    cycles: 3,
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('2. APIVerve Input Validation - Rejects invalid or impossible dates', () => {
  // Missing date
  const missing = validateForecastInputs({ lastPeriod: '' });
  assert.equal(missing.isValid, false);
  assert.match(missing.errors.lastPeriod, /required/i);

  // Invalid format
  const malformed = validateForecastInputs({ lastPeriod: '03-01-2026' });
  assert.equal(malformed.isValid, false);
  assert.match(malformed.errors.lastPeriod, /YYYY-MM-DD/i);

  // Non-existent calendar date
  const invalidCal = validateForecastInputs({ lastPeriod: '2026-02-31' });
  assert.equal(invalidCal.isValid, false);

  // Out of reasonable bounds
  const futureYear = validateForecastInputs({ lastPeriod: '2999-01-01' });
  assert.equal(futureYear.isValid, false);
});

test('3. APIVerve Input Validation - Validates cycle length boundaries (21-35 days)', () => {
  // Below minimum 21
  const tooShort = validateForecastInputs({
    lastPeriod: '2026-03-01',
    cycleLength: 20,
    periodLength: 5,
  });
  assert.equal(tooShort.isValid, false);
  assert.match(tooShort.errors.cycleLength, /between 21 and 35/i);

  // Above maximum 35
  const tooLong = validateForecastInputs({
    lastPeriod: '2026-03-01',
    cycleLength: 36,
    periodLength: 5,
  });
  assert.equal(tooLong.isValid, false);
  assert.match(tooLong.errors.cycleLength, /between 21 and 35/i);

  // Non-integer
  const floatVal = validateForecastInputs({
    lastPeriod: '2026-03-01',
    cycleLength: 28.5,
    periodLength: 5,
  });
  assert.equal(floatVal.isValid, false);
});

test('4. APIVerve Input Validation - Validates period duration boundaries (2-10 days)', () => {
  const tooShortPeriod = validateForecastInputs({
    lastPeriod: '2026-03-01',
    cycleLength: 28,
    periodLength: 1,
  });
  assert.equal(tooShortPeriod.isValid, false);
  assert.match(tooShortPeriod.errors.periodLength, /between 2 and 10/i);

  const tooLongPeriod = validateForecastInputs({
    lastPeriod: '2026-03-01',
    cycleLength: 28,
    periodLength: 11,
  });
  assert.equal(tooLongPeriod.isValid, false);
  assert.match(tooLongPeriod.errors.periodLength, /between 2 and 10/i);
});

test('5. fetchLiveCycleForecast rejects invalid inputs before dispatching request', async () => {
  await assert.rejects(
    async () => {
      await fetchLiveCycleForecast({
        lastPeriod: 'invalid-date',
        cycleLength: 28,
        periodLength: 5,
      });
    },
    (err) => {
      assert(err instanceof APIVerveForecastError);
      assert.equal(err.code, 'INVALID_INPUT');
      return true;
    }
  );
});

test('6. fetchLiveCycleForecast maps HTTP error statuses to structured errors', async () => {
  const originalFetch = global.fetch;

  try {
    // Test 503 key not configured
    global.fetch = async () => ({
      ok: false,
      status: 503,
      json: async () => ({
        error: 'APIVERVE_KEY_MISSING',
        message: 'APIVERVE_API_KEY is not configured on the server.',
      }),
    });

    await assert.rejects(
      async () => {
        await fetchLiveCycleForecast({
          lastPeriod: '2026-03-01',
          cycleLength: 28,
          periodLength: 5,
        });
      },
      (err) => {
        assert(err instanceof APIVerveForecastError);
        assert.equal(err.code, 'KEY_NOT_CONFIGURED');
        assert.equal(err.status, 503);
        return true;
      }
    );

    // Test 429 Rate limit
    global.fetch = async () => ({
      ok: false,
      status: 429,
      json: async () => ({
        error: 'APIVERVE_RATE_LIMITED',
        message: 'Rate limit exceeded',
      }),
    });

    await assert.rejects(
      async () => {
        await fetchLiveCycleForecast({
          lastPeriod: '2026-03-01',
          cycleLength: 28,
          periodLength: 5,
        });
      },
      (err) => {
        assert(err instanceof APIVerveForecastError);
        assert.equal(err.code, 'RATE_LIMITED');
        assert.equal(err.status, 429);
        return true;
      }
    );
  } finally {
    global.fetch = originalFetch;
  }
});

test('7. fetchLiveCycleForecast parses and returns verified API response', async () => {
  const originalFetch = global.fetch;

  try {
    const mockApiResponse = {
      status: 'ok',
      source: 'apiverve_live_api',
      data: {
        last_period_date: '2026-03-01',
        cycle_length: 28,
        period_length: 5,
        cycles_calculated: 1,
        cycles: [
          {
            cycle_number: 1,
            period: {
              start_date: '2026-03-29',
              end_date: '2026-04-02',
              duration_days: 5,
            },
            ovulation: {
              date: '2026-04-12',
              day_of_cycle: 14,
            },
            fertile_window: {
              start_date: '2026-04-07',
              end_date: '2026-04-13',
              duration_days: 7,
            },
          },
        ],
        disclaimer: 'Official APIVerve estimate.',
      },
    };

    global.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => mockApiResponse,
    });

    const result = await fetchLiveCycleForecast({
      lastPeriod: '2026-03-01',
      cycleLength: 28,
      periodLength: 5,
      cycles: 1,
    });

    assert.equal(result.status, 'ok');
    assert.equal(result.data.last_period_date, '2026-03-01');
    assert.equal(result.data.cycles.length, 1);
    assert.equal(result.data.cycles[0].period.start_date, '2026-03-29');
    assert.equal(result.data.cycles[0].ovulation.date, '2026-04-12');
  } finally {
    global.fetch = originalFetch;
  }
});

test('8. StorageService correctly persists, retrieves, and deletes APIVerve forecasts', () => {
  const store = new Map();
  const prevWindow = global.window;
  global.window = {
    localStorage: {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    },
    dispatchEvent: () => {},
  };

  try {
    StorageService.clearApiVerveForecasts();
    assert.equal(StorageService.getApiVerveForecasts().length, 0);

    const saved1 = StorageService.saveApiVerveForecast({
      requestInputs: { lastPeriod: '2026-03-01', cycleLength: 28, periodLength: 5, cycles: 3 },
      responseData: { last_period_date: '2026-03-01', cycles: [] },
    });

    assert(saved1.id.startsWith('apv-forecast-'));
    assert.equal(StorageService.getApiVerveForecasts().length, 1);

    const saved2 = StorageService.saveApiVerveForecast({
      requestInputs: { lastPeriod: '2026-04-01', cycleLength: 30, periodLength: 5, cycles: 3 },
      responseData: { last_period_date: '2026-04-01', cycles: [] },
    });

    assert.equal(StorageService.getApiVerveForecasts().length, 2);

    // Delete saved1
    const remaining = StorageService.deleteApiVerveForecast(saved1.id);
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].id, saved2.id);

    // Clear all
    StorageService.clearApiVerveForecasts();
    assert.equal(StorageService.getApiVerveForecasts().length, 0);
  } finally {
    global.window = prevWindow;
  }
});
