"""Service for generating structured, clinician-ready pre-consultation summaries."""
from __future__ import annotations

from typing import Any, Dict, List, Optional, Union
from ..schemas.summary import SummaryRequest, SummaryResponse
from .cycle_service import cycle_service
from .gemini_service import gemini_service

DISCLAIMER = "This is information, not a diagnosis."

AVAILABLE_CLINICAL_INSIGHTS = [
    "International Rotterdam criteria require ruling out thyroid dysfunction and hyperprolactinemia before confirming PCOS.",
    "Requesting a transvaginal or pelvic ultrasound in the early follicular phase yields clearer baseline antral follicle counts.",
    "Evaluating Fasting Glucose and Fasting Insulin can screen for metabolic insulin resistance, which occurs in 70%+ of PCOS cases.",
    "Serum Free Testosterone and DHEA-S testing helps distinguish between ovarian and adrenal androgen sources.",
    "TSH and Free T4 blood tests help differentiate primary thyroid disease from PCOS symptoms.",
]


class SummaryService:
    """Synthesizes symptoms, cycle data, and insights into doctor consultation summaries."""

    @classmethod
    async def generate_summary(cls, request: SummaryRequest) -> SummaryResponse:
        """Synthesize summary using Gemini if available, otherwise local fallback."""
        normalized_symptoms = cls._normalize_symptoms(request.symptoms)
        cycle_metrics = cls._extract_cycle_metrics(request.cycle_data)
        normalized_insights = cls._normalize_insights(request.insights)
        duration_text = request.duration.strip() if request.duration else "recent months"

        # Try Gemini AI synthesis if configured and reachable
        if gemini_service.is_available:
            ai_summary = await cls._try_gemini_summary(
                symptoms=normalized_symptoms,
                duration=duration_text,
                cycle_metrics=cycle_metrics,
                insights=normalized_insights,
                language=request.language or "en",
            )
            if ai_summary:
                return ai_summary

        # Deterministic local fallback
        return cls._local_summary(
            symptoms=normalized_symptoms,
            duration=duration_text,
            cycle_metrics=cycle_metrics,
            insights=normalized_insights,
            language=request.language or "en",
        )

    @classmethod
    def _normalize_symptoms(cls, raw_symptoms: List[Union[str, Dict[str, Any]]]) -> List[Dict[str, Any]]:
        normalized: List[Dict[str, Any]] = []
        for item in raw_symptoms:
            if isinstance(item, str):
                name = item.strip()
                if name:
                    normalized.append({
                        "symptom": name,
                        "duration": "Unspecified",
                        "frequency": "Reported",
                        "severity": "Moderate",
                    })
            elif isinstance(item, dict):
                name = str(item.get("symptom") or item.get("name") or "").strip()
                if name:
                    normalized.append({
                        "symptom": name,
                        "duration": str(item.get("duration") or "Unspecified"),
                        "frequency": str(item.get("frequency") or "Reported"),
                        "severity": str(item.get("severity") or "Moderate"),
                    })
        return normalized

    @classmethod
    def _normalize_insights(cls, raw_insights: List[Union[str, Dict[str, Any]]]) -> List[str]:
        cleaned: List[str] = []
        for item in raw_insights:
            if isinstance(item, str) and item.strip():
                cleaned.append(item.strip())
            elif isinstance(item, dict):
                title = item.get("title") or item.get("message") or item.get("summary")
                if title:
                    cleaned.append(str(title).strip())
        return cleaned

    @classmethod
    def _extract_cycle_metrics(cls, cycle_data: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        if not cycle_data:
            return {}

        # If period_start_dates provided in cycle_data, run through cycle_service
        start_dates = cycle_data.get("period_start_dates") or cycle_data.get("period_dates")
        if isinstance(start_dates, list) and len(start_dates) >= 1:
            try:
                cycle_res = cycle_service.analyze_cycle(start_dates)
                return {
                    "average_cycle_days": cycle_res.average_cycle_length,
                    "shortest_cycle": cycle_res.shortest_cycle,
                    "longest_cycle": cycle_res.longest_cycle,
                    "irregularity": cycle_res.regularity,
                    "predicted_next_period": cycle_res.predicted_next_period,
                    "total_cycles_recorded": len(cycle_res.cycles),
                }
            except Exception:
                pass

        # Return whatever was provided
        return {
            "average_cycle_days": cycle_data.get("averageCycleDays") or cycle_data.get("average_cycle_days"),
            "irregularity": cycle_data.get("irregularityScore") or cycle_data.get("irregularity") or "unknown",
            "total_cycles_recorded": cycle_data.get("total_cycles_recorded") or cycle_data.get("totalCyclesRecorded"),
        }

    @classmethod
    def _local_summary(
        cls,
        symptoms: List[Dict[str, Any]],
        duration: str,
        cycle_metrics: Dict[str, Any],
        insights: List[str],
        language: str,
    ) -> SummaryResponse:
        symptom_names = [s["symptom"] for s in symptoms]
        symptoms_str = ", ".join(symptom_names) if symptom_names else "menstrual and hormonal wellness patterns"

        avg_days = cycle_metrics.get("average_cycle_days")
        cycle_phrase = f"average cycle length of {avg_days} days" if avg_days else "menstrual cycle patterns"

        narrative = (
            f"Over the past {duration}, I recorded {symptoms_str} and observed a {cycle_phrase}. "
            "I would like to review these observations to evaluate whether clinical hormonal testing or imaging is recommended."
        )

        repeated_patterns: List[str] = []
        if avg_days and (avg_days > 35 or avg_days < 21):
            repeated_patterns.append(f"Cycle lengths outside standard window (average: {avg_days} days)")
        if any("hair" in s.lower() or "acne" in s.lower() for s in symptom_names):
            repeated_patterns.append("Co-occurrence of menstrual irregularity with dermatological/androgenic symptoms")
        if any("pain" in s.lower() for s in symptom_names):
            repeated_patterns.append("Recurrent pelvic discomfort recorded during tracking period")

        questions_for_doctor = [
            "What clinical evaluations (such as pelvic ultrasound or hormone panel: LH, FSH, Free Testosterone) are recommended for my symptoms?",
            "Could my symptoms be linked to PCOS, thyroid imbalance, or insulin resistance?",
            "What symptom diary parameters would be most useful for you to see over the next 2–3 cycles?",
            "Are there evidence-based dietary or lifestyle adjustments that would support regular ovulation?",
        ]

        # Clinical notes for pre-consultation sheet
        clinical_notes = (
            f"PRE-CONSULTATION SUMMARY\n"
            f"- Reported Timeframe: {duration}\n"
            f"- Primary Symptoms Logged: {symptoms_str}\n"
            f"- Cycle Parameters: {cycle_phrase}\n"
            f"- Red Flags: None acutely detected\n"
            f"- Purpose: Patient seeks clinical guidance and evaluation for suspected hormonal irregularity."
        )

        printable_text = (
            f"=====================================================\n"
            f" PCOS SAATHI — CLINICIAN PRE-CONSULTATION SUMMARY\n"
            f"=====================================================\n\n"
            f"PATIENT NARRATIVE:\n{narrative}\n\n"
            f"RECORDED SYMPTOMS:\n"
            + "\n".join([f" • {s['symptom']} (Severity: {s['severity']}, Duration: {s['duration']}, Frequency: {s['frequency']})" for s in symptoms])
            + f"\n\nCYCLE METRICS:\n"
            f" • Average Cycle: {avg_days or 'Not calculated'} days\n"
            f" • Regularity: {cycle_metrics.get('irregularity', 'Unspecified')}\n\n"
            f"QUESTIONS FOR DOCTOR:\n"
            + "\n".join([f" [{i+1}] {q}" for i, q in enumerate(questions_for_doctor)])
            + f"\n\nDISCLAIMER:\n{DISCLAIMER}\n"
        )

        return SummaryResponse(
            narrative=narrative,
            main_symptoms=symptoms,
            cycle_summary=cycle_metrics,
            repeated_patterns=repeated_patterns,
            red_flags=[],
            recommended_specialist="gynecologist",
            questions_for_doctor=questions_for_doctor,
            personalized_insights=AVAILABLE_CLINICAL_INSIGHTS[:3],
            clinical_notes=clinical_notes,
            printable_text=printable_text,
            disclaimer=DISCLAIMER,
        )

    @classmethod
    async def _try_gemini_summary(
        cls,
        symptoms: List[Dict[str, Any]],
        duration: str,
        cycle_metrics: Dict[str, Any],
        insights: List[str],
        language: str,
    ) -> Optional[SummaryResponse]:
        system_instruction = (
            "You are a compassionate, clinical women's reproductive health educator assistant for PCOS Saathi. "
            "Synthesize a safe, non-diagnostic pre-consultation summary for the patient to bring to their doctor. "
            "Rules:\n"
            "1. NEVER diagnose or state 'you have PCOS'.\n"
            "2. NEVER recommend medications, prescriptions, or dosages.\n"
            "3. Return strict JSON matching the schema.\n"
            "4. Always include disclaimer: 'This is information, not a diagnosis.'\n"
        )
        prompt = (
            f"Generate a doctor summary JSON based on:\n"
            f"- Symptoms: {symptoms}\n"
            f"- Duration: {duration}\n"
            f"- Cycle metrics: {cycle_metrics}\n"
            f"- Existing insights: {insights}\n"
            f"- Target language code: {language}\n"
        )

        data = await gemini_service.generate_json(system_instruction, prompt)
        if not data:
            return None

        try:
            return SummaryResponse(
                narrative=str(data.get("narrative") or ""),
                main_symptoms=symptoms,
                cycle_summary=cycle_metrics,
                repeated_patterns=[str(p) for p in data.get("repeated_patterns", [])],
                red_flags=[str(rf) for rf in data.get("red_flags", [])],
                recommended_specialist=str(data.get("recommended_specialist") or "gynecologist"),
                questions_for_doctor=[str(q) for q in data.get("questions_for_doctor", [])],
                personalized_insights=[str(pi) for pi in data.get("personalized_insights", [])] or AVAILABLE_CLINICAL_INSIGHTS[:3],
                clinical_notes=str(data.get("clinical_notes") or ""),
                printable_text=str(data.get("printable_text") or ""),
                disclaimer=DISCLAIMER,
            )
        except Exception:
            return None


summary_service = SummaryService()
