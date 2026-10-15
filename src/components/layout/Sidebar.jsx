import React from 'react';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

/**
 * Sidebar - Desktop navigation bar for SakhiCare.
 * Provides accessible, semantic side navigation with expanded titles,
 * visible helper text for every destination, and safety quick-actions.
 */
export function Sidebar({
  currentPath = '/',
  onNavigate,
  onEmergencyCall
}) {
  const navItems = [
    {
      path: '/',
      label: 'Home',
      badge: 'Daily',
      badgeVariant: 'stone',
      helperText: 'Overview, recent logs & quick actions',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      path: '/talk',
      label: 'Talk or Type',
      badge: 'Voice AI',
      badgeVariant: 'rose',
      helperText: 'Speak or type symptoms in your language',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      )
    },
    {
      path: '/tracker',
      label: 'Health Tracker',
      badge: 'Logs',
      badgeVariant: 'emerald',
      helperText: 'Review and add symptoms, cycle, & vitals',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      path: '/summary',
      label: 'Clinical Summary',
      badge: 'Report',
      badgeVariant: 'purple',
      helperText: 'One-page doctor brief & health trends',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      path: '/patterns',
      label: 'Early Warnings',
      badge: 'Rules Engine',
      badgeVariant: 'amber',
      helperText: 'Detect repeated cycles, symptoms, & red flags',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    {
      path: '/learn',
      label: 'Learn & Wellness',
      badge: 'Guides',
      badgeVariant: 'blue',
      helperText: 'Maternal nutrition, red flags & self-care',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <aside
      aria-label="Desktop Primary Navigation"
      className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-stone-200/90 min-h-[calc(100vh-4rem)] p-4 justify-between"
    >
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3">
            Main Navigation
          </span>
          <nav className="mt-2 space-y-1.5" aria-label="Main menu">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    w-full text-left p-3 rounded-2xl transition-all duration-200 flex items-start gap-3 group
                    ${isActive
                      ? 'bg-rose-50 text-rose-950 font-semibold shadow-xs ring-1 ring-rose-200'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-900'
                    }
                  `}
                >
                  <div
                    className={`
                      p-2 rounded-xl flex-shrink-0 transition-colors
                      ${isActive
                        ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                        : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200 group-hover:text-stone-900'
                      }
                    `}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold tracking-tight truncate">
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${isActive ? 'bg-rose-200 text-rose-900' : 'bg-stone-100 text-stone-500'}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 leading-snug line-clamp-1 ${isActive ? 'text-rose-800' : 'text-stone-500'}`}>
                      {item.helperText}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Local Storage Privacy Pill */}
        <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-emerald-900">Local-First Vault</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-tight">
            Encrypted SQLite/IndexedDB on this hardware. Never uploaded to remote servers.
          </p>
        </div>
      </div>

      {/* Quick Emergency / ASHA Helpline Card */}
      <div className="pt-4 border-t border-stone-200/80 space-y-2">
        <div className="bg-red-50/90 rounded-2xl p-3 border border-red-200 text-red-950">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-700 text-sm">🚨</span>
            <span className="text-xs font-bold text-red-900">Emergency Support</span>
          </div>
          <p className="text-[11px] text-red-800 mb-2 leading-tight">
            Immediate maternal ambulance & triage assistance.
          </p>
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={() => onEmergencyCall ? onEmergencyCall() : alert('Emergency Call 108 Triggered')}
            ariaLabel="Call National Ambulance 108"
            helperText="24/7 free toll helpline"
          >
            Call 108 Helpline
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
