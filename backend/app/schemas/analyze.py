"""Schemas for symptom analysis and NLP understanding."""
from __future__ import annotations

from typing import Any, List, Optional
from pydantic import BaseModel, Field, field_validator


class AnalyzeRequest(BaseModel):
    """Request payload for symptom and cycle pattern analysis."""
    text: str = Field(
        ...,
        min_length=1,
        max_length=2000,
        description="User description of symptoms, cycle delays, or bodily sensations"
    )
    language: Optional[str] = Field(
        default="en",
        max_length=10,
        description="Preferred language code (en, hi, kn, ta, ml)"
    )
    age: Optional[int] = Field(
        default=None,
        ge=10,
        le=120,
        description="User age in years (optional)"
    )

    @field_validator("text")
    @classmethod
    def validate_non_blank_text(cls, v: str) -> str:
        stripped = v.strip()
        if not stripped:
            raise ValueError("Input text cannot be blank or whitespace only.")
        return stripped


class AnalyzeResponse(BaseModel):
    """Empathetic, non-diagnostic response for symptom analysis."""
    safety_warnings: List[dict[str, Any]] = Field(default_factory=list, description="Urgent safety warnings to render before other information")
    detected_language: str = Field(..., description="Language detected or used for reply")
    symptoms: List[str] = Field(default_factory=list, description="Extracted symptom labels")
    possible_relation: str = Field(default="", description="Educational relation to hormonal/cycle patterns")
    urgency: str = Field(default="routine", description="Urgency triage: routine, soon, urgent, or emergency")
    red_flags: List[str] = Field(default_factory=list, description="Detected red flag clinical alerts")
    recommended_specialist: str = Field(default="gynecologist", description="Recommended medical specialist")
    questions_for_doctor: List[str] = Field(default_factory=list, description="Relevant questions for doctor consultation")
    self_care_tips: List[str] = Field(default_factory=list, description="Non-medical lifestyle and nutritional guidance")
    disclaimer: str = Field(default="This is information, not a diagnosis.", description="Medical disclaimer")
    reply_text: str = Field(default="", description="Empathetic, conversational overview for the user")
