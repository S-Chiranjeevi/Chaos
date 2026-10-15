import React, { useState } from 'react'
import { Code, Download, Copy, Check, FileText, Share2 } from 'lucide-react'

export function HealthEntryExport({ healthEntry }) {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('formatted') // 'formatted' | 'json'

  if (!healthEntry) return null

  const jsonString = JSON.stringify(healthEntry, null, 2)

  function handleCopy() {
    navigator.clipboard?.writeText(jsonString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleDownloadJson() {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakhicare-health-entry-${healthEntry.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleDownloadSummary() {
    const summaryText = `SAKHICARE HEALTH SUMMARY REPORT
Generated: ${new Date(healthEntry.timestamp).toLocaleString()}
Language: ${healthEntry.language.toUpperCase()}
Input Mode: ${healthEntry.inputMode}

PATIENT DESCRIPTION:
"${healthEntry.rawTranscript}"

EXTRACTED SYMPTOMS (${healthEntry.symptoms.length}):
${healthEntry.symptoms.map((s, i) => `${i + 1}. ${s.symptom}
   - Duration: ${s.duration}
   - Frequency: ${s.frequency}
   - Severity: ${s.severity}
   - Category: ${s.category}`).join('\n\n')}

CLINICAL GUIDANCE:
"${healthEntry.assessment.statement}"

QUESTIONS TO BRING TO DOCTOR:
${healthEntry.assessment.questionsForDoctor?.map((q, i) => `${i + 1}. ${q}`).join('\n')}

DISCLAIMER:
This summary was organized using SakhiCare. It is educational information for self-advocacy. This is information, not a diagnosis.`

    const blob = new Blob([summaryText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sakhicare-doctor-prep-${healthEntry.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="health-entry-section">
      <div className="export-header-row">
        <div className="export-title-group">
          <Share2 size={20} className="export-icon" />
          <div>
            <h4>Shared HealthEntry Data Format</h4>
            <p>Interoperable patient health record exposed via callback and global event listener</p>
          </div>
        </div>

        <div className="export-tab-buttons">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'formatted' ? 'active' : ''}`}
            onClick={() => setActiveTab('formatted')}
          >
            <FileText size={14} />
            <span>Overview</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            <Code size={14} />
            <span>HealthEntry JSON</span>
          </button>
        </div>
      </div>

      <div className="export-content-card">
        {activeTab === 'formatted' ? (
          <div className="formatted-summary-view">
            <div className="summary-meta-badge-row">
              <span className="meta-badge id">ID: {healthEntry.id}</span>
              <span className="meta-badge lang">Language: {healthEntry.language.toUpperCase()}</span>
              <span className="meta-badge mode">Input: {healthEntry.inputMode}</span>
              <span className="meta-badge status">Event: sakhicare:healthEntryUpdate ✓</span>
            </div>

            <div className="transcript-review-box">
              <span className="box-label">Original User Input:</span>
              <p className="box-quote">“{healthEntry.rawTranscript}”</p>
            </div>

            <div className="actions-bar">
              <button
                type="button"
                className="btn-export download-summary"
                onClick={handleDownloadSummary}
              >
                <Download size={15} />
                <span>Download Doctor Prep Summary (.txt)</span>
              </button>
              <button
                type="button"
                className="btn-export download-json"
                onClick={handleDownloadJson}
              >
                <Download size={15} />
                <span>Export HealthEntry JSON</span>
              </button>
              <button
                type="button"
                className="btn-export copy-json"
                onClick={handleCopy}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="json-code-view">
            <div className="json-toolbar">
              <span className="schema-pill">Schema: HealthEntry v1.0.0</span>
              <button
                type="button"
                className="btn-tiny-copy"
                onClick={handleCopy}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="code-block">
              <code>{jsonString}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
