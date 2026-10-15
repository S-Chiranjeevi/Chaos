import React, { useState } from 'react'
import { AlertCircle, HelpCircle, CheckSquare, ShieldCheck, Heart, Sparkles, Copy, Check, Stethoscope } from 'lucide-react'

export function AssessmentView({ assessment, symptoms = [] }) {
  const [copiedQuestion, setCopiedQuestion] = useState(false)
  const [checkedQuestions, setCheckedQuestions] = useState({})

  if (!assessment) return null

  const isUrgent = assessment.isUrgent || assessment.urgency === 'urgent'

  function copyAllQuestions() {
    const text = assessment.questionsForDoctor.join('\n- ')
    navigator.clipboard?.writeText(`Questions for my Doctor:\n- ${text}`)
    setCopiedQuestion(true)
    setTimeout(() => setCopiedQuestion(false), 2500)
  }

  function toggleQuestion(idx) {
    setCheckedQuestions((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  return (
    <div className="assessment-container">
      {/* REQUIRED MANDATORY DISCLAIMER BANNER */}
      <div className="pcos-guidance-banner" role="status">
        <div className="banner-icon-col">
          <Heart size={24} className="banner-heart-icon" />
        </div>
        <div className="banner-content">
          <h4 className="banner-title">Important Health Guidance</h4>
          <p className="banner-statement">
            “These symptoms can sometimes occur with PCOS, but they can also have other causes.”
          </p>
          <p className="banner-subtext">
            This is information, not a diagnosis. SakhiCare helps you organize your experiences and prepare for a safe, supportive conversation with a qualified healthcare professional.
          </p>
        </div>
      </div>

      {/* URGENT RED FLAGS ALERT */}
      {isUrgent && (
        <div className="urgent-care-alert" role="alert">
          <div className="alert-header">
            <AlertCircle size={22} className="alert-icon" />
            <h4>Symptoms Requiring Immediate Medical Attention</h4>
          </div>
          <p>
            You described intense symptoms such as severe pain, heavy bleeding, or fainting. Please do not wait for a routine appointment.
          </p>
          <div className="urgent-actions">
            <strong>Recommended Action:</strong>
            <span>Please seek urgent medical care now or contact local emergency services.</span>
          </div>
        </div>
      )}

      {/* DIFFERENTIAL EDUCATIONAL OVERVIEW */}
      <div className="assessment-grid">
        <div className="assessment-card">
          <div className="card-heading-row">
            <div className="icon-badge pcos">
              <Sparkles size={18} />
            </div>
            <div>
              <h4>Why PCOS May Be Considered</h4>
              <small>Clinical context</small>
            </div>
          </div>
          <p className="card-description">
            PCOS is a common hormonal condition that can influence ovulation, androgen levels, and metabolic regulation. A qualified clinician can assess your symptoms alongside other possibilities using tools such as an ultrasound or hormone blood work when appropriate.
          </p>
          <div className="conditions-list">
            <span className="condition-pill">Irregular ovulation</span>
            <span className="condition-pill">Elevated androgens</span>
            <span className="condition-pill">Follicular morphology</span>
          </div>
        </div>

        <div className="assessment-card">
          <div className="card-heading-row">
            <div className="icon-badge alternatives">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4>Other Possible Causes</h4>
              <small>Alternative evaluations</small>
            </div>
          </div>
          <p className="card-description">
            Your body’s endocrine system is sensitive. Similar symptoms often stem from other distinct factors that a doctor will test for:
          </p>
          <ul className="alternatives-list">
            <li><strong>Thyroid imbalances</strong> (Hypothyroidism or Hyperthyroidism)</li>
            <li><strong>Elevated Prolactin</strong> or hypothalamic amenorrhea</li>
            <li><strong>High cortisol & chronic stress</strong> impacting the HPO axis</li>
            <li><strong>Endometriosis or fibroids</strong> (especially with severe pelvic pain)</li>
            <li><strong>Sudden nutritional or weight changes</strong> affecting cycle rhythm</li>
          </ul>
        </div>
      </div>

      {/* QUESTIONS FOR YOUR DOCTOR */}
      <div className="doctor-prep-section">
        <div className="prep-header">
          <div className="prep-title-group">
            <Stethoscope size={22} className="prep-icon" />
            <div>
              <h3>Questions to Ask Your Doctor</h3>
              <p>Check the questions you want to bring to your consultation or copy them to your notes.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-copy-questions"
            onClick={copyAllQuestions}
            aria-label="Copy questions to clipboard"
          >
            {copiedQuestion ? <Check size={16} /> : <Copy size={16} />}
            <span>{copiedQuestion ? 'Copied to Clipboard!' : 'Copy All Questions'}</span>
          </button>
        </div>

        <div className="questions-checklist">
          {assessment.questionsForDoctor?.map((question, idx) => (
            <label
              key={idx}
              className={`question-item ${checkedQuestions[idx] ? 'checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={Boolean(checkedQuestions[idx])}
                onChange={() => toggleQuestion(idx)}
              />
              <span className="question-text">{question}</span>
            </label>
          ))}
        </div>
      </div>

      {/* LIFESTYLE & GENTLE SELF-CARE */}
      <div className="lifestyle-section">
        <div className="lifestyle-header">
          <HelpCircle size={20} className="lifestyle-icon" />
          <h4>Gentle Self-Care & Tracking While You Wait</h4>
        </div>
        <div className="lifestyle-chips">
          {assessment.lifestyleTips?.map((tip, i) => (
            <div key={i} className="lifestyle-chip">
              <span className="chip-bullet">✦</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
