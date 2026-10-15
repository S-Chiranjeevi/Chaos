import React from 'react';
import { Button } from './Button.jsx';

/**
 * UrgentWarning - Accessible, high-contrast banner for red-flag symptoms.
 * Provides clear actionable guidance and direct emergency contact triggers.
 */
export function UrgentWarning({
  title = 'Red-Flag Medical Symptoms Detected',
  description = 'Certain symptoms during pregnancy or acute illness require urgent clinical evaluation by a medical doctor.',
  symptomsList = [
    'Sudden heavy vaginal bleeding or fluid leaking',
    'Severe persistent headache with blurred vision or spots',
    'High fever above 101°F with chills or stiffness',
    'Noticeable decrease or cessation in baby movements (after week 24)'
  ],
  emergencyNumber = '108',
  onEmergencyClick = null,
  className = ''
}) {
  const handleCall = () => {
    if (onEmergencyClick) {
      onEmergencyClick();
    } else {
      window.location.href = `tel:${emergencyNumber}`;
    }
  };

  return (
    <section
      role="alert"
      aria-live="assertive"
      aria-label="Urgent medical alert banner"
      className={`bg-red-50 border-2 border-red-500 rounded-2xl p-5 shadow-sm text-red-950 ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow-sm flex-shrink-0" aria-hidden="true">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <div className="space-y-2">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="bg-red-600 text-white text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Immediate Action Required
                </span>
                <span className="text-xs font-semibold text-red-700">
                  Do not wait for appointment
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-red-950">
                {title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-red-900 leading-relaxed">
              {description}
            </p>

            {symptomsList && symptomsList.length > 0 && (
              <ul className="text-xs text-red-800 list-disc list-inside space-y-1 bg-white/70 p-3 rounded-lg border border-red-200">
                {symptomsList.map((item, idx) => (
                  <li key={idx} className="font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 items-stretch flex-shrink-0 pt-1">
          <Button
            variant="danger"
            size="md"
            onClick={handleCall}
            ariaLabel={`Call Emergency Helpline ${emergencyNumber} immediately`}
            helperText="Connects directly to emergency medical dispatch"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          >
            Call Helpline ({emergencyNumber})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('ASHA Worker Contact: Smt. Sunita Devi - Phone: +91 98765 43210. Available for maternal escort and guidance.')}
            ariaLabel="Contact local ASHA or Community Health Worker"
            helperText="Local Community Health Escort"
          >
            Contact Local ASHA Worker
          </Button>
        </div>
      </div>
    </section>
  );
}

export default UrgentWarning;
