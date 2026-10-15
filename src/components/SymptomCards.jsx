import React, { useState } from 'react'
import { Edit3, Trash2, Plus, Check, X, AlertTriangle, Clock, Activity, Tag } from 'lucide-react'
import { SEVERITY_LEVELS } from '../models/healthEntry.js'

export function SymptomCards({
  symptoms = [],
  onUpdateSymptom,
  onRemoveSymptom,
  onAddSymptom,
}) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    symptom: '',
    duration: '',
    frequency: '',
    severity: 'Moderate',
  })
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newForm, setNewForm] = useState({
    symptom: '',
    duration: '',
    frequency: '',
    severity: 'Moderate',
    category: 'User Added',
  })

  function startEdit(item) {
    setEditingId(item.id)
    setEditForm({
      symptom: item.symptom,
      duration: item.duration,
      frequency: item.frequency,
      severity: item.severity || 'Moderate',
    })
  }

  function cancelEdit() {
    setEditingId(null)
  }

  function saveEdit(id) {
    if (!editForm.symptom.trim()) return
    onUpdateSymptom(id, {
      symptom: editForm.symptom.trim(),
      duration: editForm.duration.trim() || 'Not specified',
      frequency: editForm.frequency.trim() || 'Not specified',
      severity: editForm.severity,
    })
    setEditingId(null)
  }

  function handleAddNew(e) {
    e.preventDefault()
    if (!newForm.symptom.trim()) return
    onAddSymptom({
      id: `sym-manual-${Date.now()}`,
      symptom: newForm.symptom.trim(),
      duration: newForm.duration.trim() || 'Not specified',
      frequency: newForm.frequency.trim() || 'Not specified',
      severity: newForm.severity,
      category: newForm.category || 'General',
      isCustom: true,
    })
    setNewForm({
      symptom: '',
      duration: '',
      frequency: '',
      severity: 'Moderate',
      category: 'User Added',
    })
    setIsAddingNew(false)
  }

  const getSeverityBadgeClass = (sev) => {
    switch (sev) {
      case 'Severe':
        return 'severity-badge severe'
      case 'Moderate':
        return 'severity-badge moderate'
      case 'Mild':
        return 'severity-badge mild'
      default:
        return 'severity-badge unspecified'
    }
  }

  return (
    <div className="symptom-cards-container">
      <div className="symptom-cards-header">
        <div>
          <h3 className="cards-title">
            Extracted Symptom Cards ({symptoms.length})
          </h3>
          <p className="cards-subtitle">
            Review, edit, or adjust the duration, frequency, and severity of each identified symptom.
          </p>
        </div>
        <button
          type="button"
          className="btn-add-symptom"
          onClick={() => setIsAddingNew(true)}
          aria-label="Add new symptom card"
        >
          <Plus size={16} />
          <span>Add Symptom</span>
        </button>
      </div>

      {isAddingNew && (
        <form className="symptom-card edit-mode new-card-form" onSubmit={handleAddNew}>
          <div className="card-form-grid">
            <div className="form-field">
              <label>Symptom Name *</label>
              <input
                type="text"
                placeholder="e.g., Pelvic cramping, Fatigue..."
                value={newForm.symptom}
                onChange={(e) => setNewForm({ ...newForm, symptom: e.target.value })}
                required
                autoFocus
              />
            </div>
            <div className="form-field">
              <label>Duration</label>
              <input
                type="text"
                placeholder="e.g., 2–3 months, past 2 weeks"
                value={newForm.duration}
                onChange={(e) => setNewForm({ ...newForm, duration: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Frequency</label>
              <input
                type="text"
                placeholder="e.g., Daily, Every cycle, Occasional"
                value={newForm.frequency}
                onChange={(e) => setNewForm({ ...newForm, frequency: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Severity</label>
              <select
                value={newForm.severity}
                onChange={(e) => setNewForm({ ...newForm, severity: e.target.value })}
              >
                {SEVERITY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-form-actions">
            <button type="submit" className="btn-save">
              <Check size={16} />
              <span>Save Symptom</span>
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsAddingNew(false)}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </div>
        </form>
      )}

      {symptoms.length === 0 && !isAddingNew ? (
        <div className="empty-cards-notice">
          <p>No symptoms extracted yet. Type or speak what you are experiencing to generate cards.</p>
        </div>
      ) : (
        <div className="symptom-cards-grid">
          {symptoms.map((item) => {
            const isEditing = editingId === item.id

            if (isEditing) {
              return (
                <div key={item.id} className="symptom-card edit-mode">
                  <div className="card-form-grid">
                    <div className="form-field full-width">
                      <label>Symptom Name</label>
                      <input
                        type="text"
                        value={editForm.symptom}
                        onChange={(e) => setEditForm({ ...editForm, symptom: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Duration</label>
                      <input
                        type="text"
                        value={editForm.duration}
                        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Frequency</label>
                      <input
                        type="text"
                        value={editForm.frequency}
                        onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                      />
                    </div>
                    <div className="form-field">
                      <label>Severity</label>
                      <select
                        value={editForm.severity}
                        onChange={(e) => setEditForm({ ...editForm, severity: e.target.value })}
                      >
                        {SEVERITY_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="card-form-actions">
                    <button
                      type="button"
                      className="btn-save"
                      onClick={() => saveEdit(item.id)}
                    >
                      <Check size={16} />
                      <span>Update</span>
                    </button>
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={cancelEdit}
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={item.id} className={`symptom-card ${item.isRedFlag ? 'has-red-flag' : ''}`}>
                <div className="card-top-row">
                  <div className="card-category">
                    <Tag size={13} />
                    <span>{item.category || 'Clinical Observation'}</span>
                  </div>
                  <span className={getSeverityBadgeClass(item.severity)}>
                    {item.severity}
                  </span>
                </div>

                <div className="card-main">
                  <h4 className="symptom-title">{item.symptom}</h4>
                  {item.isRedFlag && (
                    <div className="symptom-alert-pill">
                      <AlertTriangle size={13} />
                      <span>Requires prompt attention</span>
                    </div>
                  )}
                </div>

                <div className="card-meta-list">
                  <div className="meta-item">
                    <Clock size={14} className="meta-icon" />
                    <div>
                      <span className="meta-label">Duration:</span>
                      <span className="meta-value">{item.duration || 'Not specified'}</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <Activity size={14} className="meta-icon" />
                    <div>
                      <span className="meta-label">Frequency:</span>
                      <span className="meta-value">{item.frequency || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn-action edit"
                    onClick={() => startEdit(item)}
                    aria-label={`Edit ${item.symptom}`}
                  >
                    <Edit3 size={15} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-action remove"
                    onClick={() => onRemoveSymptom(item.id)}
                    aria-label={`Remove ${item.symptom}`}
                  >
                    <Trash2 size={15} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
