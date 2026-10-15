import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Check, X, AlertCircle, Sparkles } from 'lucide-react';
import { validateCycleEntryInput, formatDisplayDate } from '../../services/cycleCalculations.js';

export function CycleHistoryForm({
  onSave,
  onCancel,
  existingEntries = [],
  entryToEdit = null,
}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flowLevel, setFlowLevel] = useState('medium');
  const [painScore, setPainScore] = useState(0);
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  const isEditing = Boolean(entryToEdit);

  useEffect(() => {
    if (entryToEdit) {
      setStartDate(entryToEdit.startDate || entryToEdit.date || '');
      setEndDate(entryToEdit.endDate || '');
      setFlowLevel(entryToEdit.flowLevel || 'medium');
      setPainScore(typeof entryToEdit.painScore === 'number' ? entryToEdit.painScore : 0);
      setNotes(entryToEdit.notes || entryToEdit.note || '');
    } else {
      // Default to today
      setStartDate(new Date().toISOString().slice(0, 10));
      setEndDate('');
      setFlowLevel('medium');
      setPainScore(0);
      setNotes('');
    }
    setErrorMessage('');
    setWarningMessage('');
  }, [entryToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setWarningMessage('');

    const validation = validateCycleEntryInput(
      { startDate },
      existingEntries,
      entryToEdit?.id
    );

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    if (validation.warning) {
      setWarningMessage(validation.warning);
    }

    // Compute period duration if end date provided
    let periodDurationDays = null;
    if (endDate && endDate >= startDate) {
      const t1 = Date.parse(`${startDate}T00:00:00Z`);
      const t2 = Date.parse(`${endDate}T00:00:00Z`);
      periodDurationDays = Math.round((t2 - t1) / (1000 * 60 * 60 * 24)) + 1;
    }

    const payload = {
      ...(entryToEdit || {}),
      id: entryToEdit?.id || `cy-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      startDate,
      date: startDate,
      endDate: endDate || null,
      periodDurationDays,
      flowLevel,
      painScore: Number(painScore),
      notes: notes.trim(),
      note: notes.trim(),
      timestamp: entryToEdit?.timestamp || new Date().toISOString(),
    };

    onSave(payload);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-semibold">
            <Calendar className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 text-base sm:text-lg">
              {isEditing ? 'Edit Period Entry' : 'Log Period Start Date'}
            </h3>
            <p className="text-xs text-stone-500">
              {isEditing ? 'Update the details for this period log' : 'Record the first day you noticed bleeding'}
            </p>
          </div>
        </div>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
            aria-label="Cancel editing"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 bg-rose-50 border border-rose-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800" role="alert">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {warningMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{warningMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="period-start-input" className="block text-xs font-semibold text-stone-700 mb-1">
              Period Start Date <span className="text-rose-600">*</span>
            </label>
            <input
              id="period-start-input"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setErrorMessage('');
              }}
              required
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">Day 1 of your cycle</span>
          </div>

          <div>
            <label htmlFor="period-end-input" className="block text-xs font-semibold text-stone-700 mb-1">
              Period End Date <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <input
              id="period-end-input"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">Last day of bleeding</span>
          </div>
        </div>

        {/* Flow & Pain Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label htmlFor="flow-level-select" className="block text-xs font-semibold text-stone-700 mb-1">
              Estimated Flow Level
            </label>
            <select
              id="flow-level-select"
              value={flowLevel}
              onChange={(e) => setFlowLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            >
              <option value="spotting">Spotting (Very light drops)</option>
              <option value="light">Light flow</option>
              <option value="medium">Medium / Normal flow</option>
              <option value="heavy">Heavy flow</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="pain-score-range" className="text-xs font-semibold text-stone-700">
                Menstrual Pain Score
              </label>
              <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                {painScore} / 10 {painScore === 0 ? '(None)' : painScore <= 3 ? '(Mild)' : painScore <= 6 ? '(Moderate)' : '(Severe)'}
              </span>
            </div>
            <input
              id="pain-score-range"
              type="range"
              min="0"
              max="10"
              step="1"
              value={painScore}
              onChange={(e) => setPainScore(parseInt(e.target.value, 10))}
              className="w-full accent-rose-600 py-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>0 (No pain)</span>
              <span>5 (Manageable cramps)</span>
              <span>10 (Severe)</span>
            </div>
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label htmlFor="cycle-notes-input" className="block text-xs font-semibold text-stone-700 mb-1">
            Optional Notes or Symptoms
          </label>
          <input
            id="cycle-notes-input"
            type="text"
            maxLength={150}
            placeholder="e.g. Mild cramps, bloating, stress during exam week..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
          {isEditing && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-800 bg-stone-100 hover:bg-stone-200/70 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" /> Save Changes
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Log Period
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
