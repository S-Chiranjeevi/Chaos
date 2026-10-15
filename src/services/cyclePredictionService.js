/**
 * Cycle Prediction Service Architecture — PCOS Saathi
 * 
 * Provides an extensible prediction interface for menstrual cycle irregularity estimation.
 * 
 * ARCHITECTURAL DESIGN:
 * - `CyclePredictionService`: Abstract interface/base contract.
 * - `BaselineCyclePredictionService`: Deterministic clinical rule-based engine (current production).
 * - `XGBoostCyclePredictionService`: Future machine-learning model connector (ready for integration).
 * 
 * MEDICAL & SAFETY INVARIANTS:
 * 1. NEVER label a user as having PCOS based on cycle history alone.
 * 2. Clearly disclose rule-based nature; NEVER fabricate ML probabilities or confidence scores.
 * 3. Clinical criteria adhere to ACOG & FIGO guidelines.
 * 4. Zero prescription or drug dosage advice.
 */

import {
  computeCycleIntervals,
  computeCycleStats,
  addDaysToDate,
  calculateDayDifference,
  formatDisplayDate,
  isValidDateString,
} from './cycleCalculations.js';

export const MEDICAL_SAFETY_DISCLAIMER =
  'This cycle forecast and pattern assessment is an educational, rule-based observation based only on your entered dates. It is not a medical diagnosis of PCOS, pregnancy, or any reproductive condition. Menstrual cycles naturally vary due to stress, sleep, illness, and hormonal changes. Always consult a licensed gynecologist for persistent irregularities.';

export const CLINICAL_REFERENCES = [
  {
    source: 'American College of Obstetricians and Gynecologists (ACOG)',
    guideline: 'Practice Bulletin No. 128: Diagnosis of Abnormal Uterine Bleeding in Reproductive-Aged Women',
    standard: 'Normal cycle length in reproductive-aged adults is 21 to 35 days. Cycles exceeding 35 days are clinically defined as oligomenorrhea.',
  },
  {
    source: 'International Federation of Gynecology and Obstetrics (FIGO)',
    guideline: 'Munro MG, et al. The two FIGO systems for normal and abnormal uterine bleeding symptoms and classification of causes (2018)',
    standard: 'Normal cycle variability across a 12-month window is 7 to 9 days or less. Variation >= 8 to 10 days indicates irregular cycle patterns.',
  },
  {
    source: 'International PCOS Network / Monash University',
    guideline: 'International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome (2023)',
    standard: 'Irregular cycles are defined as >35 days or <21 days (or <8 cycles per year). Cycle irregularity alone is not sufficient for a diagnosis without clinical/biochemical hyperandrogenism or ultrasound morphology.',
  },
];

/**
 * Standard Prediction Result Object Specification.
 * Used identically by Baseline and future XGBoost engines.
 * 
 * @typedef {Object} PredictionResult
 * @property {'success' | 'insufficient_history' | 'error'} status
 * @property {'regular' | 'variable' | 'irregular' | 'insufficient_data'} irregularityCategory
 * @property {boolean | null} estimatedIrregularity
 * @property {null} confidenceScore - Explicitly null in current baseline; no fake ML confidence
 * @property {Object} uncertaintyInfo
 * @property {string} explanation
 * @property {string[]} dataQualityWarnings
 * @property {Object} expectedNextPeriod
 * @property {Object} stats
 * @property {string} modelVersion
 * @property {'rule_based' | 'ml_xgboost'} engineType
 * @property {string} disclaimer
 * @property {Array} clinicalReferences
 */

/**
 * Base abstract interface for cycle prediction engines.
 */
export class CyclePredictionService {
  /**
   * Predict cycle irregularity and forecast upcoming period window.
   * @param {Array} cycleEntries - Array of cycle logs [{ startDate, ... }]
   * @param {Object} [profileContext={}] - Optional age or context
   * @returns {Promise<PredictionResult> | PredictionResult}
   */
  predict(cycleEntries, profileContext = {}) {
    throw new Error('Method predict() must be implemented by concrete subclass.');
  }

