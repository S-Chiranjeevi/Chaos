import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { generateResponse, MAX_NOTE_LENGTH } from './gemini.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const LANGUAGES = new Set(['auto', 'en', 'hi', 'kn', 'ta', 'ml', 'te'])
let MODEL = 'gemini-3.8-flash'
const MAX_BODY_BYTES = 12_000
const REQUEST_TIMEOUT_MS = 25_000
const rateLimits = new Map()

async function loadLocalEnv() {
  const inheritedVariables = new Set(Object.keys(process.env))
  for (const filename of ['.env', '.env.local']) {
    try {
      const content = await readFile(path.join(ROOT, filename), 'utf8')
      for (const line of content.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
        if (!match || inheritedVariables.has(match[1])) continue
        let value = match[2].trim()
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
        process.env[match[1]] = value
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
}

function json(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  res.end(JSON.stringify(payload))
}

function allowedRequest(req, res) {
  const now = Date.now()
  const key = req.socket.remoteAddress || 'unknown'
  const recent = (rateLimits.get(key) || []).filter((timestamp) => now - timestamp < 60_000)
  if (recent.length >= 20) {
    json(res, 429, { error: 'Too many requests. Please wait a minute and try again.' })
    return false
  }
  recent.push(now)
  rateLimits.set(key, recent)
  if (rateLimits.size > 1000) {
    for (const [address, timestamps] of rateLimits) if (!timestamps.some((timestamp) => now - timestamp < 60_000)) rateLimits.delete(address)
  }
  return true
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY_BYTES) throw Object.assign(new Error('Request is too large.'), { status: 413 })
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    throw Object.assign(new Error('Send a valid JSON request.'), { status: 400 })
  }
}

async function analyze(requestData) {
  if (!allowedRequest(requestData.req, requestData.res)) return
  const { req, res } = requestData
  let body
  try {
    body = await readBody(req)
  } catch (error) {
    json(res, error.status || 400, { error: error.message })
    return
  }
  const text = typeof body?.text === 'string' ? body.text.trim() : ''
  const language = LANGUAGES.has(body?.language) ? body.language : 'auto'
  if (!text) return json(res, 400, { error: 'Add a few words about what you have noticed.' })
  if (text.length > MAX_NOTE_LENGTH) return json(res, 413, { error: `Please keep your description under ${MAX_NOTE_LENGTH} characters.` })
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) return json(res, 503, { error: 'Gemini is not configured yet. Add GEMINI_API_KEY to .env.local on the server.' })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const generated = await generateResponse({ text, language, apiKey, model: MODEL, signal: controller.signal })
    return json(res, 200, generated)
  } catch (error) {
    if (error.name === 'AbortError') return json(res, 504, { error: 'The analysis took too long. Please try again.' })
    if (error.status) return json(res, error.status, { error: error.message })
    console.error('Gemini request error:', error.message)
    return json(res, 502, { error: 'Could not reach Gemini. Check the server connection and try again.' })
  } finally {
    clearTimeout(timeout)
  }
}

const MIME_TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2' }

async function serveStatic(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 404, { error: 'Not found.' })
  if (!existsSync(path.join(DIST, 'index.html'))) return json(res, 404, { error: 'Website build not found. Run npm run build first.' })
  let pathname
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname) } catch { return json(res, 400, { error: 'Invalid URL.' }) }
  const requested = path.resolve(DIST, `.${pathname}`)
  if (requested !== DIST && !requested.startsWith(`${DIST}${path.sep}`)) return json(res, 403, { error: 'Forbidden.' })
  const candidate = existsSync(requested) ? requested : path.join(DIST, 'index.html')
  try {
    const content = await readFile(candidate)
    res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(candidate)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' })
    res.end(req.method === 'HEAD' ? undefined : content)
  } catch {
    json(res, 404, { error: 'Not found.' })
  }
}

await loadLocalEnv()
MODEL = process.env.GEMINI_MODEL || MODEL
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  if (pathname === '/api/health' && req.method === 'GET') return json(res, 200, { configured: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY), model: MODEL })
  if (pathname === '/api/analyze-symptoms' && req.method === 'POST') return analyze({ req, res })
  if (pathname.startsWith('/api/')) return json(res, 404, { error: 'API endpoint not found.' })
  return serveStatic(req, res)
})

const port = Number(process.env.API_PORT || process.env.PORT || 4174)
const host = process.env.HOST || (process.env.NODE_ENV === 'production' || process.env.PORT ? '0.0.0.0' : '127.0.0.1')
server.listen(port, host, () => console.log(`Luna Her server listening on http://${host}:${port}; Gemini ${process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY ? 'configured' : 'not configured'}.`))
