import React from 'react';

/**
 * Header - Top navigation bar for LunaHer.
 * Contains:
 * 1. LunaHer branding & logo
 */
export function Header({
  onNavigateHome
}) {
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
            <span className="lunaher-logo-window lunaher-header-logo"><img src="/lunaher-logo.png" alt="LunaHer" /></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
