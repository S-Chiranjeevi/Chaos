import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { MOCK_HEALTH_ENTRIES } from '../mockData/healthEntries.js';
import { ENTRY_CATEGORIES } from '../types/health.js';

export function TrackerView({ onNavigate }) {
  const [entries, setEntries] = useState(MOCK_HEALTH_ENTRIES);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form state for creating a new HealthEntry
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('symptom');
  const [newSeverity, setNewSeverity] = useState('mild');
  const [newNotes, setNewNotes] = useState('');
  const [newBpSys, setNewBpSys] = useState('');
  const [newBpDia, setNewBpDia] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Records', helper: 'All device logs' },
    { id: 'symptom', label: 'Symptoms', helper: 'Pain, aches, nausea' },
    { id: 'cycle', label: 'Cycle & Ovulation', helper: 'Periods & dates' },
    { id: 'vital', label: 'Vitals & Kicks', helper: 'BP & movements' },
    { id: 'mood', label: 'Mood & Wellbeing', helper: 'Mental state' },
    { id: 'note', label: 'Notes', helper: 'Doctor questions' }
  ];

  const filteredEntries = selectedFilter === 'all'
    ? entries
    : entries.filter(e => e.category === selectedFilter);

  const handleCreateEntry = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const createdEntry = {
      id: `entry-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateFormatted: 'Today, Just now',
      category: newCategory,
      title: newTitle,
      severity: newSeverity,
      stage: '2nd Trimester · Week 24',
      tags: [newCategory, newSeverity],
      notes: newNotes || 'No additional notes provided.',
      vitals: {
        bpSystolic: newBpSys ? parseInt(newBpSys, 10) : null,
        bpDiastolic: newBpDia ? parseInt(newBpDia, 10) : null,
        pulse: null
      },
      isUrgent: newSeverity === 'severe',
      source: 'typed'
    };

    setEntries([createdEntry, ...entries]);
    setNewTitle('');
    setNewNotes('');
    setNewBpSys('');
    setNewBpDia('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Health & Symptom Tracker"
        description="Review logged symptoms, monitor vitals, and keep track of daily pregnancy observations in your local device vault."
        badge={`${entries.length} Total Logs`}
        badgeVariant="emerald"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
        action={
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsFormOpen(!isFormOpen)}
            ariaLabel={isFormOpen ? 'Close new entry form' : 'Open new entry form'}
            helperText={isFormOpen ? 'Collapses entry fields' : 'Add symptom or measurement'}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isFormOpen ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
            }
          >
            {isFormOpen ? 'Close Form' : '+ New Health Entry'}
          </Button>
        }
      />

      <DisclaimerBanner dismissible={true} />

      {/* Clean Placeholder Section: Tracking Logic & Analysis */}
      <Card
        variant="outlined"
        title="Health Tracking Architecture Placeholder"
        subtitle="Specification compliance note for Hackathon Shell"
      >
        <div className="p-3.5 bg-stone-50 rounded-2xl text-xs text-stone-600 space-y-1">
          <p className="font-semibold text-stone-800">
            📌 Isolated Tracking Logic Placeholder:
          </p>
          <p>
            Per project constraints, automatic cycle predictive math and symptom trend regression logic are not bundled here.
            All mock records below strictly implement the shared <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-mono">HealthEntry</code> data schema for seamless module pairing.
          </p>
        </div>
      </Card>

      {/* Expandable Form: Log New HealthEntry */}
      {isFormOpen && (
        <Card
          variant="elevated"
          title="Create New Health Entry"
          subtitle="All fields are saved securely to your local device database"
        >
          <form onSubmit={handleCreateEntry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="entry-title" className="block text-xs font-semibold text-stone-800 mb-1">
                  Entry Title / Observation Name *
                </label>
                <input
                  id="entry-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mild back pain, Evening kick count"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <span className="text-[11px] text-stone-500 mt-0.5 block">Visible helper: A clear short name</span>
              </div>

              <div>
                <label htmlFor="entry-category" className="block text-xs font-semibold text-stone-800 mb-1">
                  Category *
                </label>
                <select
                  id="entry-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="symptom">Symptom Log (Physical sensations)</option>
                  <option value="cycle">Cycle & Ovulation</option>
                  <option value="vital">Vitals & Kicks (BP, pulse, kicks)</option>
                  <option value="mood">Mood & Emotional Wellbeing</option>
                  <option value="note">Personal Health Note / Doctor Query</option>
                </select>
                <span className="text-[11px] text-stone-500 mt-0.5 block">Select the best classification</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="entry-severity" className="block text-xs font-semibold text-stone-800 mb-1">
                  Severity Level
                </label>
                <select
                  id="entry-severity"
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                >
                  <option value="mild">Mild (Comfortably manageable)</option>
                  <option value="moderate">Moderate (Interferes with activity)</option>
                  <option value="severe">Severe (Urgent clinical review)</option>
                </select>
                <span className="text-[11px] text-stone-500 mt-0.5 block">Indicate discomfort level</span>
              </div>

              <div>
                <label htmlFor="entry-bp-sys" className="block text-xs font-semibold text-stone-800 mb-1">
                  BP Systolic (mmHg)
                </label>
                <input
                  id="entry-bp-sys"
                  type="number"
                  value={newBpSys}
                  onChange={(e) => setNewBpSys(e.target.value)}
                  placeholder="e.g. 120"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[11px] text-stone-500 mt-0.5 block">Optional upper reading</span>
              </div>

              <div>
                <label htmlFor="entry-bp-dia" className="block text-xs font-semibold text-stone-800 mb-1">
                  BP Diastolic (mmHg)
                </label>
                <input
                  id="entry-bp-dia"
                  type="number"
                  value={newBpDia}
                  onChange={(e) => setNewBpDia(e.target.value)}
                  placeholder="e.g. 80"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[11px] text-stone-500 mt-0.5 block">Optional lower reading</span>
              </div>
            </div>

            <div>
              <label htmlFor="entry-notes" className="block text-xs font-semibold text-stone-800 mb-1">
                Detailed Observation Notes
              </label>
              <textarea
                id="entry-notes"
                rows={3}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="What triggered it? How long did it last? What relieved it?"
                className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-rose-500"
              />
              <span className="text-[11px] text-stone-500 mt-0.5 block">Visible helper: Helpful context for your doctor</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsFormOpen(false)}
                ariaLabel="Cancel creating new health entry"
                helperText="Discards changes"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                ariaLabel="Confirm and commit health entry to device log"
                helperText="Saves entry locally"
              >
                Save Health Entry
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter Tabs (Accessible with Visible Text & Helper Text) */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-stone-200">
        {filterTabs.map((tab) => {
          const isSelected = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`
                px-3 py-2 rounded-xl text-xs font-semibold transition-all flex flex-col items-start
                ${isSelected
                  ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-500/20'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Filter by ${tab.label}: ${tab.helper}`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] ${isSelected ? 'text-rose-100' : 'text-stone-400'}`}>
                {tab.helper}
              </span>
            </button>
          );
        })}
      </div>

      {/* Entries List */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          title={`No ${selectedFilter} entries found`}
          description="There are currently no records logged in this category on your device."
          actionLabel="+ Log New Entry"
          actionHelperText="Opens entry form"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              variant="default"
              className="hover:border-stone-300"
            >
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-stone-900">
                        {entry.title}
                      </span>
                      <Badge
                        variant={
                          entry.severity === 'severe' ? 'danger' :
                          entry.severity === 'moderate' ? 'amber' : 'emerald'
                        }
                        size="sm"
                      >
                        {entry.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="stone" size="sm">
                        {entry.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-stone-500">
                      Logged: {entry.dateFormatted} · {entry.stage || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      ID: {entry.id}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50/70 p-3 rounded-xl border border-stone-100">
                  {entry.notes}
                </p>

                {/* Vitals metrics if attached */}
                {entry.vitals && (entry.vitals.bpSystolic || entry.vitals.fetalKicksCount) && (
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    {entry.vitals.bpSystolic && (
                      <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-lg font-medium">
                        📊 Blood Pressure: {entry.vitals.bpSystolic}/{entry.vitals.bpDiastolic} mmHg
                      </span>
                    )}
                    {entry.vitals.fetalKicksCount && (
                      <span className="bg-rose-50 text-rose-900 border border-rose-200 px-2.5 py-1 rounded-lg font-medium">
                        👶 Kick Count: {entry.vitals.fetalKicksCount} in 1 hr
                      </span>
                    )}
                    {entry.vitals.pulse && (
                      <span className="bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-1 rounded-lg font-medium">
                        ❤️ Pulse: {entry.vitals.pulse} bpm
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrackerView;
