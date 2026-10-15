import React from 'react'
import { LearnAndMyths } from '../components/LearnAndMyths.jsx'
import { t } from '../data/translations.js'

export function LearnPage({ currentLanguage = 'en' }) {
  return (
    <div className="page-stack">
      <header className="page-heading">
        <p className="eyebrow">{t('learnPage.eyebrow', currentLanguage) || 'Learn at your own pace'}</p>
        <h1 data-page-heading tabIndex="-1">{t('learnPage.title', currentLanguage) || 'Learn and myths'}</h1>
        <p>{t('learnPage.description', currentLanguage) || 'Short, clear information can help you prepare questions. It cannot diagnose a condition.'}</p>
      </header>
      <LearnAndMyths currentLanguage={currentLanguage} />
    </div>
  )
}

export default LearnPage
