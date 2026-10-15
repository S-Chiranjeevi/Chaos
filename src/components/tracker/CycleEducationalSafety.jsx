import React from 'react';
import { BookOpen, ShieldAlert, HeartHandshake, ExternalLink, Stethoscope, AlertTriangle } from 'lucide-react';
import { CLINICAL_REFERENCES, MEDICAL_SAFETY_DISCLAIMER } from '../../services/cyclePredictionService.js';

export function CycleEducationalSafety() {
  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
        <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-semibold">
          <BookOpen className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-semibold text-stone-900 text-base sm:text-lg">
            Clinical Guide: Irregularity vs. PCOS
          </h3>
          <p className="text-xs text-stone-500">
            Evidence-based medical context, safety limitations, and clinician discussion points
          </p>
        </div>
      </div>

      {/* Prominent Non-Diagnostic Notice */}
      <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-900">
          <p className="font-semibold">
            Important Medical Distinctions:
          </p>
          <p className="leading-relaxed">
            Menstrual cycle irregularity is a potential sign or observation, <strong>never a definitive diagnosis</strong>. Having longer or variable cycles does NOT automatically mean you have PCOS. Diagnosing PCOS requires in-person medical evaluation to satisfy recognized consensus criteria (such as Rotterdam 2003/2023) and ruling out other conditions.
          </p>
        </div>
      </div>

      {/* Causes of Cycle Variation */}
      <div className="space-y-3">
        <h4 className="font-semibold text-stone-900 text-sm flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-rose-600" />
          Common Causes of Cycle Variations
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          Menstrual cycles are orchestrated by complex interactions between the hypothalamus, pituitary gland, and ovaries (the HPO axis). Temporary or ongoing cycle changes can arise from:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <strong className="text-stone-800 font-semibold block mb-0.5">Stress & Cortisol:</strong>
            Elevated stress hormones can delay the LH surge required for ovulation, lengthening the cycle.
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <strong className="text-stone-800 font-semibold block mb-0.5">Thyroid Function:</strong>
            Hypothyroidism or hyperthyroidism directly alters cycle frequency and flow.
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <strong className="text-stone-800 font-semibold block mb-0.5">Post-Menarche / Adolescence:</strong>
            During the first 2–3 years after starting periods, cycles naturally fluctuate (21–45 days) as ovulation matures.
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <strong className="text-stone-800 font-semibold block mb-0.5">Insulin & Metabolic Health:</strong>
            Elevated insulin levels can prompt the ovaries to produce excess androgens, contributing to oligomenorrhea.
          </div>
        </div>
      </div>

      {/* When to Seek Clinical Advice */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
        <h4 className="font-semibold text-emerald-950 text-xs sm:text-sm flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-700" />
          When to Schedule an In-Person Medical Consultation
        </h4>
        <ul className="text-xs text-emerald-900/90 space-y-1.5 list-disc list-inside">
          <li>Cycles consistently arrive further than 35 days apart for three or more consecutive cycles.</li>
          <li>Your period stops completely for 90 days or longer (amenorrhea) when not pregnant.</li>
          <li>Bleeding is unusually heavy (soaking through a pad or tampon every hour for two consecutive hours).</li>
          <li>Periods are accompanied by severe, incapacitating pelvic cramps or sudden sharp pain.</li>
          <li>Bleeding lasts longer than 7 days or occurs irregularly between menstrual periods.</li>
        </ul>
      </div>

      {/* Citations & Trustworthy Medical References */}
      <div className="space-y-2.5 pt-2">
        <h4 className="font-semibold text-stone-900 text-xs uppercase tracking-wider text-stone-400">
          Trustworthy Clinical Guidelines & References
        </h4>
        <div className="space-y-2">
          {CLINICAL_REFERENCES.map((ref, idx) => (
            <div key={idx} className="p-3 bg-stone-50/80 rounded-xl border border-stone-100 text-xs space-y-1">
              <div className="font-semibold text-stone-800">{ref.source}</div>
              <div className="text-stone-500 italic text-[11px]">{ref.guideline}</div>
              <p className="text-stone-600 text-[11px] mt-0.5">{ref.standard}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Limitations of Current Model */}
      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60 text-xs text-stone-500 space-y-1">
        <div className="font-semibold text-stone-700">Limitations of Rule-Based Forecasting:</div>
        <p className="text-[11px] leading-relaxed">
          The current forecasting tool relies on mathematical intervals between your logged dates. It does not measure ovulation hormones (LH, progesterone), basal body temperature, or cervical mucus. No treatments, medicines, or dosages are ever prescribed.
        </p>
      </div>
    </div>
  );
}
