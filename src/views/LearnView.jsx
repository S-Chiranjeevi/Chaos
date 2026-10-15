import React from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { LearnAndMyths } from '../components/LearnAndMyths.jsx';
import { BodyExplorer } from '../components/BodyExplorer.jsx';
import { RotterdamMatrix } from '../components/RotterdamMatrix.jsx';
import { SpecialistNavigator } from '../components/SpecialistNavigator.jsx';

export function LearnView({ onNavigate, currentLanguage = 'en' }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Evidence-Based Learning & Myths"
        description="Empowering women with verified PCOS facts, myth-busting explanations, and daily self-care rituals."
        badge="Evidence-Based"
        badgeVariant="blue"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
      />

      <LearnAndMyths currentLanguage={currentLanguage} />

      {/* Interactive Anatomical Body Explorer */}
      <div className="pt-8 space-y-3">
        <div className="border-b border-stone-200 pb-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Interactive Symptom Explorer</span>
          <h2 className="text-xl font-bold text-stone-900">Where Symptoms Manifest in the Body</h2>
          <p className="text-xs text-stone-600">Click on anatomical hotspots to bridge colloquial expressions with physiological pathways and clinical doctor questions.</p>
        </div>
        <BodyExplorer />
      </div>

      {/* Rotterdam 2003 Diagnostic Consensus */}
      <div className="pt-8 space-y-3">
        <div className="border-b border-stone-200 pb-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Clinical Grounding</span>
          <h2 className="text-xl font-bold text-stone-900">The Rotterdam 2003 Consensus Criteria</h2>
          <p className="text-xs text-stone-600">Why clinical blood tests and in-person ultrasound imaging are required, and why digital tools cannot diagnose.</p>
        </div>
        <RotterdamMatrix />
      </div>

      {/* Specialist Navigator */}
      <div className="pt-8 space-y-3">
        <div className="border-b border-stone-200 pb-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Care Navigation</span>
          <h2 className="text-xl font-bold text-stone-900">Which Healthcare Specialist Should You Consult?</h2>
          <p className="text-xs text-stone-600">Guidance on selecting the right medical specialist for your primary symptoms and care goals.</p>
        </div>
        <SpecialistNavigator />
      </div>
    </div>
  );
}

export default LearnView;
