import React, { useState, useRef } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  Info,
  Layers,
  Sparkles,
  Upload,
  ArrowRight,
  Trash2,
} from 'lucide-react'
import { runUltrasoundAnalysis } from '../../services/screeningApi.js'

export function UltrasoundImageAnalyzer({ onApplyFollicles }) {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [applied, setApplied] = useState(false)
  const fileInputRef = useRef(null)

  function handleFileSelect(selectedFile) {
    if (!selectedFile) return
    setError(null)
    setResult(null)
    setApplied(false)

    // Validate format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image file (PNG, JPG, or JPEG). PDF or documents are not supported.')
      return
    }

    // Validate size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image exceeds 10MB limit. Please upload a smaller scan image.')
      return
    }

    setFile(selectedFile)
    const url = URL.createObjectURL(selectedFile)
    setPreviewUrl(url)
  }

  async function handleAnalyze() {
    if (!file) return
    setIsAnalyzing(true)
    setError(null)

    try {
      const data = await runUltrasoundAnalysis(file)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Failed to analyze ultrasound image.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  function handleCreateSampleScan() {
    // Generate a synthetic test ultrasound scan canvas for judge testing
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')

    // Background ultrasound dark gray texture
    ctx.fillStyle = '#1c2228'
    ctx.fillRect(0, 0, 400, 400)

    // Draw stippled background noise
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.15})`
      ctx.fillRect(Math.random() * 400, Math.random() * 400, 2, 2)
    }

    // Draw ovary boundary
    ctx.beginPath()
    ctx.ellipse(200, 200, 140, 110, 0.2, 0, Math.PI * 2)
    ctx.fillStyle = '#3a444d'
    ctx.fill()
    ctx.strokeStyle = '#5a6875'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw 14 dark anechoic circular follicles (polycystic necklace pattern)
    const centers = [
      [140, 150], [170, 130], [210, 130], [250, 140],
      [270, 170], [280, 210], [260, 250], [220, 270],
      [180, 270], [140, 250], [120, 210], [125, 175],
      [180, 190], [220, 200],
    ]

    centers.forEach(([cx, cy]) => {
      ctx.beginPath()
      ctx.arc(cx, cy, 10 + Math.random() * 6, 0, Math.PI * 2)
      ctx.fillStyle = '#0a0d10'
      ctx.fill()
    })

    canvas.toBlob((blob) => {
      if (blob) {
        const testFile = new File([blob], 'sample_pco_ultrasound.png', { type: 'image/png' })
        handleFileSelect(testFile)
      }
    }, 'image/png')
  }

  function handleClear() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setError(null)
    setApplied(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleApply() {
    if (!result) return
    onApplyFollicles({
      left: result.left_follicle_estimate,
      right: result.right_follicle_estimate,
    })
    setApplied(true)
  }

  return (
    <div className="ultrasound-analyzer-card">
      <div className="analyzer-header">
        <div className="analyzer-title-col">
          <h3>
            <Layers size={20} className="text-teal-600 dark:text-teal-400" />
            <span>Mode B: Ultrasound Follicle Analysis (AMD-SlingShot Pipeline)</span>
          </h3>
          <p>
            Upload a pelvic ultrasound sonography scan. The algorithm applies contrast normalization
            and connected-component blob detection to estimate antral follicle candidate counts.
          </p>
        </div>

        <button
          type="button"
          className="sample-scan-btn"
          onClick={handleCreateSampleScan}
          title="Generate synthetic ultrasound image for instant testing"
        >
          <Sparkles size={14} />
          <span>Load Sample USG Scan</span>
        </button>
      </div>

      {/* Upload Dropzone */}
      <div className="upload-zone-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          id="usg-upload-input"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files?.[0])}
        />

        {!file && (
          <div
            className="usg-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              handleFileSelect(e.dataTransfer.files?.[0])
            }}
          >
            <div className="dropzone-icon">
              <Upload size={32} />
            </div>
            <strong>Select or Drag & Drop Ultrasound Image</strong>
            <p>Supported: PNG, JPG, JPEG (Max 10 MB)</p>
            <button type="button" className="browse-files-btn">
              Browse Files
            </button>
          </div>
        )}

        {file && (
          <div className="preview-container-card">
            <div className="preview-image-box">
              <img src={previewUrl} alt="Ultrasound Preview" className="usg-thumbnail" />
            </div>

            <div className="preview-info-col">
              <div className="file-meta">
                <FileImage size={18} />
                <span className="file-name">{file.name}</span>
                <span className="file-size">({(file.size / 1024).toFixed(0)} KB)</span>
              </div>

              <div className="privacy-badge-notice">
                <CheckCircle2 size={15} />
                <span>Zero Storage Guarantee: Uploaded image is processed in transient RAM and automatically deleted.</span>
              </div>

              <div className="preview-actions-row">
                <button
                  type="button"
                  className="analyze-scan-btn"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="loading-spinner-sm" />
                      <span>Detecting Follicles...</span>
                    </>
                  ) : (
                    <>
                      <Layers size={16} />
                      <span>Analyze Follicle Candidates</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="clear-file-btn"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                >
                  <Trash2 size={16} />
                  <span>Remove Image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="usg-error-banner" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="usg-results-panel">
          <div className="results-grid-header">
            <h4>Ultrasound Morphological Analysis Output</h4>
            <span className="method-pill">{result.algorithm_method}</span>
          </div>

          <div className="follicles-metric-cards">
            <div className="follicle-card left">
              <span className="ovary-tag">Left Ovary</span>
              <div className="count-number">{result.left_follicle_estimate}</div>
              <span className="count-label">Estimated Follicles</span>
            </div>

            <div className="follicle-card right">
              <span className="ovary-tag">Right Ovary</span>
              <div className="count-number">{result.right_follicle_estimate}</div>
              <span className="count-label">Estimated Follicles</span>
            </div>
          </div>

          <div className="rotterdam-usg-interpret">
            {result.left_follicle_estimate >= 12 || result.right_follicle_estimate >= 12 ? (
              <div className="interpret-box elevated">
                <strong>Rotterdam Ultrasound Morphology Note:</strong>
                <p>
                  Estimated follicle candidate count (&gt;= 12–20) indicates high density suggestive of
                  polycystic ovarian morphology (PCOM) per clinical consensus thresholds.
                </p>
              </div>
            ) : (
              <div className="interpret-box normal">
                <strong>Rotterdam Ultrasound Morphology Note:</strong>
                <p>
                  Estimated follicle candidate count (&lt; 12) is within standard physiological ovulatory limits.
                </p>
              </div>
            )}
          </div>

          <div className="usg-action-export-row">
            <button
              type="button"
              className={`apply-to-form-btn ${applied ? 'is-applied' : ''}`}
              onClick={handleApply}
            >
              {applied ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Applied to Clinical Form!</span>
                </>
              ) : (
                <>
                  <ArrowRight size={16} />
                  <span>Apply Follicle Counts to Mode A (Clinical Screening)</span>
                </>
              )}
            </button>
          </div>

          <div className="usg-limitations-footer">
            <Info size={15} />
            <p>{result.disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  )
}
