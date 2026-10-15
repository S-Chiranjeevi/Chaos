import React from 'react'
import { Globe, Shield } from 'lucide-react'
import { MAIN_SECTIONS } from './navigationItems.js'
import { SUPPORTED_LANGUAGES } from './common/LanguageSelector.jsx'
import { t } from '../data/translations.js'

const NAVIGATION_LABELS = {
  home: 'nav.home',
  talk: 'nav.talk',
  tracker: 'nav.tracker',
  insights: 'nav.patterns',
  doctor: 'nav.summary',
  learn: 'nav.learn',
}

export function Navigation({ activePage, onNavigate, currentLanguage = 'en', onOpenLanguageSelector }) {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0]

  return (
    <aside className="desktop-navigation" aria-label="Main navigation">
      <a className="app-brand" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home') }}>
        <span className="lunaher-logo-window lunaher-sidebar-logo"><img src="/lunaher-logo.png" alt="LunaHer" /></span>
      </a>
      <nav className="section-links">
        {MAIN_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`section-link ${activePage === id ? 'is-active' : ''}`} aria-current={activePage === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
            <Icon size={19} aria-hidden="true" /><span>{NAVIGATION_LABELS[id] ? t(NAVIGATION_LABELS[id], currentLanguage) : label}</span>
          </button>
        ))}
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
            <span className="sidebar-language-action">{currentLanguage === 'hi' ? 'बदलें' : 'Change'}</span>
          </button>
        )}
        <div className="navigation-note"><Shield size={17} aria-hidden="true" /><span>{currentLanguage === 'hi' ? 'आपके स्वास्थ्य नोट्स इसी डिवाइस पर रहते हैं।' : 'Your health notes stay on this device.'}</span></div>
      </div>
    </aside>
  )
}

export default Navigation
