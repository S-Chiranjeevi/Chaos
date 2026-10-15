import React from 'react';
import { PageHeader } from '../components/layout/PageHeader.jsx';
import { LearnAndMyths } from '../components/LearnAndMyths.jsx';

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
    </div>
  );
}

export default LearnView;
