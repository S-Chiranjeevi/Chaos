import React, { useState } from 'react'
import { LockKeyhole, Trash2 } from 'lucide-react'
import { deleteAllLocalHealthData } from '../models/healthEntry.js'

export function PrivacyControls({ onDataDeleted }) {
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState('')
  function removeData() {
    const result = deleteAllLocalHealthData()
    if (!result?.ok) {
      setError(result?.error || 'Your browser could not remove the saved information. Please try again.')
      setDeleted(false)
      return
    }
    setError('')
    setDeleted(true)
    onDataDeleted?.()
  }
  return <div className="privacy-card">
    <div className="privacy-copy"><LockKeyhole size={25} /><div><h2>Your privacy</h2><p><strong>Stored only on this device.</strong> SakhiCare uses browser local storage for your health entries and cycle tracker. We do not send health data to analytics, a server, or an external AI API.</p><p>Voice input uses your browser’s speech-recognition feature. Your browser may process speech according to its own settings; you can always type instead.</p></div></div>
    <button className="delete-data-button" type="button" onClick={removeData} aria-label="Delete all SakhiCare health data saved on this device"><Trash2 size={16} aria-hidden="true" /> Delete all my data</button>
    {deleted && <p className="delete-confirmation" role="status">All SakhiCare data stored on this device has been deleted.</p>}
    {error && <p className="delete-error" role="alert">{error}</p>}
  </div>
}