  /**
   * Identifies the engine type.
   * @returns {string}
   */
  getEngineName() {
    return 'AbstractCyclePredictionService';
  }
}

/**
 * Production Baseline Implementation: Transparent, Explainable Clinical Rules Engine.
 * Conforms strictly to ACOG & FIGO clinical cycle criteria.
 */
export class BaselineCyclePredictionService extends CyclePredictionService {
  constructor(options = {}) {
    super();
    this.minCyclesForAnalysis = options.minCyclesForAnalysis || 1; // at least 2 period dates = 1 cycle length
    this.minCyclesForRobustIrregularity = options.minCyclesForRobustIrregularity || 3;
    this.version = 'baseline-clinical-rules-v1.0';
  }

  getEngineName() {
    return 'BaselineCyclePredictionService';
  }

  /**
   * Synchronously evaluate historical cycle logs using transparent clinical rules.
   * @param {Array} cycleEntries 
   * @param {Object} [profileContext={}] 
   * @returns {PredictionResult}
   */
  predict(cycleEntries = [], profileContext = {}) {
    const intervals = computeCycleIntervals(cycleEntries);
    const stats = computeCycleStats(intervals);

    // Filter valid dates sorted ascending
    const validDates = (Array.isArray(cycleEntries) ? cycleEntries : [])
      .map((e) => (e?.startDate || e?.date || '').trim())
      .filter(isValidDateString)
      .sort();

    const uniqueDates = [...new Set(validDates)];
    const dataQualityWarnings = [];

    // Check for empty or single date state
    if (uniqueDates.length < 2 || intervals.length === 0) {
      const singleDate = uniqueDates[0] || null;
      let expectedWindow = null;

      if (singleDate) {
        // Fallback default 28-day window when only 1 date recorded
        const estDate = addDaysToDate(singleDate, 28);
        const today = new Date().toISOString().slice(0, 10);
        const daysRemaining = calculateDayDifference(today, estDate);

        expectedWindow = {
          earliestDate: addDaysToDate(singleDate, 26),
          latestDate: addDaysToDate(singleDate, 30),
          mostLikelyDate: estDate,
          daysUntilWindow: daysRemaining,
          windowText: `${formatDisplayDate(addDaysToDate(singleDate, 26))} – ${formatDisplayDate(addDaysToDate(singleDate, 30))}`,
          isStandardEstimate: true,
        };
        dataQualityWarnings.push('Only 1 period start date recorded. Showing a preliminary estimate based on an average 28-day cycle until more entries are added.');
      } else {
        dataQualityWarnings.push('No period dates have been recorded yet. Log your first period date to begin tracking.');
      }

      return {
        status: 'insufficient_history',
        irregularityCategory: 'insufficient_data',
        estimatedIrregularity: null,
        confidenceScore: null,
        uncertaintyInfo: {
          description: 'At least 2 to 3 recorded menstrual cycles are required to detect regularity trends.',
          variationDays: null,
          standardDeviation: null,
          minimumCyclesRecommended: this.minCyclesForRobustIrregularity,
          hasSufficientData: false,
        },
        explanation: 'Insufficient history. Menstrual cycle patterns require multiple consecutive recorded cycles to distinguish natural day-to-day variability from true irregularity.',
        dataQualityWarnings,
        expectedNextPeriod: expectedWindow,
        stats,
        modelVersion: this.version,
        engineType: 'rule_based',
        disclaimer: MEDICAL_SAFETY_DISCLAIMER,
        clinicalReferences: CLINICAL_REFERENCES,
      };
    }

    // Check for large gaps (> 90 days between consecutive logs)
    const hasLongGaps = intervals.some((i) => i.cycleLengthDays > 90);
    if (hasLongGaps) {
      dataQualityWarnings.push(
        'One or more recorded intervals exceed 90 days. If you missed logging any periods during this window, add them to maintain accurate statistics.'
      );
    }

    // Check if under the robust threshold (< 3 cycles)
    if (intervals.length < this.minCyclesForRobustIrregularity) {
      dataQualityWarnings.push(
        `You have recorded ${intervals.length} cycle${intervals.length === 1 ? '' : 's'}. Regularity observations become significantly more reliable after 3 consecutive cycles.`
      );
    }

    const avg = stats.averageCycleLength;
    const variation = stats.variationDays;
    const hasLongCycles = intervals.some((i) => i.cycleLengthDays > 35);
    const hasShortCycles = intervals.some((i) => i.cycleLengthDays < 21);
    const highVariation = variation >= 8;

    // Clinical classification
    let irregularityCategory = 'regular';
    let estimatedIrregularity = false;
    let explanation = '';

    if (avg > 35 || hasLongCycles) {
      irregularityCategory = 'irregular';
      estimatedIrregularity = true;
      explanation = `Your recorded cycles average ${avg} days, with cycles extending past the standard 35-day clinical threshold (oligomenorrhea pattern). Cycle lengthening is common during ovulatory delays, stress, or hormonal shifts such as PCOS.`;
    } else if (avg < 21 || hasShortCycles) {
      irregularityCategory = 'irregular';
      estimatedIrregularity = true;
      explanation = `Your cycle history includes cycles under 21 days (polymenorrhea pattern). Frequent cycles should be evaluated by a healthcare provider.`;
    } else if (highVariation) {
      irregularityCategory = 'variable';
      estimatedIrregularity = true;
      explanation = `Your cycle lengths average ${avg} days (within the standard 21–35 day range), but vary by ${variation} days across cycles. A variation of 8 or more days is considered variable.`;
    } else {
      irregularityCategory = 'regular';
      estimatedIrregularity = false;
      explanation = `Your cycle lengths average ${avg} days with a low variation of ${variation} days. This pattern falls within typical clinical regularity parameters (21–35 days, <= 7 days variability).`;
    }

    // Calculate expected next period range
    const lastDate = uniqueDates[uniqueDates.length - 1];
    const today = new Date().toISOString().slice(0, 10);

    // Buffer range is dynamic based on user variation
    const buffer = Math.max(2, Math.min(6, Math.round(variation / 2)));
    const targetCenter = addDaysToDate(lastDate, avg);
    const earliest = addDaysToDate(targetCenter, -buffer);
    const latest = addDaysToDate(targetCenter, buffer);
    const daysUntil = calculateDayDifference(today, earliest);

    const expectedNextPeriod = {
      earliestDate: earliest,
      latestDate: latest,
      mostLikelyDate: targetCenter,
      daysUntilWindow: daysUntil,
      windowText: `${formatDisplayDate(earliest)} – ${formatDisplayDate(latest)}`,
      bufferDays: buffer,
      isStandardEstimate: false,
    };

    return {
      status: 'success',
      irregularityCategory,
      estimatedIrregularity,
      confidenceScore: null, // explicit: NO fabricated ML scores
      uncertaintyInfo: {
        description: `Natural biological variability for your recorded cycles is approximately ±${buffer} days (${variation} days total spread).`,
        variationDays: variation,
        standardDeviation: stats.standardDeviation,
        minimumCyclesRecommended: this.minCyclesForRobustIrregularity,
        hasSufficientData: intervals.length >= this.minCyclesForRobustIrregularity,
      },
      explanation,
      dataQualityWarnings,
      expectedNextPeriod,
      stats,
      modelVersion: this.version,
      engineType: 'rule_based',
      disclaimer: MEDICAL_SAFETY_DISCLAIMER,
      clinicalReferences: CLINICAL_REFERENCES,
    };
  }
}

