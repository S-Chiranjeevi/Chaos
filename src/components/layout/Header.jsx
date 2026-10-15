import React from 'react';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { SUPPORTED_LANGUAGES } from '../common/LanguageSelector.jsx';

/**
 * Header - Top navigation bar for SakhiCare.
 * Contains:
 * 1. SakhiCare branding & logo
 * 2. Current language trigger with visible helper text
 * 3. Privacy Indicator: "Stored only on this device"
 */
export function Header({
  currentLanguage = 'en',
  onOpenLanguageSelector,
  onNavigateHome,
  onTriggerDemoError
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

        {/* Center / Right: Privacy Indicator & Language */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Privacy Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-900 text-xs shadow-xs lunaher-privacy-indicator"
            title="All health records, audio notes, and logs remain strictly encrypted on this device."
            role="status"
            aria-label="Device Privacy: Stored only on this device"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" aria-hidden="true" />
            <svg className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[11px] sm:text-xs leading-tight">
                Stored only on this device
              </span>
              <span className="text-[9px] text-emerald-700 hidden md:inline leading-none">
                Zero Cloud Uploads · Offline Safe
              </span>
            </div>
          </div>

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
