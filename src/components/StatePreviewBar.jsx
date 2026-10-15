import React from 'react'
import { Sliders } from 'lucide-react'

const UI_STATES = [
  { id: 'empty', label: 'Empty' },
  { id: 'typing', label: 'Typing' },
  { id: 'recording', label: 'Recording' },
  { id: 'transcribing', label: 'Transcribing' },
  { id: 'processing', label: 'Processing' },
  { id: 'followup', label: 'AI Follow-Up' },
  { id: 'results', label: 'Results' },
  { id: 'permission-denied', label: 'Permission Denied' },
  { id: 'unsupported-browser', label: 'Unsupported Browser' },
  { id: 'network-error', label: 'Network Error' },
]

export function StatePreviewBar({ currentState, onSelectState }) {
  return (
    <div className="state-preview-bar bg-white/95 rounded-2xl border border-rose-200/80 p-3.5 mb-5 shadow-sm backdrop-blur-md">
      <div className="preview-bar-inner flex flex-wrap items-center gap-3">
        <div className="preview-label flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800">
          <Sliders size={14} className="sliders-icon text-rose-600" />
          <span>Interactive State Tester:</span>
        </div>
        <div className="state-chips-row flex flex-wrap items-center gap-1.5 flex-1">
          {UI_STATES.map((st) => {
            const isActive = currentState === st.id
            return (
              <button
                key={st.id}
                type="button"
                className={`state-chip inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'active bg-rose-700 text-white shadow-sm ring-2 ring-rose-300'
                    : 'bg-stone-100 hover:bg-rose-50 text-stone-700 border border-stone-200 hover:border-rose-300 hover:text-rose-900'
                }`}
                onClick={() => onSelectState(st.id)}
              >
                {isActive && <span className="active-dot w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                {st.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
