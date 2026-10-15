import React from 'react'
import { MAIN_SECTIONS } from './navigationItems.js'

export function BottomNavigation({ activePage, onNavigate }) {
  return (
    <nav className="bottom-navigation" aria-label="Main navigation">
      {MAIN_SECTIONS.map(({ id, label, shortLabel, icon: Icon }) => (
        <button key={id} type="button" className={`bottom-nav-item ${activePage === id ? 'is-active' : ''}`} aria-label={label} aria-current={activePage === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
          <Icon size={19} aria-hidden="true" />
          <span>{shortLabel || label}</span>
        </button>
      ))}
    </nav>
  )
}
