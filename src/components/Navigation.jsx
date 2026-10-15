import React from 'react'
import { Shield } from 'lucide-react'
import { MAIN_SECTIONS } from './navigationItems.js'
import { SUPPORTED_LANGUAGES } from './common/LanguageSelector.jsx'

export function Navigation({ activePage, onNavigate, currentLanguage = 'en', onOpenLanguageSelector }) {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <aside className="desktop-navigation" aria-label="Main navigation">
      <a className="app-brand" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home') }}>
        <span className="lunaher-logo-window lunaher-sidebar-logo"><img src="/lunaher-logo.png" alt="LunaHer" /></span>
      </a>
      <nav className="section-links">
        {MAIN_SECTIONS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={`section-link ${activePage === id ? 'is-active' : ''}`} aria-current={activePage === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
            <Icon size={19} aria-hidden="true" /><span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Language selector — moved from header to sidebar */}
      <div className="sidebar-language-section">
        <button
          type="button"
          onClick={onOpenLanguageSelector}
          className="sidebar-language-button"
          aria-label={`Current language: ${currentLangObj.name}. Click to change language.`}
        >
          <svg className="sidebar-language-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="sidebar-language-label">
            {currentLangObj.native}
            <span className="sidebar-language-name">({currentLangObj.name})</span>
          </span>
          <span className="sidebar-language-chevron">▼</span>
        </button>
        <span className="sidebar-language-hint">Change Language</span>
      </div>

      <div className="navigation-note"><Shield size={17} aria-hidden="true" /><span>Your health notes stay on this device.</span></div>
    </aside>
  )
}
