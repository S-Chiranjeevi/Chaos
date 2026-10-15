import React, { useEffect, useRef, useState } from 'react'
import { Bot, ChevronDown, MessageCircle, Send, ShieldAlert, X } from 'lucide-react'
import { UrgentCareBanner } from './UrgentCareBanner.jsx'
import { CHAT_STARTER, createChatReply } from '../services/chatbotService.js'

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

export function ChatbotWidget({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([CHAT_STARTER])
  const transcriptRef = useRef(null)

  useEffect(() => {
    if (isOpen) transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [isOpen, messages])

  function navigateFromSuggestion(label) {
    if (label === 'Open cycle tracker') onNavigate?.('tracker')
    if (label === 'Open doctor summary') onNavigate?.('doctor')
  }

  function sendMessage(value = draft) {
    const text = value.trim()
    if (!text) return

    const reply = createChatReply(text)
    const userMessage = { id: `user-${Date.now()}`, sender: 'user', text }
    const assistantMessage = {
      id: `assistant-${Date.now() + 1}`,
      sender: 'assistant',
      text: reply.message,
      kind: reply.kind,
      warnings: reply.warnings,
      suggestions: reply.suggestions,
    }
    setMessages((current) => [...current, userMessage, assistantMessage])
    setDraft('')
  }

  return (
    <aside className="chatbot-shell" aria-label="LumaHer help chat">
      {isOpen && (
        <section className="chatbot-panel" aria-labelledby="chatbot-title">
          <header className="chatbot-header">
            <div className="chatbot-heading">
              <span className="chatbot-header-icon"><MessageCircle size={20} aria-hidden="true" /></span>
              <div><h2 id="chatbot-title">Ask LumaHer</h2><p>Private, local guidance</p></div>
            </div>
            <button type="button" className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat"><X size={20} /></button>
          </header>
          <p className="chatbot-safety-note"><ShieldAlert size={15} aria-hidden="true" /> Urgent symptoms are checked before guidance.</p>
          <div className="chatbot-transcript" ref={transcriptRef} aria-live="polite" aria-relevant="additions">
            {messages.map((message) => <Message key={message.id} message={message} onSuggestion={sendMessage} onNavigate={navigateFromSuggestion} />)}
          </div>
          <form className="chatbot-composer" onSubmit={(event) => { event.preventDefault(); sendMessage() }}>
            <label className="sr-only" htmlFor="chatbot-message">Type a message</label>
            <textarea id="chatbot-message" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask about tracking or preparing for a visit" rows="2" />
            <button type="submit" disabled={!draft.trim()} aria-label="Send message"><Send size={18} /></button>
          </form>
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
        <span>{isOpen ? 'Close chat' : 'Ask LumaHer'}</span>
        {isOpen && <ChevronDown size={17} aria-hidden="true" />}
      </button>
    </aside>
  )
}

export default ChatbotWidget
