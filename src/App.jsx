import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import Header from './components/layout/Header.jsx';
import GlobalError from './components/layout/GlobalError.jsx';
import { LanguageSelector, SUPPORTED_LANGUAGES } from './components/common/LanguageSelector.jsx';
import { BottomNavigation } from './components/BottomNavigation.jsx';
import { Navigation } from './components/Navigation.jsx';
import { DoctorSummaryPage } from './pages/DoctorSummaryPage.jsx';
import { HealthTrackerPage } from './pages/HealthTrackerPage.jsx';
import { Home } from './pages/Home.jsx';
import { InsightsPage } from './pages/InsightsPage.jsx';
import { LearnPage } from './pages/LearnPage.jsx';
import { TalkOrTypePage } from './pages/TalkOrTypePage.jsx';
import { ChatbotWidget } from './components/ChatbotWidget.jsx';
import { BackgroundMusic } from './components/BackgroundMusic.jsx';
import { ResearchScreeningPage } from './pages/ResearchScreeningPage.jsx';
import { getLatestHealthEntry } from './models/healthEntry.js';
import { StorageService } from './services/storageService.js';
import './App.css';
import './layout.css';

const PATH_TO_PAGE = {
  '/': 'home',
  '/talk': 'talk',
  '/tracker': 'tracker',
  '/insights': 'insights',
  '/patterns': 'insights',
  '/doctor': 'doctor',
  '/summary': 'doctor',
  '/screening': 'screening',
  '/research': 'screening',
  '/learn': 'learn',
};

const PAGE_TO_PATH = {
  home: '/',
  talk: '/talk',
  tracker: '/tracker',
  insights: '/insights',
  screening: '/screening',
  doctor: '/summary',
  learn: '/learn',
};

const PAGE_TITLES = {
  home: 'Home',
  talk: 'Talk or Type',
  tracker: 'Cycle Insights & Forecast',
  insights: 'Early Warnings and Insights',
  screening: 'LunaHer Pattern Screening',
  doctor: 'Doctor Summary',
  learn: 'Learn and Myths',
};

export function App() {
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (PATH_TO_PAGE[hash]) return PATH_TO_PAGE[hash];
    return PATH_TO_PAGE[window.location.pathname] || 'home';
  });

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return StorageService.getPreferences().language || 'en';
  });
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [lastSharedEntry, setLastSharedEntry] = useState(() => getLatestHealthEntry());
  const [refreshKey, setRefreshKey] = useState(0);
  const [globalError, setGlobalError] = useState(null);

  function handleDataDeleted() {
    StorageService.clearAllPcosData();
    setLastSharedEntry(null);
    setRefreshKey((value) => value + 1);
  }

  useEffect(() => {
    const handleEntryUpdate = (event) => {
      setLastSharedEntry(event.detail);
      setRefreshKey((value) => value + 1);
    };

    const handleStorageChange = (e) => {
      if (e.detail?.key === 'all_purged') {
        setLastSharedEntry(null);
        setRefreshKey((value) => value + 1);
      }
    };

    const handleHistoryChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (PATH_TO_PAGE[hash]) {
        setActivePage(PATH_TO_PAGE[hash]);
        return;
      }
      setActivePage(PATH_TO_PAGE[window.location.pathname] || 'home');
    };

    window.addEventListener('lunaher:healthEntryUpdate', handleEntryUpdate);
    window.addEventListener('lunaher:dataDeleted', handleDataDeleted);
    window.addEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate);
    window.addEventListener('sakhicare:dataDeleted', handleDataDeleted);
    window.addEventListener('pcos_saathi:data_change', handleStorageChange);
    window.addEventListener('popstate', handleHistoryChange);
    window.addEventListener('hashchange', handleHistoryChange);

    return () => {
      window.removeEventListener('lunaher:healthEntryUpdate', handleEntryUpdate);
      window.removeEventListener('lunaher:dataDeleted', handleDataDeleted);
      window.removeEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate);
      window.removeEventListener('sakhicare:dataDeleted', handleDataDeleted);
      window.removeEventListener('pcos_saathi:data_change', handleStorageChange);
      window.removeEventListener('popstate', handleHistoryChange);
      window.removeEventListener('hashchange', handleHistoryChange);
    };
  }, []);

  useEffect(() => {
    document.title = `${PAGE_TITLES[activePage]} · LunaHer`;
    if (activePage !== 'home') {
      requestAnimationFrame(() => document.querySelector('[data-page-heading]')?.focus());
    }
  }, [activePage]);

  function navigate(page) {
    const targetPage = PAGE_TO_PATH[page] ? page : PATH_TO_PAGE[page] || 'home';
    setActivePage(targetPage);
    const nextPath = PAGE_TO_PATH[targetPage] || '/';
    window.location.hash = nextPath;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function renderPage() {
    switch (activePage) {
      case 'talk':
        return (
          <TalkOrTypePage
            key={currentLanguage}
            currentLanguage={currentLanguage}
            onHealthEntryCreated={(entry) => {
              setLastSharedEntry(entry);
              setRefreshKey((v) => v + 1);
            }}
          />
        );
      case 'tracker':
        return <HealthTrackerPage latestEntry={lastSharedEntry} />;
      case 'insights':
        return (
          <InsightsPage
            onNavigate={navigate}
            healthEntry={lastSharedEntry}
            refreshKey={refreshKey}
          />
        );
      case 'screening':
        return <ResearchScreeningPage onNavigate={navigate} />;
      case 'doctor':
        return (
          <DoctorSummaryPage
            onNavigate={navigate}
            healthEntry={lastSharedEntry}
            refreshKey={refreshKey}
            currentLanguage={currentLanguage}
          />
        );
      case 'learn':
        return <LearnPage />;
      default:
        return <Home onNavigate={navigate} />;
    }
  }

  return (
    <div className="app-root light-theme sakhi-layout min-h-screen bg-stone-100/70 text-stone-900 font-sans">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      {/* Global Error Banner */}
      <GlobalError
        error={globalError}
        onDismiss={() => setGlobalError(null)}
        onRetry={() => {
          alert('Retrying local storage verification...');
          setGlobalError(null);
        }}
      />

      {/* Header */}
      <Header
        onNavigateHome={() => navigate('home')}
      />

      <div className="app-body">
        <Navigation
          activePage={activePage}
          onNavigate={navigate}
          currentLanguage={currentLanguage}
          onOpenLanguageSelector={() => setLanguageDialogOpen(true)}
        />
        <div className="app-column">
          <main id="main-content" className="page-content" tabIndex="-1">
            {renderPage()}
            <footer className="page-footer">
              <span>LunaHer · A gentle place to begin</span>
              <button
                type="button"
                onClick={() => setLanguageDialogOpen(true)}
                className="page-footer-language-btn"
                aria-label={`Current language is ${SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.name || 'English'}. Click to change language.`}
              >
                <Globe size={14} aria-hidden="true" />
                <span>
                  Language: <strong>{SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.native || 'English'}</strong> ({SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)?.name || 'English'})
                </span>
              </button>
            </footer>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <BottomNavigation activePage={activePage} onNavigate={navigate} />

      <ChatbotWidget onNavigate={navigate} />
      <BackgroundMusic />

      {/* Language Selector Modal */}
      <LanguageSelector
        isOpen={languageDialogOpen}
        onClose={() => setLanguageDialogOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(lang) => {
          setCurrentLanguage(lang);
          StorageService.savePreferences({ language: lang });
        }}
      />
    </div>
  );
}

export default App;
