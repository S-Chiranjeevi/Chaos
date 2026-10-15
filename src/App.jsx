import { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { assessSymptoms } from './engine.js'
import CycleTracker from './components/CycleTracker.jsx'
import { EXAMPLE_PROMPTS, LANGUAGES, UI_STRINGS } from './data/languages.js'
import { extractSymptoms } from './services/symptomExtractor.js'
import { analyzeSymptomsWithGemini } from './services/geminiService.js'
import { speechService } from './services/speechService.js'
import { saveHealthEntry } from './services/storageService.js'
import './App.css'
import './Gemini.css'

const RESULT_LABELS = {
  en: { resultTitle: 'Your symptom summary', nextStep: 'A starting point for your next step', routine: 'Routine follow-up', soon: 'Discuss with a clinician', urgent: 'Urgent care', mentioned: 'What you mentioned', topics: 'Topics to explore', questions: 'Questions you could ask', care: 'Care guidance', disclaimer: 'This is information, not a diagnosis.', urgentMessage: 'Some symptoms you described may need urgent medical attention. Please seek urgent medical care or contact local emergency services.', unclear: 'I could not confidently identify a symptom pattern. You can try describing what you feel, when it started, and how it affects you.', privacy: 'When Gemini is configured, your note is sent to Google for analysis and saved in this browser.', consent: 'I understand my health description will be sent to Google Gemini for analysis.', analyzing: 'Understanding your description…', localFallback: 'Gemini is unavailable, so SakhiCare used its on-device pattern checks. This may miss symptoms, especially in regional languages.' },
  hi: { resultTitle: 'आपके लक्षणों का सारांश', nextStep: 'अगले कदम के लिए एक शुरुआत', routine: 'सामान्य जानकारी', soon: 'डॉक्टर से चर्चा करें', urgent: 'तत्काल देखभाल', mentioned: 'आपने क्या बताया', topics: 'चर्चा के विषय', questions: 'डॉक्टर से पूछने के प्रश्न', care: 'देखभाल संबंधी जानकारी', disclaimer: 'यह जानकारी है, निदान नहीं।', urgentMessage: 'आपके बताए कुछ लक्षणों में तुरंत चिकित्सा सहायता की ज़रूरत हो सकती है। कृपया तत्काल चिकित्सा सहायता लें।', unclear: 'हम लक्षणों को स्पष्ट रूप से पहचान नहीं सके। आप क्या महसूस कर रहे हैं और यह कब शुरू हुआ, बताने की कोशिश करें।', privacy: 'Gemini चालू होने पर आपका नोट विश्लेषण के लिए Google को भेजा जाएगा और इस ब्राउज़र में सहेजा जाएगा।', consent: 'मैं समझता/समझती हूँ कि मेरा स्वास्थ्य विवरण विश्लेषण के लिए Google Gemini को भेजा जाएगा।', analyzing: 'आपके विवरण को समझा जा रहा है…', localFallback: 'Gemini उपलब्ध नहीं है, इसलिए SakhiCare ने इस डिवाइस पर उपलब्ध सीमित जाँच का उपयोग किया। क्षेत्रीय भाषाओं में कुछ लक्षण छूट सकते हैं।' },
  kn: { resultTitle: 'ನಿಮ್ಮ ಲಕ್ಷಣಗಳ ಸಾರಾಂಶ', nextStep: 'ಮುಂದಿನ ಹೆಜ್ಜೆಗೆ ಒಂದು ಆರಂಭ', routine: 'ಸಾಮಾನ್ಯ ಮಾಹಿತಿ', soon: 'ವೈದ್ಯರೊಂದಿಗೆ ಚರ್ಚಿಸಿ', urgent: 'ತುರ್ತು ಚಿಕಿತ್ಸೆ', mentioned: 'ನೀವು ತಿಳಿಸಿದವು', topics: 'ಚರ್ಚಿಸಬಹುದಾದ ವಿಷಯಗಳು', questions: 'ವೈದ್ಯರನ್ನು ಕೇಳಬಹುದಾದ ಪ್ರಶ್ನೆಗಳು', care: 'ಆರೈಕೆ ಮಾಹಿತಿ', disclaimer: 'ಇದು ಮಾಹಿತಿ ಮಾತ್ರ, ರೋಗನಿರ್ಣಯವಲ್ಲ.', urgentMessage: 'ನೀವು ವಿವರಿಸಿದ ಕೆಲವು ಲಕ್ಷಣಗಳಿಗೆ ತುರ್ತು ವೈದ್ಯಕೀಯ ನೆರವು ಬೇಕಾಗಬಹುದು. ದಯವಿಟ್ಟು ತುರ್ತು ಆರೈಕೆ ಪಡೆಯಿರಿ.', unclear: 'ಲಕ್ಷಣಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಗುರುತಿಸಲು ಆಗಲಿಲ್ಲ. ಏನು ಅನಿಸುತ್ತಿದೆ ಮತ್ತು ಯಾವಾಗ ಆರಂಭವಾಯಿತು ಎಂದು ವಿವರಿಸಿ.', privacy: 'Gemini ಹೊಂದಿಸಿದಾಗ, ನಿಮ್ಮ ವಿವರಣೆಯನ್ನು ವಿಶ್ಲೇಷಣೆಗೆ Google ಗೆ ಕಳುಹಿಸಿ ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತದೆ.', consent: 'ನನ್ನ ಆರೋಗ್ಯ ವಿವರಣೆಯನ್ನು ವಿಶ್ಲೇಷಣೆಗೆ Google Gemini ಗೆ ಕಳುಹಿಸಲಾಗುತ್ತದೆ ಎಂಬುದು ನನಗೆ ತಿಳಿದಿದೆ.', analyzing: 'ನಿಮ್ಮ ವಿವರಣೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲಾಗುತ್ತಿದೆ…', localFallback: 'Gemini ಲಭ್ಯವಿಲ್ಲ. SakhiCare ಈ ಸಾಧನದ ಸೀಮಿತ ಮಾದರಿ ಪರಿಶೀಲನೆಯನ್ನು ಬಳಸಿದೆ; ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳಲ್ಲಿನ ಕೆಲವು ಲಕ್ಷಣಗಳು ತಪ್ಪಬಹುದು.' },
  ta: { resultTitle: 'உங்கள் அறிகுறிகளின் சுருக்கம்', nextStep: 'அடுத்த படிக்கான தொடக்கம்', routine: 'பொதுவான தகவல்', soon: 'மருத்துவருடன் பேசுங்கள்', urgent: 'அவசர சிகிச்சை', mentioned: 'நீங்கள் குறிப்பிட்டவை', topics: 'விவாதிக்க வேண்டியவை', questions: 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்', care: 'பராமரிப்பு வழிகாட்டல்', disclaimer: 'இது தகவல் மட்டுமே; நோயறிதல் அல்ல.', urgentMessage: 'நீங்கள் குறிப்பிட்ட சில அறிகுறிகளுக்கு உடனடி மருத்துவ உதவி தேவைப்படலாம். அவசர மருத்துவ உதவியை நாடுங்கள்.', unclear: 'அறிகுறிகளைத் தெளிவாக அடையாளம் காண முடியவில்லை. என்ன உணர்கிறீர்கள், எப்போது தொடங்கியது என்பதை விவரிக்கவும்.', privacy: 'Gemini அமைக்கப்பட்டிருந்தால், உங்கள் குறிப்பு பகுப்பாய்விற்காக Google-க்கு அனுப்பப்பட்டு இந்த உலாவியில் சேமிக்கப்படும்.', consent: 'எனது சுகாதார விளக்கம் பகுப்பாய்விற்காக Google Gemini-க்கு அனுப்பப்படும் என்பதைப் புரிந்துகொள்கிறேன்.', analyzing: 'உங்கள் விளக்கத்தைப் புரிந்துகொள்கிறோம்…', localFallback: 'Gemini கிடைக்கவில்லை. SakhiCare இந்தச் சாதனத்தின் வரையறுக்கப்பட்ட முறை சரிபார்ப்பைப் பயன்படுத்தியது; பிராந்திய மொழி அறிகுறிகள் விடுபடலாம்.' },
  ml: { resultTitle: 'നിങ്ങളുടെ ലക്ഷണങ്ങളുടെ ചുരുക്കം', nextStep: 'അടുത്ത നടപടിയിലേക്കുള്ള തുടക്കം', routine: 'പൊതുവായ വിവരം', soon: 'ഡോക്ടറുമായി സംസാരിക്കുക', urgent: 'അടിയന്തര പരിചരണം', mentioned: 'നിങ്ങൾ പറഞ്ഞത്', topics: 'ചർച്ച ചെയ്യാവുന്ന വിഷയങ്ങൾ', questions: 'ഡോക്ടറോട് ചോദിക്കാവുന്ന ചോദ്യങ്ങൾ', care: 'പരിചരണ മാർഗ്ഗനിർദ്ദേശം', disclaimer: 'ഇത് വിവരമാണ്, രോഗനിർണയം അല്ല.', urgentMessage: 'നിങ്ങൾ പറഞ്ഞ ചില ലക്ഷണങ്ങൾക്ക് ഉടൻ വൈദ്യസഹായം ആവശ്യമായേക്കാം. അടിയന്തര വൈദ്യസഹായം തേടുക.', unclear: 'ലക്ഷണങ്ങൾ വ്യക്തമായി തിരിച്ചറിയാനായില്ല. എന്താണ് അനുഭവപ്പെടുന്നത്, എപ്പോൾ തുടങ്ങി എന്ന് വിവരിക്കുക.', privacy: 'Gemini സജ്ജമാക്കിയാൽ, നിങ്ങളുടെ കുറിപ്പ് വിശകലനത്തിനായി Google-ലേക്ക് അയയ്ക്കുകയും ഈ ബ്രൗസറിൽ സൂക്ഷിക്കുകയും ചെയ്യും.', consent: 'എന്റെ ആരോഗ്യ വിവരണം വിശകലനത്തിനായി Google Gemini-ലേക്ക് അയയ്ക്കുമെന്ന് ഞാൻ മനസ്സിലാക്കുന്നു.', analyzing: 'നിങ്ങളുടെ വിവരണം മനസ്സിലാക്കുന്നു…', localFallback: 'Gemini ലഭ്യമല്ല. SakhiCare ഈ ഉപകരണത്തിലെ പരിമിതമായ പാറ്റേൺ പരിശോധന ഉപയോഗിച്ചു; പ്രാദേശിക ഭാഷയിലെ ചില ലക്ഷണങ്ങൾ കണ്ടെത്താനാകാതെ വരാം.' },
  te: { resultTitle: 'మీ లక్షణాల సారాంశం', nextStep: 'తదుపరి అడుగుకు ఒక ప్రారంభం', routine: 'సాధారణ సమాచారం', soon: 'ఆరోగ్య నిపుణుడితో చర్చించండి', urgent: 'తక్షణ వైద్య సహాయం', mentioned: 'మీరు తెలిపినవి', topics: 'చర్చించాల్సిన విషయాలు', questions: 'వైద్యుడిని అడగగల ప్రశ్నలు', care: 'సంరక్షణ సూచనలు', disclaimer: 'ఇది సమాచారం మాత్రమే, నిర్ధారణ కాదు.', urgentMessage: 'మీరు తెలిపిన కొన్ని లక్షణాలకు తక్షణ వైద్య సహాయం అవసరం కావచ్చు. దయచేసి అత్యవసర వైద్య సహాయం పొందండి.', unclear: 'లక్షణాలను స్పష్టంగా గుర్తించలేకపోయాం. మీకు ఏమి అనిపిస్తోంది, ఎప్పటి నుంచి ఉందో వివరించండి.', privacy: 'Gemini అమర్చినప్పుడు, మీ వివరాలు విశ్లేషణ కోసం Googleకు పంపబడతాయి మరియు ఈ బ్రౌజర్‌లో భద్రపరచబడతాయి.', consent: 'నా ఆరోగ్య వివరాలు విశ్లేషణ కోసం Google Geminiకి పంపబడతాయని నాకు తెలుసు.', analyzing: 'మీ వివరాలను అర్థం చేసుకుంటున్నాం…', localFallback: 'Gemini అందుబాటులో లేదు. SakhiCare ఈ పరికరంలోని పరిమిత నమూనా తనిఖీని ఉపయోగించింది; ప్రాంతీయ భాషల్లో కొన్ని లక్షణాలు గుర్తించబడకపోవచ్చు.' },
}

function mergeAnalysis(gemini, local, fallbackEngine, labels) {
  const redFlags = [...new Set([...(gemini?.redFlags || []), ...local.redFlags, ...fallbackEngine.redFlags])]
  const urgent = local.isUrgent || fallbackEngine.urgency === 'urgent' || gemini?.urgency === 'urgent' || redFlags.length > 0
  const extractedSymptoms = gemini?.extractedSymptoms?.length ? gemini.extractedSymptoms : [...new Set([...local.symptoms.filter((symptom) => !symptom.isCustom).map((symptom) => symptom.symptom), ...fallbackEngine.extractedSymptoms])]
  return {
    summary: gemini?.summary || '',
    extractedSymptoms,
    possibleTopics: gemini?.possibleTopics?.length ? gemini.possibleTopics : fallbackEngine.possibleTopics.length ? fallbackEngine.possibleTopics : local.topics,
    urgency: urgent ? 'urgent' : gemini?.urgency || fallbackEngine.urgency || 'routine',
    explanation: urgent ? labels.urgentMessage : gemini?.explanation || (extractedSymptoms.length ? labels.disclaimer : labels.unclear),
    recommendedDoctor: urgent ? labels.urgentMessage : gemini?.recommendedDoctor || labels.soon,
    questionsForDoctor: gemini?.questionsForDoctor?.length ? gemini.questionsForDoctor : fallbackEngine.questionsForDoctor.length ? fallbackEngine.questionsForDoctor : local.questionsForDoctor,
    redFlags,
    source: gemini ? 'gemini' : 'local',
  }
}

function App() {
  const [note, setNote] = useState('')
  const [language, setLanguage] = useState('auto')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [storageError, setStorageError] = useState('')
  const [analysisNotice, setAnalysisNotice] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [consent, setConsent] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const copy = UI_STRINGS[language] || UI_STRINGS.en
  const labels = RESULT_LABELS[language] || RESULT_LABELS.en
  const examples = EXAMPLE_PROMPTS[language] || EXAMPLE_PROMPTS.en

  async function submit(event) {
    event.preventDefault()
    if (!note.trim()) {
      setError('empty')
      return
    }
    if (!consent) {
      setError('consent')
      return
    }
    setError('')
    setIsAnalyzing(true)
    setAnalysisNotice('')

    const local = extractSymptoms(note)
    const fallbackEngine = assessSymptoms(note)
    let gemini = null
    try {
      gemini = await analyzeSymptomsWithGemini(note.trim(), language)
    } catch (analysisError) {
      setAnalysisNotice(`${labels.localFallback} ${analysisError.message}`)
    }
    const assessment = mergeAnalysis(gemini, local, fallbackEngine, labels)
    setResult(assessment)
    try {
      saveHealthEntry({ recordedAt: new Date().toISOString(), language, notes: note.trim(), symptoms: assessment.extractedSymptoms.map((symptom) => ({ symptom })), assessment: { urgency: assessment.urgency, redFlags: assessment.redFlags, summary: assessment.summary } })
      setStorageError('')
      window.dispatchEvent(new Event('sakhicare:health-entry-update'))
    } catch {
      setStorageError('Your summary is ready, but it could not be saved on this device.')
    }
    setIsAnalyzing(false)
    window.setTimeout(() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  function toggleSpeech() {
    setVoiceError('')
    if (isListening) {
      speechService.stop()
      setIsListening(false)
      setInterimTranscript('')
      return
    }
    const selected = LANGUAGES.find((item) => item.code === language)
    const started = speechService.start({
      language: selected?.speechCode || 'en-IN',
      onStart: () => setIsListening(true),
      onResult: ({ finalTranscript, interimTranscript: interim }) => {
        if (finalTranscript) setNote((current) => `${current}${current && !/\s$/.test(current) ? ' ' : ''}${finalTranscript}`)
        setInterimTranscript(interim || '')
      },
      onNoMatch: () => setVoiceError(copy.couldNotHear),
      onError: ({ error: reason, message }) => {
        setIsListening(false)
        setVoiceError(reason === 'permission-denied' ? copy.permissionDenied : reason === 'unsupported-browser' ? copy.browserUnsupported : message || copy.networkError)
      },
      onEnd: () => { setIsListening(false); setInterimTranscript('') },
    })
    if (!started) setVoiceError(copy.browserUnsupported)
  }

  function selectExample(text) {
    setNote(text)
    setResult(null)
    setError('')
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
          <div className="section-heading"><p className="eyebrow">A gentle place to start</p><h2>{copy.talkOrTypeHeader}</h2><p>Describe your symptoms in English, Hindi, Kannada, Tamil, Malayalam, Telugu, or a mix of languages.</p></div>
          <div className="checker-grid">
            <form className="checker-card" onSubmit={submit}>
              <div className="checker-language-row"><label className="field-label" htmlFor="analysis-language">{copy.selectLanguage}</label><select id="analysis-language" value={language} onChange={(event) => { setLanguage(event.target.value); setVoiceError('') }}><option value="auto">Auto detect language</option>{LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.nativeName}</option>)}</select></div>
              <label className="field-label" htmlFor="symptom-text">{copy.talkOrTypeHeader}</label>
              <p className="field-hint">Share what you noticed, when it started, and how it affects you. The summary is information, not a diagnosis.</p>
              <textarea id="symptom-text" maxLength={1500} rows={5} value={note} onChange={(event) => { setNote(event.target.value); if (event.target.value.trim()) setError('') }} placeholder={copy.inputPlaceholder} />
              <div className="input-footer"><span className="privacy-note">▣ &nbsp;{labels.privacy}</span><span>{note.length} / 1500</span></div>
              <div className="speech-controls"><button className={`speech-button ${isListening ? 'listening' : ''}`} type="button" onClick={toggleSpeech} aria-pressed={isListening} aria-label={isListening ? copy.tapToStop : copy.micTooltip}>{isListening ? <MicOff size={16} aria-hidden="true" /> : <Mic size={16} aria-hidden="true" />}{isListening ? copy.tapToStop : copy.micTooltip}</button>{interimTranscript && <span className="interim-transcript" aria-live="polite">{interimTranscript}</span>}</div>
              {voiceError && <p className="inline-error" role="status">{voiceError}</p>}
              <div className="example-prompts"><span>{copy.tryExamples}</span>{examples.slice(0, 3).map((example) => <button key={example.title} type="button" onClick={() => selectExample(example.text)}>{example.title}</button>)}</div>
              <label className="gemini-consent"><input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); if (event.target.checked && error === 'consent') setError('') }} /><span>{labels.consent}</span></label>
              <button className="primary-button submit-button" type="submit" disabled={isAnalyzing}>{isAnalyzing ? labels.analyzing : copy.understandBtn} <span aria-hidden="true">{isAnalyzing ? '…' : '→'}</span></button>
              {error === 'empty' && <p className="inline-error" role="alert">Please add a few words about what you’ve been noticing.</p>}
              {error === 'consent' && <p className="inline-error" role="alert">Please confirm before sending your health description for analysis.</p>}
              {storageError && <p className="inline-error" role="status">{storageError}</p>}
              <p className="form-disclaimer">This is an educational tool. It cannot diagnose a condition or replace care from a qualified professional.</p>
            </form>
            <aside className="side-note"><div className="note-icon">✧</div><p className="eyebrow">A note from SakhiCare</p><h3>You deserve to be heard.</h3><p>Symptoms can have several causes. This tool can help you find words for what you’re feeling and questions to bring to a clinician.</p><div className="note-divider" /><p className="note-small"><span>♡</span> If you feel unsafe or have severe symptoms, please seek medical help right away.</p><div className="leaf-art" aria-hidden="true">❧</div></aside>
          </div>
        </section>

        {analysisNotice && <p className="analysis-notice" role="status">{analysisNotice}</p>}
        {result && <section className="results-section" id="results" aria-live="polite" aria-atomic="false"><article className="results-card">
          <div className="results-head"><div><p className="eyebrow">{labels.resultTitle}</p><h2>{result.summary || labels.nextStep}</h2><span className="analysis-source">{result.source === 'gemini' ? 'Gemini assisted · Please review with a healthcare professional' : 'On-device pattern check · Limited coverage'}</span></div><span className={`urgency-pill ${result.urgency}`}>{result.urgency === 'urgent' ? labels.urgent : result.urgency === 'soon' ? labels.soon : labels.routine}</span></div>
          {result.urgency === 'urgent' && <div className="urgent-banner" role="alert">{labels.urgentMessage}</div>}
          <div className="results-body"><p className="result-summary">{result.explanation}</p><div className="result-block"><h3>{labels.mentioned}</h3><div className="symptom-tags">{result.extractedSymptoms.length ? result.extractedSymptoms.map((item) => <span className="symptom-tag" key={item}>{item}</span>) : <span className="symptom-tag">No specific symptom matched yet</span>}</div></div>
            <div className="result-grid"><div className="result-block"><h3>{labels.topics}</h3><ul>{(result.possibleTopics.length ? result.possibleTopics : ['You can talk through your concerns with a healthcare professional.']).map((item) => <li key={item}>{item}</li>)}</ul></div><div className="result-block"><h3>{labels.questions}</h3><ul>{result.questionsForDoctor.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
            <div className="results-doctor"><b>{labels.care}</b>{result.recommendedDoctor}</div>
            {result.redFlags.length > 0 && <div className="result-block"><h3>Symptoms needing attention</h3><ul>{result.redFlags.map((item) => <li key={item}>{item}</li>)}</ul></div>}
            <p className="results-disclaimer">{labels.disclaimer}</p>
          </div>
        </article></section>}

        <CycleTracker />

        <section className="how-section" id="how-it-works"><div><p className="eyebrow">Small steps, more confidence</p><h2>Make the next conversation<br />a little easier.</h2></div><div className="steps"><article><span>01</span><div><h3>Put it into words</h3><p>Share symptoms in your own words and language.</p></div></article><article><span>02</span><div><h3>See what stands out</h3><p>Get a simple summary and guidance on when to seek care.</p></div></article><article><span>03</span><div><h3>Feel ready to ask</h3><p>Take suggested questions to a health professional.</p></div></article></div></section>
      </main>
      <footer><a className="brand" href="#top"><span className="brand-mark">✳</span><span>Sakhi<span className="brand-accent">Care</span></span></a><p>Made with care. For information and support, not diagnosis.</p><a href="#checker">Back to symptom checker ↑</a></footer>
    </>
  )
}

export default App
