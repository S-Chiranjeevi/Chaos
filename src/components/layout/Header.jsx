import React from 'react';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { SUPPORTED_LANGUAGES } from '../common/LanguageSelector.jsx';

/**
 * Header - Top navigation bar for SakhiCare.
 * Contains:
 * 1. SakhiCare branding & logo
 * 2. Current language trigger with visible helper text
 * 3. Language selector
 */
export function Header({
  currentLanguage = 'en',
  onOpenLanguageSelector,
  onNavigateHome
}) {
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs lunaher-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none rounded-xl p-1 lunaher-brand-button"
            aria-label="LunaHer Home - Return to main dashboard"
          >
            <span className="lunaher-logo-window lunaher-header-logo"><img src="/lunaher-logo.png" alt="" /></span>
          </button>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Current Language Trigger */}
          <div className="flex flex-col items-end">
            <button
              type="button"
              onClick={onOpenLanguageSelector}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-stone-100 hover:bg-rose-50 hover:border-rose-300 border border-stone-200 rounded-xl text-stone-800 text-xs font-semibold transition-all focus:outline-none lunaher-language-button"
              aria-label={`Current language is ${currentLangObj.name}. Click to change language.`}
            >
              <svg className="w-3.5 h-3.5 text-rose-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{currentLangObj.native}</span>
              <span className="text-stone-400 font-normal hidden sm:inline">({currentLangObj.name})</span>
              <span className="text-[10px] text-rose-700 ml-0.5">▼</span>
            </button>
            <span className="text-[10px] text-stone-400 mt-0.5 hidden lg:inline">
              Change Language
            </span>
          </div>



        </div>
      </div>
    </header>
  );
}

export default Header;
