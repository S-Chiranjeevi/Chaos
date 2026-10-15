import React from 'react';
import { DoctorSummaryPage } from '../pages/DoctorSummaryPage.jsx';

export function SummaryView({ onNavigate, currentLanguage = 'en' }) {
  return (
    <div className="space-y-6">
      <DoctorSummaryPage onNavigate={onNavigate} currentLanguage={currentLanguage} />
    </div>
  );
}

export default SummaryView;
