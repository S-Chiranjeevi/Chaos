import React, { useState, useRef } from 'react'
import {
  Mic,
  MicOff,
  Globe,
  RotateCcw,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Info,
  Loader2,
  Radio,
  FileCheck,
} from 'lucide-react'
import { LANGUAGES, EXAMPLE_PROMPTS, UI_STRINGS } from '../data/languages.js'
import { speechService } from '../services/speechService.js'
import { extractSymptoms } from '../services/symptomExtractor.js'
import { createHealthEntry, publishHealthEntry } from '../models/healthEntry.js'
import { SymptomCards } from './SymptomCards.jsx'
import { AssessmentView } from './AssessmentView.jsx'
import { HealthEntryExport } from './HealthEntryExport.jsx'
import { StatePreviewBar } from './StatePreviewBar.jsx'

export function TalkOrType({ onHealthEntryCreated }) {
  // Primary state
  const [selectedLang, setSelectedLang] = useState('en')
  const [inputText, setInputText] = useState('')
  const [currentState, setCurrentState] = useState('empty') // 'empty' | 'typing' | 'recording' | 'transcribing' | 'processing' | 'results' | 'permission-denied' | 'unsupported-browser' | 'network-error'
  
  // Audio & Speech status
  const [recordingStatusMessage, setRecordingStatusMessage] = useState('') // "Listening...", "Tap to stop", "We could not hear you. Try again."
  const [micActive, setMicActive] = useState(false)
  const [inputMode, setInputMode] = useState('text') // 'text' | 'speech'
  const [interimSpokenText, setInterimSpokenText] = useState('')

  // Results & Extracted Symptoms
  const [extractedResult, setExtractedResult] = useState(null)
  const [symptomsList, setSymptomsList] = useState([])
  const [healthEntry, setHealthEntry] = useState(null)

  const textareaRef = useRef(null)
  const resultsRef = useRef(null)

  const currentLangObj = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0]
  const strings = UI_STRINGS[selectedLang] || UI_STRINGS.en
  const examples = EXAMPLE_PROMPTS[selectedLang] || EXAMPLE_PROMPTS.en


  // Handle language change
  function handleLanguageChange(code) {
    setSelectedLang(code)
    // If mic is active, restart or stop
    if (micActive) {
      speechService.stop()
      setMicActive(false)
      setCurrentState(inputText.trim() ? 'typing' : 'empty')
    }
  }

  // Handle example prompt click
  function handleSelectExample(promptText) {
    setInputText(promptText)
    setCurrentState('typing')
    setRecordingStatusMessage('')
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 50)
  }

  // Toggle Microphone
  function handleToggleMic() {
    if (micActive) {
      // User tapped to stop
      setRecordingStatusMessage(strings.processingText || 'Finalizing speech...')
      setCurrentState('transcribing')
      speechService.stop()
      setMicActive(false)
      
      setTimeout(() => {
        setRecordingStatusMessage('')
        setCurrentState('typing')
      }, 700)
      return
    }

    // Check if browser supports speech
    if (!speechService.isSupported()) {
      setCurrentState('unsupported-browser')
      setRecordingStatusMessage('')
      return
    }

    // Starting recording
    setInputMode('speech')
    setRecordingStatusMessage(strings.listening) // "Listening…"
    setCurrentState('recording')
    setMicActive(true)

    const started = speechService.start({
      language: currentLangObj.speechCode,
      onStart: () => {
        setMicActive(true)
        setCurrentState('recording')
        setRecordingStatusMessage(strings.listening) // "Listening…"
      },
      onResult: ({ finalTranscript, interimTranscript }) => {
        setCurrentState('transcribing')
        setInterimSpokenText(interimTranscript)
        if (finalTranscript) {
          setInputText((prev) => {
            const separator = prev && !prev.endsWith(' ') ? ' ' : ''
            return prev + separator + finalTranscript.trim()
          })
          setInterimSpokenText('')
        }
      },
      onNoMatch: () => {
        setMicActive(false)
        setRecordingStatusMessage(strings.couldNotHear) // "We could not hear you. Try again."
        setCurrentState('typing')
      },
      onError: ({ error }) => {
        setMicActive(false)
        if (error === 'permission-denied') {
          setCurrentState('permission-denied')
        } else if (error === 'network-error' || error === 'network') {
          setCurrentState('network-error')
        } else if (error === 'unsupported-browser') {
          setCurrentState('unsupported-browser')
        } else {
          setRecordingStatusMessage(strings.couldNotHear)
          setCurrentState('typing')
        }
      },
      onEnd: () => {
        setMicActive(false)
        if (currentState === 'recording' || currentState === 'transcribing') {
          setCurrentState('typing')
        }
      },
    })

    if (!started) {
      setMicActive(false)
    }
  }

  // Submit / Understand my symptoms
  function handleUnderstandSymptoms(e) {
    if (e) e.preventDefault()
    if (!inputText.trim()) {
      textareaRef.current?.focus()
      return
    }

    // Stop recording if active
    if (micActive) {
      speechService.stop()
      setMicActive(false)
    }

    setCurrentState('processing')

    // Simulate clinical assessment extraction
    setTimeout(() => {
      const parsed = extractSymptoms(inputText)
      setExtractedResult(parsed)
      setSymptomsList(parsed.symptoms)

      // Build standardized HealthEntry
      const newEntry = createHealthEntry({
        language: selectedLang,
        inputMode,
        rawTranscript: inputText.trim(),
        symptoms: parsed.symptoms,
        assessment: {
          statement: parsed.disclaimer,
          urgency: parsed.urgency,
          topics: parsed.topics,
          questionsForDoctor: parsed.questionsForDoctor,
          redFlags: parsed.redFlags,
        },
      })

      setHealthEntry(newEntry)
      publishHealthEntry(newEntry)

      if (onHealthEntryCreated) {
        onHealthEntryCreated(newEntry)
      }

      setCurrentState('results')

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }, 750)
  }

  // Symptom Card Operations
  function handleUpdateSymptom(id, updatedFields) {
    const updated = symptomsList.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    setSymptomsList(updated)
    syncHealthEntry(updated)
  }

  function handleRemoveSymptom(id) {
    const updated = symptomsList.filter((item) => item.id !== id)
    setSymptomsList(updated)
    syncHealthEntry(updated)
  }

  function handleAddSymptom(newSymptom) {
    const updated = [...symptomsList, newSymptom]
    setSymptomsList(updated)
    syncHealthEntry(updated)
  }

  function syncHealthEntry(updatedSymptoms) {
    if (!healthEntry) return
    const updatedEntry = {
      ...healthEntry,
      symptoms: updatedSymptoms,
      metadata: {
        ...healthEntry.metadata,
        exportedAt: new Date().toISOString(),
      },
    }
    setHealthEntry(updatedEntry)
    publishHealthEntry(updatedEntry)
    if (onHealthEntryCreated) onHealthEntryCreated(updatedEntry)
  }

  // Force state directly for Hackathon judge testing
  function handleJudgeStateSelect(targetState) {
    setCurrentState(targetState)
    if (targetState === 'recording') {
      setMicActive(true)
      setRecordingStatusMessage(strings.listening) // "Listening…"
    } else {
      setMicActive(false)
    }

    if (targetState === 'empty') {
      setInputText('')
      setRecordingStatusMessage('')
    } else if (targetState === 'typing' && !inputText) {
      setInputText(examples[0].text)
      setRecordingStatusMessage('')
    } else if (targetState === 'transcribing') {
      setRecordingStatusMessage('Transcribing voice input...')
      setInterimSpokenText('My periods have been irregular for two or three months...')
    } else if (targetState === 'processing') {
      setRecordingStatusMessage('')
    } else if (targetState === 'results') {
      if (!inputText) setInputText('My periods come every 2–3 months, and I have acne and severe pain.')
      const parsed = extractSymptoms('My periods come every 2–3 months, and I have acne and severe pain.')
      setExtractedResult(parsed)
      setSymptomsList(parsed.symptoms)
      const mockEntry = createHealthEntry({
        language: selectedLang,
        inputMode: 'speech',
        rawTranscript: 'My periods come every 2–3 months, and I have acne and severe pain.',
        symptoms: parsed.symptoms,
      })
      setHealthEntry(mockEntry)
      publishHealthEntry(mockEntry)
    }
  }

  return (
    <div className="talk-or-type-module">
      {/* HACKATHON STATE TESTER */}
      <StatePreviewBar
        currentState={currentState}
        onSelectState={handleJudgeStateSelect}
      />

      {/* MAIN CARD */}
      <div className="talk-card">
        {/* TOP CONTROLS: LANGUAGE PICKER & STATUS BADGE */}
        <div className="card-top-bar">
          <div className="lang-picker-group">
            <label htmlFor="language-select" className="lang-label">
              <Globe size={16} className="lang-icon" />
              <span>{strings.selectLanguage}:</span>
            </label>
            <div className="lang-pills">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  id={`lang-btn-${lang.code}`}
                  className={`lang-pill-btn ${selectedLang === lang.code ? 'active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="lang-pill-badge">{lang.badge}</span>
                  <span className="lang-pill-name">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="status-indicator-tag">
            <span className={`status-pulse ${currentState}`} />
            <span className="status-name">State: {currentState.replace('-', ' ')}</span>
          </div>
        </div>

        {/* NOTIFICATION BANNERS FOR ERROR / SPECIAL STATES */}
        {currentState === 'permission-denied' && (
          <div className="state-alert-banner alert-permission" role="alert">
            <AlertCircle size={20} className="alert-icon" />
            <div className="alert-text">
              <strong>Microphone Permission Denied:</strong>
              <p>{strings.permissionDenied}</p>
              <div className="alert-sublinks">
                <span>Tip: Click the lock icon 🔒 or camera/mic icon in your browser address bar and select "Allow".</span>
              </div>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn"
              onClick={() => setCurrentState('typing')}
            >
              Dismiss
            </button>
          </div>
        )}

        {currentState === 'unsupported-browser' && (
          <div className="state-alert-banner alert-unsupported" role="alert">
            <Info size={20} className="alert-icon" />
            <div className="alert-text">
              <strong>Browser Voice Input Unsupported:</strong>
              <p>{strings.browserUnsupported}</p>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn"
              onClick={() => setCurrentState('typing')}
            >
              Type Instead
            </button>
          </div>
        )}

        {currentState === 'network-error' && (
          <div className="state-alert-banner alert-network" role="alert">
            <AlertCircle size={20} className="alert-icon" />
            <div className="alert-text">
              <strong>Network Connection Issue:</strong>
              <p>{strings.networkError}</p>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn"
              onClick={handleToggleMic}
            >
              Retry Voice
            </button>
          </div>
        )}

        {/* RECORDING / TRANSCRIBING LIVE OVERLAY / PROMPT */}
        {(currentState === 'recording' || recordingStatusMessage) && (
          <div className={`recording-banner ${micActive ? 'is-recording' : ''}`}>
            <div className="recording-indicator">
              <span className="record-red-dot" />
              <div className="sound-wave-bars">
                <span className="bar b1" />
                <span className="bar b2" />
                <span className="bar b3" />
                <span className="bar b4" />
                <span className="bar b5" />
              </div>
            </div>
            <div className="recording-message-col">
              <p className="rec-primary-text">
                {micActive ? strings.listening : recordingStatusMessage}
              </p>
              {micActive && (
                <p className="rec-sub-text">
                  {strings.tapToStop} (Speak naturally in {currentLangObj.nativeName})
                </p>
              )}
            </div>
            {micActive && (
              <button
                type="button"
                className="btn-stop-recording"
                onClick={handleToggleMic}
                aria-label="Stop recording"
              >
                <span>{strings.tapToStop}</span>
              </button>
            )}
          </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleUnderstandSymptoms} className="input-form">
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              id="talk-or-type-textarea"
              className={`main-symptom-input ${micActive ? 'recording-active' : ''}`}
              rows={5}
              placeholder={strings.inputPlaceholder}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value)
                setInputMode('text')
              }}
              aria-label="Describe symptoms in your own words"
            />

            {/* LIVE TRANSCRIBING PREVIEW BADGE */}
            {interimSpokenText && (
              <div className="interim-spoken-overlay">
                <Radio size={14} className="live-icon animate-pulse" />
                <span>Transcribing: "{interimSpokenText}"</span>
              </div>
            )}

            {/* FLOATING MICROPHONE ACTION BUTTON */}
            <div className="mic-dock">
              <button
                type="button"
                id="mic-action-button"
                className={`mic-round-button ${micActive ? 'recording' : ''}`}
                onClick={handleToggleMic}
                title={micActive ? strings.tapToStop : strings.micTooltip}
                aria-label={micActive ? 'Stop listening' : 'Start speaking'}
              >
                {micActive ? <MicOff size={24} /> : <Mic size={24} />}
                {micActive && <span className="mic-pulse-ring" />}
              </button>
            </div>
          </div>

          {/* INPUT BAR FOOTER & REVIEW MESSAGE */}
          <div className="input-bar-footer">
            <div className="input-hints">
              {inputText.length > 0 && (
                <span className="review-hint">
                  <FileCheck size={14} />
                  <span>{strings.reviewBeforeSubmit}</span>
                </span>
              )}
              {inputText.length === 0 && (
                <span className="empty-hint">
                  Speak or type freely. Stored only on this device.
                </span>
              )}
            </div>

            <div className="input-actions-cluster">
              {inputText.length > 0 && (
                <button
                  type="button"
                  className="btn-clear-text"
                  onClick={() => {
                    setInputText('')
                    setCurrentState('empty')
                    textareaRef.current?.focus()
                  }}
                >
                  <RotateCcw size={14} />
                  <span>{strings.clearText}</span>
                </button>
              )}

              <span className="char-counter">{inputText.length} chars</span>

              <button
                type="submit"
                id="understand-symptoms-btn"
                className={`btn-understand-symptoms ${currentState === 'processing' ? 'loading' : ''}`}
                disabled={!inputText.trim() || currentState === 'processing'}
              >
                {currentState === 'processing' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Analyzing symptoms…</span>
                  </>
                ) : (
                  <>
                    <span>{strings.understandBtn}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* EXAMPLE PROMPTS BAR */}
        <div className="examples-tray">
          <div className="examples-heading">
            <Sparkles size={14} className="sparkle-icon" />
            <span>{strings.tryExamples}</span>
          </div>
          <div className="example-chips-grid">
            {examples.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="example-prompt-card"
                onClick={() => handleSelectExample(item.text)}
              >
                <div className="example-tag-row">
                  <span className="example-tag">{item.tag}</span>
                </div>
                <p className="example-prompt-text">“{item.text}”</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {currentState === 'results' && extractedResult && (
        <section ref={resultsRef} className="results-container" id="results-view" aria-live="polite">
          {/* SECTION HEADER */}
          <div className="results-hero-strip">
            <div className="strip-title-group">
              <span className="strip-badge">Clinical Understanding</span>
              <h2>Organized Symptom Overview</h2>
              <p>Your inputs have been categorized into actionable health details below.</p>
            </div>
            <div className="strip-urgency">
              <span className={`urgency-badge ${extractedResult.urgency}`}>
                {extractedResult.urgency === 'urgent'
                  ? 'Urgent clinical evaluation advised'
                  : extractedResult.urgency === 'soon'
                  ? 'Consultation recommended soon'
                  : 'Routine consultation'}
              </span>
            </div>
          </div>

          {/* 1. EXTRACTED SYMPTOM CARDS */}
          <SymptomCards
            symptoms={symptomsList}
            onUpdateSymptom={handleUpdateSymptom}
            onRemoveSymptom={handleRemoveSymptom}
            onAddSymptom={handleAddSymptom}
          />

          {/* 2. PCOS GUIDANCE & NON-DIAGNOSTIC ASSESSMENT */}
          <AssessmentView
            assessment={extractedResult}
            symptoms={symptomsList}
          />

          {/* 3. SHARED HEALTHENTRY EXPORT & INTEROPERABILITY */}
          <HealthEntryExport
            healthEntry={healthEntry}
          />
        </section>
      )}
    </div>
  )
}
