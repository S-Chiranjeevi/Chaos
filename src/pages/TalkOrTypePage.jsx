import React from 'react'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx'
import { TalkOrType } from '../components/TalkOrType.jsx'

export function TalkOrTypePage({ onNavigate, currentLanguage = 'en' }) {
  return <div className="space-y-6">
    <PageHeader title="Talk or Type with Sakhi" description="Describe symptoms in your own words, by voice or text. Results are educational, not diagnostic." badge="Private Companion" badgeVariant="rose" onBack={() => onNavigate('/')} backLabel="Back to Home Dashboard" backHelperText="Returns to main overview" />
    <DisclaimerBanner dismissible={false} />
    <TalkOrType initialLanguage={currentLanguage} />
  </div>
}

export default TalkOrTypePage
