import { useState } from 'react'
import { assessSymptoms } from './engine.js'
import HealthTracker from './HealthTracker.jsx'
import './App.css'

function App() {
  const [note, setNote] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (!note.trim()) {
      setError(true)
      return
    }
    setError(false)
    setResult(assessSymptoms(note))
    window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  return (
    <>
      <a className="skip-link" href="#checker">Skip to symptom checker</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="SakhiCare home"><span className="brand-mark">✳</span><span>Sakhi<span className="brand-accent">Care</span></span></a>
        <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#health-tracker">Health tracker</a><a className="nav-cta" href="#checker">Check symptoms <span>↗</span></a></nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> A little more clarity, at your pace</p>
            <h1>Your body is telling you something.<br /><span>Let’s make sense of it.</span></h1>
            <p className="hero-description">Share what you’ve been experiencing in your own words. We’ll help you organize your symptoms and prepare for a conversation with a health professional.</p>
            <a className="primary-button" href="#checker">Explore your symptoms <span>↓</span></a>
            <div className="trust-note"><span className="shield">♡</span><span>Private by design <i>·</i> No account needed <i>·</i> No diagnosis</span></div>
          </div>
          <div className="hero-art" role="img" aria-label="Illustration representing a gentle check-in with your wellbeing">
            <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
            <div className="art-card card-top"><span className="mini-icon pink">♡</span><span><b>Listen to your body</b><small>Your experience matters</small></span></div>
            <div className="portrait"><div className="hair" /><div className="face"><div className="eye eye-left" /><div className="eye eye-right" /><div className="nose" /><div className="smile" /><div className="ear" /></div><div className="neck" /><div className="body" /><div className="shirt" /><div className="arm" /><span className="flower flower-a">✿</span><span className="flower flower-b">✦</span></div>
            <div className="art-card card-bottom"><span className="mini-icon green">✓</span><span><b>Care starts with a conversation</b><small>Take your notes to an appointment</small></span></div><span className="sparkle sparkle-a">✳</span><span className="sparkle sparkle-b">✦</span>
          </div>
          <div className="hero-stamp">YOU<br />KNOW<br />YOURSELF <b>✳</b></div>
        </section>

        <section className="checker-section" id="checker">
          <div className="section-heading"><p className="eyebrow">A gentle place to start</p><h2>What have you been noticing?</h2><p>There’s no wrong way to describe it. Type in English, Hindi, Telugu, or a mix of languages.</p></div>
          <div className="checker-grid">
            <form className="checker-card" onSubmit={submit}>
              <label className="field-label" htmlFor="symptom-text">Tell us what’s going on</label>
              <p className="field-hint">For example: “My periods have been irregular for three months, and I’ve noticed more acne.”</p>
              <textarea id="symptom-text" maxLength={1500} rows={5} value={note} onChange={(event) => { setNote(event.target.value); if (event.target.value.trim()) setError(false) }} placeholder="Write what you’ve noticed, when it started, and how it affects you…" />
              <div className="input-footer"><span className="privacy-note">▣ &nbsp;Your note stays in this browser.</span><span>{note.length} / 1500</span></div>
              <button className="primary-button submit-button" type="submit">Help me understand <span>→</span></button>
              {error && <p className="inline-error" role="alert">Please add a few words about what you’ve been noticing.</p>}
              <p className="form-disclaimer">This is an educational tool. It cannot diagnose a condition or replace care from a qualified professional.</p>
            </form>
            <aside className="side-note"><div className="note-icon">✧</div><p className="eyebrow">A note from SakhiCare</p><h3>You deserve to be heard.</h3><p>Symptoms can have several causes. This tool can help you find words for what you’re feeling and questions to bring to a clinician.</p><div className="note-divider" /><p className="note-small"><span>♡</span> If you feel unsafe or have severe symptoms, please seek medical help right away.</p><div className="leaf-art" aria-hidden="true">❧</div></aside>
          </div>
        </section>

        {result && <section className="results-section" id="results" aria-live="polite" aria-atomic="false"><article className="results-card">
          <div className="results-head"><div><p className="eyebrow">Your symptom summary</p><h2>A starting point for your next step</h2></div><span className={`urgency-pill ${result.urgency}`}>{result.urgency === 'urgent' ? 'Urgent care' : result.urgency === 'soon' ? 'Arrange care soon' : 'Routine care'}</span></div>
          {result.urgency === 'urgent' && <div className="urgent-banner" role="alert">Please seek urgent medical care now or contact local emergency services.</div>}
          <div className="results-body"><p className="result-summary">{result.explanation}</p><div className="result-block"><h3>What you mentioned</h3><div className="symptom-tags">{result.extractedSymptoms.length ? result.extractedSymptoms.map((item) => <span className="symptom-tag" key={item}>{item}</span>) : <span className="symptom-tag">No specific symptom matched yet</span>}</div></div>
            <div className="result-grid"><div className="result-block"><h3>Topics to explore</h3><ul>{(result.possibleTopics.length ? result.possibleTopics : ['You can talk through your concerns with a clinician.']).map((item) => <li key={item}>{item}</li>)}</ul></div><div className="result-block"><h3>Questions you could ask</h3><ul>{result.questionsForDoctor.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
            <div className="results-doctor"><b>Care guidance</b>{result.recommendedDoctor}</div>
            {result.redFlags.length > 0 && <div className="result-block"><h3>Symptoms needing attention</h3><ul>{result.redFlags.map((item) => <li key={item}>{item}</li>)}</ul></div>}
            <p className="results-disclaimer">This is information, not a diagnosis.</p>
          </div>
        </article></section>}

        <HealthTracker />

        <section className="how-section" id="how-it-works"><div><p className="eyebrow">Small steps, more confidence</p><h2>Make the next conversation<br />a little easier.</h2></div><div className="steps"><article><span>01</span><div><h3>Put it into words</h3><p>Share symptoms in your own words and language.</p></div></article><article><span>02</span><div><h3>See what stands out</h3><p>Get a simple summary and guidance on when to seek care.</p></div></article><article><span>03</span><div><h3>Feel ready to ask</h3><p>Take suggested questions to a health professional.</p></div></article></div></section>
      </main>
      <footer><a className="brand" href="#top"><span className="brand-mark">✳</span><span>Sakhi<span className="brand-accent">Care</span></span></a><p>Made with care. For information and support, not diagnosis.</p><a href="#checker">Back to symptom checker ↑</a></footer>
    </>
  )
}

export default App
