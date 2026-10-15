import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { StorageService } from '../services/storageService.js';
import { STORAGE_KEYS } from '../models/pcosSaathiSchemas.js';

/**
 * PrivacyView - Product Area 7: Privacy Controls & Data Vault
 * 
 * Provides:
 * - Local-First Vault status & entry counts
 * - AI Opt-In & Privacy Consent management (pcos_saathi_ai_consent)
 * - Raw JSON data export & download
 * - Emergency "Delete All My Data" irreversible purge
 */
export function PrivacyView({ onNavigate }) {
  const [consent, setConsent] = useState(() => StorageService.getAiConsent());
  const [healthEntriesCount, setHealthEntriesCount] = useState(() => StorageService.getHealthEntries().length);
  const [cycleEntriesCount, setCycleEntriesCount] = useState(() => StorageService.getCycleEntries().length);
  const [insightsCount, setInsightsCount] = useState(() => StorageService.getInsights().length);
  const [purgeConfirmed, setPurgeConfirmed] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  const handleToggleConsent = () => {
    const updated = StorageService.saveAiConsent({
      consented: !consent.consented,
      remoteFastApiOptIn: !consent.remoteFastApiOptIn,
    });
    setConsent(updated);
  };

  const handleExportData = () => {
    const data = StorageService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pcos_saathi_vault_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 3000);
  };

  const handlePurgeAll = () => {
    if (window.confirm('Are you absolutely sure? This will permanently delete all symptom logs, cycle dates, and doctor summaries stored on this device. This action cannot be undone.')) {
      StorageService.clearAllPcosData();
      setHealthEntriesCount(0);
      setCycleEntriesCount(0);
      setInsightsCount(0);
      setPurgeConfirmed(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Privacy Controls & Local Vault"
        description="Inspect what is stored on this hardware, manage offline AI consent, and export or purge your health records."
        badge="Zero-Cloud Vault"
        badgeVariant="emerald"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
      />

      {/* Vault Status Card */}
      <section aria-labelledby="vault-status-title">
        <Card
          title="Hardware Storage Status"
          subtitle="All records are encrypted and retained strictly inside your local browser sandbox"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block uppercase">Health Entries</span>
              <p className="text-xl font-bold text-stone-900 mt-1">{healthEntriesCount} logs</p>
              <span className="text-[10px] text-stone-500 font-mono">pcos_saathi_health_entries</span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block uppercase">Cycle Logs</span>
              <p className="text-xl font-bold text-stone-900 mt-1">{cycleEntriesCount} cycles</p>
              <span className="text-[10px] text-stone-500 font-mono">pcos_saathi_cycle_entries</span>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block uppercase">Computed Insights</span>
              <p className="text-xl font-bold text-stone-900 mt-1">{insightsCount} insights</p>
              <span className="text-[10px] text-stone-500 font-mono">pcos_saathi_insights</span>
            </div>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Client-Side Invariant</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              No analytics SDKs, tracking pixels, or remote database connectors are loaded.
              Telemetry is permanently disabled by architectural design.
            </p>
          </div>
        </Card>
      </section>

      {/* AI Consent & Processing Mode */}
      <section aria-labelledby="ai-consent-title">
        <Card
          title="AI Processing & Consent Settings"
          subtitle="Configure how speech and symptom extraction execute"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">Optional Remote NLP / FastAPI Enhancement</span>
                  <Badge variant={consent.remoteFastApiOptIn ? 'emerald' : 'stone'} size="sm">
                    {consent.remoteFastApiOptIn ? 'Opted In' : 'Offline Rule Engine Only'}
                  </Badge>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed max-w-xl">
                  When enabled, anonymous transcripts can be sent to a stateless, database-free FastAPI microservice for improved multilingual nuance. When disabled, 100% of triage runs locally via deterministic regex rules.
                </p>
              </div>

              <Button
                variant={consent.remoteFastApiOptIn ? 'secondary' : 'outline'}
                size="sm"
                onClick={handleToggleConsent}
                ariaLabel="Toggle Remote AI consent"
                helperText="Changes saved to pcos_saathi_ai_consent"
              >
                {consent.remoteFastApiOptIn ? 'Disable Remote NLP' : 'Enable Remote NLP'}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-stone-500">
                Key: <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded font-mono">{STORAGE_KEYS.AI_CONSENT}</code>
              </span>
              <span className="text-xs text-stone-500">
                Last modified: {consent.timestamp ? new Date(consent.timestamp).toLocaleDateString() : 'Default offline state'}
              </span>
            </div>
          </div>
        </Card>
      </section>

      {/* Backup Export & Complete Wipe */}
      <section aria-labelledby="data-actions-title">
        <Card
          title="Backup & Data Eradication"
          subtitle="Export your data for safe keeping or purge it completely"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-stone-200 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Export Raw Health Vault (JSON)</h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Download a structured, unencrypted copy of your logs to your phone or computer.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportData}
                ariaLabel="Download full JSON data export"
                helperText="Generates .json download"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                }
              >
                {downloadNotice ? '✓ File Downloaded!' : 'Export JSON Backup'}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-2 border-red-200 bg-red-50/50 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-red-950">Emergency Data Erasure</h3>
                <p className="text-xs text-red-800 mt-0.5">
                  Instantly and irreversibly wipes all <code className="font-mono">pcos_saathi_*</code> keys from this device.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handlePurgeAll}
                ariaLabel="Delete all stored PCOS Saathi records permanently"
                helperText="Irreversible action"
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                }
              >
                Delete All My Data
              </Button>
            </div>

            {purgeConfirmed && (
              <div role="status" className="p-3 bg-red-100 text-red-900 border border-red-300 rounded-xl text-xs font-semibold">
                ✓ All PCOS Saathi local records have been successfully eradicated from this browser.
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}

export default PrivacyView;
