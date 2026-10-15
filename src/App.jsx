import React, { useEffect, useState } from 'react'
import Header from './components/layout/Header.jsx'
import { LanguageSelector } from './components/common/LanguageSelector.jsx'
import { BottomNavigation } from './components/BottomNavigation.jsx'
import { Navigation } from './components/Navigation.jsx'
import { PrivacyControls } from './components/PrivacyControls.jsx'
import { DoctorSummaryPage } from './pages/DoctorSummaryPage.jsx'
import { HealthTrackerPage } from './pages/HealthTrackerPage.jsx'
import { Home } from './pages/Home.jsx'
import { InsightsPage } from './pages/InsightsPage.jsx'
import { LearnPage } from './pages/LearnPage.jsx'
import { TalkOrTypePage } from './pages/TalkOrTypePage.jsx'
import { getLatestHealthEntry } from './models/healthEntry.js'
import './App.css'
import './layout.css'

const PATH_TO_PAGE = {
  '/': 'home', '/talk': 'talk', '/tracker': 'tracker', '/insights': 'insights',
  '/patterns': 'insights', '/doctor': 'doctor', '/summary': 'doctor', '/learn': 'learn', '/privacy': 'privacy',
}
const PAGE_TO_PATH = { home: '/', talk: '/talk', tracker: '/tracker', insights: '/insights', doctor: '/doctor', learn: '/learn', privacy: '/privacy' }
const PAGE_TITLES = {
  home: 'Home', talk: 'Talk or Type', tracker: 'My Health Tracker',
  insights: 'Early Warnings and Insights', doctor: 'Doctor Summary',
  learn: 'Learn and Myths', privacy: 'Privacy',
}

function App() {
  const [activePage, setActivePage] = useState(() => PATH_TO_PAGE[window.location.pathname] || 'home')
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const [lastSharedEntry, setLastSharedEntry] = useState(() => getLatestHealthEntry())
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const handleEntryUpdate = (event) => {
      setLastSharedEntry(event.detail)
      setRefreshKey((value) => value + 1)
    }
    const handleHistoryChange = () => setActivePage(PATH_TO_PAGE[window.location.pathname] || 'home')
    window.addEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate)
    window.addEventListener('popstate', handleHistoryChange)
    return () => {
      window.removeEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate)
      window.removeEventListener('popstate', handleHistoryChange)
    }
  }, [])

  useEffect(() => {
    document.title = `${PAGE_TITLES[activePage]} · SakhiCare`
    if (activePage !== 'home') requestAnimationFrame(() => document.querySelector('[data-page-heading]')?.focus())
  }, [activePage])

  function navigate(page) {
    const path = PAGE_TO_PATH[page] ? page : PATH_TO_PAGE[page] || 'home'
    setActivePage(path)
    const nextPath = PAGE_TO_PATH[path]
    if (window.location.pathname !== nextPath) window.history.pushState({}, '', nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleDataDeleted() {
    setLastSharedEntry(null)
    setRefreshKey((value) => value + 1)
  }

  function renderPage() {
    switch (activePage) {
      case 'talk': return <TalkOrTypePage key={currentLanguage} currentLanguage={currentLanguage} onHealthEntryCreated={setLastSharedEntry} />
      case 'tracker': return <HealthTrackerPage latestEntry={lastSharedEntry} />
      case 'insights': return <InsightsPage onNavigate={navigate} healthEntry={lastSharedEntry} refreshKey={refreshKey} />
      case 'doctor': return <DoctorSummaryPage onNavigate={navigate} healthEntry={lastSharedEntry} refreshKey={refreshKey} currentLanguage={currentLanguage} />
      case 'learn': return <LearnPage />
      case 'privacy': return <div className="page-stack"><header className="page-heading"><p className="eyebrow">Your information belongs to you</p><h1 data-page-heading tabIndex="-1">Privacy</h1><p>See what stays on this device and remove your saved SakhiCare information whenever you choose.</p></header><PrivacyControls onDataDeleted={handleDataDeleted} /></div>
      default: return <Home onNavigate={navigate} />
    }
  }

  return (
    <div className="app-root light-theme sakhi-layout">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Header currentLanguage={currentLanguage} onOpenLanguageSelector={() => setLanguageDialogOpen(true)} onNavigateHome={() => navigate('home')} />
      <div className="app-body">
        <Navigation activePage={activePage} onNavigate={navigate} />
        <div className="app-column">
          <main id="main-content" className="page-content" tabIndex="-1">
            {renderPage()}
            <footer className="page-footer"><span>SakhiCare · A gentle place to begin</span><button type="button" onClick={() => navigate('privacy')}>Privacy choices</button></footer>
          </main>
        </div>
      </div>
      <BottomNavigation activePage={activePage} onNavigate={navigate} />
      <LanguageSelector isOpen={languageDialogOpen} onClose={() => setLanguageDialogOpen(false)} currentLanguage={currentLanguage} onSelectLanguage={setCurrentLanguage} />
    </div>
  )
}

export default App
