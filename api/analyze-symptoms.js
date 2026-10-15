import { generateResponse, MAX_NOTE_LENGTH } from '../server/gemini.js'

const LANGUAGES = new Set(['auto', 'en', 'hi', 'kn', 'ta', 'ml', 'te'])
const requestCounts = new Map()

function checkRateLimit(req, res) {
  const key = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (requestCounts.get(key) || []).filter((timestamp) => now - timestamp < 60_000)
  if (recent.length >= 20) {
    res.setHeader('Retry-After', '60')
    res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' })
    return false
  }
  recent.push(now)
  requestCounts.set(key, recent)
  return true
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }
  if (!checkRateLimit(req, res)) return

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body) } catch { return null } })() : req.body
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Send a valid JSON request.' })
  const text = typeof body.text === 'string' ? body.text.trim() : ''
  const language = LANGUAGES.has(body.language) ? body.language : 'auto'
  if (!text) return res.status(400).json({ error: 'Add a question or describe what you have noticed.' })
  if (text.length > MAX_NOTE_LENGTH) return res.status(413).json({ error: `Please keep your message under ${MAX_NOTE_LENGTH} characters.` })
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'Gemini is not configured yet. Add GEMINI_API_KEY to the Vercel project environment.' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)
  try {
    const result = await generateResponse({ text, language, apiKey, model: process.env.GEMINI_MODEL || 'gemini-3.8-flash', signal: controller.signal })
    return res.status(200).json(result)
  } catch (error) {
    if (error.name === 'AbortError') return res.status(504).json({ error: 'The response took too long. Please try again.' })
    if (error.status) return res.status(error.status).json({ error: error.message })
    console.error('Gemini request error:', error.message)
    return res.status(502).json({ error: 'Could not reach Gemini. Check the server connection and try again.' })
  } finally {
    clearTimeout(timeout)
  }
}
