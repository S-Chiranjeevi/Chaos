import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Plus,
  TrendingUp,
  Activity,
  Calendar as CalendarIcon,
  BookOpen,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../services/storageService.js';
import { STORAGE_KEYS } from '../models/pcosSaathiSchemas.js';
import { defaultPredictionService } from '../services/cyclePredictionService.js';
import { computeCycleIntervals, computeCycleStats } from '../services/cycleCalculations.js';
import { CycleHistoryForm } from './tracker/CycleHistoryForm.jsx';
import { CycleHistoryList } from './tracker/CycleHistoryList.jsx';
import { CycleTrendChart } from './tracker/CycleTrendChart.jsx';
import { CycleCalendarView } from './tracker/CycleCalendarView.jsx';
import { UpcomingPeriodCard } from './tracker/UpcomingPeriodCard.jsx';
import { CycleInsightsCard } from './tracker/CycleInsightsCard.jsx';
import { CycleEducationalSafety } from './tracker/CycleEducationalSafety.jsx';
import { APIVerveForecastCard } from './tracker/APIVerveForecastCard.jsx';

function readInitialEntries() {
  try {
    const canonical = StorageService.getCycleEntries();
    if (Array.isArray(canonical) && canonical.length > 0) {
      return canonical;
    }
    const legacy = localStorage.getItem('lunaher_cycle_tracker') || localStorage.getItem('sakhicare_cycle_tracker');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function CycleTracker({ latestEntry }) {
  const [entries, setEntries] = useState(() => readInitialEntries());
  const [forecastHistory, setForecastHistory] = useState(() => StorageService.getApiVerveForecasts());
  const [activeTab, setActiveTab] = useState('forecast'); // 'forecast' | 'insights' | 'calendar' | 'safety'
  const [editingEntry, setEditingEntry] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const reloadEntries = () => {
    setEntries(readInitialEntries());
  };

  // Listen to cross-app storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.detail?.key === STORAGE_KEYS.CYCLE_ENTRIES || e.detail?.key === 'all_purged') {
        reloadEntries();
      }
      if (e.detail?.key === STORAGE_KEYS.APIVERVE_FORECASTS || e.detail?.key === 'all_purged') {
        setForecastHistory(StorageService.getApiVerveForecasts());
      }
    };
    window.addEventListener('pcos_saathi:data_change', handleStorageChange);
    return () => window.removeEventListener('pcos_saathi:data_change', handleStorageChange);
  }, []);

  // Compute intervals & prediction
  const intervals = useMemo(() => computeCycleIntervals(entries), [entries]);
  const stats = useMemo(() => computeCycleStats(intervals), [intervals]);
  const predictionResult = useMemo(() => {
    return defaultPredictionService.predict(entries);
  }, [entries]);

  // Handlers
  const handleSaveEntry = (newOrUpdated) => {
    try {
      const saved = StorageService.saveCycleEntry(newOrUpdated);
      const allEntries = StorageService.getCycleEntries();
      try {
        localStorage.setItem('lunaher_cycle_tracker', JSON.stringify(allEntries));
        localStorage.setItem('sakhicare_cycle_tracker', JSON.stringify(allEntries));
        window.dispatchEvent(new CustomEvent('lunaher:cycleTrackerUpdate', { detail: allEntries }));
        window.dispatchEvent(new CustomEvent('sakhicare:cycleTrackerUpdate', { detail: allEntries }));
      } catch {}
      reloadEntries();
      setEditingEntry(null);
      setIsFormOpen(false);
      setStatusMessage({ type: 'success', text: 'Period entry saved successfully.' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to save period entry.' });
    }
  };

  const handleDeleteEntry = (id) => {
    try {
      const remaining = StorageService.deleteCycleEntry(id);
      try {
        localStorage.setItem('lunaher_cycle_tracker', JSON.stringify(remaining));
        localStorage.setItem('sakhicare_cycle_tracker', JSON.stringify(remaining));
        window.dispatchEvent(new CustomEvent('lunaher:cycleTrackerUpdate', { detail: remaining }));
        window.dispatchEvent(new CustomEvent('sakhicare:cycleTrackerUpdate', { detail: remaining }));
      } catch {}
      reloadEntries();
      if (editingEntry?.id === id) {
        setEditingEntry(null);
        setIsFormOpen(false);
      }
      setStatusMessage({ type: 'success', text: 'Period entry deleted.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to delete entry.' });
    }
  };


  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
    // Switch to calendar / history tab so the form is visible
    setActiveTab('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
          role="status"
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-stone-400 hover:text-stone-600 font-bold px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* Feature Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-stone-200/80 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/50 rounded-2xl flex-wrap">
          <button
            type="button"
            onClick={() => {
              setActiveTab('forecast');
              setIsFormOpen(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'forecast'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Cycle Insights & Forecast</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('insights');
              setIsFormOpen(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'insights'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-600" />
            <span>Pattern Analysis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'calendar'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-rose-600" />
            <span>Calendar & History ({entries.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('safety');
              setIsFormOpen(false);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'safety'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Clinical Guide</span>
          </button>
        </div>

        {/* Quick Log Action */}
        <button
          type="button"
          onClick={() => {
            setEditingEntry(null);
            setIsFormOpen(!isFormOpen);
            if (!isFormOpen) setActiveTab('calendar');
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isFormOpen
              ? 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              : 'bg-rose-600 text-white hover:bg-rose-700 shadow-xs'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Close Form' : 'Log Period Date'}</span>
        </button>
      </div>

      {/* Expandable Period Entry Form */}
      {isFormOpen && (
        <CycleHistoryForm
          onSave={handleSaveEntry}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingEntry(null);
          }}
          existingEntries={entries}
          entryToEdit={editingEntry}
        />
      )}

      {/* TAB 1: Live APIVerve Menstrual Cycle Forecast */}
      {activeTab === 'forecast' && (
        <APIVerveForecastCard />
      )}

      {/* TAB 2: Insights & Pattern History */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* Upcoming Period Forecast Card */}
          <UpcomingPeriodCard predictionResult={predictionResult} />

          {/* Regularity & Pattern Evaluation Card */}
          <CycleInsightsCard predictionResult={predictionResult} />

          {/* Historical Trend Chart */}
          <CycleTrendChart intervals={intervals} stats={stats} />
        </div>
      )}

      {/* TAB 3: Calendar & Logged History */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Interactive Menstrual Calendar */}
          <CycleCalendarView
            entries={entries}
            expectedWindow={predictionResult?.expectedNextPeriod}
            apiverveCycles={forecastHistory[0]?.responseData?.cycles || []}
          />

          {/* Chronological Entry List with Edit / Delete */}
          <CycleHistoryList
            entries={entries}
            onEdit={handleEditEntry}
            onDelete={handleDeleteEntry}
          />
        </div>
      )}

      {/* TAB 4: Clinical Guide & Safety */}
      {activeTab === 'safety' && (
        <CycleEducationalSafety />
      )}
    </div>
  );
}

export default CycleTracker;
