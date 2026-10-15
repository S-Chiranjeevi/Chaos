import React, { useState } from 'react';
import { Calendar, Trash2, Edit2, AlertCircle, Droplets, Activity } from 'lucide-react';
import { formatDisplayDate, computeCycleIntervals } from '../../services/cycleCalculations.js';

export function CycleHistoryList({ entries = [], onEdit, onDelete }) {
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (!entries || entries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-stone-800 text-sm mb-1">No Period Dates Logged Yet</h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto">
          Start recording the first day of your period using the form above. Your entries are saved privately only on this device.
        </p>
      </div>
    );
  }

  // Pre-calculate intervals to display cycle length next to each entry
  const intervals = computeCycleIntervals(entries);
  const intervalMap = new Map();
  // Map interval start date to cycle length
  for (const item of intervals) {
    intervalMap.set(item.startDate, item.cycleLengthDays);
  }

  // Sort descending (newest first)
  const sorted = [...entries].sort((a, b) => {
    const da = a.startDate || a.date || '';
    const db = b.startDate || b.date || '';
    return db.localeCompare(da);
  });

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
        <div>
          <h3 className="font-semibold text-stone-900 text-base">
            Period History & Recorded Cycles
          </h3>
          <p className="text-xs text-stone-500">
            {sorted.length} period log{sorted.length === 1 ? '' : 's'} recorded on this device
          </p>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {sorted.map((entry) => {
          const entryDate = entry.startDate || entry.date;
          const cycleLen = intervalMap.get(entryDate);
          const isConfirmingDelete = deleteConfirmId === entry.id;

          return (
            <div
              key={entry.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/50 -mx-2 px-2 rounded-2xl transition-colors"
            >
              {/* Date & Tags */}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-semibold shrink-0 mt-0.5">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-stone-900 text-sm">
                      {formatDisplayDate(entryDate)}
                    </span>
                    {cycleLen && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        cycleLen > 35
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : cycleLen < 21
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {cycleLen} days cycle
                      </span>
                    )}
                    {entry.flowLevel && (
                      <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md capitalize">
                        {entry.flowLevel} flow
                      </span>
                    )}
                    {typeof entry.painScore === 'number' && entry.painScore > 0 && (
                      <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        Pain: {entry.painScore}/10
                      </span>
                    )}
                  </div>

                  {(entry.notes || entry.note) && (
                    <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                      {entry.notes || entry.note}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                {isConfirmingDelete ? (
                  <div className="flex items-center gap-2 bg-rose-50 p-1.5 rounded-xl border border-rose-200">
                    <span className="text-xs text-rose-700 font-medium px-1">Delete entry?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(entry.id);
                        setDeleteConfirmId(null);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-1 text-xs font-medium text-stone-600 hover:text-stone-800 bg-white rounded-lg border border-stone-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                      aria-label={`Edit entry for ${formatDisplayDate(entryDate)}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(entry.id)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      aria-label={`Delete entry for ${formatDisplayDate(entryDate)}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
