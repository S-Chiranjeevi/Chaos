"""Health and liveness probes for PCOS Saathi backend."""
from __future__ import annotations

from fastapi import APIRouter
from ..schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/api/health", response_model=HealthResponse)
@router.get("/health", response_model=HealthResponse, include_in_schema=False)
@router.get("/api/v1/health", response_model=HealthResponse, include_in_schema=False)
async def check_health() -> HealthResponse:
    """Return stateless service health status."""
    return HealthResponse(status="ok")
