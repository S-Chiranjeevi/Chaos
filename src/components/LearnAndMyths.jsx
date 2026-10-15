import React, { useState } from 'react'
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  Heart,
  Moon,
  Activity,
  Apple,
  Wind,
  ShieldCheck,
  Stethoscope,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import pcosFactsData from '../../content/pcos_facts.json'
import mythsData from '../../content/myths.json'
import selfCareData from '../../content/self_care.json'
import { t } from '../data/translations.js'

export function LearnAndMyths({ currentLanguage = 'en' }) {
  const [activeTab, setActiveTab] = useState('facts') // 'facts' | 'myths' | 'selfcare' | 'doctorprep'
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaqId, setExpandedFaqId] = useState(null)

  const filteredMyths = mythsData.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.myth.toLowerCase().includes(q) ||
      item.fact.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q)
    )
  })

  const filteredFacts = pcosFactsData.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.topic.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.keyPoints.some((p) => p.toLowerCase().includes(q))
    )
  })

  const filteredSelfCare = selfCareData.filter((item) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      item.pillar.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.actionableTips.some((tip) => tip.toLowerCase().includes(q))
    )
  })

  function toggleFaq(id) {
    setExpandedFaqId(expandedFaqId === id ? null : id)
  }

  const getPillarIcon = (pillar = '') => {
    if (/sleep/i.test(pillar)) return <Moon size={18} className="pillar-icon sleep" />
    if (/movement/i.test(pillar)) return <Activity size={18} className="pillar-icon movement" />
    if (/nutrition/i.test(pillar)) return <Apple size={18} className="pillar-icon nutrition" />
    if (/stress/i.test(pillar)) return <Wind size={18} className="pillar-icon stress" />
    return <Heart size={18} className="pillar-icon default" />
  }

  return (
    <div className="learn-and-myths-module">
      {/* HEADER & SEARCH BAR */}
      <div className="learn-header-row">
        <div>
          <span className="subhead-pill">Evidence-Based Education</span>
          <h2>PCOS Knowledge & Myths Demystified</h2>
          <p className="learn-subtitle">
            Curated, cited medical facts, myth-busting explanations, and supportive daily self-care.
          </p>
        </div>

        {/* SEARCH BOX */}
        <div className="learn-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search symptoms, myths, sleep, nutrition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="learn-search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="btn-clear-search"
              onClick={() => setSearchQuery('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* MANDATORY DISCLAIMER BANNER */}
      <div className="learn-disclaimer-strip">
        <Heart size={18} className="heart-icon" />
        <div>
          <strong>{t('disclaimer.standard', currentLanguage)}</strong>
          <span> {t('disclaimer.pcosGuidance', currentLanguage)}</span>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="learn-tab-bar">
        <button
          type="button"
          className={`learn-tab-btn ${activeTab === 'facts' ? 'active' : ''}`}
          onClick={() => setActiveTab('facts')}
        >
          <BookOpen size={16} />
          <span>PCOS Facts & Causes</span>
        </button>

        <button
          type="button"
          className={`learn-tab-btn ${activeTab === 'myths' ? 'active' : ''}`}
          onClick={() => setActiveTab('myths')}
        >
          <HelpCircle size={16} />
          <span>Myth vs. Fact ({mythsData.length})</span>
        </button>

        <button
          type="button"
          className={`learn-tab-btn ${activeTab === 'selfcare' ? 'active' : ''}`}
          onClick={() => setActiveTab('selfcare')}
        >
          <Sparkles size={16} />
          <span>Supportive Self-Care</span>
        </button>

        <button
          type="button"
          className={`learn-tab-btn ${activeTab === 'doctorprep' ? 'active' : ''}`}
          onClick={() => setActiveTab('doctorprep')}
        >
          <Stethoscope size={16} />
          <span>Doctor Consultation Prep</span>
        </button>
      </div>

      {/* TAB 1: PCOS FACTS & CAUSES */}
      {activeTab === 'facts' && (
        <div className="learn-tab-content">
          <div className="facts-grid">
            {filteredFacts.map((fact) => (
              <article key={fact.id} className="fact-article-card">
                <div className="card-top-tag">
                  <span className="topic-badge">{fact.topic}</span>
                </div>
                <h3 className="fact-title">{fact.title}</h3>
                <p className="fact-summary">{fact.summary}</p>

                <div className="fact-keypoints-box">
                  <span className="keypoints-title">Key Clinical Takeaways:</span>
                  <ul className="keypoints-list">
                    {fact.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                <div className="fact-source-footer">
                  <span className="source-label">Source:</span>
                  <span className="source-text">{fact.source}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MYTH VS FACT */}
      {activeTab === 'myths' && (
        <div className="learn-tab-content">
          <div className="myths-list-container">
            {filteredMyths.map((item) => {
              const isExpanded = expandedFaqId === item.id
              return (
                <div key={item.id} className={`myth-card ${isExpanded ? 'expanded' : ''}`}>
                  <div
                    className="myth-header-row"
                    onClick={() => toggleFaq(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && toggleFaq(item.id)}
                  >
                    <div className="myth-title-cluster">
                      <span className="myth-bubble-tag">Myth</span>
                      <h3 className="myth-statement">“{item.myth}”</h3>
                    </div>
                    <div className="chevron-toggle">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* FACT REVEAL */}
                  <div className="fact-reveal-section">
                    <div className="fact-header-row">
                      <span className="fact-bubble-tag">Fact</span>
                      <p className="fact-text">{item.fact}</p>
                    </div>

                    <p className="fact-explanation">{item.explanation}</p>

                    <div className="fact-source-footer">
                      <span className="source-label">Verified Source:</span>
                      <span className="source-text">{item.source}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SELF-CARE (SLEEP, MOVEMENT, NUTRITION, STRESS) */}
      {activeTab === 'selfcare' && (
        <div className="learn-tab-content">
          <div className="selfcare-grid">
            {filteredSelfCare.map((item) => (
              <div key={item.id} className="selfcare-card">
                <div className="selfcare-pillar-row">
                  {getPillarIcon(item.pillar)}
                  <h4>{item.pillar}</h4>
                </div>

                <h3 className="selfcare-title">{item.title}</h3>
                <p className="selfcare-summary">{item.summary}</p>

                <div className="tips-box">
                  <span className="tips-label">Actionable Daily Practices:</span>
                  <ul className="tips-list">
                    {item.actionableTips.map((tip, i) => (
                      <li key={i}>
                        <span className="tip-bullet">✦</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="fact-source-footer">
                  <span className="source-label">Clinical Reference:</span>
                  <span className="source-text">{item.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCTOR CONSULTATION PREP */}
      {activeTab === 'doctorprep' && (
        <div className="learn-tab-content">
          <div className="doctorprep-wrapper">
            <div className="prep-intro-card">
              <Stethoscope size={24} className="prep-icon" />
              <div>
                <h3>How to Navigate Your Consultation with Confidence</h3>
                <p>
                  Going into an appointment with organized notes, cycle dates, and explicit questions helps clinicians evaluate your hormonal balance without feeling rushed.
                </p>
              </div>
            </div>

            <div className="prep-steps-grid">
              <div className="prep-step-card">
                <span className="step-badge">Step 1</span>
                <h4>Bring Cycle Data</h4>
                <p>Have your period start dates from the last 3–6 months ready. Note how many days cycles lasted and if there were any missed periods.</p>
              </div>

              <div className="prep-step-card">
                <span className="step-badge">Step 2</span>
                <h4>Track Symptoms & Duration</h4>
                <p>Share when you first noticed acne, excess facial hair, hair loss, or pelvic cramping. Mention whether severity has increased.</p>
              </div>

              <div className="prep-step-card">
                <span className="step-badge">Step 3</span>
                <h4>Ask About Testing</h4>
                <p>Ask which blood tests (TSH, Free Testosterone, DHEA-S, Prolactin, Fasting Glucose) or pelvic ultrasound fit your symptoms.</p>
              </div>

              <div className="prep-step-card">
                <span className="step-badge">Step 4</span>
                <h4>Discuss Long-Term Goals</h4>
                <p>Clarify your personal priorities (cycle regularity, skin clearance, energy support, or fertility) so your care plan matches your needs.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearnAndMyths
