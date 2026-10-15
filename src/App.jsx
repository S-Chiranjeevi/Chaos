import React, { useState, useEffect } from 'react'
import { TalkOrType } from './components/TalkOrType.jsx'
import { BodyExplorer } from './components/BodyExplorer.jsx'
import { RotterdamMatrix } from './components/RotterdamMatrix.jsx'
import { SpecialistNavigator } from './components/SpecialistNavigator.jsx'
import { MythBusters } from './components/MythBusters.jsx'
import { CycleTracker } from './components/CycleTracker.jsx'
import { PrivacyControls } from './components/PrivacyControls.jsx'
import { EducationLibrary } from './components/EducationLibrary.jsx'
import { Heart, Shield, Sparkles, Stethoscope, Sun, Moon, Info } from 'lucide-react'
import { getLatestHealthEntry } from './models/healthEntry.js'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [lastSharedEntry, setLastSharedEntry] = useState(() => getLatestHealthEntry())

  useEffect(() => {
    // Listen for custom event from HealthEntry
    const handleEntryUpdate = (event) => {
      setLastSharedEntry(event.detail)
    }

    window.addEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate)
    return () => {
      window.removeEventListener('sakhicare:healthEntryUpdate', handleEntryUpdate)
    }
  }, [])

  function toggleDarkMode() {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`app-root ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <header className="site-navbar">
        <div className="navbar-container">
          <a href="#top" className="brand-logo" aria-label="SakhiCare Home">
            <span className="brand-symbol">✿</span>
            <span className="brand-name">
              Sakhi<span className="accent">Care</span>
            </span>
          </a>

          <div className="navbar-center-tag">
            <span className="nav-pill">
              <Sparkles size={13} className="pill-sparkle" />
              Empathetic PCOS &amp; Women's Health Guide
            </span>
          </div>

          <div className="navbar-actions">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a href="#talk-or-type-section" className="nav-cta-btn">
              <span>Talk or Type</span>
              <span>↓</span>
            </a>
          </div>
        </div>
      </header>

      {/* QUICK IN-PAGE NAVIGATION */}
      <nav className="quick-nav-bar" aria-label="Section navigation">
        <div className="quick-nav-container">
          <a href="#talk-or-type-section" className="quick-nav-link">Symptom Checker</a>
          <a href="#body-explorer" className="quick-nav-link">Body Explorer</a>
          <a href="#rotterdam" className="quick-nav-link">Rotterdam Criteria</a>
          <a href="#specialists" className="quick-nav-link">Specialist Guide</a>
          <a href="#tracker" className="quick-nav-link">Cycle Tracker</a>
          <a href="#learn" className="quick-nav-link">Education Library</a>
          <a href="#myths" className="quick-nav-link">Myth Busters</a>
          <a href="#privacy" className="quick-nav-link">Privacy &amp; Data</a>
        </div>
      </nav>

      <main id="top" className="main-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="eyebrow-badge">
                <Heart size={14} className="heart-icon" />
                <span>Multilingual Care Navigation</span>
              </div>
              <h1 className="hero-headline">
                Your body speaks in everyday words.<br />
                <span className="gradient-text">Let's make sense of it together.</span>
              </h1>
              <p className="hero-lead">
                Describe how you feel in <strong>English, Hindi, Hinglish, Telugu, Tamil, Kannada, Malayalam, Marathi, or Bengali</strong>—by speaking or typing.
                SakhiCare structures your symptoms into clear details and helps you prepare for your doctor visit with confidence.
              </p>

              <div className="hero-trust-badges">
                <div className="trust-item">
                  <Shield size={16} className="trust-icon" />
                  <span>100% Private in Browser</span>
                </div>
                <div className="trust-item">
                  <Info size={16} className="trust-icon" />
                  <span>No Diagnosis · Educational Support</span>
                </div>
                <div className="trust-item">
                  <Stethoscope size={16} className="trust-icon" />
                  <span>Doctor Discussion Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TALK OR TYPE FEATURE SECTION */}
        <section className="feature-section" id="talk-or-type-section">
          <div className="section-container">
            <div className="section-header">
              <span className="subhead-pill">Interactive Feature</span>
              <h2>“Talk or Type” for SakhiCare</h2>
              <p>Choose your preferred language, speak into your microphone or type naturally.</p>
            </div>

            <TalkOrType onHealthEntryCreated={(entry) => setLastSharedEntry(entry)} />
          </div>
        </section>

        {/* INTERACTIVE BODY EXPLORER */}
        <section className="feature-section" id="body-explorer">
          <div className="section-container">
            <div className="section-header">
              <span className="subhead-pill">Anatomical Symptom Map</span>
              <h2>Explore Where PCOS Shows Up in the Body</h2>
              <p>Click on anatomical regions to discover how hormones, insulin resistance, and cycle biology manifest across different body systems.</p>
            </div>

            <BodyExplorer />
          </div>
        </section>

        {/* ROTTERDAM CONSENSUS CRITERIA MATRIX */}
        <section className="feature-section" id="rotterdam">
          <div className="section-container">
            <div className="section-header">
              <span className="subhead-pill">Clinical Grounding</span>
              <h2>The Rotterdam 2003 Diagnostic Consensus</h2>
              <p>How physicians evaluate PCOS across 3 core pillars—and why clinical ultrasound and blood tests are required to confirm or rule it out.</p>
            </div>

            <RotterdamMatrix />
          </div>
        </section>

        {/* SPECIALIST NAVIGATOR */}
        <section className="feature-section" id="specialists">
          <div className="section-container">
            <div className="section-header">
              <span className="subhead-pill">Care Navigation</span>
              <h2>Which Specialist Should You See?</h2>
              <p>Understanding which healthcare provider aligns best with your symptom profile, from initial evaluation to specialized metabolic care.</p>
            </div>

            <SpecialistNavigator />
          </div>
        </section>

        {/* CYCLE TRACKER */}
        <section className="integration-section" id="tracker">
          <div className="section-container">
            <div className="section-header">
              <span className="subhead-pill">Private cycle tracker</span>
              <h2>Notice patterns over time</h2>
              <p>Log a cycle or symptom in a few words. Entries stay only on this device.</p>
            </div>
            <CycleTracker latestEntry={lastSharedEntry} />
          </div>
        </section>

        {/* EDUCATION LIBRARY */}
        <section className="education-section" id="learn">
          <div className="section-container">
            <EducationLibrary />
          </div>
        </section>

        {/* EVIDENCE-BASED MYTH BUSTERS */}
        <section className="feature-section" id="myths">
          <div className="section-container">
            <div className="section-header">
              <span className="subhead-pill">Evidence Over Stigma</span>
              <h2>PCOS Myth vs. Clinical Reality</h2>
              <p>Dismantling widespread misconceptions around fertility, weight, birth control, and ultrasound scans with verified facts.</p>
            </div>

            <MythBusters />
          </div>
        </section>

        {/* PRIVACY & OFFLINE DATA CONTROLS */}
        <section className="privacy-section" id="privacy">
          <div className="section-container"><PrivacyControls onDataDeleted={() => setLastSharedEntry(null)} /></div>
        </section>

        {/* HOW IT HELPS SECTION */}
        <section className="guidance-overview-section" id="how-it-works">
          <div className="section-container">
            <div className="overview-grid">
              <div className="step-card">
                <div className="step-num">01</div>
                <h3>Express in Any Dialect</h3>
                <p>Use your local language or everyday phrasing without medical jargon.</p>
              </div>
              <div className="step-card">
                <div className="step-num">02</div>
                <h3>Structured Health Cards</h3>
                <p>We identify duration, frequency, and severity for each symptom so you can review and edit.</p>
              </div>
              <div className="step-card">
                <div className="step-num">03</div>
                <h3>PCOS &amp; Differential Guidance</h3>
                <p>Learn why symptoms might occur with PCOS while acknowledging other possible conditions.</p>
              </div>
              <div className="step-card">
                <div className="step-num">04</div>
                <h3>Shared HealthEntry Record</h3>
                <p>Export a standardized doctor prep report or interoperable data for care providers.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <span className="footer-logo">✿ SakhiCare</span>
            <p>A companion for women's reproductive health navigation and self-advocacy.</p>
          </div>
          <div className="footer-disclaimer-box">
            <strong>Medical Disclaimer:</strong>
            <p>
              SakhiCare is an informational tool. This is information, not a diagnosis.
              “These symptoms can sometimes occur with PCOS, but they can also have other causes.”
              Always consult a certified medical practitioner or gynecologist for diagnosis and clinical care.
            </p>
          </div>
          <div className="footer-bottom-row">
            <span>© {new Date().getFullYear()} SakhiCare · Hackathon Prototype</span>
            <a href="#top" className="back-to-top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
