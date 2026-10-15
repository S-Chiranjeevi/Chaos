import React from 'react'
import { MAIN_SECTIONS } from './navigationItems.js'
import { t } from '../data/translations.js'

export function BottomNavigation({ activePage, onNavigate, currentLanguage = 'en' }) {
  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {MAIN_SECTIONS.map(({ id, label, shortLabel, icon: Icon }) => {
        const translatedLabel = t(`nav.${id}`, currentLanguage) || label
        const translatedShort = t(`nav.${id}Short`, currentLanguage) || translatedLabel || shortLabel || label
        return (
          <button key={id} type="button" className={`bottom-nav-item ${activePage === id ? 'is-active' : ''}`} aria-label={translatedLabel} aria-current={activePage === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
            <Icon size={19} aria-hidden="true" />
            <span>{translatedShort}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNavigation
