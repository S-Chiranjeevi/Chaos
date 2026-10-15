import React, { useEffect, useRef, useState } from 'react'
import { Bot, ChevronDown, Loader2, MessageCircle, Send, ShieldAlert, X } from 'lucide-react'
import { UrgentCareBanner } from './UrgentCareBanner.jsx'
import { CHAT_STARTER, createChatReply } from '../services/chatbotService.js'
import { t } from '../data/translations.js'
import { AnalysisUnavailableError, requestSymptomAnalysis } from '../services/apiClient.js'
import { getSafetyDisclaimer } from '../services/safetyRules.js'

function Message({ message, onSuggestion, onNavigate }) {
  const isAssistant = message.sender === 'assistant'
  return (
    <article className={`chatbot-message chatbot-message-${isAssistant ? 'assistant' : 'user'}`}>
      {isAssistant && <Bot size={18} aria-hidden="true" className="chatbot-avatar" />}
      <div className="chatbot-message-content">
        {message.warnings?.length > 0 && <UrgentCareBanner warnings={message.warnings} />}
        <p>{message.text}</p>
        {message.suggestions?.length > 0 && (
          <div className="chatbot-suggestions" aria-label="Suggested questions">
            {message.suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion}
                onClick={() => (suggestion.startsWith('Open ') ? onNavigate(suggestion) : onSuggestion(suggestion))}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function ChatbotWidget({ onNavigate, currentLanguage = 'en' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([CHAT_STARTER])
  const [useGemini, setUseGemini] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const transcriptRef = useRef(null)

  useEffect(() => {
    if (isOpen) transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [isOpen, messages])

  function navigateFromSuggestion(label) {
    if (label === 'Open cycle tracker') onNavigate?.('tracker')
    if (label === 'Open doctor summary') onNavigate?.('doctor')
  }

  async function sendMessage(value = draft) {
    const text = value.trim()
    if (!text || isSending) return

    const localReply = createChatReply(text)
    const userMessage = { id: `user-${Date.now()}`, sender: 'user', text }
    setMessages((current) => [...current, userMessage])
    setDraft('')
    setIsSending(true)

    let reply = localReply
    if (useGemini && localReply.kind !== 'urgent') {
      try {
        const ai = await requestSymptomAnalysis({ text, language: 'auto' })
        const explanation = ai.explanation && ai.explanation !== ai.answer ? `\n\n${ai.explanation}` : ''
        const suggestions = Array.isArray(ai.questionsForDoctor) && ai.questionsForDoctor.length
          ? ai.questionsForDoctor.slice(0, 2).filter(Boolean)
          : localReply.suggestions
        reply = {
          kind: 'guidance',
          message: `${ai.answer}${explanation}\n\n${getSafetyDisclaimer()}`,
          warnings: [],
          suggestions,
        }
      } catch (error) {
        const unavailable = error instanceof AnalysisUnavailableError
        reply = {
          ...localReply,
          message: `${localReply.message}\n\n${unavailable ? 'Gemini is unavailable right now, so I used on-device guidance.' : 'I used on-device guidance for this response.'}`,
        }
      }
    }

    const assistantMessage = { id: `assistant-${Date.now() + 1}`, sender: 'assistant', text: reply.message, kind: reply.kind, warnings: reply.warnings, suggestions: reply.suggestions }
    setMessages((current) => [...current, assistantMessage])
    setIsSending(false)
  }

  const launcherLabel = isOpen
    ? (t('chatbot.launcherOpen', currentLanguage) || 'Close chat')
    : (t('chatbot.launcherClosed', currentLanguage) || 'Ask LumaHer')
  const botTitle = t('chatbot.title', currentLanguage) || 'Ask LumaHer'
  const botSubtitle = t('chatbot.subtitle', currentLanguage) || 'Private, local guidance'
  const safetyNote = t('chatbot.safetyNote', currentLanguage) || 'Urgent symptoms are checked before guidance.'
  const placeholderText = t('chatbot.placeholder', currentLanguage) || 'Ask about tracking or preparing for a visit'

  return (
    <aside className="chatbot-shell" aria-label="LumaHer help chat">
      {isOpen && (
        <section className="chatbot-panel" aria-labelledby="chatbot-title">
          <header className="chatbot-header">
            <div className="chatbot-heading">
              <span className="chatbot-header-icon"><MessageCircle size={20} aria-hidden="true" /></span>
              <div><h2 id="chatbot-title">{botTitle}</h2><p>{botSubtitle}</p></div>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat"><X size={20} /></button>
          </header>
          <p className="chatbot-safety-note"><ShieldAlert size={15} aria-hidden="true" /> {safetyNote}</p>
          <div className="chatbot-transcript" ref={transcriptRef} aria-live="polite" aria-relevant="additions">
            {messages.map((message) => <Message key={message.id} message={message} onSuggestion={sendMessage} onNavigate={navigateFromSuggestion} />)}
          </div>
          <form className="chatbot-composer" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
            <label className="sr-only" htmlFor="chatbot-message">Type a message</label>
            <textarea id="chatbot-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={placeholderText} rows="2" disabled={isSending} />
            <button type="submit" disabled={!draft.trim() || isSending} aria-label="Send message">{isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}</button>
          </form>
          <label className="flex items-start gap-2 px-3 pb-3 text-[11px] leading-snug text-stone-500">
            <input type="checkbox" className="mt-0.5 accent-rose-700" checked={useGemini} onChange={(event) => setUseGemini(event.target.checked)} />
            <span>Use Gemini AI for this chat. Your message is sent to Google Gemini only when this is selected.</span>
          </label>
        </section>
      )}
      <button
        type="button"
        className="chatbot-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="chatbot-title"
      >
        <MessageCircle size={22} aria-hidden="true" />
        <span>{launcherLabel}</span>
        {isOpen && <ChevronDown size={17} aria-hidden="true" />}
      </button>
    </aside>
  )
}

export default ChatbotWidget
