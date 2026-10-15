import React from 'react'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { TalkOrType } from '../components/TalkOrType.jsx'

export function TalkOrTypePage({ onNavigate, onHealthEntryCreated, currentLanguage = 'en' }) {
  return <div className="space-y-6">
    <PageHeader title="Talk or Type with Sakhi" description="Describe symptoms in your own words, by voice or text. Results are educational, not diagnostic." badge="Private Companion" badgeVariant="rose" onBack={onNavigate ? () => onNavigate('/') : undefined} backLabel="Back to Home Dashboard" backHelperText="Returns to main overview" />
    <TalkOrType initialLanguage={currentLanguage} onHealthEntryCreated={onHealthEntryCreated} />
  </div>
}

export default TalkOrTypePage
