/**
 * Pure calculation utilities for menstrual cycle history, intervals, and validation.
 * 
 * Clinical Reference:
 * - ACOG (American College of Obstetricians and Gynecologists)
 * - FIGO (International Federation of Gynecology and Obstetrics)
 * - Normal cycle length: 21 to 35 days (adults), 21 to 45 days (adolescents within 3 years of menarche)
 * - Normal cycle variation: <= 7 to 9 days difference across cycles
 */

/**
 * Validates whether a date string is in valid YYYY-MM-DD format and is a real calendar date.
 * @param {string} dateStr 
 * @returns {boolean}
 */
export function isValidDateString(dateStr) {
  if (typeof dateStr !== 'string') return false;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Calculates day difference between two YYYY-MM-DD dates (d2 - d1).
 * Positive if d2 is after d1.
 * @param {string} d1
 * @param {string} d2
 * @returns {number | null}
 */
export function calculateDayDifference(d1, d2) {
  if (!isValidDateString(d1) || !isValidDateString(d2)) return null;
  const t1 = Date.parse(`${d1}T00:00:00Z`);
  const t2 = Date.parse(`${d2}T00:00:00Z`);
  if (isNaN(t1) || isNaN(t2)) return null;
  return Math.round((t2 - t1) / (1000 * 60 * 60 * 24));
}

/**
 * Adds a specific number of days to a YYYY-MM-DD date.
 * @param {string} dateStr
 * @param {number} days
 * @returns {string} YYYY-MM-DD
 */
export function addDaysToDate(dateStr, days) {
  if (!isValidDateString(dateStr)) return '';
  const date = new Date(Date.parse(`${dateStr}T00:00:00Z`));
  date.setUTCDate(date.getUTCDate() + Math.round(days));
  return date.toISOString().slice(0, 10);
}

/**
 * Formats a YYYY-MM-DD date into human-readable string (e.g. "Oct 12, 2026").
 * @param {string} dateStr
 * @param {string} [locale='en-US']
 * @returns {string}
 */
export function formatDisplayDate(dateStr, locale = 'en-US') {
  if (!isValidDateString(dateStr)) return dateStr || 'Unknown date';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Sorts cycle entries chronologically (oldest to newest by default, or newest to oldest).
 * @param {Array} entries
 * @param {'asc' | 'desc'} [direction='asc']
 * @returns {Array}
 */
export function sortCycleEntries(entries = [], direction = 'asc') {
  if (!Array.isArray(entries)) return [];
  return [...entries].sort((a, b) => {
    const dateA = a.startDate || a.date || '';
    const dateB = b.startDate || b.date || '';
    return direction === 'asc'
      ? dateA.localeCompare(dateB)
      : dateB.localeCompare(dateA);
  });
}

/**
 * Computes consecutive cycle lengths from an array of period start dates.
 * 
 * Given dates: D1, D2, D3 (sorted ascending)
 * Cycle 1: length = D2 - D1
 * Cycle 2: length = D3 - D2
 * 
 * @param {Array} rawEntries - Array of objects with startDate or date string
 * @returns {Array<{ id: string, startDate: string, endDate: string, cycleLengthDays: number, rawEntry: Object }>}
 */
export function computeCycleIntervals(rawEntries = []) {
  const valid = rawEntries
    .filter((e) => e && isValidDateString(e.startDate || e.date))
    .map((e) => ({
      ...e,
      startDate: (e.startDate || e.date).trim(),
    }));

  // Deduplicate by startDate keeping latest created
  const uniqueMap = new Map();
  for (const entry of valid) {
    if (!uniqueMap.has(entry.startDate) || (entry.timestamp && entry.timestamp > (uniqueMap.get(entry.startDate).timestamp || ''))) {
      uniqueMap.set(entry.startDate, entry);
    }
  }

  const sorted = [...uniqueMap.values()].sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (sorted.length < 2) return [];

  const intervals = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];
    const diff = calculateDayDifference(current.startDate, next.startDate);

    if (diff !== null && diff > 0) {
      intervals.push({
        id: `interval-${current.startDate}-${next.startDate}`,
        startDate: current.startDate,
        endDate: next.startDate,
        cycleLengthDays: diff,
        periodDurationDays: current.periodDurationDays || null,
        flowLevel: current.flowLevel || 'medium',
        painScore: typeof current.painScore === 'number' ? current.painScore : 0,
        notes: current.notes || current.note || '',
        rawEntry: current,
      });
    }
  }

  return intervals;
}

