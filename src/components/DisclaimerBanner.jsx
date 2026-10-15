import React from 'react'
import { Info } from 'lucide-react'

export function DisclaimerBanner() {
  return (
    <aside className="disclaimer-banner" aria-label="Health information notice">
      <Info size={20} aria-hidden="true" />
      <div>
        <strong>Helpful to know</strong>
        <p>LunaHer shares general information. It cannot tell you what condition you have or replace a health worker.</p>
      </div>
    </aside>
  )
}
