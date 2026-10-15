import React from 'react'
import { CycleTracker } from '../components/CycleTracker.jsx'

export function HealthTrackerPage({ latestEntry }) {
  return <div className="page-stack"><header className="page-heading"><p className="eyebrow">Optional notes, on your device</p><h1 data-page-heading tabIndex="-1">My health tracker</h1><p>Add a period start date or a short note when you want to. Tracking is always optional.</p></header><CycleTracker latestEntry={latestEntry} /></div>
}
