import React from 'react'
import { BookOpen, CircleHelp, HeartHandshake, Sparkles } from 'lucide-react'

export function EducationLibrary() {
  return <div className="education-library">
    <div className="section-header education-heading"><span className="subhead-pill">Learn at your own pace</span><h2>Simple, trustworthy context</h2><p>These articles support a conversation with a clinician. They cannot diagnose a condition.</p></div>
    <div className="education-grid">
      <article><BookOpen size={21} aria-hidden="true" /><h3>What PCOS can involve</h3><p>PCOS is a health condition that can sometimes be related to changes in periods, skin, or hair. Similar changes can have other causes too. A health worker can talk with you about your situation.</p></article>
      <article><Sparkles size={21} aria-hidden="true" /><h3>Myth: A period must come on the exact same day</h3><p>Period timing can vary from person to person and sometimes from month to month. A note of dates can help you describe what you notice.</p></article>
      <article><CircleHelp size={21} aria-hidden="true" /><h3>When to get help quickly</h3><p>If you feel in immediate danger or very unwell, contact local emergency help or a trusted health worker. This page cannot judge an emergency for you.</p></article>
      <article><HeartHandshake size={21} aria-hidden="true" /><h3>Prepare for a visit</h3><p>You may want to bring cycle dates, changes you noticed, and questions. You decide which notes to share.</p></article>
    </div>
    <p className="education-disclaimer">This is information, not a diagnosis.</p>
  </div>
}
