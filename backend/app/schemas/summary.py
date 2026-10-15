"""Schemas for clinician pre-consultation summary synthesis."""
from __future__ import annotations

from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field


class SummaryRequest(BaseModel):
    """Request payload containing symptoms, cycle metrics, and insights for doctor summary."""
    symptoms: List[Union[str, Dict[str, Any]]] = Field(
        default_factory=list,
        max_length=100,
        description="Recorded symptoms as names or structured objects"
    )
    duration: Optional[str] = Field(
        default="",
        max_length=200,
        description="Overall timeframe or symptom duration"
    )
    cycle_data: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Cycle metrics, logs, or dates"
    )
    insights: List[Union[str, Dict[str, Any]]] = Field(
        default_factory=list,
        max_length=100,
        description="Recorded pattern insights or observations"
    )
    language: Optional[str] = Field(
        default="en",
        max_length=10,
        description="Language code for the synthesized narrative"
    )


class SummaryResponse(BaseModel):
    """Synthesized 1-page clinician pre-consultation dossier."""
    safety_warnings: List[Dict[str, Any]] = Field(default_factory=list, description="Urgent safety warnings to render before other information")
    narrative: str = Field(default="", description="Patient-facing narrative of reported symptoms")
    main_symptoms: List[Dict[str, Any]] = Field(default_factory=list, description="Structured symptom frequency and severity table")
    cycle_summary: Dict[str, Any] = Field(default_factory=dict, description="Condensed menstrual regularity metrics")
    repeated_patterns: List[str] = Field(default_factory=list, description="Observed recurring patterns")
    red_flags: List[str] = Field(default_factory=list, description="Active clinical red flags")
    recommended_specialist: str = Field(default="gynecologist", description="Primary recommended medical specialist")
    questions_for_doctor: List[str] = Field(default_factory=list, description="Targeted clinical questions for the physician")
    personalized_insights: List[str] = Field(default_factory=list, description="Evidence-based guidelines (e.g. Rotterdam criteria)")
    clinical_notes: str = Field(default="", description="Objective clinician-facing note")
    printable_text: str = Field(default="", description="Clean formatted text ready for clipboard or printing")
    disclaimer: str = Field(default="This is information, not a diagnosis.", description="Mandatory medical disclaimer")
