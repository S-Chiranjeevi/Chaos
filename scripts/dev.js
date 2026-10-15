import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const children = []
let shuttingDown = false

function stopAll(exitCode = 0) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) if (child.exitCode === null) child.kill('SIGTERM')
  setTimeout(() => process.exit(exitCode), 300)
}

function launch(label, args) {
  const child = spawn(process.execPath, args, { cwd: root, env: process.env, stdio: 'inherit' })
  children.push(child)
  child.on('error', (error) => {
    console.error(`${label} failed to start: ${error.message}`)
    stopAll(1)
  })
  child.on('exit', (code) => {
    if (!shuttingDown) {
      if (code !== 0) console.error(`${label} stopped with exit code ${code}.`)
      stopAll(code || 0)
    }
  })
}

process.on('SIGINT', () => stopAll(0))
process.on('SIGTERM', () => stopAll(0))
launch('SakhiCare API', ['server/index.js'])
launch('Vite', ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1'])