/**
 * Future XGBoost Model Connector Interface.
 * 
 * DESIGN RATIONALE:
 * - Ready for seamless plug-in when a trained XGBoost Python artifact or REST endpoint is deployed.
 * - When no remote model endpoint is configured, it falls back cleanly to BaselineCyclePredictionService.
 * - Never pretends that a trained machine-learning model is active when it is not.
 */
export class XGBoostCyclePredictionService extends CyclePredictionService {
  constructor(options = {}) {
    super();
    this.endpoint = options.endpoint || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_XGBOOST_CYCLE_API_URL : null);
    this.fallbackService = new BaselineCyclePredictionService();
    this.version = 'xgboost-cycle-classifier-v0.1-stub';
  }

  getEngineName() {
    return this.isModelConfigured()
      ? 'XGBoostCyclePredictionService'
      : 'XGBoostCyclePredictionService (Fallback: Baseline)';
  }

  isModelConfigured() {
    return Boolean(this.endpoint && this.endpoint.trim());
  }

  /**
   * If remote XGBoost model endpoint is reachable, call it; otherwise delegate safely to baseline rules.
   * @param {Array} cycleEntries 
   * @param {Object} [profileContext={}] 
   * @returns {Promise<PredictionResult>}
   */
  async predict(cycleEntries = [], profileContext = {}) {
    // When no external trained ML endpoint is configured, use baseline clinical rules
    if (!this.isModelConfigured()) {
      const baselineResult = this.fallbackService.predict(cycleEntries, profileContext);
      return {
        ...baselineResult,
        modelVersion: `${this.version}+fallback(${baselineResult.modelVersion})`,
        dataQualityWarnings: [
          ...baselineResult.dataQualityWarnings,
          'Note: Real XGBoost model endpoint is not configured. Evaluated using transparent clinical rules.',
        ],
      };
    }

    // Future XGBoost HTTP Integration Protocol
    try {
      const intervals = computeCycleIntervals(cycleEntries);
      const stats = computeCycleStats(intervals);

      // Standardized Feature Vector specification for Python/XGBoost:
      const featurePayload = {
        age: profileContext.age || null,
        total_cycles_recorded: stats.totalCycles,
        average_cycle_length: stats.averageCycleLength,
        min_cycle_length: stats.shortestCycle,
        max_cycle_length: stats.longestCycle,
        cycle_variation: stats.variationDays,
        recent_cycle_lengths: stats.cycleLengths.slice(-6),
        average_pain_score: intervals.length > 0
          ? intervals.reduce((acc, i) => acc + (i.painScore || 0), 0) / intervals.length
          : 0,
      };

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(featurePayload),
      });

      if (!response.ok) {
        throw new Error(`XGBoost service responded with status ${response.status}`);
      }

      const mlData = await response.json();
      return {
        status: 'success',
        irregularityCategory: mlData.irregularityCategory || 'variable',
        estimatedIrregularity: Boolean(mlData.estimatedIrregularity),
        confidenceScore: mlData.calibratedProbability || null,
        uncertaintyInfo: mlData.uncertaintyInfo || { description: 'Model prediction calibrated.' },
        explanation: mlData.explanation || 'Prediction generated by trained XGBoost classification model.',
        dataQualityWarnings: mlData.warnings || [],
        expectedNextPeriod: mlData.expectedNextPeriod || null,
        stats,
        modelVersion: mlData.modelVersion || 'xgboost-deployed-v1.0',
        engineType: 'ml_xgboost',
        disclaimer: MEDICAL_SAFETY_DISCLAIMER,
        clinicalReferences: CLINICAL_REFERENCES,
      };
    } catch (err) {
      console.warn('XGBoost prediction service unreachable; reverting to baseline clinical rules:', err.message);
      const fallbackResult = this.fallbackService.predict(cycleEntries, profileContext);
      return {
        ...fallbackResult,
        modelVersion: `${this.version}+error_fallback`,
        dataQualityWarnings: [
          ...fallbackResult.dataQualityWarnings,
          'XGBoost model service currently unreachable; safely fell back to clinical rules.',
        ],
      };
    }
  }
}

// Default export: singleton instance of BaselineCyclePredictionService
export const defaultPredictionService = new BaselineCyclePredictionService();
