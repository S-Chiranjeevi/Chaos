/**
 * PCOS Research Screening Client API (AMD-SlingShot Model Integration)
 * Communicates with the FastAPI backend service for XGBoost inference
 * and ultrasound follicle estimation.
 */

const BASE_API_URL = import.meta.env?.VITE_SCREENING_API_URL || 'http://localhost:8000/api/pcos-screening'
const PROXY_API_URL = '/api/pcos-screening'

async function tryFetchWithFallback(endpointPath, options = {}) {
  // First try direct endpoint or proxy
  const urls = [
    `${BASE_API_URL}${endpointPath}`,
    `${PROXY_API_URL}${endpointPath}`,
  ]

  let lastError = null
  for (const url of urls) {
    try {
      const response = await fetch(url, options)
      if (response.ok) {
        return await response.json()
      }
      // If server returned structured JSON error message
      let errJson = null
      try {
        errJson = await response.json()
      } catch {
        // ignore JSON parse error
      }
      const msg = errJson?.message || errJson?.detail || `Server responded with status ${response.status}`
      throw new Error(msg)
    } catch (err) {
      lastError = err
    }
  }

  throw (
    lastError ||
    new Error(
      'Unable to connect to the PCOS Research Screening model service. Please ensure the backend is running at http://localhost:8000.'
    )
  )
}

/**
 * Checks service health and model readiness
 */
export async function getScreeningHealth() {
  return tryFetchWithFallback('/health')
}

export const checkScreeningHealth = getScreeningHealth

/**
 * Retrieves model version, validation metrics, and supported input features
 */
export async function getModelInfo() {
  return tryFetchWithFallback('/model-info')
}

/**
 * Runs clinical model inference with validated parameters
 */
export async function runClinicalScreening(payload) {
  return tryFetchWithFallback('/clinical', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

/**
 * Uploads an ultrasound image scan for follicle candidate estimation
 */
export async function runUltrasoundAnalysis(file) {
  const formData = new FormData()
  formData.append('file', file)

  const urls = [
    `${BASE_API_URL}/ultrasound`,
    `${PROXY_API_URL}/ultrasound`,
  ]

  let lastError = null
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        return await response.json()
      }
      let errJson = null
      try {
        errJson = await response.json()
      } catch {
        // ignore
      }
      throw new Error(errJson?.message || errJson?.detail || `Upload failed with status ${response.status}`)
    } catch (err) {
      lastError = err
    }
  }

  throw lastError || new Error('Could not upload or analyze ultrasound image.')
}
