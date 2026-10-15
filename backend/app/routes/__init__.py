"""PCOS Saathi Route Controllers."""
from __future__ import annotations

from .health import router as health_router
from .analyze import router as analyze_router
from .cycle import router as cycle_router
from .summary import router as summary_router

__all__ = [
    "health_router",
    "analyze_router",
    "cycle_router",
    "summary_router",
]
