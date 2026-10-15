import React, { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Info,
  RotateCcw,
  Sparkles,
  Stethoscope,
  TestTube,
} from 'lucide-react'
import { SCREENING_PRESETS } from '../../data/screeningPresets.js'

export function ClinicalScreeningForm({
  onSubmit,
  isSubmitting,
  prefilledFollicles = null,
}) {
  const [formData, setFormData] = useState({
    age: '',
    weight_kg: '',
    height_cm: '',
    waist_inch: '',
    hip_inch: '',
    pulse_bpm: '',
    rbs_mg_dl: '',
    bp_systolic: '',
    bp_diastolic: '',
    cycle_regularity: 'regular',
    cycle_length_days: '',
    fsh_miu_ml: '',
    lh_miu_ml: '',
    amh_ng_ml: '',
    prl_ng_ml: '',
    prg_ng_ml: '',
    tsh_miu_l: '',
    hair_growth: false,
    skin_darkening: false,
    hair_loss: false,
    pimples_acne: false,
    weight_gain: false,
    fast_food: false,
    regular_exercise: true,
    follicles_left: '',
    follicles_right: '',
  })

  const [consentGiven, setConsentGiven] = useState(false)
  const [showHormones, setShowHormones] = useState(false)
  const [activePreset, setActivePreset] = useState(null)

  // Sync prefilled follicles from Ultrasound Mode B if passed
  useEffect(() => {
    if (prefilledFollicles) {
      setFormData((prev) => ({
        ...prev,
        follicles_left: prefilledFollicles.left ?? prev.follicles_left,
        follicles_right: prefilledFollicles.right ?? prev.follicles_right,
      }))
    }
  }, [prefilledFollicles])

  // Computed live metrics
  const computedBmi =
    formData.weight_kg && formData.height_cm
      ? (
          Number(formData.weight_kg) /
          Math.pow(Number(formData.height_cm) / 100, 2)
        ).toFixed(1)
      : null

  const computedWaistHip =
    formData.waist_inch && formData.hip_inch && Number(formData.hip_inch) > 0
      ? (Number(formData.waist_inch) / Number(formData.hip_inch)).toFixed(2)
      : null

  function handleChange(field, value) {
    setActivePreset(null)
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  function handlePresetSelect(preset) {
    setActivePreset(preset.id)
    setFormData((prev) => ({
      ...prev,
      age: preset.data.age ?? '',
      weight_kg: preset.data.weight_kg ?? '',
      height_cm: preset.data.height_cm ?? '',
      waist_inch: preset.data.waist_inch ?? '',
      hip_inch: preset.data.hip_inch ?? '',
      pulse_bpm: preset.data.pulse_bpm ?? '',
      rbs_mg_dl: preset.data.rbs_mg_dl ?? '',
      bp_systolic: preset.data.bp_systolic ?? '',
      bp_diastolic: preset.data.bp_diastolic ?? '',
      cycle_regularity: preset.data.cycle_regularity ?? 'regular',
      cycle_length_days: preset.data.cycle_length_days ?? '',
      fsh_miu_ml: preset.data.fsh_miu_ml ?? '',
      lh_miu_ml: preset.data.lh_miu_ml ?? '',
      amh_ng_ml: preset.data.amh_ng_ml ?? '',
      prl_ng_ml: preset.data.prl_ng_ml ?? '',
      prg_ng_ml: preset.data.prg_ng_ml ?? '',
      tsh_miu_l: preset.data.tsh_miu_l ?? '',
      hair_growth: Boolean(preset.data.hair_growth),
      skin_darkening: Boolean(preset.data.skin_darkening),
      hair_loss: Boolean(preset.data.hair_loss),
      pimples_acne: Boolean(preset.data.pimples_acne),
      weight_gain: Boolean(preset.data.weight_gain),
      fast_food: Boolean(preset.data.fast_food),
      regular_exercise: Boolean(preset.data.regular_exercise),
      follicles_left: preset.data.follicles_left ?? '',
      follicles_right: preset.data.follicles_right ?? '',
    }))
    if (preset.data.amh_ng_ml || preset.data.lh_miu_ml) {
      setShowHormones(true)
    }
  }

  function handleReset() {
    setActivePreset(null)
    setFormData({
      age: '',
      weight_kg: '',
      height_cm: '',
      waist_inch: '',
      hip_inch: '',
      pulse_bpm: '',
      rbs_mg_dl: '',
      bp_systolic: '',
      bp_diastolic: '',
      cycle_regularity: 'regular',
      cycle_length_days: '',
      fsh_miu_ml: '',
      lh_miu_ml: '',
      amh_ng_ml: '',
      prl_ng_ml: '',
      prg_ng_ml: '',
      tsh_miu_l: '',
      hair_growth: false,
      skin_darkening: false,
      hair_loss: false,
      pimples_acne: false,
      weight_gain: false,
      fast_food: false,
      regular_exercise: true,
      follicles_left: '',
      follicles_right: '',
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!consentGiven) {
      alert('Please check the consent box acknowledging this is an educational research screening tool before submitting.')
      return
    }

    // Prepare numerical payload, filtering empty strings to null
    const payload = {
      age: formData.age !== '' ? Number(formData.age) : null,
      weight_kg: formData.weight_kg !== '' ? Number(formData.weight_kg) : null,
      height_cm: formData.height_cm !== '' ? Number(formData.height_cm) : null,
      waist_inch: formData.waist_inch !== '' ? Number(formData.waist_inch) : null,
      hip_inch: formData.hip_inch !== '' ? Number(formData.hip_inch) : null,
      pulse_bpm: formData.pulse_bpm !== '' ? Number(formData.pulse_bpm) : null,
      rbs_mg_dl: formData.rbs_mg_dl !== '' ? Number(formData.rbs_mg_dl) : null,
      bp_systolic: formData.bp_systolic !== '' ? Number(formData.bp_systolic) : null,
      bp_diastolic: formData.bp_diastolic !== '' ? Number(formData.bp_diastolic) : null,
      cycle_regularity: formData.cycle_regularity,
      cycle_length_days: formData.cycle_length_days !== '' ? Number(formData.cycle_length_days) : null,
      fsh_miu_ml: formData.fsh_miu_ml !== '' ? Number(formData.fsh_miu_ml) : null,
      lh_miu_ml: formData.lh_miu_ml !== '' ? Number(formData.lh_miu_ml) : null,
      amh_ng_ml: formData.amh_ng_ml !== '' ? Number(formData.amh_ng_ml) : null,
      prl_ng_ml: formData.prl_ng_ml !== '' ? Number(formData.prl_ng_ml) : null,
      prg_ng_ml: formData.prg_ng_ml !== '' ? Number(formData.prg_ng_ml) : null,
      tsh_miu_l: formData.tsh_miu_l !== '' ? Number(formData.tsh_miu_l) : null,
      hair_growth: formData.hair_growth,
      skin_darkening: formData.skin_darkening,
      hair_loss: formData.hair_loss,
      pimples_acne: formData.pimples_acne,
      weight_gain: formData.weight_gain,
      fast_food: formData.fast_food,
      regular_exercise: formData.regular_exercise,
      follicles_left: formData.follicles_left !== '' ? Number(formData.follicles_left) : null,
      follicles_right: formData.follicles_right !== '' ? Number(formData.follicles_right) : null,
    }

    onSubmit(payload)
  }

  return (
    <div className="screening-form-card">
      {/* Benchmark Presets Toolbar */}
      <div className="presets-bar">
        <div className="presets-title">
          <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
          <span>Quick Benchmark Scenarios (Judge Testing):</span>
        </div>
        <div className="preset-buttons-row">
          {SCREENING_PRESETS.map((preset) => {
            const isSelected = activePreset === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                className={`preset-btn ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handlePresetSelect(preset)}
                title={preset.description}
              >
                <span>{preset.tag}</span>
              </button>
            )
          })}
          <button
            type="button"
            className="preset-reset-btn"
            onClick={handleReset}
            title="Clear all fields"
          >
            <RotateCcw size={14} /> Clear
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="screening-inputs-form">
        {/* Section 1: Anthropometric & Physical Measurements */}
        <div className="form-section-block">
          <h3 className="section-block-title">
            <span>1. Physical & Body Measurements</span>
            {computedBmi && (
              <span className="live-metric-badge">
                BMI: <strong>{computedBmi} kg/m²</strong>
              </span>
            )}
            {computedWaistHip && (
              <span className="live-metric-badge">
                Waist:Hip: <strong>{computedWaistHip}</strong>
              </span>
            )}
          </h3>

          <div className="form-grid-3">
            <div className="input-field-group">
              <label htmlFor="input-age">Age (years) *</label>
              <input
                id="input-age"
                type="number"
                min="12"
                max="75"
                placeholder="e.g. 28"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                required
              />
              <span className="field-hint">Range: 12–75 yrs</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-height">Height (cm)</label>
              <input
                id="input-height"
                type="number"
                min="100"
                max="230"
                placeholder="e.g. 162"
                value={formData.height_cm}
                onChange={(e) => handleChange('height_cm', e.target.value)}
              />
              <span className="field-hint">Used to compute BMI</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-weight">Weight (kg)</label>
              <input
                id="input-weight"
                type="number"
                min="25"
                max="250"
                step="0.5"
                placeholder="e.g. 64"
                value={formData.weight_kg}
                onChange={(e) => handleChange('weight_kg', e.target.value)}
              />
              <span className="field-hint">Used to compute BMI</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-waist">Waist Circumference (inches)</label>
              <input
                id="input-waist"
                type="number"
                min="18"
                max="70"
                step="0.5"
                placeholder="e.g. 32"
                value={formData.waist_inch}
                onChange={(e) => handleChange('waist_inch', e.target.value)}
              />
              <span className="field-hint">Narrowest abdomen point</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-hip">Hip Circumference (inches)</label>
              <input
                id="input-hip"
                type="number"
                min="20"
                max="80"
                step="0.5"
                placeholder="e.g. 38"
                value={formData.hip_inch}
                onChange={(e) => handleChange('hip_inch', e.target.value)}
              />
              <span className="field-hint">Widest buttocks point</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-pulse">Resting Pulse (bpm)</label>
              <input
                id="input-pulse"
                type="number"
                min="40"
                max="160"
                placeholder="e.g. 74"
                value={formData.pulse_bpm}
                onChange={(e) => handleChange('pulse_bpm', e.target.value)}
              />
              <span className="field-hint">Normal: 60–100 bpm</span>
            </div>
          </div>
        </div>

        {/* Section 2: Menstrual Cycle History */}
        <div className="form-section-block">
          <h3 className="section-block-title">
            <span>2. Menstrual Cycle History</span>
          </h3>
          <div className="form-grid-2">
            <div className="input-field-group">
              <label>Cycle Regularity Pattern *</label>
              <div className="radio-pills-row">
                <button
                  type="button"
                  className={`radio-pill-btn ${formData.cycle_regularity === 'regular' ? 'active' : ''}`}
                  onClick={() => handleChange('cycle_regularity', 'regular')}
                >
                  Regular (Every 21–35 days)
                </button>
                <button
                  type="button"
                  className={`radio-pill-btn ${formData.cycle_regularity === 'irregular' ? 'active' : ''}`}
                  onClick={() => handleChange('cycle_regularity', 'irregular')}
                >
                  Irregular (&gt;35 days or variable)
                </button>
              </div>
              <span className="field-hint">Key Rotterdam diagnostic marker</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-cycle-length">Typical Cycle Length (days)</label>
              <input
                id="input-cycle-length"
                type="number"
                min="15"
                max="180"
                placeholder="e.g. 32 (or 50 if irregular)"
                value={formData.cycle_length_days}
                onChange={(e) => handleChange('cycle_length_days', e.target.value)}
              />
              <span className="field-hint">From first day to next first day</span>
            </div>
          </div>
        </div>

        {/* Section 3: Clinical Phenotype & Symptoms */}
        <div className="form-section-block">
          <h3 className="section-block-title">
            <span>3. Clinical & Dermatological Observations</span>
            <span className="text-xs font-normal text-stone-500">
              Select all that apply
            </span>
          </h3>

          <div className="toggle-cards-grid">
            <label className={`toggle-card ${formData.hair_growth ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={formData.hair_growth}
                onChange={(e) => handleChange('hair_growth', e.target.checked)}
              />
              <div className="toggle-info">
                <strong>Excess Hair Growth (Hirsutism)</strong>
                <p>Upper lip, chin, chest, or abdomen</p>
              </div>
            </label>

            <label className={`toggle-card ${formData.skin_darkening ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={formData.skin_darkening}
                onChange={(e) => handleChange('skin_darkening', e.target.checked)}
              />
              <div className="toggle-info">
                <strong>Skin Darkening (Acanthosis Nigricans)</strong>
                <p>Velvety dark patches on neck or skinfolds</p>
              </div>
            </label>

            <label className={`toggle-card ${formData.pimples_acne ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={formData.pimples_acne}
                onChange={(e) => handleChange('pimples_acne', e.target.checked)}
              />
              <div className="toggle-info">
                <strong>Persistent Acne / Pimples</strong>
                <p>Cystic jawline or recurrent adult breakouts</p>
              </div>
            </label>

            <label className={`toggle-card ${formData.hair_loss ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={formData.hair_loss}
                onChange={(e) => handleChange('hair_loss', e.target.checked)}
              />
              <div className="toggle-info">
                <strong>Scalp Hair Thinning</strong>
                <p>Widening part or male-pattern shedding</p>
              </div>
            </label>

            <label className={`toggle-card ${formData.weight_gain ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={formData.weight_gain}
                onChange={(e) => handleChange('weight_gain', e.target.checked)}
              />
              <div className="toggle-info">
                <strong>Difficulty Managing Weight</strong>
                <p>Unexplained rapid weight gain</p>
              </div>
            </label>

            <label className={`toggle-card ${formData.fast_food ? 'is-active' : ''}`}>
              <input
                type="checkbox"
                checked={formData.fast_food}
                onChange={(e) => handleChange('fast_food', e.target.checked)}
              />
              <div className="toggle-info">
                <strong>Frequent Fast Food Diet</strong>
                <p>High refined sugar or ultra-processed meals</p>
              </div>
            </label>
          </div>
        </div>

        {/* Section 4: Ultrasound Follicle Counts */}
        <div className="form-section-block">
          <h3 className="section-block-title">
            <span>4. Ultrasound Follicle Counts (Optional)</span>
            {prefilledFollicles && (
              <span className="live-metric-badge success">
                Auto-estimated from Ultrasound Scan
              </span>
            )}
          </h3>
          <p className="section-block-subtitle">
            If you have pelvic ultrasound sonography results or uploaded a scan in Mode B, enter follicle counts.
            Otherwise leave blank; the model will use reference population medians.
          </p>

          <div className="form-grid-2">
            <div className="input-field-group">
              <label htmlFor="input-follicle-l">Left Ovary Follicle Count</label>
              <input
                id="input-follicle-l"
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 6 (or >=12 for polycystic)"
                value={formData.follicles_left}
                onChange={(e) => handleChange('follicles_left', e.target.value)}
              />
              <span className="field-hint">&gt;= 12–20 indicates PCO morphology</span>
            </div>

            <div className="input-field-group">
              <label htmlFor="input-follicle-r">Right Ovary Follicle Count</label>
              <input
                id="input-follicle-r"
                type="number"
                min="0"
                max="50"
                placeholder="e.g. 7 (or >=12 for polycystic)"
                value={formData.follicles_right}
                onChange={(e) => handleChange('follicles_right', e.target.value)}
              />
              <span className="field-hint">&gt;= 12–20 indicates PCO morphology</span>
            </div>
          </div>
        </div>

        {/* Section 5: Hormonal Bloodwork (Collapsible Optional Panel) */}
        <div className="form-section-block">
          <button
            type="button"
            className="collapsible-header-btn"
            onClick={() => setShowHormones(!showHormones)}
          >
            <div className="flex items-center gap-2">
              <TestTube size={18} className="text-teal-600 dark:text-teal-400" />
              <span>5. Laboratory Bloodwork & Hormones (Optional)</span>
            </div>
            {showHormones ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showHormones && (
            <div className="collapsible-content-area">
              <div className="hormone-info-notice">
                <Info size={16} />
                <span>
                  Laboratory tests are completely optional. The model does not invent missing lab numbers;
                  unfilled tests default to dataset baseline medians.
                </span>
              </div>

              <div className="form-grid-3">
                <div className="input-field-group">
                  <label htmlFor="input-amh">AMH (ng/mL)</label>
                  <input
                    id="input-amh"
                    type="number"
                    min="0"
                    max="40"
                    step="0.1"
                    placeholder="e.g. 3.2"
                    value={formData.amh_ng_ml}
                    onChange={(e) => handleChange('amh_ng_ml', e.target.value)}
                  />
                  <span className="field-hint">Anti-Müllerian Hormone</span>
                </div>

                <div className="input-field-group">
                  <label htmlFor="input-lh">LH (mIU/mL)</label>
                  <input
                    id="input-lh"
                    type="number"
                    min="0"
                    max="150"
                    step="0.1"
                    placeholder="e.g. 6.5"
                    value={formData.lh_miu_ml}
                    onChange={(e) => handleChange('lh_miu_ml', e.target.value)}
                  />
                  <span className="field-hint">Luteinizing Hormone</span>
                </div>

                <div className="input-field-group">
                  <label htmlFor="input-fsh">FSH (mIU/mL)</label>
                  <input
                    id="input-fsh"
                    type="number"
                    min="0"
                    max="150"
                    step="0.1"
                    placeholder="e.g. 5.1"
                    value={formData.fsh_miu_ml}
                    onChange={(e) => handleChange('fsh_miu_ml', e.target.value)}
                  />
                  <span className="field-hint">Follicle-Stimulating Hormone</span>
                </div>

                <div className="input-field-group">
                  <label htmlFor="input-rbs">Random Blood Sugar (mg/dL)</label>
                  <input
                    id="input-rbs"
                    type="number"
                    min="40"
                    max="400"
                    placeholder="e.g. 95"
                    value={formData.rbs_mg_dl}
                    onChange={(e) => handleChange('rbs_mg_dl', e.target.value)}
                  />
                  <span className="field-hint">Normal: &lt; 140 mg/dL</span>
                </div>

                <div className="input-field-group">
                  <label htmlFor="input-tsh">TSH (mIU/L)</label>
                  <input
                    id="input-tsh"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    placeholder="e.g. 2.2"
                    value={formData.tsh_miu_l}
                    onChange={(e) => handleChange('tsh_miu_l', e.target.value)}
                  />
                  <span className="field-hint">Thyroid Hormone check</span>
                </div>

                <div className="input-field-group">
                  <label htmlFor="input-prl">Prolactin (ng/mL)</label>
                  <input
                    id="input-prl"
                    type="number"
                    min="0"
                    max="200"
                    step="0.1"
                    placeholder="e.g. 15.0"
                    value={formData.prl_ng_ml}
                    onChange={(e) => handleChange('prl_ng_ml', e.target.value)}
                  />
                  <span className="field-hint">Normal: &lt; 25 ng/mL</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Consent and Verification Checkbox */}
        <div className="screening-consent-panel">
          <label className="consent-checkbox-label">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              required
            />
            <div className="consent-copy">
              <strong>Informed Consent & Medical Understanding:</strong>
              <p>
                I understand this analysis uses LunaHer’s research-only pattern screening model
                for research risk stratification. It is not an automated medical diagnosis, does not replace
                evaluation by a gynecologist, and will not log my health data to an external server.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="form-submit-row">
          <button
            type="submit"
            className="screening-primary-submit-btn"
            disabled={isSubmitting || !consentGiven}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner-sm" />
                <span>Running XGBoost Inference...</span>
              </>
            ) : (
              <>
                <Stethoscope size={18} />
                <span>Run Research Model Screening</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
