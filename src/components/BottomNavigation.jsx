import React from 'react'
import { MAIN_SECTIONS } from './navigationItems.js'
import { t } from '../data/translations.js'

const NAVIGATION_LABELS = {
  home: 'nav.home',
  talk: 'nav.talk',
  tracker: 'nav.tracker',
  insights: 'nav.patterns',
  doctor: 'nav.summary',
  learn: 'nav.learn',
}

export function BottomNavigation({ activePage, onNavigate, currentLanguage = 'en' }) {
  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {MAIN_SECTIONS.map(({ id, label, shortLabel, icon: Icon }) => {
        const translatedLabel = NAVIGATION_LABELS[id] ? t(NAVIGATION_LABELS[id], currentLanguage) : label
        return <button key={id} type="button" className={`bottom-nav-item ${activePage === id ? 'is-active' : ''}`} aria-label={translatedLabel} aria-current={activePage === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
          <Icon size={19} aria-hidden="true" />
          <span>{shortLabel && currentLanguage === 'en' ? shortLabel : translatedLabel}</span>
        </button>
      })}
    </nav>
  )
}
