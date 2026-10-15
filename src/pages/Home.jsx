import React from 'react'
import { ArrowRight, BookOpen, CalendarDays, HeartPulse, MessageCircle, Microscope, Stethoscope } from 'lucide-react'

const actions = [
  { id: 'talk', label: 'Describe my symptoms', detail: 'Write or say what you notice, using your own words.', icon: MessageCircle, primary: true },
  { id: 'tracker', label: 'Track my cycle', detail: 'Add a period date if you would like to keep a record.', icon: CalendarDays },
  { id: 'insights', label: 'View my insights', detail: 'Review notes you have saved on this device.', icon: HeartPulse },
  { id: 'screening', label: 'PCOS Research Screening', detail: 'Screen clinical and lab values using AMD-SlingShot ML models.', icon: Microscope },
  { id: 'doctor', label: 'Prepare for a doctor visit', detail: 'Make a simple summary and questions to bring.', icon: Stethoscope },
  { id: 'learn', label: 'Learn about PCOS', detail: 'Read clear, gentle information and myth checks.', icon: BookOpen },
]

export function Home({ onNavigate }) {
  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <p className="eyebrow">A gentle place to begin</p>
        <h1>Your health, in your words.</h1>
        <p>You do not need medical words or all the answers. Choose one thing that would help you today.</p>
        <button className="button button-primary welcome-action" type="button" onClick={() => onNavigate('talk')}>Describe my symptoms <ArrowRight size={18} aria-hidden="true" /></button>
      </section>
      <section aria-labelledby="home-actions-title">
        <div className="section-heading"><div><p className="eyebrow">Choose what feels useful</p><h2 id="home-actions-title">How can we help today?</h2></div></div>
        <div className="action-grid">
          {actions.map(({ id, label, detail, icon: Icon, primary }) => (
            <button key={id} type="button" className={`action-card ${primary ? 'action-card-primary' : ''}`} onClick={() => onNavigate(id)}>
              <span className="action-icon"><Icon size={21} aria-hidden="true" /></span>
              <span className="action-copy"><strong>{label}</strong><small>{detail}</small></span>
              <ArrowRight size={18} className="action-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
      <p className="home-footnote">Take your time. You can skip any step and come back later.</p>
    </div>
  )
}