/**
 * Computes comprehensive statistical summary over historical cycle intervals.
 * @param {Array} intervals - Output of computeCycleIntervals
 * @returns {Object}
 */
export function computeCycleStats(intervals = []) {
  if (!Array.isArray(intervals) || intervals.length === 0) {
    return {
      totalCycles: 0,
      averageCycleLength: null,
      medianCycleLength: null,
      shortestCycle: null,
      longestCycle: null,
      variationDays: null,
      standardDeviation: null,
      cycleLengths: [],
      hasSufficientData: false,
    };
  }

  const lengths = intervals.map((i) => i.cycleLengthDays).filter((n) => typeof n === 'number' && n > 0);
  if (lengths.length === 0) {
    return {
      totalCycles: 0,
      averageCycleLength: null,
      medianCycleLength: null,
      shortestCycle: null,
      longestCycle: null,
      variationDays: null,
      standardDeviation: null,
      cycleLengths: [],
      hasSufficientData: false,
    };
  }

  const sum = lengths.reduce((acc, val) => acc + val, 0);
  const avg = Math.round((sum / lengths.length) * 10) / 10;
  const shortest = Math.min(...lengths);
  const longest = Math.max(...lengths);
  const variation = longest - shortest;

  // Median
  const sortedLengths = [...lengths].sort((a, b) => a - b);
  const mid = Math.floor(sortedLengths.length / 2);
  const median = sortedLengths.length % 2 !== 0
    ? sortedLengths[mid]
    : Math.round(((sortedLengths[mid - 1] + sortedLengths[mid]) / 2) * 10) / 10;

  // Standard deviation
  const variance = lengths.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / lengths.length;
  const stdDev = Math.round(Math.sqrt(variance) * 10) / 10;

  return {
    totalCycles: lengths.length,
    averageCycleLength: avg,
    medianCycleLength: median,
    shortestCycle: shortest,
    longestCycle: longest,
    variationDays: variation,
    standardDeviation: stdDev,
    cycleLengths: lengths,
    hasSufficientData: lengths.length >= 3,
  };
}

/**
 * Validates a new cycle entry before persisting.
 * Checks date validity, duplicates against existing records, and reasonable ranges.
 * 
 * @param {Object} newEntry - { startDate, ... }
 * @param {Array} existingEntries - Array of existing cycle entries
 * @param {string} [editingId] - Optional entry ID currently being updated
 * @returns {{ isValid: boolean, error?: string, warning?: string }}
 */
export function validateCycleEntryInput(newEntry, existingEntries = [], editingId = null) {
  if (!newEntry || !newEntry.startDate) {
    return { isValid: false, error: 'Please choose a period start date.' };
  }

  const trimmedDate = newEntry.startDate.trim();
  if (!isValidDateString(trimmedDate)) {
    return { isValid: false, error: 'Invalid date format. Please use a valid calendar date.' };
  }

  // Prevent dates excessively in the future (> 30 days)
  const today = new Date().toISOString().slice(0, 10);
  const daysFromToday = calculateDayDifference(today, trimmedDate);
  if (daysFromToday !== null && daysFromToday > 1) {
    return { isValid: false, error: 'Period start date cannot be set in the future.' };
  }

  // Prevent dates older than 5 years
  if (daysFromToday !== null && daysFromToday < -1825) {
    return { isValid: false, error: 'Date is older than 5 years. Please enter recent period logs.' };
  }

  // Duplicate check
  const duplicate = existingEntries.find((e) => {
    const existingDate = (e.startDate || e.date || '').trim();
    const isDifferentId = editingId ? e.id !== editingId : true;
    return isDifferentId && existingDate === trimmedDate;
  });

  if (duplicate) {
    return {
      isValid: false,
      error: `A period log already exists for ${formatDisplayDate(trimmedDate)}. Please choose a different date or edit that entry.`,
    };
  }

  // Soft warning if another period is very close (e.g. < 10 days)
  let warning = null;
  const closeEntry = existingEntries.find((e) => {
    const existingDate = (e.startDate || e.date || '').trim();
    const isDifferentId = editingId ? e.id !== editingId : true;
    if (!isDifferentId || !isValidDateString(existingDate)) return false;
    const diff = Math.abs(calculateDayDifference(existingDate, trimmedDate) || 999);
    return diff > 0 && diff < 10;
  });

  if (closeEntry) {
    warning = 'Note: This period date is less than 10 days from an existing entry. If this was spotting or mid-cycle bleeding, make a note in the description.';
  }

  return { isValid: true, warning };
}
