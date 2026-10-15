"""Stateless cycle calculation and regularity analysis endpoint."""
from __future__ import annotations

from fastapi import APIRouter
from ..schemas.cycle import CycleRequest, CycleResponse
from ..services.cycle_service import cycle_service

router = APIRouter(tags=["Cycle"])


@router.post("/api/cycle", response_model=CycleResponse)
async def analyze_cycle(request: CycleRequest) -> CycleResponse:
    """Analyze menstrual cycle intervals, statistics, and regularity patterns.

    Stateless computation. No dates or health entries are stored.
    """
    return cycle_service.analyze_cycle(request.period_start_dates)
