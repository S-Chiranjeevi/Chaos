/**
 * Client service for calling the server-side APIVerve Menstrual Cycle Forecast endpoint.
 *
 * Invariants:
 * - The secret API key is NEVER stored or sent from this client code.
 * - Always calls the backend endpoint (/api/cycle/apiverve-forecast).
 * - Validates inputs on client-side before sending.
 * - Never returns fabricated results when the API call fails or is unavailable.
 * - Throws structured APIVerveForecastError with actionable messages.
 */

export class APIVerveForecastError extends Error {
  constructor(message, code = 'FORECAST_ERROR', status = null) {
    super(message);
    this.name = 'APIVerveForecastError';
    this.code = code;
    this.status = status;
  }
}

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates input parameters strictly before making a network call.
 * Rejects invalid dates, impossible durations, and non-numeric entries.
 */
export function validateForecastInputs({ lastPeriod, cycleLength, periodLength, cycles = 3 }) {
  const errors = {};

  // 1. Validate last period date
  if (!lastPeriod || typeof lastPeriod !== 'string') {
    errors.lastPeriod = 'First day of last period is required.';
  } else {
    const trimmed = lastPeriod.trim();
    if (!DATE_REGEX.test(trimmed)) {
      errors.lastPeriod = 'Date must be in YYYY-MM-DD format.';
    } else {
      const parsed = new Date(trimmed + 'T00:00:00Z');
      if (isNaN(parsed.getTime())) {
        errors.lastPeriod = 'Invalid calendar date.';
      } else {
        const year = parsed.getUTCFullYear();
        if (year < 1900 || year > 2100) {
          errors.lastPeriod = 'Date year is outside a valid range.';
        }
      }
    }
  }

  // 2. Validate cycle length (APIVerve range: 21 to 35)
  const cLen = Number(cycleLength);
  if (isNaN(cLen) || !Number.isInteger(cLen)) {
    errors.cycleLength = 'Average cycle length must be an integer number of days.';
  } else if (cLen < 21 || cLen > 35) {
    errors.cycleLength = 'Average cycle length must be between 21 and 35 days for standard forecast.';
  }

  // 3. Validate period length (APIVerve range: 2 to 10)
  const pLen = Number(periodLength);
  if (isNaN(pLen) || !Number.isInteger(pLen)) {
    errors.periodLength = 'Period duration must be an integer number of days.';
  } else if (pLen < 2 || pLen > 10) {
    errors.periodLength = 'Period duration must be between 2 and 10 days.';
  }

  // 4. Validate number of cycles (APIVerve range: 1 to 12)
  const nCycles = Number(cycles);
  if (isNaN(nCycles) || !Number.isInteger(nCycles) || nCycles < 1 || nCycles > 12) {
    errors.cycles = 'Number of forecast cycles must be between 1 and 12.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calls the backend APIVerve forecast endpoint.
 *
 * @param {Object} params
 * @param {string} params.lastPeriod - YYYY-MM-DD
 * @param {number} params.cycleLength - Integer 21-35
 * @param {number} params.periodLength - Integer 2-10
 * @param {number} [params.cycles=3] - Integer 1-12
 * @param {AbortSignal} [params.signal] - Optional fetch abort signal
 * @returns {Promise<Object>} APIVerve forecast result
 */
export async function fetchLiveCycleForecast({
  lastPeriod,
  cycleLength = 28,
  periodLength = 5,
  cycles = 3,
  signal,
}) {
  const validation = validateForecastInputs({ lastPeriod, cycleLength, periodLength, cycles });
  if (!validation.isValid) {
    const firstMsg = Object.values(validation.errors)[0];
    throw new APIVerveForecastError(firstMsg, 'INVALID_INPUT', 400);
  }

  const payload = {
    last_period: lastPeriod.trim(),
    cycle_length: Number(cycleLength),
    period_length: Number(periodLength),
    cycles: Number(cycles),
  };

  const endpoint = '/api/cycle/apiverve-forecast';

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new APIVerveForecastError(
      'Could not connect to the backend server. Please verify the backend service is running.',
      'NETWORK_ERROR',
      null
    );
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw new APIVerveForecastError(
      'Backend returned an unparseable response.',
      'INVALID_RESPONSE',
      response.status
    );
  }

  if (!response.ok) {
    const errorDetail = body?.detail || body?.message || body?.error || 'Unknown error';
    const detailMsg = typeof errorDetail === 'object' ? errorDetail.message || JSON.stringify(errorDetail) : String(errorDetail);

    if (response.status === 503) {
      throw new APIVerveForecastError(
        'APIVerve API key is not configured on the server. Please add APIVERVE_API_KEY to your backend .env file.',
        'KEY_NOT_CONFIGURED',
        503
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new APIVerveForecastError(
        'APIVerve authentication failed. Please check that the API key is active and valid.',
        'AUTH_ERROR',
        response.status
      );
    }
    if (response.status === 429) {
      throw new APIVerveForecastError(
        'APIVerve rate limit or monthly credit quota exceeded. Please check your account quota.',
        'RATE_LIMITED',
        429
      );
    }
    if (response.status === 422 || response.status === 400) {
      throw new APIVerveForecastError(
        `Invalid input: ${detailMsg}`,
        'BAD_REQUEST',
        response.status
      );
    }

    throw new APIVerveForecastError(
      `Forecast service error (${response.status}): ${detailMsg}`,
      'UPSTREAM_ERROR',
      response.status
    );
  }

  // Validate response contract
  if (!body || body.status !== 'ok' || !body.data || !Array.isArray(body.data.cycles)) {
    throw new APIVerveForecastError(
      'APIVerve returned incomplete or unexpected forecast data structure.',
      'UNEXPECTED_DATA',
      200
    );
  }

  return body;
}
