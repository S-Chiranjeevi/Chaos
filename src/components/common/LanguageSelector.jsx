import React, { useEffect, useRef } from 'react';
import { Button } from './Button.jsx';
import { Badge } from './Badge.jsx';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', region: 'India (Default)', speechReady: true },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'भारत', speechReady: true },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', region: 'ಕರ್ನಾಟಕ', speechReady: true },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'இந்தியா / தமிழ்நாடு', speechReady: true },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'ഇന്ത്യ / കേരളം', speechReady: true },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', region: 'భారతదేశం / ఆంధ్రప్రదేశ్', speechReady: true },
  { code: 'mr', name: 'Marathi', native: 'मराठी', region: 'भारत / महाराष्ट्र', speechReady: true },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', region: 'ভারত / পশ্চিমবঙ্গ', speechReady: true },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', region: 'കേരളം', speechReady: true }
];

/**
 * LanguageSelector - Accessible modal dialog for switching app language and speech model.
 */
export function LanguageSelector({
  isOpen,
  onClose,
  currentLanguage = 'en',
  onSelectLanguage
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
      aria-describedby="lang-modal-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden transform transition-all"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h2 id="lang-modal-title" className="text-lg font-bold text-stone-900">
              Select Your Language
            </h2>
            <p id="lang-modal-desc" className="text-xs text-stone-500 mt-0.5">
              अपनी भाषा चुनें · আপনার ভাষা নির্বাচন করুন
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-200/50 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Close language selector modal"
          >
            <span className="text-sm font-bold">✕ Close</span>
          </button>
        </div>

        {/* Informational Subtext */}
        <div className="px-6 py-3 bg-rose-50/60 border-b border-rose-100/70 text-xs text-rose-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <span>
            Voice input and screen speech dynamically adapt to your selected language.
          </span>
        </div>

        {/* Language Options Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`
                  w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between
                  ${isSelected
                    ? 'border-rose-600 bg-rose-50/70 shadow-sm ring-2 ring-rose-500/20'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }
                `}
                aria-pressed={isSelected}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-stone-900">
                      {lang.native}
                    </span>
                    <span className="text-xs text-stone-500">
                      ({lang.name})
                    </span>
                    {isSelected && (
                      <Badge variant="rose" size="sm">Active</Badge>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-500 mt-0.5">
                    {lang.region} · Speech Voice Ready
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      ✓
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-stone-400 group-hover:text-stone-600">
                      Select
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <p className="text-[11px] text-stone-500">
            Selected language is saved locally on this phone.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            ariaLabel="Cancel and keep current language"
            helperText="Dismisses without changing"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;
