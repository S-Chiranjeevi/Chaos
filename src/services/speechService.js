/**
 * Speech Recognition Service for SakhiCare Talk or Type
 * Handles Web Speech API integration, multi-language speech-to-text,
 * permission checking, and fallback states.
 */

export class SpeechService {
  constructor() {
    const SpeechRec = typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null
    this.SpeechRecognitionClass = SpeechRec
    this.recognition = null
    this.isListening = false
  }

  isSupported() {
    return Boolean(this.SpeechRecognitionClass)
  }

  start({
    language = 'en-IN',
    onStart,
    onResult,
    onNoMatch,
    onError,
    onEnd,
  }) {
    if (!this.isSupported()) {
      if (onError) onError({ error: 'unsupported-browser', message: 'SpeechRecognition not available in this browser.' })
      return false
    }

    // Abort any existing session
    if (this.recognition) {
      try {
        this.recognition.abort()
      } catch (e) {
        console.warn('Abort error:', e)
      }
    }

    try {
      this.recognition = new this.SpeechRecognitionClass()
      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.lang = language
      this.recognition.maxAlternatives = 1

      let hasReceivedSpeech = false

      this.recognition.onstart = () => {
        this.isListening = true
        if (onStart) onStart()
      }

      this.recognition.onresult = (event) => {
        hasReceivedSpeech = true
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptChunk = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptChunk
          } else {
            interimTranscript += transcriptChunk
          }
        }

        if (onResult) {
          onResult({
            finalTranscript,
            interimTranscript,
            fullTranscript: finalTranscript || interimTranscript,
          })
        }
      }

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error)
        this.isListening = false

        if (event.error === 'no-speech') {
          if (onNoMatch) onNoMatch({ message: 'We could not hear you. Try again.' })
          return
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (onError) onError({ error: 'permission-denied', message: 'Microphone permission denied.' })
          return
        }

        if (event.error === 'network') {
          if (onError) onError({ error: 'network-error', message: 'Network error occurred during speech recognition.' })
          return
        }

        if (onError) onError({ error: event.error, message: event.message || event.error })
      }

      this.recognition.onend = () => {
        const wasListening = this.isListening
        this.isListening = false
        if (!hasReceivedSpeech && wasListening) {
          if (onNoMatch) onNoMatch({ message: 'We could not hear you. Try again.' })
        }
        if (onEnd) onEnd()
      }

      this.recognition.start()
      return true
    } catch (err) {
      console.error('Speech recognition start failed:', err)
      this.isListening = false
      if (onError) onError({ error: 'start-failed', message: err.message })
      return false
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop()
      } catch (err) {
        console.warn('Stop error:', err)
      }
    }
    this.isListening = false
  }

  abort() {
    if (this.recognition) {
      try {
        this.recognition.abort()
      } catch (err) {
        console.warn('Abort error:', err)
      }
    }
    this.isListening = false
  }
}

export const speechService = new SpeechService()
