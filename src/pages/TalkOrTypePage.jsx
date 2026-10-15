import React from 'react'
import { TalkOrType } from '../components/TalkOrType.jsx'
import { DisclaimerBanner } from '../components/DisclaimerBanner.jsx'

export function TalkOrTypePage({ onHealthEntryCreated, currentLanguage = 'en' }) {
  return <div className="page-stack"><header className="page-heading"><p className="eyebrow">Start with what you notice</p><h1 data-page-heading tabIndex="-1">Talk or type</h1><p>Use your everyday words. You can speak or type, and review the notes before saving.</p></header><DisclaimerBanner /><TalkOrType initialLanguage={currentLanguage} onHealthEntryCreated={onHealthEntryCreated} /></div>
}
