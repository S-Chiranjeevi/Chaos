"""Stateless clinician pre-consultation summary endpoint."""
from __future__ import annotations

from fastapi import APIRouter
from ..schemas.summary import SummaryRequest, SummaryResponse
from ..services.summary_service import summary_service

router = APIRouter(tags=["Summary"])


@router.post("/api/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest) -> SummaryResponse:
    """Synthesize symptoms, cycle data, and insights into a clinician pre-consultation summary.

    Stateless operation. No data is stored.
    """
    return await summary_service.generate_summary(request)
