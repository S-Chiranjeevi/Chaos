"""Stateless cycle calculation and regularity analysis endpoint."""
from __future__ import annotations

from fastapi import APIRouter
from ..schemas.cycle import CycleRequest, CycleResponse
from ..services.cycle_service import cycle_service
from ..safety.output_validator import DISCLAIMER, validate_output

router = APIRouter(tags=["Cycle"])


@router.post("/api/cycle", response_model=CycleResponse)
async def analyze_cycle(request: CycleRequest) -> CycleResponse:
    """Analyze menstrual cycle intervals, statistics, and regularity patterns.

    Stateless computation. No dates or health entries are stored.
    """
    response = cycle_service.analyze_cycle(request.period_start_dates)
    safe_response = validate_output(response.model_dump())
    if safe_response is None:
        return CycleResponse(
            insights=[
                "Cycle information was hidden because it did not pass safety checks. "
                "Please speak with a qualified healthcare professional."
            ],
            disclaimer=DISCLAIMER,
        )
    return CycleResponse(**safe_response)
