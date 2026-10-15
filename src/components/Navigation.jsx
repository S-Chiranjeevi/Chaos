import React from 'react'
import { Globe, Shield } from 'lucide-react'
import { MAIN_SECTIONS } from './navigationItems.js'
import { SUPPORTED_LANGUAGES } from './common/LanguageSelector.jsx'
import { t } from '../data/translations.js'

export function Navigation({ activePage, onNavigate, currentLanguage = 'en', onOpenLanguageSelector }) {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0]

  return (
    <aside className="desktop-navigation" aria-label="Main navigation">
      <a className="app-brand" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home') }}>
        <span className="lunaher-logo-window lunaher-sidebar-logo"><img src="/lunaher-logo.png" alt="LunaHer" /></span>
      </a>
      <nav className="section-links">
        {MAIN_SECTIONS.map(({ id, label, icon: Icon }) => {
          const translatedLabel = t(`nav.${id}`, currentLanguage) || label
          return (
            <button key={id} type="button" className={`section-link ${activePage === id ? 'is-active' : ''}`} aria-current={activePage === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
              <Icon size={19} aria-hidden="true" /><span>{translatedLabel}</span>
            </button>
          )
        })}
      </nav>
      <div className="navigation-footer">
        {onOpenLanguageSelector && (
          <button
            type="button"
            className="sidebar-language-trigger"
            onClick={onOpenLanguageSelector}
            aria-label={`Current language is ${currentLangObj.name}. Click to change language.`}
          >
            <div className="sidebar-language-label">
              <Globe size={16} aria-hidden="true" />
              <span>{currentLangObj.native} <small className="sidebar-language-name">({currentLangObj.name})</small></span>
            </div>
            <span className="sidebar-language-action">{t('buttons.change', currentLanguage) || 'Change'}</span>
          </button>
        )}
        <div className="navigation-note"><Shield size={17} aria-hidden="true" /><span>{t('nav.privacyNote', currentLanguage) || 'Your health notes stay on this device.'}</span></div>
      </div>
    </aside>
  )
}

export default Navigation
