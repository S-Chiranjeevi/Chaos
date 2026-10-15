import React from 'react'
import { AlertTriangle, PhoneCall } from 'lucide-react'

export function UrgentCareBanner({ warnings = [] }) {
  if (!warnings.length) return null

  const immediateDanger = warnings.some((warning) => warning.id === 'other_urgent_concern')
  return (
    <section
      className="mb-5 rounded-2xl border-2 border-rose-800 bg-rose-50 p-5 text-rose-950 shadow-lg"
      role="alert"
      aria-live="assertive"
      aria-labelledby="urgent-care-title"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-7 w-7 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-widest">Urgent medical attention</p>
          <h2 id="urgent-care-title" className="mt-1 text-lg font-extrabold">
            Please read this before the other information
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {warnings.map((warning) => (
              <li key={warning.id}>
                <strong>{warning.title}.</strong> {warning.message}
              </li>
            ))}
          </ul>
          {immediateDanger && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-lg border border-rose-900 bg-white px-3 py-2 font-bold">
              <PhoneCall size={18} aria-hidden="true" /> If you are in immediate danger, contact local emergency services or a trusted person now.
            </p>
          )}
          <p className="mt-3 text-sm font-semibold">This is information, not a diagnosis.</p>
        </div>
      </div>
    </section>
  )
}

export default UrgentCareBanner
