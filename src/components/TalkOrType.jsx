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
import { AnalysisUnavailableError, requestSymptomAnalysis } from '../services/apiClient.js'
import { detectRedFlags, getSafetyDisclaimer } from '../services/safetyRules.js'
import { validateOutput } from '../services/outputValidator.js'
import { createHealthEntry, publishHealthEntry } from '../models/healthEntry.js'
import { UrgentCareBanner } from './UrgentCareBanner.jsx'
import { SymptomCards } from './SymptomCards.jsx'
import { AssessmentView } from './AssessmentView.jsx'
import { HealthEntryExport } from './HealthEntryExport.jsx'

function assessWithSafety(input, candidate, localResult) {
  const safetyWarnings = detectRedFlags(input)
  const validation = validateOutput(candidate)
  const localValidation = validateOutput(localResult)
  let parsed = validation.valid ? validation.output : localValidation.valid ? localValidation.output : null

  if (!parsed) {
    parsed = {
      symptoms: [],
      possibleRelationships: [],
      isUrgent: safetyWarnings.length > 0,
      urgency: safetyWarnings.length > 0 ? 'urgent' : 'routine',
      redFlags: [],
      disclaimer: getSafetyDisclaimer(),
      questionsForDoctor: [],
      lifestyleTips: [],
      recommendedSpecialist: 'a qualified healthcare professional',
      outputBlocked: true,
    }
  }

  const redFlags = Array.isArray(parsed.redFlags) ? parsed.redFlags : Array.isArray(parsed.red_flags) ? parsed.red_flags : []
  return {
    ...parsed,
    safetyWarnings,
    isUrgent: safetyWarnings.length > 0 || parsed.isUrgent || ['urgent', 'emergency'].includes(parsed.urgency),
    urgency: safetyWarnings.length > 0 || parsed.urgency === 'emergency' ? 'urgent' : parsed.urgency,
    redFlags: [...new Set([...redFlags, ...safetyWarnings.map((warning) => warning.title)])],
    disclaimer: getSafetyDisclaimer(),
  }
}

