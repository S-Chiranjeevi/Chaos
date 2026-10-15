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


# ============================================================================
# APIVerve Menstrual Cycle Forecast Schemas
# Documentation: https://docs.apiverve.com/ref/menstrualcycle
# ============================================================================

class APIVerveForecastRequest(BaseModel):
    """Validated input parameters for APIVerve Menstrual Cycle Calculator API."""
    last_period: str = Field(
        ...,
        description="First day of last menstrual period in YYYY-MM-DD format",
        examples=["2026-03-01"]
    )
    cycle_length: int = Field(
        default=28,
        ge=21,
        le=35,
        description="Average length of menstrual cycle in days (allowed: 21-35)"
    )
    period_length: int = Field(
        default=5,
        ge=2,
        le=10,
        description="Average length of period in days (allowed: 2-10)"
    )
    cycles: int = Field(
        default=3,
        ge=1,
        le=12,
        description="Number of future cycles to calculate (allowed: 1-12)"
    )

    @field_validator("last_period")
    @classmethod
    def validate_last_period(cls, value: str) -> str:
        cleaned = str(value).strip()
        if not DATE_REGEX.match(cleaned):
            raise ValueError(f"Invalid date format '{cleaned}'. Must be YYYY-MM-DD.")
        try:
            parsed = datetime.strptime(cleaned, "%Y-%m-%d")
        except ValueError:
            raise ValueError(f"'{cleaned}' is not a valid calendar date.")

        # Reasonable bounds check: between 1900 and 2100
        if parsed.year < 1900 or parsed.year > 2100:
            raise ValueError(f"Date year {parsed.year} is outside acceptable range.")
        return cleaned


class APIVervePeriod(BaseModel):
    start_date: str = Field(..., description="Estimated period start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="Estimated period end date (YYYY-MM-DD)")
    duration_days: int = Field(..., description="Period duration in days")


class APIVerveOvulation(BaseModel):
    date: str = Field(..., description="Estimated ovulation date (YYYY-MM-DD)")
    day_of_cycle: int = Field(..., description="Cycle day number on which ovulation is estimated")


class APIVerveFertileWindow(BaseModel):
    start_date: str = Field(..., description="Fertile window start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="Fertile window end date (YYYY-MM-DD)")
    duration_days: int = Field(..., description="Fertile window length in days")


class APIVerveCycleItem(BaseModel):
    cycle_number: int = Field(..., description="Index of calculated cycle (1-based)")
    period: APIVervePeriod
    ovulation: APIVerveOvulation
    fertile_window: APIVerveFertileWindow


class APIVerveForecastData(BaseModel):
    last_period_date: str = Field(..., description="Input last period start date")
    cycle_length: int = Field(..., description="Cycle length used for calculations")
    period_length: int = Field(..., description="Period duration used for calculations")
    cycles_calculated: int = Field(..., description="Count of calculated cycles returned")
    cycles: List[APIVerveCycleItem] = Field(default_factory=list, description="Forecast cycle details")
    disclaimer: Optional[str] = Field(
        default=None,
        description="Medical disclaimer provided by APIVerve upstream engine"
    )


class APIVerveForecastResponse(BaseModel):
    status: str = Field(default="ok", description="Status code ('ok')")
    source: str = Field(default="apiverve_live_api", description="Source identifier")
    data: APIVerveForecastData = Field(..., description="Structured menstrual cycle forecast data")
    disclaimer: str = Field(
        default="This information is an estimate based on average mathematical cycle calculations and is not a medical diagnosis.",
        description="PCOS Saathi medical safety disclaimer"
    )

