import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { Card } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx';
import { MOCK_HEALTH_ENTRIES, MOCK_USER_PROFILE } from '../mockData/healthEntries.js';

export function SummaryView({ onNavigate }) {
  const [copiedStatus, setCopiedStatus] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyClipboard = () => {
    const textSummary = `
SakhiCare Clinician Summary Report
Patient: ${MOCK_USER_PROFILE.name} (${MOCK_USER_PROFILE.currentStage})
Date: ${new Date().toLocaleDateString()}
Storage: 100% On-Device Encrypted

Key Vitals Trend:
- Blood Pressure: Stable (~118/76 mmHg)
- Fetal Kicks: Active (Average 10 kicks / 35-45 min session)
- Hydration: 2.2L / day avg

Reported Symptoms (Last 7 Days):
- Mild Lower Back Pain (associated with standing >30m)
- Nighttime Acid Reflux (managed with elevation & dietary changes)

Doctor Questions Prepared:
1. Iron chewable tablet absorption with citrus water
2. Routine anomaly scan scheduling confirmation
    `.trim();

    navigator.clipboard?.writeText(textSummary);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Clinician Health Summary"
        description="A concise, structured summary ready to share with your Doctor, ANM, or Gynaecologist during your next appointment."
        badge="Ready for Doctor Visit"
        badgeVariant="purple"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyClipboard}
              ariaLabel="Copy text brief to clipboard"
              helperText="For messaging or email"
            >
              {copiedStatus ? '✓ Copied to Clipboard!' : 'Copy Text Brief'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              ariaLabel="Print or Export 1-Page Medical PDF"
              helperText="Generates offline printable sheet"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              }
            >
              Print / Save PDF
            </Button>
          </div>
        }
      />

      <DisclaimerBanner dismissible={false} />

      {/* Printable Clinical Sheet Container */}
      <div className="bg-white border-2 border-stone-300 rounded-3xl p-6 sm:p-8 shadow-sm print:border-none print:shadow-none space-y-6">
        
        {/* Clinician Sheet Header */}
        <div className="border-b-2 border-stone-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-rose-800 tracking-tight">
                SakhiCare
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-stone-100 rounded text-stone-700">
                Patient Pre-Consultation Brief
              </span>
            </div>
            <h2 className="text-lg font-bold text-stone-900 mt-1">
              Patient: {MOCK_USER_PROFILE.name} (Age 28)
            </h2>
            <p className="text-xs text-stone-500">
              Current Stage: <strong>{MOCK_USER_PROFILE.currentStage}</strong> · Generated from Encrypted On-Device Logs
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold text-stone-500 block">Report Window:</span>
            <span className="text-sm font-bold text-stone-800">Last 14 Days (Oct 2026)</span>
            <Badge variant="emerald" size="sm" showDot className="mt-1">Device Verified</Badge>
          </div>
        </div>

        {/* 1. Vitals & Biometrics Summary */}
        <section aria-labelledby="vitals-trend-title" className="space-y-2">
          <h3 id="vitals-trend-title" className="text-sm font-bold uppercase tracking-wider text-stone-800">
            1. Physiological Vitals Trend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block">Blood Pressure (Resting)</span>
              <p className="text-base font-bold text-stone-900">118 / 76 mmHg</p>
              <span className="text-[10px] text-emerald-700 font-medium">Normotensive · No spikes logged</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block">Fetal Kicks Count (1-Hour)</span>
              <p className="text-base font-bold text-stone-900">10 movements / 35 min</p>
              <span className="text-[10px] text-emerald-700 font-medium">Consistent daily activity</span>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 block">Resting Heart Rate</span>
              <p className="text-base font-bold text-stone-900">74 - 82 bpm</p>
              <span className="text-[10px] text-emerald-700 font-medium">Within pregnancy baseline</span>
            </div>
          </div>
        </section>

        {/* 2. Symptom Frequency & Severity Table */}
        <section aria-labelledby="symptom-table-title" className="space-y-2">
          <h3 id="symptom-table-title" className="text-sm font-bold uppercase tracking-wider text-stone-800">
            2. Symptom Observations & Timeline
          </h3>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-700 border-b border-stone-200">
                <tr>
                  <th className="p-3 font-semibold">Date & Time</th>
                  <th className="p-3 font-semibold">Observation</th>
                  <th className="p-3 font-semibold">Severity</th>
                  <th className="p-3 font-semibold">Trigger & Relief Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {MOCK_HEALTH_ENTRIES.filter(e => e.category === 'symptom' || e.category === 'vital').map(item => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="p-3 font-medium text-stone-600 whitespace-nowrap">{item.dateFormatted}</td>
                    <td className="p-3 font-bold text-stone-900">{item.title}</td>
                    <td className="p-3">
                      <Badge variant={item.severity === 'moderate' ? 'amber' : 'emerald'} size="sm">
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="p-3 text-stone-600 max-w-xs">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Patient Doctor Questions */}
        <section aria-labelledby="doctor-questions-title" className="space-y-2">
          <h3 id="doctor-questions-title" className="text-sm font-bold uppercase tracking-wider text-stone-800">
            3. Questions Prepared for Doctor / ANM
          </h3>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-stone-700 bg-stone-50 p-4 rounded-xl border border-stone-200">
            <li className="leading-relaxed">
              <strong>Iron Supplementation:</strong> Can chewable iron tablets be accompanied with fresh lemon water for better absorption without worsening evening heartburn?
            </li>
            <li className="leading-relaxed">
              <strong>Routine Anomaly Scan:</strong> Scheduling dates for the targeted anomaly ultrasound scan between weeks 24 and 26.
            </li>
            <li className="leading-relaxed">
              <strong>Postural Relief:</strong> Safe stretching recommendations for lower back strain when standing during chores.
            </li>
          </ul>
        </section>

        {/* Clinician Signature Footer */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            <p>Clinician Notes / Advice Given:</p>
            <div className="w-64 border-b border-stone-300 mt-6"></div>
          </div>
          <div>
            <p>Doctor / ANM Signature & Stamp:</p>
            <div className="w-48 border-b border-stone-300 mt-6"></div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default SummaryView;
