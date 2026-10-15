import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import MobileNav from './components/layout/MobileNav.jsx';
import GlobalError from './components/layout/GlobalError.jsx';
import LanguageSelector from './components/common/LanguageSelector.jsx';

import HomeView from './views/HomeView.jsx';
import TalkView from './views/TalkView.jsx';
import TrackerView from './views/TrackerView.jsx';
import SummaryView from './views/SummaryView.jsx';
import LearnView from './views/LearnView.jsx';

// Pattern detection integration if available from teammate contribution
import { PatternDetectionView } from './components/PatternDetectionView.jsx';

/**
 * SakhiCare - Main Responsive Frontend Shell
 * Hackathon-optimized, accessible, privacy-first women's & maternal health shell.
 */
export function App() {
  // Navigation Route State (supports '/', '/talk', '/tracker', '/summary', '/learn')
  const [currentPath, setCurrentPath] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['/', '/talk', '/tracker', '/summary', '/learn', '/patterns'].includes(hash)) {
      return hash;
    }
    const path = window.location.pathname;
    if (['/talk', '/tracker', '/summary', '/learn', '/patterns'].includes(path)) {
      return path;
    }
    return '/';
  });

  // Current Language State
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  // Global Error Area State
  const [globalError, setGlobalError] = useState(null);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['/', '/talk', '/tracker', '/summary', '/learn', '/patterns'].includes(hash)) {
        setCurrentPath(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerDemoError = () => {
    setGlobalError({
      title: 'Local Vault Sync Warning',
      message: 'IndexedDB transaction took longer than expected. Local encrypted cache remains intact.',
      code: 'ERR_LOCAL_STORAGE_WARN_04'
    });
  };

  const handleEmergencyCall = () => {
    alert('🚨 Emergency Protocol Triggered: Connecting to National Maternal & Ambulance Helpline: 108 / 102.');
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col selection:bg-rose-100 selection:text-rose-900">
      
      {/* 7. Global Error Message Area */}
      <GlobalError
        error={globalError}
        onDismiss={() => setGlobalError(null)}
        onRetry={() => {
          alert('Retrying local storage verification...');
          setGlobalError(null);
        }}
      />

      {/* 2. Top Header (Logo, Language, Privacy Indicator) */}
      <Header
        currentLanguage={currentLanguage}
        onOpenLanguageSelector={() => setIsLanguageModalOpen(true)}
        onNavigateHome={() => handleNavigate('/')}
        onTriggerDemoError={handleTriggerDemoError}
      />

      {/* Main Layout Container (Sidebar + Content Body) */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* 4. Desktop Sidebar Navigation */}
        <Sidebar
          currentPath={currentPath}
          onNavigate={handleNavigate}
          onEmergencyCall={handleEmergencyCall}
        />

        {/* Responsive Content Area */}
        <main
          id="main-content"
          role="main"
          className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-5xl w-full focus:outline-none"
          tabIndex={-1}
        >
          {/* Active View Router */}
          {currentPath === '/' && (
            <HomeView onNavigate={handleNavigate} />
          )}

          {currentPath === '/talk' && (
            <TalkView onNavigate={handleNavigate} currentLanguage={currentLanguage} />
          )}

          {currentPath === '/tracker' && (
            <TrackerView onNavigate={handleNavigate} />
          )}

          {currentPath === '/summary' && (
            <SummaryView onNavigate={handleNavigate} />
          )}

          {currentPath === '/learn' && (
            <LearnView onNavigate={handleNavigate} />
          )}

          {currentPath === '/patterns' && PatternDetectionView && (
            <div className="space-y-6">
              <PatternDetectionView onNavigateToSymptomGuide={() => handleNavigate('/talk')} />
            </div>
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation */}
      <MobileNav
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Shared Multilingual Selector Modal */}
      <LanguageSelector
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={(langCode) => setCurrentLanguage(langCode)}
      />

      {/* Accessibility Skip-To-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 bg-rose-700 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-semibold"
      >
        Skip directly to main health content
      </a>
    </div>
  );
}

export default App;
