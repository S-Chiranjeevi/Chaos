import React, { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader.jsx'
import { DoctorSummary } from '../components/DoctorSummary.jsx'
import { DisclaimerBanner } from '../components/common/DisclaimerBanner.jsx'
import { t } from '../data/translations.js'

export function DoctorSummaryPage({ onNavigate, currentLanguage = 'en' }) {
  const [notification, setNotification] = useState('')

  function handleCopySuccess() {
    setNotification('Summary successfully copied to clipboard!')
    setTimeout(() => setNotification(''), 3000)
  }

  return (
    <div className="space-y-6 doctor-summary-page-root">
      {/* Page Header */}
      <PageHeader
        title={t('summaryLabels.title', currentLanguage)}
        description="A structured, self-advocacy report combining your cycle history, symptoms, repeated patterns, and doctor questions."
        badge="Ready for Doctor Visit"
        badgeVariant="purple"
        onBack={() => onNavigate('/')}
        backLabel="Back to Home Dashboard"
        backHelperText="Returns to main overview"
      />

      <DisclaimerBanner dismissible={false} />

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold flex items-center justify-between">
          <span>{notification}</span>
          <button type="button" onClick={() => setNotification('')} className="text-emerald-600 hover:text-emerald-900">×</button>
        </div>
      )}

      {/* Main Doctor Summary Component */}
      <DoctorSummary
        currentLanguage={currentLanguage}
        onCopySuccess={handleCopySuccess}
      />
    </div>
  )
}

export default DoctorSummaryPage
