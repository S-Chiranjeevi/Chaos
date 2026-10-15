import React, { useState } from 'react'
import {
  Sparkles,
  Stethoscope,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Heart,
  Activity,
  ArrowRight,
  HelpCircle,
  Clock,
  Apple,
  Moon,
  Flame,
} from 'lucide-react'

export function TailoredSuggestions({
  suggestions,
  followUpAnswers = {},
  onEditFollowUp,
}) {
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState(null)
  const [allCopied, setAllCopied] = useState(false)

  if (!suggestions) return null

  const {
    summaryNarrative,
    pillarInsights = [],
    questionsForDoctor = [],
    tailoredTips = [],
    recommendedSpecialist,
    urgency,
    disclaimer,
    answeredQuestionsCount = 0,
  } = suggestions

  function copyQuestion(text, index) {
    navigator.clipboard?.writeText(text)
    setCopiedQuestionIndex(index)
    setTimeout(() => setCopiedQuestionIndex(null), 2000)
  }

  function copyAllQuestions() {
    const text = questionsForDoctor.join('\n\n')
    navigator.clipboard?.writeText(`Questions for my Doctor (from LunaHer):\n\n${text}`)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2500)
  }

  return (
    <div
      className="tailored-suggestions-card bg-white rounded-3xl border border-rose-200/90 p-6 md:p-8 shadow-sm backdrop-blur-xl mb-6 relative overflow-hidden"
      id="tailored-suggestions-view"
    >
      {/* HEADER WITH AI SYNTHESIS BADGE */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-rose-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-200">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-md">
                AI Synthesized Care Guidance
              </span>
              {answeredQuestionsCount > 0 && (
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  {answeredQuestionsCount} Follow-up Details Applied
                </span>
              )}
            </div>
            <h3 className="text-base md:text-lg font-bold text-stone-900 mt-0.5">
              Personalized Guidance & Next Steps
            </h3>
          </div>
        </div>

        {onEditFollowUp && (
          <button
            type="button"
            id="btn-edit-followup"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-300 text-xs font-semibold text-stone-700 hover:text-rose-800 transition-colors cursor-pointer"
            onClick={onEditFollowUp}
          >
            <RotateCcw size={13} />
            <span>Update Follow-up Answers</span>
          </button>
        )}
      </div>

      {/* SYNTHESIZED NARRATIVE BOX */}
      {summaryNarrative && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-xs md:text-sm text-stone-800 leading-relaxed">
          <strong className="block text-rose-900 font-bold mb-1 flex items-center gap-1.5">
            <Heart size={14} className="text-rose-600 shrink-0" />
            <span>Your Clarified Pattern Summary:</span>
          </strong>
          <p className="text-stone-700 italic">“{summaryNarrative}”</p>
        </div>
      )}

      {/* ROTTERDAM & CLINICAL PILLARS (IF APPLICABLE) */}
      {pillarInsights.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={16} className="text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Clinical Context & Rotterdam Pillars
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pillarInsights.map((pi, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200 hover:border-rose-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md inline-block mb-1.5">
                    {pi.badge}
                  </span>
                  <h5 className="text-xs font-bold text-stone-900 leading-snug">
                    {pi.pillar}
                  </h5>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-normal">
                    {pi.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAILORED QUESTIONS FOR DOCTOR */}
      {questionsForDoctor.length > 0 && (
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Stethoscope size={16} className="text-rose-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Tailored Questions for Your Doctor
              </h4>
            </div>
            <button
              type="button"
              id="btn-copy-all-doctor-questions"
              className="inline-flex items-center gap-1.5 text-xs text-rose-700 font-semibold hover:text-rose-900 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-lg border border-rose-200/80 transition-colors cursor-pointer"
              onClick={copyAllQuestions}
            >
              {allCopied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{allCopied ? 'All Copied!' : 'Copy All Questions'}</span>
            </button>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            These questions incorporate the duration, frequency, and specific signs you answered above:
          </p>
          <div className="space-y-2">
            {questionsForDoctor.map((q, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50/70 hover:bg-rose-50/50 border border-stone-200/80 flex items-start justify-between gap-3 transition-colors group"
              >
                <div className="flex items-start gap-2.5 flex-1">
                  <span className="text-xs font-bold text-rose-700 shrink-0 mt-0.5">
                    Q{idx + 1}:
                  </span>
                  <p className="text-xs text-stone-800 leading-relaxed font-medium">
                    {q}
                  </p>
                </div>
                <button
                  type="button"
                  id={`btn-copy-question-${idx}`}
                  className="text-stone-400 hover:text-rose-700 transition-colors p-1 rounded cursor-pointer shrink-0"
                  onClick={() => copyQuestion(q, idx)}
                  title="Copy question"
                  aria-label={`Copy question ${idx + 1}`}
                >
                  {copiedQuestionIndex === idx ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAILORED SELF-CARE & NUTRITION */}
      {tailoredTips.length > 0 && (
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={16} className="text-rose-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Evidence-Backed Self-Care & Routine Tips
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tailoredTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Apple size={14} />
                </div>
                <div>
                  <strong className="text-xs font-bold text-stone-900 block">
                    {tip.category}
                  </strong>
                  <p className="text-xs text-stone-600 mt-0.5 leading-relaxed font-normal">
                    {tip.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDED SPECIALIST BANNER */}
      {recommendedSpecialist && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-rose-300">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                Recommended Care Pathway
              </span>
              <p className="text-xs md:text-sm font-semibold text-white mt-0.5">
                {recommendedSpecialist}
              </p>
            </div>
          </div>
          <div className="text-[11px] text-stone-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            Non-emergency routine care
          </div>
        </div>
      )}
    </div>
  )
}
