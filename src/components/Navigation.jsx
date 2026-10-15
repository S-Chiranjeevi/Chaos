import React from 'react'
import { Shield } from 'lucide-react'
import { MAIN_SECTIONS } from './navigationItems.js'

export function Navigation({ activePage, onNavigate }) {
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
      <div className="navigation-note"><Shield size={17} aria-hidden="true" /><span>Your health notes stay on this device.</span></div>
    </aside>
  )
}
