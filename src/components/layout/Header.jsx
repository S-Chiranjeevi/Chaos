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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-rose-500 rounded-xl p-1"
            aria-label="SakhiCare Home - Return to main dashboard"
          >
            {/* Logo Emblem */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight group-hover:text-rose-700 transition-colors">
                  SakhiCare
                </span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded-full hidden sm:inline-block">
                  सखी
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Maternal & Holistic Women’s Health
              </p>
            </div>
          </button>
        </div>

        {/* Center / Right: Privacy Indicator & Language */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Privacy Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-emerald-900 text-xs shadow-xs"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-stone-100 hover:bg-rose-50 hover:border-rose-300 border border-stone-200 rounded-xl text-stone-800 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
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

          {/* Test Error Trigger (Demonstrates Global Error Area) */}
          {onTriggerDemoError && (
            <button
              type="button"
              onClick={onTriggerDemoError}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg text-[10px] font-medium text-stone-600 hidden xl:inline-block"
              title="Test the Global Error notification component"
            >
              Simulate Error
            </button>
          )}

        </div>
      </div>
    </header>
  );
}

export default Header;
