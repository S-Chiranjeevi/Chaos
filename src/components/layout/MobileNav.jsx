import React from 'react';

/**
 * MobileNav - Fixed bottom navigation for mobile & small tablet screens.
 * Contains: Home, Talk or Type, Tracker, Early Warnings (Insights), Summary.
 * All controls have visible text labels and clear active states.
 */
export function MobileNav({
  currentPath = '/',
  onNavigate
}) {
  const navItems = [
    {
      path: '/',
      label: 'Home',
      shortLabel: 'Home',
      helperText: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/talk',
      label: 'Talk/Type',
      shortLabel: 'Talk/Type',
      helperText: 'Speak or Ask',
      isHighlight: true,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      )
    },
    {
      path: '/tracker',
      label: 'Tracker',
      shortLabel: 'Tracker',
      helperText: 'Log Vitals',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      path: '/insights',
      aliases: ['/patterns'],
      label: 'Warnings',
      shortLabel: 'Insights',
      helperText: 'Red Flags',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      path: '/summary',
      label: 'Summary',
      shortLabel: 'Summary',
      helperText: 'Doctor Brief',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      path: '/privacy',
      label: 'Privacy',
      shortLabel: 'Vault',
      helperText: 'Local-Only',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    }
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 shadow-lg px-1 py-1 safe-area-pb"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path || item.aliases?.includes(currentPath);

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => onNavigate(item.path)}
              aria-label={`${item.label}: ${item.helperText}`}
              aria-current={isActive ? 'page' : undefined}
              className={`
                flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[50px] min-h-[50px]
                ${isActive
                  ? 'text-rose-700 font-bold bg-rose-50/80 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }
              `}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-rose-100/70 text-rose-800' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] leading-tight font-semibold mt-0.5 tracking-tight truncate max-w-[56px]">
                {item.shortLabel}
              </span>
              <span className={`text-[8px] leading-none ${isActive ? 'text-rose-600 font-medium' : 'text-stone-400'} truncate max-w-[56px]`}>
                {item.helperText}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
