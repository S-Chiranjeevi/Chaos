import { prepareOutputForDisplay } from './outputValidator.js'

const disclaimer = 'This is information, not a diagnosis.'

function numberOrNull(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function round(value, digits = 2) {
  return Number(value.toFixed(digits))
}

function addFactor(factors, feature, patientValue, cohortMedian, importanceRank) {
  factors.push({ feature, patient_value: patientValue, cohort_median: cohortMedian, importance_rank: importanceRank })
}

/**
 * Runs a browser-only educational pattern screen. It intentionally uses simple,
 * explainable rules so the page remains usable without a model service.
 */
export function runLocalScreening(input = {}) {
  const factors = []
  let score = 10
  let rank = 1
  const bmi = numberOrNull(input.weight_kg) && numberOrNull(input.height_cm)
    ? round(input.weight_kg / ((input.height_cm / 100) ** 2), 1)
    : null
  const waistHipRatio = numberOrNull(input.waist_inch) && numberOrNull(input.hip_inch) && input.hip_inch > 0
    ? round(input.waist_inch / input.hip_inch, 2)
    : null

  if (input.cycle_regularity === 'irregular') {
    score += 18
    addFactor(factors, 'Cycle regularity', 'Irregular', 'Regular', rank++)
  }
  if (numberOrNull(input.cycle_length_days) >= 35) {
    score += 8
    addFactor(factors, 'Cycle length (days)', input.cycle_length_days, 28, rank++)
  }
  for (const [key, label, weight] of [
    ['hair_growth', 'Excess hair growth', 6],
    ['pimples_acne', 'Persistent acne', 5],
    ['hair_loss', 'Hair thinning', 5],
    ['skin_darkening', 'Skin darkening', 7],
    ['weight_gain', 'Difficulty managing weight', 5],
  ]) {
    if (input[key]) {
      score += weight
      addFactor(factors, label, 'Reported', 'Not reported', rank++)
    }
  }
  const follicleCount = Math.max(numberOrNull(input.follicles_left) ?? 0, numberOrNull(input.follicles_right) ?? 0)
  if (follicleCount >= 12) {
    score += 10
    addFactor(factors, 'Reported follicle count', follicleCount, 6, rank++)
  }
  if (numberOrNull(input.amh_ng_ml) > 4) {
    score += 5
    addFactor(factors, 'AMH (ng/mL)', input.amh_ng_ml, 2.5, rank++)
  }
  if (numberOrNull(input.lh_miu_ml) && numberOrNull(input.fsh_miu_ml) && input.lh_miu_ml / input.fsh_miu_ml > 2) {
    score += 4
    addFactor(factors, 'LH:FSH ratio', round(input.lh_miu_ml / input.fsh_miu_ml, 2), 1, rank++)
  }
  if (bmi && bmi >= 25) {
    score += 4
    addFactor(factors, 'Body mass index', bmi, 22, rank++)
  }

  const patternScore = Math.min(88, Math.max(8, score))
  const moreFactors = patternScore >= 45
  const output = {
    prediction: moreFactors ? 1 : 0,
    prediction_label: moreFactors ? 'More factors to discuss' : 'Fewer factors recorded',
    probability: patternScore / 100,
    analysis_mode: follicleCount > 0 ? 'hybrid' : 'clinical',
    calculated_metrics: { bmi, waist_hip_ratio: waistHipRatio },
    contributing_features: factors.slice(0, 6),
    screening_summary: moreFactors
      ? `Your entries include several pattern factors that may be useful to discuss with a qualified healthcare professional. ${disclaimer}`
      : `Your entries include fewer of the pattern factors used by this educational screen. A clinician can consider your full health history if you have concerns. ${disclaimer}`,
  }
  const safety = prepareOutputForDisplay({ input, output })
  if (safety.blocked) throw new Error('The local screening result could not be safely prepared.')
  return safety.output
}

function percentile(values, p) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)))]
}

/** Estimates dark, circular candidate regions in an uploaded image entirely in the browser. */
export async function runLocalUltrasoundAnalysis(file) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height))
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()
  const pixels = context.getImageData(0, 0, width, height).data
  const luminance = new Uint8Array(width * height)
  for (let i = 0; i < luminance.length; i += 1) {
    const offset = i * 4
    luminance[i] = Math.round((pixels[offset] * 299 + pixels[offset + 1] * 587 + pixels[offset + 2] * 114) / 1000)
  }
  const threshold = percentile(luminance, 0.22)
  const seen = new Uint8Array(luminance.length)
  let candidates = 0
  for (let start = 0; start < luminance.length; start += 1) {
    if (seen[start] || luminance[start] > threshold) continue
    const queue = [start]
    seen[start] = 1
    let head = 0
    let area = 0
    let minX = width; let maxX = 0; let minY = height; let maxY = 0
    while (head < queue.length) {
      const index = queue[head++]
      const x = index % width
      const y = Math.floor(index / width)
      area += 1
      minX = Math.min(minX, x); maxX = Math.max(maxX, x)
      minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      for (const next of [index - 1, index + 1, index - width, index + width]) {
        if (next < 0 || next >= luminance.length || seen[next]) continue
        const nextX = next % width
        if (Math.abs(nextX - x) > 1 || luminance[next] > threshold) continue
        seen[next] = 1
        queue.push(next)
      }
    }
    const componentWidth = maxX - minX + 1
    const componentHeight = maxY - minY + 1
    const aspect = Math.min(componentWidth, componentHeight) / Math.max(componentWidth, componentHeight)
    if (area >= 20 && area <= 1200 && componentWidth >= 4 && componentWidth <= 60 && componentHeight >= 4 && componentHeight <= 60 && aspect >= 0.45) candidates += 1
  }
  const estimate = Math.min(30, candidates)
  return {
    left_follicle_estimate: estimate,
    right_follicle_estimate: estimate,
    algorithm_method: 'LunaHer Browser Image Pattern Estimation',
    disclaimer: `This browser-only estimate identifies image regions and cannot interpret an ultrasound scan. ${disclaimer}`,
  }
}
