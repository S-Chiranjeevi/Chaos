import React from 'react';
import { CycleTracker } from '../components/CycleTracker.jsx';

export function HealthTrackerPage({ latestEntry }) {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">Data-based cycle observations, on your device</p>
        <h1 data-page-heading tabIndex="-1">
          Cycle Insights & Forecast
        </h1>
        <p>
          Record period dates to observe your cycle trends, view transparent irregularity classifications, and receive estimated upcoming windows.
        </p>
      </header>
      <CycleTracker latestEntry={latestEntry} />
    </div>
  );
}

export default HealthTrackerPage;
