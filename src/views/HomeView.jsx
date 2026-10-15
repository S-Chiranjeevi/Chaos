import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { UrgentWarning } from '../components/common/UrgentWarning.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { LoadingState } from '../components/common/LoadingState.jsx';
import { MOCK_HEALTH_ENTRIES, MOCK_USER_PROFILE } from '../mockData/healthEntries.js';

export function HomeView({ onNavigate }) {
  const [entries, setEntries] = useState(MOCK_HEALTH_ENTRIES);
  const [showUrgentBanner, setShowUrgentBanner] = useState(false);
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);

  const handleSimulateLoading = () => {
    setShowLoadingDemo(true);
    setTimeout(() => {
      setShowLoadingDemo(false);
    }, 1500);
  };

  const handleToggleEmptyState = () => {
    setEntries(prev => prev.length > 0 ? [] : MOCK_HEALTH_ENTRIES);
  };

  return (
    <div className="space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title={`Namaste, ${MOCK_USER_PROFILE.name}`}
        description="Here is your personal health overview. Everything recorded here is stored solely on your local device."
        badge={MOCK_USER_PROFILE.currentStage}
        badgeVariant="rose"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/talk')}
              ariaLabel="Start Voice or Typed Health Note"
              helperText="Opens Talk or Type screen"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
              }
            >
              Talk or Type
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/tracker')}
              ariaLabel="Log new symptom or vital entry"
              helperText="Opens tracker form"
            >
              + Log Entry
            </Button>
          </div>
        }
      />

      {/* Toggleable Urgent Warning Demo */}
      {showUrgentBanner ? (
        <div className="space-y-2">
          <UrgentWarning
            onEmergencyClick={() => alert('Initiating priority emergency call: 108')}
          />
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUrgentBanner(false)}
              ariaLabel="Close simulated urgent warning"
              helperText="Hides red-flag banner preview"
            >
              Dismiss Urgent Alert Preview
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-stone-100 rounded-xl text-xs text-stone-600">
          <span>Demo Tool: Preview clinical red-flag symptom alert</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrgentBanner(true)}
            ariaLabel="Simulate urgent clinical alert banner"
            helperText="Tests high-contrast emergency warning"
          >
            Show Red-Flag Warning
          </Button>
        </div>
      )}

      {/* Quick Action Cards Grid */}
      <section aria-labelledby="quick-actions-title">
        <h2 id="quick-actions-title" className="text-base font-bold text-stone-900 mb-3">
          Quick Health Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card
            variant="interactive"
            onClick={() => onNavigate('/talk')}
            title="Talk or Type"
            subtitle="Voice & Text Companion"
            helperText="Speech transcribed on device"
            className="border-rose-200 bg-gradient-to-br from-rose-50/60 to-white"
          >
            <p className="text-xs text-stone-600 mb-3">
              Describe symptoms naturally in Hindi, English, or your mother tongue.
            </p>
            <div className="flex items-center text-xs font-semibold text-rose-700">
              <span>Open Voice/Text Input →</span>
            </div>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onNavigate('/tracker')}
            title="Log Today's Vitals"
            subtitle="BP & Kick Counts"
            helperText="Stored locally in device vault"
          >
            <p className="text-xs text-stone-600 mb-3">
              Record morning kicks, resting blood pressure, or physical sensations.
            </p>
            <div className="flex items-center text-xs font-semibold text-emerald-700">
              <span>Open Tracker →</span>
            </div>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onNavigate('/summary')}
            title="Clinician Brief"
            subtitle="1-Page Doctor Summary"
            helperText="Ready for next ANM/Doctor visit"
          >
            <p className="text-xs text-stone-600 mb-3">
              Generate formatted medical notes and trend charts for appointments.
            </p>
            <div className="flex items-center text-xs font-semibold text-purple-700">
              <span>View Summary →</span>
            </div>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onNavigate('/learn')}
            title="Maternal Guides"
            subtitle="Week 24 Milestones"
            helperText="Evidence-based care guides"
          >
            <p className="text-xs text-stone-600 mb-3">
              Nutrition tips, iron absorption hacks, and gentle pelvic movements.
            </p>
            <div className="flex items-center text-xs font-semibold text-sky-700">
              <span>Explore Library →</span>
            </div>
          </Card>

        </div>
      </section>

      {/* Health Vitals Placeholder Card */}
      <section aria-labelledby="vitals-snapshot-title">
        <Card
          title="Daily Maternal Health Snapshot"
          subtitle="Latest measurements recorded on this device"
          headerAction={
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSimulateLoading}
              ariaLabel="Simulate data reload"
              helperText="Tests accessible loading state"
            >
              Refresh Vault
            </Button>
          }
        >
          {showLoadingDemo ? (
            <LoadingState
              message="Reading encrypted records from local storage..."
              helperText="Validating on-device SHA integrity"
              variant="skeleton"
              count={2}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Resting BP</span>
                <p className="text-lg font-bold text-stone-900 mt-0.5">118 / 76 <span className="text-xs font-normal text-stone-500">mmHg</span></p>
                <span className="text-[10px] text-emerald-700 font-medium">✓ Normal Range</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Fetal Kicks (1 hr)</span>
                <p className="text-lg font-bold text-stone-900 mt-0.5">10 <span className="text-xs font-normal text-stone-500">movements</span></p>
                <span className="text-[10px] text-emerald-700 font-medium">✓ Active & Reassuring</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Hydration Target</span>
                <p className="text-lg font-bold text-stone-900 mt-0.5">2.2 / 3.0 <span className="text-xs font-normal text-stone-500">L</span></p>
                <span className="text-[10px] text-stone-500">2 glasses remaining</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[11px] font-medium text-stone-500 uppercase">Iron Supplement</span>
                <p className="text-lg font-bold text-stone-900 mt-0.5">Taken <span className="text-xs font-normal text-stone-500">with lemon</span></p>
                <span className="text-[10px] text-emerald-700 font-medium">✓ Completed Today</span>
              </div>
            </div>
          )}
        </Card>
      </section>

      {/* Recent Health Entries Section (HealthEntry compatible format) */}
      <section aria-labelledby="recent-entries-title" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="recent-entries-title" className="text-base font-bold text-stone-900">
              Recent Health Log Entries ({entries.length})
            </h2>
            <p className="text-xs text-stone-500">
              Entries conforming to the shared HealthEntry schema
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleEmptyState}
              ariaLabel={entries.length > 0 ? 'Preview empty state view' : 'Restore mock health entries'}
              helperText="Toggles empty vs filled view"
            >
              {entries.length > 0 ? 'Test Empty State' : 'Restore Sample Entries'}
            </Button>
          </div>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="No Health Records on this Device"
            description="You have not logged any health entries yet. Start by logging your vitals or speaking with Sakhi."
            actionLabel="+ Create First Health Entry"
            actionHelperText="Opens symptom & vital tracker"
            onAction={() => onNavigate('/tracker')}
          />
        ) : (
          <div className="space-y-3">
            {entries.slice(0, 3).map((entry) => (
              <Card
                key={entry.id}
                variant="outlined"
                className="bg-white hover:border-stone-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-stone-500">
                        {entry.dateFormatted}
                      </span>
                      <Badge
                        variant={entry.severity === 'moderate' ? 'amber' : 'emerald'}
                        size="sm"
                      >
                        {entry.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="stone" size="sm">
                        {entry.category}
                      </Badge>
                      {entry.source && (
                        <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          Source: {entry.source === 'voice' ? '🎙️ Voice Note' : '⌨️ Typed'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-stone-900">
                      {entry.title}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {entry.notes}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {entry.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 self-end sm:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate('/tracker')}
                      ariaLabel={`View full details for ${entry.title}`}
                      helperText="Opens details in tracker"
                    >
                      View in Tracker →
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomeView;
