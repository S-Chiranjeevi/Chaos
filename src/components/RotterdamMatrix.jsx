import React from 'react'
import { Stethoscope, Activity, Eye, ShieldAlert } from 'lucide-react'

export function RotterdamMatrix() {
  return (
    <div className="rotterdam-container">
      <div className="rotterdam-cards-grid">
        <div className="rotterdam-card">
          <div className="card-top-indicator">
            <span className="pillar-num">01</span>
            <Activity size={20} className="pillar-icon" />
          </div>
          <h4>Ovulatory Dysfunction</h4>
          <p>
            Irregular, delayed (&gt;35 days), or absent menstrual cycles signifying unpredictable or paused ovulation (oligo/anovulation).
          </p>
          <div className="pillar-eval">
            <b>Clinical Evaluation:</b> Menstrual cycle tracking and luteal phase progesterone timing.
          </div>
        </div>

        <div className="rotterdam-card">
          <div className="card-top-indicator">
            <span className="pillar-num">02</span>
            <Stethoscope size={20} className="pillar-icon" />
          </div>
          <h4>Hyperandrogenism</h4>
          <p>
            Clinical signs (coarse chin/facial hair, cystic acne, scalp thinning) OR elevated serum free/total testosterone and DHEA-S.
          </p>
          <div className="pillar-eval">
            <b>Clinical Evaluation:</b> Ferriman-Gallwey score and early morning venous hormone blood panels.
          </div>
        </div>

        <div className="rotterdam-card">
          <div className="card-top-indicator">
            <span className="pillar-num">03</span>
            <Eye size={20} className="pillar-icon" />
          </div>
          <h4>Polycystic Ovarian Morphology</h4>
          <p>
            Enlarged ovaries with multiple small arrested antral follicles (≥20 follicles per ovary or ovarian volume &gt;10 mL).
          </p>
          <div className="pillar-eval">
            <b>Clinical Evaluation:</b> In-person pelvic ultrasound scan by a trained sonologist or radiologist.
          </div>
        </div>
      </div>

      <div className="rotterdam-callout">
        <ShieldAlert size={22} className="callout-icon" />
        <div>
          <strong>Why No Software or AI Can Diagnose PCOS:</strong>
          <p>
            Under international Rotterdam Consensus guidelines, a diagnosis requires meeting at least 2 of these 3 pillars <strong>and</strong> ruling out mimicking conditions such as hypothyroidism (TSH), hyperprolactinemia, and congenital adrenal hyperplasia (17-OHP). Because apps cannot draw blood or perform pelvic ultrasounds, Luna Her prepares you for your clinician appointment with organized notes.
          </p>
        </div>
      </div>
    </div>
  )
}
