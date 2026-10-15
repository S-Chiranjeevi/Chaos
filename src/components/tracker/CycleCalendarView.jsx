import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from 'lucide-react';
import { isValidDateString, formatDisplayDate } from '../../services/cycleCalculations.js';

export function CycleCalendarView({ entries = [], expectedWindow = null, apiverveCycles = [] }) {
  const [currentDate, setCurrentDate] = useState(() => {
    // If entries exist, start at the month of the latest entry or today
    const valid = entries.filter((e) => isValidDateString(e.startDate || e.date));
    if (valid.length > 0) {
      const sorted = [...valid].sort((a, b) => (b.startDate || b.date).localeCompare(a.startDate || a.date));
      const latest = sorted[0].startDate || sorted[0].date;
      return new Date(Date.parse(`${latest}T00:00:00Z`));
    }
    // If apiverveCycles has dates, start from first forecast cycle
    if (apiverveCycles && apiverveCycles.length > 0 && apiverveCycles[0]?.period?.start_date) {
      return new Date(Date.parse(`${apiverveCycles[0].period.start_date}T00:00:00Z`));
    }
    return new Date();
  });

  const year = currentDate.getUTCFullYear();
  const month = currentDate.getUTCMonth(); // 0 to 11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Set of logged period start dates
  const periodDatesSet = new Set(
    entries
      .map((e) => (e.startDate || e.date || '').trim())
      .filter(isValidDateString)
  );

  // Set of logged flow range dates (if periodDurationDays is set)
  const periodFlowDatesSet = new Set();
  for (const entry of entries) {
    const sDate = entry.startDate || entry.date;
    if (isValidDateString(sDate) && entry.periodDurationDays && entry.periodDurationDays > 1) {
      const d = new Date(Date.parse(`${sDate}T00:00:00Z`));
      for (let i = 1; i < Math.min(10, entry.periodDurationDays); i++) {
        d.setUTCDate(d.getUTCDate() + 1);
        periodFlowDatesSet.add(d.toISOString().slice(0, 10));
      }
    }
  }

  // Set of dates in the upcoming forecast window (baseline rules)
  const forecastDatesSet = new Set();
  if (expectedWindow && expectedWindow.earliestDate && expectedWindow.latestDate) {
    const d1 = new Date(Date.parse(`${expectedWindow.earliestDate}T00:00:00Z`));
    const d2 = new Date(Date.parse(`${expectedWindow.latestDate}T00:00:00Z`));
    const cur = new Date(d1);
    while (cur <= d2) {
      forecastDatesSet.add(cur.toISOString().slice(0, 10));
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }

  // Sets for APIVerve forecast dates
  const apvPeriodDatesSet = new Set();
  const apvFertileDatesSet = new Set();
  const apvOvulationDatesSet = new Set();

  if (Array.isArray(apiverveCycles)) {
    for (const c of apiverveCycles) {
      if (c?.period?.start_date && c?.period?.end_date) {
        const cur = new Date(Date.parse(`${c.period.start_date}T00:00:00Z`));
        const end = new Date(Date.parse(`${c.period.end_date}T00:00:00Z`));
        while (cur <= end) {
          apvPeriodDatesSet.add(cur.toISOString().slice(0, 10));
          cur.setUTCDate(cur.getUTCDate() + 1);
        }
      }
      if (c?.fertile_window?.start_date && c?.fertile_window?.end_date) {
        const cur = new Date(Date.parse(`${c.fertile_window.start_date}T00:00:00Z`));
        const end = new Date(Date.parse(`${c.fertile_window.end_date}T00:00:00Z`));
        while (cur <= end) {
          apvFertileDatesSet.add(cur.toISOString().slice(0, 10));
          cur.setUTCDate(cur.getUTCDate() + 1);
        }
      }
      if (c?.ovulation?.date) {
        apvOvulationDatesSet.add(c.ovulation.date);
      }
    }
  }

  // Days in month calculation
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(Date.UTC(year, month - 1, 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(Date.UTC(year, month + 1, 1)));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)));
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      {/* Calendar Header with Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
        <div>
          <h3 className="font-semibold text-stone-900 text-base sm:text-lg">
            Menstrual Calendar
          </h3>
          <p className="text-xs text-stone-500">
            {monthNames[month]} {year}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-lg transition-colors mr-1"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <span key={d} className="text-[11px] font-semibold text-stone-400 py-1">
            {d}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10 sm:h-12 rounded-xl" />
        ))}

        {/* Month Day Cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isPeriodStart = periodDatesSet.has(dayDateStr);
          const isPeriodFlow = periodFlowDatesSet.has(dayDateStr);
          const isForecast = forecastDatesSet.has(dayDateStr);
          const isApvPeriod = apvPeriodDatesSet.has(dayDateStr);
          const isApvFertile = apvFertileDatesSet.has(dayDateStr);
          const isApvOvulation = apvOvulationDatesSet.has(dayDateStr);
          const isToday = dayDateStr === todayStr;

          return (
            <div
              key={dayDateStr}
              className={`h-10 sm:h-12 rounded-xl p-1 flex flex-col items-center justify-center relative transition-all ${
                isPeriodStart
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : isPeriodFlow
                  ? 'bg-rose-100 text-rose-900 font-semibold'
                  : isApvOvulation
                  ? 'bg-purple-100 border-2 border-purple-400 text-purple-900 font-bold shadow-2xs'
                  : isApvFertile
                  ? 'bg-amber-50 border border-amber-300 text-amber-900 font-semibold'
                  : isApvPeriod
                  ? 'bg-rose-50 border-2 border-dashed border-rose-300 text-rose-800 font-medium'
                  : isForecast
                  ? 'bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 font-medium'
                  : isToday
                  ? 'bg-stone-100 text-stone-900 font-bold border border-stone-300'
                  : 'hover:bg-stone-50 text-stone-700'
              }`}
              title={
                isPeriodStart
                  ? `Logged Period Start: ${formatDisplayDate(dayDateStr)}`
                  : isApvOvulation
                  ? `APIVerve Estimated Ovulation: ${formatDisplayDate(dayDateStr)}`
                  : isApvFertile
                  ? `APIVerve Fertile Window: ${formatDisplayDate(dayDateStr)}`
                  : isApvPeriod
                  ? `APIVerve Forecast Period: ${formatDisplayDate(dayDateStr)}`
                  : isForecast
                  ? `Projected Next Period Window: ${formatDisplayDate(dayDateStr)}`
                  : formatDisplayDate(dayDateStr)
              }
            >
              <span className="text-xs sm:text-sm">{dayNum}</span>
              {isPeriodStart && (
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-0.5" />
              )}
              {isApvOvulation && !isPeriodStart && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-0.5" />
              )}
              {isToday && !isPeriodStart && !isApvOvulation && (
                <span className="w-1 h-1 rounded-full bg-stone-500 mt-0.5" />
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap pt-4 mt-3 border-t border-stone-100 text-[11px] text-stone-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-600 inline-block shadow-xs" />
          <span>Period Start Date</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-rose-100 inline-block" />
          <span>Flow Days</span>
        </div>
        {apvPeriodDatesSet.size > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-rose-50 border-2 border-dashed border-rose-300 inline-block" />
            <span>Forecast Period</span>
          </div>
        )}
        {apvFertileDatesSet.size > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-50 border border-amber-300 inline-block" />
            <span>Fertile Window</span>
          </div>
        )}
        {apvOvulationDatesSet.size > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-purple-100 border-2 border-purple-400 inline-block" />
            <span>Ovulation Peak</span>
          </div>
        )}
        {(expectedWindow || forecastDatesSet.size > 0) && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-amber-50 border-2 border-dashed border-amber-300 inline-block" />
            <span>Estimated Window</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-md bg-stone-100 border border-stone-300 inline-block" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
