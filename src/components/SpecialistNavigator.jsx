import React from 'react'
import { Stethoscope, Dna, Sparkles, Apple } from 'lucide-react'

export function SpecialistNavigator() {
  return (
    <div className="specialists-grid">
      <div className="specialist-item">
        <div className="specialist-header">
          <Stethoscope size={22} className="spec-icon" />
          <span className="specialist-badge">Recommended First Contact</span>
        </div>
        <h4>Gynecologist (OB-GYN)</h4>
        <p>
          Specializes in menstrual cycle regulation, pelvic ultrasound imaging, ovulation tracking, and reproductive health.
        </p>
        <div className="specialist-when">
          <b>When to visit:</b> Cycles &gt;35 days apart, painful cramps, missed periods, or fertility planning.
        </div>
      </div>

      <div className="specialist-item">
        <div className="specialist-header">
          <Dna size={22} className="spec-icon" />
          <span className="specialist-badge">Hormone & Metabolic Depth</span>
        </div>
        <h4>Endocrinologist</h4>
        <p>
          Specializes in the endocrine hormone network, insulin resistance, thyroid disorders, and adrenal androgen regulation.
        </p>
        <div className="specialist-when">
          <b>When to visit:</b> Velvety dark neck patches (acanthosis), pre-diabetes, or family history of type 2 diabetes.
        </div>
      </div>

      <div className="specialist-item">
        <div className="specialist-header">
          <Sparkles size={22} className="spec-icon" />
          <span className="specialist-badge">Skin & Hair Focus</span>
        </div>
        <h4>Dermatologist</h4>
        <p>
          Provides targeted medical therapies for severe cystic acne, facial hirsutism, and female pattern hair thinning.
        </p>
        <div className="specialist-when">
          <b>When to visit:</b> Deep scarring acne or sudden facial hair growth causing physical or emotional distress.
        </div>
      </div>

      <div className="specialist-item">
        <div className="specialist-header">
          <Apple size={22} className="spec-icon" />
          <span className="specialist-badge">Lifestyle Nutrition</span>
        </div>
        <h4>Clinical Dietitian</h4>
        <p>
          Tailors balanced, anti-inflammatory, low-glycemic nutritional strategies to support insulin sensitivity without crash dieting.
        </p>
        <div className="specialist-when">
          <b>When to visit:</b> To build sustainable meal patterns that stabilize energy, cravings, and blood glucose.
        </div>
      </div>
    </div>
  )
}
