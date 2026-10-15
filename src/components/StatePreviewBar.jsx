import React from 'react'
import { Sliders } from 'lucide-react'

const UI_STATES = [
  { id: 'empty', label: 'Empty' },
  { id: 'typing', label: 'Typing' },
  { id: 'recording', label: 'Recording' },
  { id: 'transcribing', label: 'Transcribing' },
  { id: 'processing', label: 'Processing' },
  { id: 'results', label: 'Results' },
  { id: 'permission-denied', label: 'Permission Denied' },
  { id: 'unsupported-browser', label: 'Unsupported Browser' },
  { id: 'network-error', label: 'Network Error' },
]

export function StatePreviewBar({ currentState, onSelectState }) {
  return (
    <div className="state-preview-bar">
      <div className="preview-bar-inner">
        <div className="preview-label">
          <Sliders size={14} className="sliders-icon" />
          <span>Hackathon State Tester:</span>
        </div>
        <div className="state-chips-row">
          {UI_STATES.map((st) => {
            const isActive = currentState === st.id
            return (
              <button
                key={st.id}
                type="button"
                className={`state-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelectState(st.id)}
              >
                {isActive && <span className="active-dot" />}
                {st.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
