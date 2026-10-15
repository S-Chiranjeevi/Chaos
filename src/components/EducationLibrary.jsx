import React from 'react'
import { BookOpen, CircleHelp, HeartHandshake } from 'lucide-react'

export function EducationLibrary() {
  return <div className="education-library">
    <div className="section-header education-heading"><span className="subhead-pill">Learn at your own pace</span><h2>Simple, trustworthy context</h2><p>These articles support a conversation with a clinician. They cannot diagnose a condition.</p></div>
    <div className="education-grid">
      <article><BookOpen size={21} /><h3>What PCOS can involve</h3><p>Changes in periods, skin, hair, or weight may be related to hormones and can have several causes. Only a qualified clinician can assess your situation.</p></article>
      <article><CircleHelp size={21} /><h3>When to seek care</h3><p>Very heavy bleeding, severe pain, dizziness, fainting, or possible pregnancy warning signs need prompt attention. Please seek urgent medical care now or contact local emergency services.</p></article>
      <article><HeartHandshake size={21} /><h3>Prepare for a visit</h3><p>Bring cycle dates, changes you noticed, and questions. This can help your clinician understand the full picture.</p></article>
    </div>
    <p className="education-disclaimer">This is information, not a diagnosis.</p>
  </div>
}
