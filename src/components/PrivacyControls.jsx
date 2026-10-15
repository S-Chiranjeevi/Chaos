import React, { useState } from 'react'
import { LockKeyhole, Trash2, Sparkles, Check } from 'lucide-react'
import { deleteAllLocalHealthData } from '../models/healthEntry.js'
import { deleteMyInsights } from '../models/insightsStorage.js'

export function PrivacyControls({ onDataDeleted }) {
  const [deletedAll, setDeletedAll] = useState(false)
  const [deletedInsights, setDeletedInsights] = useState(false)

  function removeAllData() {
    deleteAllLocalHealthData()
    setDeletedAll(true)
    setDeletedInsights(false)
    onDataDeleted?.()
    window.dispatchEvent(new CustomEvent('sakhicare:dataDeleted'))
  }

  function removeOnlyInsights() {
    deleteMyInsights()
    setDeletedInsights(true)
    setDeletedAll(false)
    window.dispatchEvent(new CustomEvent('sakhicare:insightsDeleted'))
  }

  return (
    <div className="privacy-card">
      <div className="privacy-copy">
        <LockKeyhole size={25} />
        <div>
          <h2>Your privacy & local data ownership</h2>
          <p>
            <strong>Stored only on this device.</strong> SakhiCare uses browser local storage for your
            health entries, cycle history, and AI insights. We do not send your health data to analytics,
            a tracking server, or an external AI model without your explicit consent.
          </p>
          <p>
            Voice input uses your browser’s speech-recognition feature. Your browser may process speech
            according to its own settings; you can always type instead.
          </p>
        </div>
      </div>

      <div className="privacy-actions-row">
        <button
          className="delete-insights-secondary-button"
          type="button"
          onClick={removeOnlyInsights}
        >
          <Sparkles size={16} /> Delete my insights
        </button>

        <button
          className="delete-data-button"
          type="button"
          onClick={removeAllData}
        >
          <Trash2 size={16} /> Delete all my data
        </button>
      </div>

      {deletedInsights && (
        <p className="delete-confirmation" role="status">
          <Check size={16} /> All personalized insights and doctor summaries have been deleted from this device.
        </p>
      )}

      {deletedAll && (
        <p className="delete-confirmation" role="status">
          <Check size={16} /> All SakhiCare data stored on this device has been deleted.
        </p>
      )}
    </div>
  )
}