export function TalkOrType({ onHealthEntryCreated, initialLanguage = 'en' }) {
  // Primary state
  const [selectedLang, setSelectedLang] = useState(initialLanguage)
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
  const [analysisFallbackMessage, setAnalysisFallbackMessage] = useState('')

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
  async function handleUnderstandSymptoms(e) {
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
    setAnalysisFallbackMessage('')

    const input = inputText.trim()
    const safetyWarnings = detectRedFlags(input)
    const localResult = extractSymptoms(input, { preferredLanguage: selectedLang })
    let candidate = localResult

    // Urgent findings use local rules immediately and never wait on an online model.
    if (!safetyWarnings.length) {
      try {
        const response = await requestSymptomAnalysis({ text: input, language: selectedLang })
        const validation = validateOutput(response)
        if (!validation.valid) throw new AnalysisUnavailableError('The online response did not pass safety checks.')
        const backendResult = validation.output
        candidate = {
          ...localResult,
          ...backendResult,
          // Keep locally structured symptom cards, while accepting safe backend education.
          symptoms: localResult.symptoms,
          detectedLanguage: backendResult.detectedLanguage || backendResult.detected_language || localResult.detectedLanguage,
          possibleRelationships: Array.isArray(backendResult.possibleRelationships)
            ? backendResult.possibleRelationships
            : backendResult.possible_relation ? [backendResult.possible_relation] : localResult.possibleRelationships,
          recommendedSpecialist: backendResult.recommendedSpecialist || backendResult.recommended_specialist || localResult.recommendedSpecialist,
          urgency: localResult.urgency === 'urgent' ? 'urgent' : backendResult.urgency,
          redFlags: localResult.redFlags.length ? localResult.redFlags : backendResult.redFlags || backendResult.red_flags || [],
          lifestyleTips: backendResult.lifestyleTips || backendResult.self_care_tips || localResult.lifestyleTips,
          questionsForDoctor: backendResult.questionsForDoctor || backendResult.questions_for_doctor || localResult.questionsForDoctor,
          disclaimer: getSafetyDisclaimer(),
        }
      } catch (error) {
        const safetyBlocked = error instanceof AnalysisUnavailableError && /safety checks/i.test(error.message)
        setAnalysisFallbackMessage(safetyBlocked
          ? 'The online response was hidden by safety checks, so LunaHer used on-device guidance instead.'
          : 'We could not use the online analysis service, so LunaHer used private on-device symptom guidance instead.')
      }
    }

    const parsed = assessWithSafety(input, candidate, localResult)

    setExtractedResult(parsed)
    setSymptomsList(parsed.symptoms)

    // Build and save the shared local HealthEntry regardless of backend availability.
    const newEntry = createHealthEntry({
      language: parsed.detectedLanguage || selectedLang,
      inputMode,
      rawTranscript: inputText.trim(),
      symptoms: parsed.symptoms,
      assessment: {
        statement: parsed.disclaimer,
        urgency: parsed.urgency,
        topics: parsed.topics,
        questionsForDoctor: parsed.questionsForDoctor,
        redFlags: parsed.redFlags,
        safetyWarnings: parsed.safetyWarnings,
      },
    })

    setHealthEntry(newEntry)
    const saveResult = publishHealthEntry(newEntry)
    setStorageSaveError(saveResult?.ok ? '' : saveResult?.error || 'Your note could not be saved on this device.')

    if (onHealthEntryCreated) onHealthEntryCreated(newEntry)

    setCurrentState('results')

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
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

  return (
    <div className="talk-or-type-module">
      {/* MAIN CARD */}
      <div className="talk-card bg-white/95 rounded-3xl border border-stone-200/90 p-6 md:p-8 shadow-sm backdrop-blur-xl relative overflow-hidden transition-all">
        {/* TOP CONTROLS: LANGUAGE PICKER & STATUS BADGE */}
        <div className="card-top-bar flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-100">
          <div className="lang-picker-group flex flex-wrap items-center gap-2 sm:gap-3">
            <label htmlFor="language-select" className="lang-label flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
              <Globe size={15} className="lang-icon text-rose-600" />
              <span>{strings.selectLanguage}:</span>
            </label>
            <div className="lang-pills flex flex-wrap items-center gap-1.5">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  id={`lang-btn-${lang.code}`}
                  className={`lang-pill-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedLang === lang.code
                      ? 'active bg-rose-50 text-rose-800 border-rose-300 shadow-xs ring-1 ring-rose-200 font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="lang-pill-badge text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-200/70 text-stone-700 uppercase">{lang.badge}</span>
                  <span className="lang-pill-name font-medium">{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="status-indicator-tag inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100/90 border border-stone-200 text-xs font-semibold text-stone-700">
            <span className={`status-pulse ${currentState} w-2 h-2 rounded-full ${
              currentState === 'recording' ? 'bg-red-500 animate-ping' :
              currentState === 'processing' ? 'bg-amber-500 animate-spin' :
              currentState === 'results' ? 'bg-emerald-500' : 'bg-stone-400'
            }`} />
            <span className="status-name capitalize font-medium text-stone-700">State: {currentState.replace('-', ' ')}</span>
          </div>
        </div>

        {/* NOTIFICATION BANNERS FOR ERROR / SPECIAL STATES */}
        {currentState === 'permission-denied' && (
          <div className="state-alert-banner alert-permission p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-4 flex items-start gap-3" role="alert">
            <AlertCircle size={20} className="alert-icon text-rose-600 shrink-0 mt-0.5" />
            <div className="alert-text flex-1">
              <strong className="block text-sm font-bold text-rose-900">Microphone Permission Denied</strong>
              <p className="text-xs text-rose-700 mt-0.5">{strings.permissionDenied}</p>
              <div className="alert-sublinks text-[11px] text-rose-600 mt-1">
                <span>Tip: Click the lock icon 🔒 or camera/mic icon in your browser address bar and select "Allow".</span>
              </div>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn px-3 py-1 bg-white hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 transition-colors cursor-pointer"
              onClick={() => setCurrentState('typing')}
            >
              Dismiss
            </button>
          </div>
        )}

        {currentState === 'unsupported-browser' && (
          <div className="state-alert-banner alert-unsupported p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-4 flex items-start gap-3" role="alert">
            <Info size={20} className="alert-icon text-amber-600 shrink-0 mt-0.5" />
            <div className="alert-text flex-1">
              <strong className="block text-sm font-bold text-amber-900">Browser Voice Input Unsupported</strong>
              <p className="text-xs text-amber-700 mt-0.5">{strings.browserUnsupported}</p>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn px-3 py-1 bg-white hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800 transition-colors cursor-pointer"
              onClick={() => setCurrentState('typing')}
            >
              Type Instead
            </button>
          </div>
        )}

        {currentState === 'network-error' && (
          <div className="state-alert-banner alert-network p-4 bg-rose-50 border border-rose-200 rounded-2xl mb-4 flex items-start gap-3" role="alert">
            <AlertCircle size={20} className="alert-icon text-rose-600 shrink-0 mt-0.5" />
            <div className="alert-text flex-1">
              <strong className="block text-sm font-bold text-rose-900">Network Connection Issue</strong>
              <p className="text-xs text-rose-700 mt-0.5">{strings.networkError}</p>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn px-3 py-1 bg-white hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold text-rose-800 transition-colors cursor-pointer"
              onClick={handleToggleMic}
            >
              Retry Voice
            </button>
          </div>
        )}

        {analysisFallbackMessage && (
          <div className="state-alert-banner alert-unsupported p-3.5 bg-blue-50 border border-blue-200 rounded-2xl mb-4 flex items-start gap-3" role="status">
            <Info size={18} className="alert-icon text-blue-600 shrink-0 mt-0.5" />
            <div className="alert-text flex-1 text-xs text-blue-800">
              <strong className="block font-bold">Using on-device guidance</strong>
              <p className="mt-0.5">{analysisFallbackMessage}</p>
            </div>
            <button
              type="button"
              className="alert-dismiss-btn px-3 py-1 bg-white hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 transition-colors cursor-pointer"
              onClick={() => handleUnderstandSymptoms()}
            >
              Retry online
            </button>
          </div>
        )}

        {/* RECORDING / TRANSCRIBING LIVE OVERLAY / PROMPT */}
        {(currentState === 'recording' || recordingStatusMessage) && (
          <div className={`recording-banner p-4 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-300 rounded-2xl mb-4 flex items-center justify-between gap-4 ${micActive ? 'is-recording ring-2 ring-rose-300' : ''}`}>
            <div className="recording-indicator flex items-center gap-3">
              <span className="record-red-dot w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <div className="sound-wave-bars flex items-center gap-1 h-6">
                <span className="bar b1 w-1 bg-rose-600 rounded-full h-2 animate-bounce" />
                <span className="bar b2 w-1 bg-rose-600 rounded-full h-4 animate-bounce delay-75" />
                <span className="bar b3 w-1 bg-rose-600 rounded-full h-6 animate-bounce delay-150" />
                <span className="bar b4 w-1 bg-rose-600 rounded-full h-3 animate-bounce delay-100" />
                <span className="bar b5 w-1 bg-rose-600 rounded-full h-2 animate-bounce delay-200" />
              </div>
            </div>
            <div className="recording-message-col flex-1">
              <p className="rec-primary-text font-bold text-sm text-rose-900">
                {micActive ? strings.listening : recordingStatusMessage}
              </p>
              {micActive && (
                <p className="rec-sub-text text-xs text-stone-600">
                  {strings.tapToStop} (Speak naturally in {currentLangObj.nativeName})
                </p>
              )}
            </div>
            {micActive && (
              <button
                type="button"
                className="btn-stop-recording px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                onClick={handleToggleMic}
                aria-label="Stop recording"
              >
                <span>{strings.tapToStop}</span>
              </button>
            )}
          </div>
        )}

        {/* INPUT FORM */}
        <form onSubmit={handleUnderstandSymptoms} className="input-form space-y-4">
          <div className="textarea-wrapper relative">
            <textarea
              ref={textareaRef}
              id="talk-or-type-textarea"
              className={`main-symptom-input w-full min-h-[140px] p-4 pr-16 rounded-2xl border border-stone-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-stone-900 text-base placeholder:text-stone-400 outline-none transition-all resize-y bg-stone-50/50 focus:bg-white shadow-2xs ${micActive ? 'recording-active border-red-400 bg-red-50/30 ring-2 ring-red-200' : ''}`}
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
              <div className="interim-spoken-overlay absolute top-3 left-4 right-16 flex items-center gap-2 p-2 bg-white/95 rounded-xl border border-rose-200 shadow-xs text-xs font-medium text-rose-700">
                <Radio size={14} className="live-icon animate-pulse text-rose-600 shrink-0" />
                <span className="truncate">Transcribing: "{interimSpokenText}"</span>
              </div>
            )}

            {/* FLOATING MICROPHONE ACTION BUTTON */}
            <div className="mic-dock absolute right-3 bottom-3 z-10">
              <button
                type="button"
                id="mic-action-button"
                className={`mic-round-button w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all cursor-pointer ${
                  micActive
                    ? 'recording bg-red-600 hover:bg-red-700 animate-pulse ring-4 ring-red-200 scale-105'
                    : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 hover:scale-105 shadow-rose-200'
                }`}
                onClick={handleToggleMic}
                title={micActive ? strings.tapToStop : strings.micTooltip}
                aria-label={micActive ? 'Stop listening' : 'Start speaking'}
              >
                {micActive ? <MicOff size={22} /> : <Mic size={22} />}
                {micActive && <span className="mic-pulse-ring absolute inset-0 rounded-full border-2 border-red-400 animate-ping pointer-events-none" />}
              </button>
            </div>
          </div>

          {/* INPUT BAR FOOTER & REVIEW MESSAGE */}
          <div className="input-bar-footer flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="input-hints text-xs text-stone-500">
              {inputText.length > 0 && (
                <span className="review-hint inline-flex items-center gap-1.5 font-medium text-stone-700">
                  <FileCheck size={14} className="text-emerald-600" />
                  <span>{strings.reviewBeforeSubmit}</span>
                </span>
              )}
              {inputText.length === 0 && (
                <span className="empty-hint text-stone-500 text-xs">
                  Speak or type freely. Stored solely on your device.
                </span>
              )}
            </div>

            <div className="input-actions-cluster flex items-center gap-3">
              {inputText.length > 0 && (
                <button
                  type="button"
                  className="btn-clear-text inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                  onClick={() => {
                    setInputText('')
                    setCurrentState('empty')
                    textareaRef.current?.focus()
                  }}
                >
                  <RotateCcw size={13} />
                  <span>{strings.clearText}</span>
                </button>
              )}

              <span className="char-counter text-xs text-stone-400">{inputText.length} chars</span>

              <button
                type="submit"
                id="understand-symptoms-btn"
                className={`btn-understand-symptoms inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-all cursor-pointer ${
                  currentState === 'processing'
                    ? 'loading bg-rose-400 cursor-wait'
                    : 'bg-rose-700 hover:bg-rose-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-700 hover:shadow-md'
                }`}
                disabled={!inputText.trim() || currentState === 'processing'}
              >
                {currentState === 'processing' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Analyzing symptoms…</span>
                  </>
                ) : (
                  <>
                    <span>{strings.understandBtn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* EXAMPLE PROMPTS BAR */}
        <div className="examples-tray mt-6 pt-5 border-t border-stone-100">
          <div className="examples-heading flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
            <Sparkles size={14} className="sparkle-icon text-rose-600" />
            <span>{strings.tryExamples}</span>
          </div>
          <div className="example-chips-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {examples.map((item, idx) => (
              <button
                key={idx}
                type="button"
                className="example-prompt-card p-3.5 rounded-2xl bg-stone-50/80 hover:bg-rose-50/70 border border-stone-200/80 hover:border-rose-300 text-left transition-all group cursor-pointer shadow-2xs"
                onClick={() => handleSelectExample(item.text)}
              >
                <div className="example-tag-row mb-1.5">
                  <span className="example-tag text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md">{item.tag}</span>
                </div>
                <p className="example-prompt-text text-xs text-stone-700 leading-relaxed font-normal group-hover:text-stone-900">“{item.text}”</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS DISPLAY */}
      {currentState === 'results' && extractedResult && (
        <section ref={resultsRef} className="results-container" id="results-view" aria-live="polite">
          <UrgentCareBanner warnings={extractedResult.safetyWarnings || []} />
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

          <div className="mx-4 mt-4 grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-700 sm:mx-6 sm:grid-cols-2">
            <div><strong>Detected language:</strong> {(LANGUAGES.find((language) => language.code === extractedResult.detectedLanguage)?.name) || extractedResult.detectedLanguage || 'English'}</div>
            <div><strong>Recommended specialist:</strong> {extractedResult.recommendedSpecialist || 'Consider booking an appointment with a gynecologist.'}</div>
            <div className="sm:col-span-2"><strong>Possible relationships:</strong><ul className="mt-1 list-disc pl-5">{(extractedResult.possibleRelationships || extractedResult.topics || []).map((item) => <li key={item}>{item}</li>)}</ul></div>
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
