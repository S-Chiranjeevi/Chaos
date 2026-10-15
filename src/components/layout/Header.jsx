import React from 'react';

/**
 * Header - Slim top bar for LunaHer.
 * Logo & brand have been moved to the sidebar Navigation.
 * Language selector has been moved to the sidebar Navigation.
 */
export function Header({ onNavigateHome }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/90 shadow-xs lunaher-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center gap-2 sm:gap-4">
        {/* intentionally empty — branding & language are in the sidebar */}
      </div>
    </header>
  );
}

export default Header;
