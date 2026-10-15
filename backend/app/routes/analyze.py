"""Stateless symptom and cycle analysis endpoint."""
from __future__ import annotations

from fastapi import APIRouter
from ..core.logging import logger
from ..schemas.analyze import AnalyzeRequest, AnalyzeResponse
from ..services.gemini_service import gemini_service
from ..services.local_analyzer import local_analyze

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
    # 1. If Gemini AI is configured, try calling it with strict timeout
    if gemini_service.is_available:
        user_prompt = (
            f"Analyze user input (Age: {request.age or 'Not provided'}, Preferred language: {request.language}):\n"
            f"\"{request.text}\""
        )
        ai_data = await gemini_service.generate_json(ANALYZE_SYSTEM_PROMPT, user_prompt)
        if ai_data:
            try:
                # Sanitize and validate through schema
                ai_data["disclaimer"] = "This is information, not a diagnosis."
                if not ai_data.get("detected_language"):
                    ai_data["detected_language"] = request.language or "en"
                return AnalyzeResponse(**ai_data)
            except Exception as exc:
                logger.warning("AI response validation failed (%s); reverting to local analyzer.", exc.__class__.__name__)

    # 2. Local deterministic clinical rule fallback (guaranteed offline & private)
    return local_analyze(
        text=request.text,
        language=request.language or "en",
        age=request.age
    )
