import React, { useState } from 'react'
import {
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  SkipForward,
  Info,
  Clock,
  Activity,
  Heart,
  MessageSquareHeart,
} from 'lucide-react'

export function FollowUpQuestions({
  questions = [],
  initialAnswers = {},
  onSubmitAnswers,
  onSkip,
  isAnalyzing = false,
}) {
  const [answers, setAnswers] = useState(initialAnswers || {})
  const [customNotes, setCustomNotes] = useState({})

  // Handle single-select question option
  function handleSelectOption(questionId, optionId) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }))
  }

  // Handle multi-select question option
  function handleToggleMultiOption(questionId, optionId) {
    setAnswers((prev) => {
      const currentList = Array.isArray(prev[questionId]) ? prev[questionId] : []
      if (optionId.includes('none') || optionId.includes('steady')) {
        // Exclusive option
        return { ...prev, [questionId]: [optionId] }
      }
      const filtered = currentList.filter((id) => !id.includes('none') && !id.includes('steady'))
      const exists = filtered.includes(optionId)
      const nextList = exists ? filtered.filter((id) => id !== optionId) : [...filtered, optionId]
      return {
        ...prev,
        [questionId]: nextList.length > 0 ? nextList : [],
      }
    })
  }

  // Count answered questions
  const answeredCount = questions.filter((q) => {
    const val = answers[q.id]
    return val && (Array.isArray(val) ? val.length > 0 : true)
  }).length

  function handleSubmit(e) {
    if (e) e.preventDefault()
    onSubmitAnswers(answers, customNotes)
  }

  return (
    <div
      className="follow-up-module mt-6 bg-gradient-to-br from-rose-50/70 via-white to-pink-50/60 rounded-3xl border border-rose-200/90 p-6 md:p-8 shadow-sm backdrop-blur-xl animate-fade-in"
      id="followup-questions-container"
      role="region"
      aria-label="Follow-up symptom clarification questions"
    >
      {/* HEADER BANNER */}
      <div className="follow-up-header flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-rose-100">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
            <MessageSquareHeart size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-full">
                AI Follow-Up Clarifier
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {answeredCount} of {questions.length} answered
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-stone-900 mt-1">
              Let's get a clearer picture of your symptoms
            </h3>
            <p className="text-xs md:text-sm text-stone-600 mt-0.5 max-w-2xl leading-relaxed">
              Answering a few quick questions helps LunaHer provide tailored guidance, connect to relevant Rotterdam pillars, and write precise questions for your doctor.
            </p>
          </div>
        </div>

        {/* PROGRESS PILL */}
        <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-rose-200/80 shadow-2xs text-xs font-semibold text-rose-800">
          <Sparkles size={14} className="text-rose-600" />
          <span>Non-Diagnostic Assistant</span>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <form onSubmit={handleSubmit} className="follow-up-form space-y-6 mt-6">
        {questions.map((q, qIndex) => {
          const isMulti = q.allowMultiple
          const currentAnswer = answers[q.id]
          const isAnswered = isMulti
            ? Array.isArray(currentAnswer) && currentAnswer.length > 0
            : Boolean(currentAnswer)

          return (
            <div
              key={q.id}
              className={`question-card rounded-2xl p-5 md:p-6 transition-all border ${
                isAnswered
                  ? 'bg-white border-rose-200/90 shadow-sm ring-1 ring-rose-100'
                  : 'bg-white/80 border-stone-200/80 hover:border-rose-200'
              }`}
              id={`question-card-${q.id}`}
            >
              {/* QUESTION TITLE & HINT */}
              <div className="question-header mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      {q.title}
                    </span>
                  </div>
                  {isAnswered && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <CheckCircle2 size={12} />
                      <span>Answered</span>
                    </span>
                  )}
                </div>
                <h4 className="text-base font-semibold text-stone-900 mt-2">
                  {q.question}
                </h4>
                {q.hint && (
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                    <Info size={13} className="text-rose-500 shrink-0" />
                    <span>{q.hint}</span>
                  </p>
                )}
                {isMulti && (
                  <span className="text-[11px] font-medium text-rose-600 block mt-1">
                    (Select all that apply)
                  </span>
                )}
              </div>

              {/* OPTIONS GRID */}
              <div className="options-grid grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {q.options.map((opt) => {
                  const isSelected = isMulti
                    ? Array.isArray(currentAnswer) && currentAnswer.includes(opt.id)
                    : currentAnswer === opt.id

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`opt-${q.id}-${opt.id}`}
                      className={`option-btn p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected
                          ? 'bg-rose-50/90 border-rose-400 text-rose-950 ring-2 ring-rose-200 shadow-xs'
                          : 'bg-stone-50/70 hover:bg-stone-100/80 border-stone-200 text-stone-800 hover:border-stone-300'
                      }`}
                      onClick={() =>
                        isMulti
                          ? handleToggleMultiOption(q.id, opt.id)
                          : handleSelectOption(q.id, opt.id)
                      }
                      aria-pressed={isSelected}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-rose-600 border-rose-600 text-white'
                            : 'border-stone-400 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="flex-1">
                        <strong className="text-xs font-semibold block leading-snug">
                          {opt.label}
                        </strong>
                        {opt.detail && (
                          <span className="text-[11px] text-stone-500 block mt-0.5 leading-relaxed font-normal">
                            {opt.detail}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* OPTIONAL CUSTOM NOTE PER QUESTION */}
              <div className="mt-3.5 pt-3 border-t border-stone-100/80">
                <input
                  type="text"
                  id={`note-${q.id}`}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 placeholder:text-stone-400 text-stone-800 focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-200/50 outline-none transition-all"
                  placeholder="Any other details in your own words? (optional)"
                  value={customNotes[q.id] || ''}
                  onChange={(e) =>
                    setCustomNotes((prev) => ({ ...prev, [q.id]: e.target.value }))
                  }
                />
              </div>
            </div>
          )
        })}

        {/* BOTTOM ACTIONS BAR */}
        <div className="follow-up-actions flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-rose-100">
          <button
            type="button"
            id="btn-skip-followup"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer"
            onClick={onSkip}
          >
            <SkipForward size={14} />
            <span>Skip to Basic Suggestions</span>
          </button>

          <button
            type="submit"
            id="btn-submit-followup"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs md:text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
              answeredCount > 0
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 hover:shadow-lg hover:scale-[1.01] shadow-rose-200 ring-2 ring-rose-200'
                : 'bg-rose-500 hover:bg-rose-600 opacity-90'
            }`}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>Synthesizing suggestions…</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>
                  {answeredCount > 0
                    ? `Get Tailored Suggestions (${answeredCount} answered)`
                    : 'Get Tailored Suggestions'}
                </span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
