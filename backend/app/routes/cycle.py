"""Stateless cycle calculation and regularity analysis endpoint."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from ..schemas.cycle import (
    CycleRequest,
    CycleResponse,
    APIVerveForecastRequest,
    APIVerveForecastResponse,
)
from ..services.cycle_service import cycle_service
from ..services.apiverve_service import apiverve_service, APIVerveError

router = APIRouter(tags=["Cycle"])


@router.post("/api/cycle", response_model=CycleResponse)
async def analyze_cycle(request: CycleRequest) -> CycleResponse:
    """Analyze menstrual cycle intervals, statistics, and regularity patterns.

    Stateless computation. No dates or health entries are stored.
    """
    return cycle_service.analyze_cycle(request.period_start_dates)


@router.post("/api/cycle/apiverve-forecast", response_model=APIVerveForecastResponse)
async def calculate_apiverve_forecast(request: APIVerveForecastRequest) -> APIVerveForecastResponse:
    """Calculate forward menstrual cycle forecast using official APIVerve API.

    Stateless gateway. The API key is managed securely on the server.
    Does not mock, guess, or fabricate predictions if the API is unavailable.
    """
    try:
        result = await apiverve_service.calculate_forecast(
            last_period=request.last_period,
            cycle_length=request.cycle_length,
            period_length=request.period_length,
            cycles=request.cycles,
        )
        return APIVerveForecastResponse(
            status="ok",
            source="apiverve_live_api",
            data=result["data"],
        )
    except APIVerveError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail={"error": exc.code, "message": exc.message},
        )

