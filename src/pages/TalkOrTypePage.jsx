import React from 'react'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { TalkOrType } from '../components/TalkOrType.jsx'
import { UI_STRINGS } from '../data/languages.js'

export function TalkOrTypePage({ onNavigate, onHealthEntryCreated, currentLanguage = 'en' }) {
  const strings = UI_STRINGS[currentLanguage] || UI_STRINGS.en
  return <div className="space-y-6">
    <PageHeader title={strings.talkOrTypeHeader} description={strings.heroSubtitle} badge="LunaHer" badgeVariant="rose" onBack={onNavigate ? () => onNavigate('/') : undefined} backLabel="Back to Home Dashboard" backHelperText="Returns to main overview" />
    <TalkOrType initialLanguage={currentLanguage} onHealthEntryCreated={onHealthEntryCreated} />
  </div>
}

export default TalkOrTypePage
