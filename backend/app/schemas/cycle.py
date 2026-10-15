"""Schemas for menstrual cycle history and interval analysis."""
from __future__ import annotations

import re
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class CycleRequest(BaseModel):
    """Request payload containing period start dates."""
    period_start_dates: List[str] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="List of ISO format period start dates (YYYY-MM-DD)"
    )

    @field_validator("period_start_dates")
    @classmethod
    def validate_dates(cls, dates: List[str]) -> List[str]:
        cleaned: List[str] = []
        for d in dates:
            d_str = str(d).strip()
            if not DATE_REGEX.match(d_str):
                raise ValueError(f"Invalid date format '{d_str}'. Must be YYYY-MM-DD.")
            try:
                datetime.strptime(d_str, "%Y-%m-%d")
            except ValueError:
                raise ValueError(f"Date '{d_str}' is not a valid calendar date.")
            cleaned.append(d_str)
        return cleaned


class CycleInterval(BaseModel):
    """Calculated duration between consecutive period start dates."""
    start_date: str = Field(..., description="Start date of the earlier period (YYYY-MM-DD)")
    end_date: str = Field(..., description="Start date of the following period (YYYY-MM-DD)")
    length_days: int = Field(..., description="Cycle length in days")


class CycleResponse(BaseModel):
    """Comprehensive, non-diagnostic cycle metrics and insights."""
    cycles: List[CycleInterval] = Field(default_factory=list, description="Calculated individual cycle intervals")
    average_cycle_length: Optional[float] = Field(default=None, description="Mean cycle length in days")
    shortest_cycle: Optional[int] = Field(default=None, description="Shortest observed cycle length in days")
    longest_cycle: Optional[int] = Field(default=None, description="Longest observed cycle length in days")
    variation_days: Optional[int] = Field(default=None, description="Difference between longest and shortest cycle")
    regularity: str = Field(default="regular", description="Regularity classification: regular, variable, irregular, or insufficient_data")
    predicted_next_period: Optional[str] = Field(default=None, description="Estimated next period date (YYYY-MM-DD)")
    insights: List[str] = Field(default_factory=list, description="Educational insights based on clinical guidelines")
    urgency: str = Field(default="routine", description="Urgency rating based on cycle patterns")
    disclaimer: str = Field(default="This is information, not a diagnosis.", description="Medical disclaimer")
