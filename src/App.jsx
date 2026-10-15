import React, { useEffect, useState } from 'react';
import Header from './components/layout/Header.jsx';
import GlobalError from './components/layout/GlobalError.jsx';
import { LanguageSelector } from './components/common/LanguageSelector.jsx';
import { BottomNavigation } from './components/BottomNavigation.jsx';
import { Navigation } from './components/Navigation.jsx';
import { DoctorSummaryPage } from './pages/DoctorSummaryPage.jsx';
import { HealthTrackerPage } from './pages/HealthTrackerPage.jsx';
import { Home } from './pages/Home.jsx';
import { InsightsPage } from './pages/InsightsPage.jsx';
import { LearnPage } from './pages/LearnPage.jsx';
import { TalkOrTypePage } from './pages/TalkOrTypePage.jsx';
import { PrivacyView } from './views/PrivacyView.jsx';
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
  '/learn': 'learn',
  '/privacy': 'privacy',
};

const PAGE_TO_PATH = {
  home: '/',
  talk: '/talk',
  tracker: '/tracker',
  insights: '/insights',
  doctor: '/summary',
  learn: '/learn',
  privacy: '/privacy',
};

const PAGE_TITLES = {
  home: 'Home',
  talk: 'Talk or Type',
  tracker: 'My Health Tracker',
  insights: 'Early Warnings and Insights',
  doctor: 'Doctor Summary',
  learn: 'Learn and Myths',
  privacy: 'Privacy Controls',
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

    window.addEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate);
    window.addEventListener('pcos_saathi:data_change', handleStorageChange);
    window.addEventListener('popstate', handleHistoryChange);
    window.addEventListener('hashchange', handleHistoryChange);

    return () => {
      window.removeEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate);
      window.removeEventListener('pcos_saathi:data_change', handleStorageChange);
      window.removeEventListener('popstate', handleHistoryChange);
      window.removeEventListener('hashchange', handleHistoryChange);
    };
  }, []);

  useEffect(() => {
    document.title = `${PAGE_TITLES[activePage]} · PCOS Saathi`;
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

  function handleDataDeleted() {
    StorageService.clearAllPcosData();
    setLastSharedEntry(null);
    setRefreshKey((value) => value + 1);
  }

  function handleTriggerDemoError() {
    setGlobalError({
      title: 'Local Vault Sync Notice',
      message: 'IndexedDB transaction cached locally. All health data remains strictly on your device.',
      code: 'OFFLINE_STORAGE_VERIFIED',
    });
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
      case 'privacy':
        return <PrivacyView onNavigate={navigate} />;
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
        currentLanguage={currentLanguage}
        onOpenLanguageSelector={() => setLanguageDialogOpen(true)}
        onNavigateHome={() => navigate('home')}
        onTriggerDemoError={handleTriggerDemoError}
      />

      <div className="app-body">
        <Navigation activePage={activePage} onNavigate={navigate} />
        <div className="app-column">
          <main id="main-content" className="page-content" tabIndex="-1">
            {renderPage()}
            <footer className="page-footer">
              <span>PCOS Saathi · A gentle, private place to begin</span>
              <button type="button" onClick={() => navigate('privacy')}>
                Privacy choices
              </button>
            </footer>
          </main>
        </div>
      </div>

      {/* Mobile Navigation */}
      <BottomNavigation activePage={activePage} onNavigate={navigate} />

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
