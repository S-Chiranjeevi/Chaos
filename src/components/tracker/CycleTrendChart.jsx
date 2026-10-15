import React from 'react';
import { TrendingUp, AlertCircle, Info } from 'lucide-react';
import { formatDisplayDate } from '../../services/cycleCalculations.js';

export function CycleTrendChart({ intervals = [], stats = {} }) {
  if (!intervals || intervals.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-stone-800 text-sm mb-1">Cycle Length Trend Chart</h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Log at least 2 period start dates to calculate your first cycle length and view changes over time.
        </p>
      </div>
    );
  }

  // Chart configuration
  const maxVal = Math.max(50, ...intervals.map((i) => i.cycleLengthDays + 5));
  const minVal = Math.max(0, Math.min(15, ...intervals.map((i) => i.cycleLengthDays - 5)));
  const range = maxVal - minVal || 1;

  const chartHeight = 160;
  const paddingX = 40;
  const paddingY = 24;

  // Normal clinical range is 21 - 35 days
  const normalTopY = chartHeight - paddingY - ((35 - minVal) / range) * (chartHeight - paddingY * 2);
  const normalBottomY = chartHeight - paddingY - ((21 - minVal) / range) * (chartHeight - paddingY * 2);
  const normalHeight = Math.max(0, normalBottomY - normalTopY);

  const points = intervals.map((interval, index) => {
    const denom = Math.max(1, intervals.length - 1);
    const x = intervals.length === 1
      ? 200
      : paddingX + (index / denom) * (400 - paddingX * 2);
    const y = chartHeight - paddingY - ((interval.cycleLengthDays - minVal) / range) * (chartHeight - paddingY * 2);
    return { x, y, interval };
  });

  const pathD = points.length === 1
    ? ''
    : points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-stone-900 text-sm sm:text-base">
              Cycle Length Changes Over Time
            </h3>
            <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Normal range: 21–35 days
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Historical day count from the start of one period to the next
          </p>
        </div>

        {stats.averageCycleLength && (
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
              <span className="text-stone-400 mr-1.5">Avg:</span>
              <span className="font-semibold text-stone-800">{stats.averageCycleLength} days</span>
            </div>
            <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200/60">
              <span className="text-stone-400 mr-1.5">Spread:</span>
              <span className="font-semibold text-stone-800">{stats.shortestCycle}–{stats.longestCycle}d</span>
            </div>
          </div>
        )}
      </div>

      {/* SVG Responsive Trend Visualization */}
      <div className="relative w-full overflow-x-auto py-2">
        <svg
          viewBox="0 0 400 160"
          className="w-full h-44 sm:h-48 overflow-visible select-none"
          role="img"
          aria-label="Cycle length historical trend chart"
        >
          {/* Shaded Normal Zone (21–35 days) */}
          <rect
            x={paddingX - 10}
            y={normalTopY}
            width={400 - paddingX * 2 + 20}
            height={normalHeight}
            fill="#ecfdf5"
            opacity="0.8"
            rx="6"
          />
          <text
            x={paddingX}
            y={normalTopY + 12}
            fill="#059669"
            fontSize="9"
            fontWeight="600"
          >
            ACOG Normal Window (21–35d)
          </text>

          {/* Reference Line 28 Days */}
          <line
            x1={paddingX - 10}
            y1={chartHeight - paddingY - ((28 - minVal) / range) * (chartHeight - paddingY * 2)}
            x2={400 - paddingX + 10}
            y2={chartHeight - paddingY - ((28 - minVal) / range) * (chartHeight - paddingY * 2)}
            stroke="#a7f3d0"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Connective Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Individual Data Points */}
          {points.map((pt, idx) => {
            const isOligo = pt.interval.cycleLengthDays > 35;
            const isPoly = pt.interval.cycleLengthDays < 21;
            const isAbnormal = isOligo || isPoly;

            return (
              <g key={pt.interval.id || idx}>
                {/* Vertical drop line */}
                <line
                  x1={pt.x}
                  y1={pt.y}
                  x2={pt.x}
                  y2={chartHeight - paddingY}
                  stroke="#f5d0fe"
                  strokeDasharray="2 2"
                  strokeWidth="1"
                />

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5.5"
                  fill={isAbnormal ? '#e11d48' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-transform hover:scale-125"
                />

                {/* Day value badge above point */}
                <rect
                  x={pt.x - 14}
                  y={pt.y - 20}
                  width="28"
                  height="14"
                  rx="4"
                  fill="#1c1917"
                  opacity="0.85"
                />
                <text
                  x={pt.x}
                  y={pt.y - 10}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="8.5"
                  fontWeight="600"
                >
                  {pt.interval.cycleLengthDays}d
                </text>

                {/* Date label at bottom */}
                <text
                  x={pt.x}
                  y={chartHeight - 6}
                  textAnchor="middle"
                  fill="#78716c"
                  fontSize="8"
                >
                  {formatDisplayDate(pt.interval.startDate).slice(0, 6)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Screen reader / accessible text table */}
      <details className="mt-3 text-xs text-stone-500">
        <summary className="cursor-pointer hover:text-stone-700 font-medium select-none">
          View numerical cycle breakdown table
        </summary>
        <div className="mt-2 overflow-x-auto border border-stone-100 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 border-b border-stone-200/60">
              <tr>
                <th className="p-2">Cycle</th>
                <th className="p-2">Start Date</th>
                <th className="p-2">Length</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {intervals.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-stone-50">
                  <td className="p-2 font-medium text-stone-800">#{idx + 1}</td>
                  <td className="p-2">{formatDisplayDate(item.startDate)}</td>
                  <td className="p-2 font-semibold text-rose-600">{item.cycleLengthDays} days</td>
                  <td className="p-2">
                    {item.cycleLengthDays > 35 ? (
                      <span className="text-amber-700 font-medium">Long ({item.cycleLengthDays}d &gt; 35d)</span>
                    ) : item.cycleLengthDays < 21 ? (
                      <span className="text-amber-700 font-medium">Short ({item.cycleLengthDays}d &lt; 21d)</span>
                    ) : (
                      <span className="text-emerald-700 font-medium">Standard window</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
