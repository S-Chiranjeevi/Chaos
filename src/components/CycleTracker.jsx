import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Plus, TrendingUp } from 'lucide-react';
import { readLocalData, writeLocalData } from '../services/localStorage.js';
import { STORAGE_KEYS } from '../models/pcosSaathiSchemas.js';

function readEntries() {
  try {
    const canonical = localStorage.getItem(STORAGE_KEYS.CYCLE_ENTRIES);
    if (canonical) {
      const parsed = JSON.parse(canonical);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const legacy = readLocalData('sakhicare_cycle_tracker', []).value;
    return Array.isArray(legacy) ? legacy : [];
  } catch {
    return [];
  }
}

export function CycleTracker({ latestEntry }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState('');
  const [cycleDate, setCycleDate] = useState('');
  const [cycleNote, setCycleNote] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEntries(readEntries());
      setIsLoading(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Synchronize on external changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail?.key === STORAGE_KEYS.CYCLE_ENTRIES || e.detail?.key === 'all_purged') {
        setEntries(readEntries());
      }
    };
    window.addEventListener('pcos_saathi:data_change', handleStorageChange);
    return () => window.removeEventListener('pcos_saathi:data_change', handleStorageChange);
  }, []);

  function saveEntries(nextEntries) {
    setEntries(nextEntries);
    try {
      localStorage.setItem(STORAGE_KEYS.CYCLE_ENTRIES, JSON.stringify(nextEntries));
      writeLocalData('sakhicare_cycle_tracker', nextEntries);
      window.dispatchEvent(new CustomEvent('pcos_saathi:data_change', {
        detail: { key: STORAGE_KEYS.CYCLE_ENTRIES, data: nextEntries },
        bubbles: true,
      }));
      window.dispatchEvent(new CustomEvent('sakhicare:cycleTrackerUpdate', { detail: nextEntries }));
    } catch {
      setStorageError('Could not save to local storage.');
    }
  }

  const pattern = useMemo(() => {
    const irregular = entries.filter((entry) =>
      /irregular|late|missed|2.?3 months|infrequent/i.test(entry.note || entry.notes || '')
    ).length;
    if (irregular >= 3)
      return 'Three or more entries mention irregular cycles. Consider bringing this timeline to a gynecologist.';
    if (entries.length >= 3)
      return 'You have three or more entries. This timeline can make your doctor conversation easier.';
    return null;
  }, [entries]);

  function addCycle(event) {
    event.preventDefault();
    if (!cycleDate) return;
    const note =
      cycleNote.trim() ||
      latestEntry?.symptoms?.map((symptom) => symptom.name || symptom.symptom).join(', ') ||
      'Period logged';

    const nextEntries = [
      ...entries,
      {
        id: `cy-${Date.now()}`,
        startDate: cycleDate,
        date: cycleDate,
        note,
        notes: note,
        flowLevel: 'medium',
        painScore: 0,
        timestamp: new Date().toISOString(),
      },
    ].sort((a, b) => (b.startDate || b.date).localeCompare(a.startDate || a.date));

    saveEntries(nextEntries);
    setCycleDate('');
    setCycleNote('');
  }

  return (
    <div className="tracker-card">
      <div className="tracker-intro">
        <CalendarDays size={22} aria-hidden="true" />
        <div>
          <h3>Cycle and symptom log</h3>
          <p>Saved only on this device. Add a date if it feels useful.</p>
        </div>
      </div>
      <form className="tracker-form" onSubmit={addCycle}>
        <label htmlFor="period-start-date">
          Period start date
          <span className="tracker-helper">Choose the first day you noticed bleeding.</span>
          <input
            id="period-start-date"
            type="date"
            value={cycleDate}
            onChange={(event) => setCycleDate(event.target.value)}
            required
          />
        </label>
        <label htmlFor="period-note">
          Optional note
          <span className="tracker-helper">Use your own words. You can leave this empty.</span>
          <input
            id="period-note"
            value={cycleNote}
            onChange={(event) => setCycleNote(event.target.value)}
            placeholder="For example: I felt tired"
          />
        </label>
        <button className="tracker-add" type="submit" aria-label="Save this period date and optional note">
          <Plus size={16} aria-hidden="true" /> Save period date
        </button>
      </form>
      {storageError && (
        <p className="tracker-error" role="alert">
          <strong>We could not access your saved notes.</strong> {storageError}
        </p>
      )}
      {isLoading ? (
        <p className="tracker-loading" role="status">Loading your saved dates. Please wait.</p>
      ) : pattern && (
        <div className="pattern-alert">
          <TrendingUp size={18} aria-hidden="true" />
          <span>{pattern}</span>
        </div>
      )}
      {!isLoading && entries.length === 0 ? (
        <div className="tracker-empty" role="status">
          <strong>No tracker dates yet</strong>
          <span>Add a period start date when you are ready. Tracking is optional.</span>
        </div>
      ) : (
        !isLoading && (
          <ul className="tracker-list">
            {entries.map((entry) => (
              <li key={entry.id}>
                <strong>{new Date(`${entry.startDate || entry.date}T12:00:00`).toLocaleDateString()}</strong>
                <span>{entry.notes || entry.note}</span>
              </li>
            ))}
          </ul>
        )
      )}
      <p className="tracker-disclaimer">This is information, not a diagnosis.</p>
    </div>
  );
}

export default CycleTracker;
