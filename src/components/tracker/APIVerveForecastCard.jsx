import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Heart,
  CalendarDays,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Info,
  ChevronRight,
  History,
} from 'lucide-react';
import {
  fetchLiveCycleForecast,
  validateForecastInputs,
  APIVerveForecastError,
} from '../../services/apiverveClient.js';
import { StorageService } from '../../services/storageService.js';
import { formatDisplayDate } from '../../services/cycleCalculations.js';

export function APIVerveForecastCard() {
  // Form State
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [cycles, setCycles] = useState(3);

  // Validation & Request State
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Active Forecast & History
  const [forecastResult, setForecastResult] = useState(null);
  const [forecastHistory, setForecastHistory] = useState(() => StorageService.getApiVerveForecasts());
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  // Refresh history on custom storage events
  useEffect(() => {
    const handleStorageChange = () => {
      setForecastHistory(StorageService.getApiVerveForecasts());
    };
    window.addEventListener('pcos_saathi:data_change', handleStorageChange);
    return () => window.removeEventListener('pcos_saathi:data_change', handleStorageChange);
  }, []);

  // Demo Example loader
  const handleLoadDemo = () => {
    // Populate realistic demo values: 1st of current month
    const demoDate = new Date();
    demoDate.setDate(1);
    const yyyy = demoDate.getFullYear();
    const mm = String(demoDate.getMonth() + 1).padStart(2, '0');
    const dd = String(demoDate.getDate()).padStart(2, '0');

    setLastPeriod(`${yyyy}-${mm}-${dd}`);
    setCycleLength(28);
    setPeriodLength(5);
    setCycles(3);
    setValidationErrors({});
    setApiError(null);
  };

  // Submit Handler
  const handleCalculate = async (e) => {
    if (e) e.preventDefault();

    const validation = validateForecastInputs({
      lastPeriod,
      cycleLength,
      periodLength,
      cycles,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    setApiError(null);
    setIsLoading(true);

    try {
      const response = await fetchLiveCycleForecast({
        lastPeriod,
        cycleLength,
        periodLength,
        cycles,
      });

      setForecastResult(response);

      // Persist in forecast history
      const saved = StorageService.saveApiVerveForecast({
        requestInputs: {
          lastPeriod,
          cycleLength: Number(cycleLength),
          periodLength: Number(periodLength),
          cycles: Number(cycles),
        },
        responseData: response.data,
      });
      setSelectedHistoryId(saved.id);
      setForecastHistory(StorageService.getApiVerveForecasts());
    } catch (err) {
      console.error('APIVerve Forecast error:', err);
      setApiError({
        message: err.message || 'An unexpected error occurred while communicating with APIVerve.',
        code: err.code || 'UNKNOWN_ERROR',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // History handlers
  const handleSelectHistory = (item) => {
    setSelectedHistoryId(item.id);
    setLastPeriod(item.requestInputs.lastPeriod);
    setCycleLength(item.requestInputs.cycleLength);
    setPeriodLength(item.requestInputs.periodLength);
    setCycles(item.requestInputs.cycles || 3);
    setForecastResult({
      status: 'ok',
      source: 'apiverve_live_api',
      data: item.responseData,
    });
    setApiError(null);
  };

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    const updated = StorageService.deleteApiVerveForecast(id);
    setForecastHistory(updated);
    if (selectedHistoryId === id) {
      setSelectedHistoryId(null);
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Delete all saved forecast history?')) {
      StorageService.clearApiVerveForecasts();
      setForecastHistory([]);
      setSelectedHistoryId(null);
    }
  };

  const activeCycles = forecastResult?.data?.cycles || [];
  const primaryCycle = activeCycles[0];

  return (
    <div className="space-y-6">
      {/* Input Form Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-rose-600" />
            <h3 className="font-semibold text-stone-900 text-base">
              Forecast Input Parameters
            </h3>
          </div>

          <button
            type="button"
            onClick={handleLoadDemo}
            className="text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-200/70 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Load Demo Example</span>
          </button>
        </div>

        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Last Period Date */}
            <div>
              <label
                htmlFor="apv-last-period"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                First Day of Last Period <span className="text-rose-600">*</span>
              </label>
              <input
                id="apv-last-period"
                type="date"
                value={lastPeriod}
                onChange={(e) => {
                  setLastPeriod(e.target.value);
                  if (validationErrors.lastPeriod) {
                    setValidationErrors((prev) => ({ ...prev, lastPeriod: null }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 ${
                  validationErrors.lastPeriod
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-stone-300'
                }`}
                required
              />
              {validationErrors.lastPeriod ? (
                <p className="text-[11px] text-rose-600 mt-1">{validationErrors.lastPeriod}</p>
              ) : (
                <p className="text-[10px] text-stone-400 mt-1">Starting date of most recent bleeding</p>
              )}
            </div>

            {/* 2. Average Cycle Length */}
            <div>
              <label
                htmlFor="apv-cycle-length"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Avg Cycle Length (Days) <span className="text-rose-600">*</span>
              </label>
              <input
                id="apv-cycle-length"
                type="number"
                min="21"
                max="35"
                value={cycleLength}
                onChange={(e) => {
                  setCycleLength(e.target.value);
                  if (validationErrors.cycleLength) {
                    setValidationErrors((prev) => ({ ...prev, cycleLength: null }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 ${
                  validationErrors.cycleLength
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-stone-300'
                }`}
                required
              />
              {validationErrors.cycleLength ? (
                <p className="text-[11px] text-rose-600 mt-1">{validationErrors.cycleLength}</p>
              ) : (
                <p className="text-[10px] text-stone-400 mt-1">Allowed range: 21 to 35 days (default 28)</p>
              )}
            </div>

            {/* 3. Average Period Duration */}
            <div>
              <label
                htmlFor="apv-period-length"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Avg Bleeding Duration (Days) <span className="text-rose-600">*</span>
              </label>
              <input
                id="apv-period-length"
                type="number"
                min="2"
                max="10"
                value={periodLength}
                onChange={(e) => {
                  setPeriodLength(e.target.value);
                  if (validationErrors.periodLength) {
                    setValidationErrors((prev) => ({ ...prev, periodLength: null }));
                  }
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs text-stone-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 ${
                  validationErrors.periodLength
                    ? 'border-rose-400 bg-rose-50/30'
                    : 'border-stone-300'
                }`}
                required
              />
              {validationErrors.periodLength ? (
                <p className="text-[11px] text-rose-600 mt-1">{validationErrors.periodLength}</p>
              ) : (
                <p className="text-[10px] text-stone-400 mt-1">Allowed range: 2 to 10 days (default 5)</p>
              )}
            </div>

            {/* 4. Number of Cycles to Forecast */}
            <div>
              <label
                htmlFor="apv-cycles-count"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Upcoming Cycles to Project
              </label>
              <select
                id="apv-cycles-count"
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20"
              >
                <option value={1}>1 upcoming cycle</option>
                <option value={2}>2 upcoming cycles</option>
                <option value={3}>3 upcoming cycles (recommended)</option>
                <option value={6}>6 upcoming cycles</option>
                <option value={12}>12 upcoming cycles (1 year)</option>
              </select>
              <p className="text-[10px] text-stone-400 mt-1">Multi-cycle calendar projection</p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-2 shadow-xs ${
                isLoading
                  ? 'bg-rose-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-700 active:scale-98'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calling APIVerve Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Calculate Forecast</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error State Banner */}
      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Unable to Complete Forecast Calculation</p>
              <p className="text-rose-700">{apiError.message}</p>
              <p className="text-[11px] text-rose-600/80">
                Code: <code className="font-mono bg-rose-100 px-1 py-0.5 rounded">{apiError.code}</code>. Note: PCOS Saathi never invents fabricated calculations when the official API fails.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleCalculate}
              className="text-xs font-semibold text-rose-700 bg-white hover:bg-rose-100 px-3 py-1 rounded-lg border border-rose-300 transition-colors"
            >
              Retry Request
            </button>
          </div>
        </div>
      )}

      {/* Active Results Display */}
      {forecastResult && primaryCycle && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Next Period */}
            <div className="bg-gradient-to-br from-rose-50/90 to-white rounded-2xl p-4 border border-rose-200/70 shadow-xs relative">
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block mb-1">
                Estimated Next Period
              </span>
              <div className="text-xl font-bold text-stone-900 tracking-tight">
                {formatDisplayDate(primaryCycle.period.start_date)}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Window: {formatDisplayDate(primaryCycle.period.start_date)} – {formatDisplayDate(primaryCycle.period.end_date)}
              </p>
              <div className="mt-2 text-[11px] font-medium text-rose-700 inline-block bg-rose-100/70 px-2 py-0.5 rounded-full">
                Duration: {primaryCycle.period.duration_days} days
              </div>
            </div>

            {/* Card 2: Ovulation */}
            <div className="bg-gradient-to-br from-purple-50/90 to-white rounded-2xl p-4 border border-purple-200/70 shadow-xs relative">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                Estimated Ovulation Day
              </span>
              <div className="text-xl font-bold text-stone-900 tracking-tight">
                {formatDisplayDate(primaryCycle.ovulation.date)}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Estimated cycle day: <strong className="text-stone-800">Day {primaryCycle.ovulation.day_of_cycle}</strong>
              </p>
              <div className="mt-2 text-[11px] font-medium text-purple-700 inline-block bg-purple-100/70 px-2 py-0.5 rounded-full">
                Mid-Cycle Phase
              </div>
            </div>

            {/* Card 3: Fertile Window */}
            <div className="bg-gradient-to-br from-amber-50/90 to-white rounded-2xl p-4 border border-amber-200/70 shadow-xs relative">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                Estimated Fertile Window
              </span>
              <div className="text-xl font-bold text-stone-900 tracking-tight">
                {formatDisplayDate(primaryCycle.fertile_window.start_date)}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Through {formatDisplayDate(primaryCycle.fertile_window.end_date)} ({primaryCycle.fertile_window.duration_days} days)
              </p>
              <div className="mt-2 text-[11px] font-medium text-amber-800 inline-block bg-amber-100/70 px-2 py-0.5 rounded-full">
                Highest Conception Probability
              </div>
            </div>
          </div>

          {/* Plain English Summary Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-stone-500" />
              <h4 className="font-semibold text-stone-900 text-sm">
                Forecast Summary & Interpretation
              </h4>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              Based on your recorded last period date of{' '}
              <strong className="text-stone-900">{formatDisplayDate(forecastResult.data.last_period_date)}</strong>,
              an average cycle length of <strong className="text-stone-900">{forecastResult.data.cycle_length} days</strong>,
              and a period duration of <strong className="text-stone-900">{forecastResult.data.period_length} days</strong>:
            </p>

            <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-5">
              <li>
                Your next cycle (Cycle 1) is estimated to start on{' '}
                <strong className="text-stone-900">{formatDisplayDate(primaryCycle.period.start_date)}</strong> and
                conclude bleeding on <strong className="text-stone-900">{formatDisplayDate(primaryCycle.period.end_date)}</strong>.
              </li>
              <li>
                Ovulation is projected for cycle day {primaryCycle.ovulation.day_of_cycle} on{' '}
                <strong className="text-stone-900">{formatDisplayDate(primaryCycle.ovulation.date)}</strong>.
              </li>
              <li>
                The fertile window spans from{' '}
                <strong className="text-stone-900">{formatDisplayDate(primaryCycle.fertile_window.start_date)}</strong> to{' '}
                <strong className="text-stone-900">{formatDisplayDate(primaryCycle.fertile_window.end_date)}</strong>.
              </li>
            </ul>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60 text-[11px] text-stone-500">
              {forecastResult.data.disclaimer ||
                'This information is an estimate based on mathematical cycle calculations. Individual cycles may vary depending on hormones, stress, and lifestyle.'}
            </div>
          </div>

          {/* Multi-Cycle Projections Table */}
          {activeCycles.length > 1 && (
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-rose-600" />
                  <span>{activeCycles.length}-Cycle Forward Projections</span>
                </h4>
                <span className="text-[11px] text-stone-400">APIVerve Multi-Cycle Data</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-700">
                  <thead className="bg-stone-50 text-stone-500 text-[11px] uppercase font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Cycle</th>
                      <th className="py-2.5 px-3">Period Window</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Fertile Window</th>
                      <th className="py-2.5 px-3">Ovulation Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeCycles.map((c) => (
                      <tr key={c.cycle_number} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-3 px-3 font-semibold text-stone-900">
                          Cycle #{c.cycle_number}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-rose-700">
                            {formatDisplayDate(c.period.start_date)}
                          </span>
                          <span className="text-stone-400 mx-1">→</span>
                          <span>{formatDisplayDate(c.period.end_date)}</span>
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          {c.period.duration_days} days
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-amber-700 font-medium">
                            {formatDisplayDate(c.fertile_window.start_date)}
                          </span>
                          <span className="text-stone-400 mx-1">→</span>
                          <span>{formatDisplayDate(c.fertile_window.end_date)}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium border border-purple-200/60">
                            {formatDisplayDate(c.ovulation.date)} (Day {c.ovulation.day_of_cycle})
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Color Legend & Medical Safety Notice */}
          <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-200/50 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[11px] font-semibold text-stone-700">Color Reference:</span>
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Period Phase</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Fertile Window</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px]">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Ovulation Peak</span>
              </span>
            </div>

            <p className="text-[11px] text-stone-500 pt-1 border-t border-rose-200/40">
              <strong className="text-stone-700">Medical Safety & Non-Diagnostic Disclosure:</strong>{' '}
              APIVerve provides mathematical cycle estimates based on standard clinical averages. It is not an artificial intelligence model, machine-learning classifier, or diagnostic tool, and does not evaluate irregular cycle causes such as PCOS, thyroid disorders, or anovulation. Please consult your physician for individualized reproductive healthcare.
            </p>
          </div>
        </div>
      )}

      {/* Forecast History Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-stone-600" />
            <h3 className="font-semibold text-stone-900 text-sm">
              Saved Forecast History ({forecastHistory.length})
            </h3>
          </div>

          {forecastHistory.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllHistory}
              className="text-[11px] font-medium text-stone-500 hover:text-rose-600 transition-colors"
            >
              Clear All History
            </button>
          )}
        </div>

        {forecastHistory.length === 0 ? (
          <p className="text-xs text-stone-400 py-3 text-center">
            No previous calculations saved on this device. Future calculations will appear here.
          </p>
        ) : (
          <div className="divide-y divide-stone-100">
            {forecastHistory.map((item) => {
              const firstCycle = item.responseData?.cycles?.[0];
              const isSelected = selectedHistoryId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectHistory(item)}
                  className={`py-3 px-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-rose-50/70 border border-rose-200/60' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900">
                        Last Period: {formatDisplayDate(item.requestInputs.lastPeriod)}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        ({item.requestInputs.cycleLength}d cycle / {item.requestInputs.periodLength}d bleed)
                      </span>
                    </div>
                    {firstCycle && (
                      <p className="text-[11px] text-stone-600">
                        Projected: <span className="font-medium text-rose-700">{formatDisplayDate(firstCycle.period.start_date)}</span>
                        {' • '}Ovulation: <span className="font-medium text-purple-700">{formatDisplayDate(firstCycle.ovulation.date)}</span>
                      </p>
                    )}
                    <p className="text-[10px] text-stone-400">
                      Calculated on {new Date(item.createdAt).toLocaleDateString()} at{' '}
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Delete record"
                      onClick={(e) => handleDeleteHistory(e, item.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-stone-300" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default APIVerveForecastCard;
