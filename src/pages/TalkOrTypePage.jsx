import React from 'react'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { TalkOrType } from '../components/TalkOrType.jsx'
import { t } from '../data/translations.js'

export function TalkOrTypePage({ onNavigate, onHealthEntryCreated, currentLanguage = 'en', onSelectLanguage }) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={t('talkPage.title', currentLanguage) || 'Talk or Type with LumaHer'}
        description={t('talkPage.description', currentLanguage) || 'Describe symptoms in your own words, by voice or text. Results are educational, not diagnostic.'}
        badge={t('talkPage.badge', currentLanguage) || 'Private Companion'}
        badgeVariant="rose"
        onBack={onNavigate ? () => onNavigate('/') : undefined}
        backLabel={t('talkPage.backHome', currentLanguage) || 'Back to Home Dashboard'}
        backHelperText="Returns to main overview"
      />
      <TalkOrType
        initialLanguage={currentLanguage}
        onLanguageChange={onSelectLanguage}
        onHealthEntryCreated={onHealthEntryCreated}
      />
    </div>
  )
}

export default TalkOrTypePage
