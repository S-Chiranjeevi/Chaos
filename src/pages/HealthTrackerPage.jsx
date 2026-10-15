import React from 'react';
import { CycleTracker } from '../components/CycleTracker.jsx';
import { t } from '../data/translations.js';

export function HealthTrackerPage({ latestEntry, currentLanguage = 'en' }) {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">{t('trackerPage.eyebrow', currentLanguage) || 'Data-based cycle observations, on your device'}</p>
        <h1 data-page-heading tabIndex="-1">
          {t('trackerPage.title', currentLanguage) || 'Cycle Insights & Forecast'}
        </h1>
        <p>
          {t('trackerPage.description', currentLanguage) || 'Record period dates to observe your cycle trends, view transparent irregularity classifications, and receive estimated upcoming windows.'}
        </p>
      </header>
      <CycleTracker latestEntry={latestEntry} currentLanguage={currentLanguage} />
    </div>
  );
}

export default HealthTrackerPage;
