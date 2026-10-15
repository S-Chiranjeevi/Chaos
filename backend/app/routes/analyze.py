"""Stateless symptom and cycle analysis endpoint."""
from __future__ import annotations

from fastapi import APIRouter
from ..core.logging import logger
from ..schemas.analyze import AnalyzeRequest, AnalyzeResponse
from ..services.gemini_service import gemini_service
from ..services.local_analyzer import local_analyze
from ..safety.output_validator import DISCLAIMER, validate_output
from ..safety.red_flags import detect_red_flags

router = APIRouter(tags=["Analyze"])

ANALYZE_SYSTEM_PROMPT = (
    "You are an empathetic, clinical women's reproductive health educator assistant for PCOS Saathi. "
    "Analyze the user's description of symptoms and return structured JSON. "
    "Safety Guidelines:\n"
    "1. NEVER give a definitive diagnosis or say 'you have PCOS'.\n"
    "2. NEVER prescribe medication, treatments, or dosages.\n"
    "3. Set urgency to 'urgent' or 'emergency' if acute red flags are present (e.g. fever with severe pelvic pain, fainting with bleeding, soaking pads hourly).\n"
    "4. Return strict JSON with the following keys:\n"
    "   detected_language: string\n"
    "   symptoms: list of strings\n"
    "   possible_relation: string explaining educational context\n"
    "   urgency: string ('routine', 'soon', 'urgent', or 'emergency')\n"
    "   red_flags: list of strings (empty if none)\n"
    "   recommended_specialist: string (e.g. 'gynecologist')\n"
    "   questions_for_doctor: list of strings\n"
    "   self_care_tips: list of strings (lifestyle, nutrition, sleep only)\n"
    "   disclaimer: 'This is information, not a diagnosis.'\n"
    "   reply_text: empathetic conversational summary\n"
)


@router.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_symptoms(request: AnalyzeRequest) -> AnalyzeResponse:
    """Analyze symptoms and cycle notes with optional Gemini AI and local deterministic fallback.

    Zero data is permanently saved or stored.
    """
    # Scan the submitted note before an AI call or response can be returned.
    warnings = detect_red_flags(request.text)

    # Urgent input uses the local path immediately and never waits on AI.
    if not warnings and gemini_service.is_available:
        follow_up_context = f"\nUser Follow-up Clarification Answers: {request.follow_up_answers}" if request.follow_up_answers else ""
        user_prompt = (
            f"Analyze user input (Age: {request.age or 'Not provided'}, Preferred language: {request.language}):\n"
            f"\"{request.text}\"{follow_up_context}"
        )
        ai_data = await gemini_service.generate_json(ANALYZE_SYSTEM_PROMPT, user_prompt)
        if ai_data:
            try:
                safe_ai_data = validate_output(ai_data)
                if safe_ai_data is None:
                    raise ValueError("AI output did not pass safety checks")
                safe_ai_data["disclaimer"] = DISCLAIMER
                safe_ai_data["safety_warnings"] = warnings
                if not safe_ai_data.get("detected_language"):
                    safe_ai_data["detected_language"] = request.language or "en"
                ai_response = AnalyzeResponse(**safe_ai_data)
                safe_response = _validate_response(ai_response, warnings)
                if safe_response is not None:
                    return safe_response
                logger.warning("AI response failed output safety checks; reverting to local analyzer.")
            except Exception as exc:
                logger.warning("AI response validation failed (%s); reverting to local analyzer.", exc.__class__.__name__)

    # 2. Local deterministic clinical rule fallback (guaranteed offline & private)
    local_response = local_analyze(
        text=request.text,
        language=request.language or "en",
        age=request.age,
        follow_up_answers=request.follow_up_answers,
    )
    safe_local_response = _validate_response(local_response, warnings)
    return safe_local_response or _blocked_response(warnings, request.language or "en")


def _validate_response(response: AnalyzeResponse, warnings: list[dict]) -> AnalyzeResponse | None:
    data = response.model_dump()
    data["disclaimer"] = DISCLAIMER
    data["safety_warnings"] = warnings
    if warnings:
        data["urgency"] = "urgent"
        data["red_flags"] = list(dict.fromkeys([*data.get("red_flags", []), *[warning["title"] for warning in warnings]]))
    safe = validate_output(data)
    return AnalyzeResponse(**safe) if safe is not None else None


def _blocked_response(warnings: list[dict], language: str) -> AnalyzeResponse:
    return AnalyzeResponse(
        safety_warnings=warnings,
        detected_language=language,
        symptoms=[],
        possible_relation="",
        urgency="urgent" if warnings else "routine",
        red_flags=[warning["title"] for warning in warnings],
        recommended_specialist="urgent medical care" if warnings else "a qualified healthcare professional",
        questions_for_doctor=[],
        self_care_tips=[],
        disclaimer=DISCLAIMER,
        reply_text=(
            "Please seek urgent medical care. " if warnings else
            "Automated health information could not safely be shown. Please speak with a qualified healthcare professional. "
        ) + DISCLAIMER,
    )
