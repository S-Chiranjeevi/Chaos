"""Privacy-first logger and middleware for PCOS Saathi backend.

Strict Invariants:
1. NEVER log raw symptom text or user-provided health descriptions.
2. NEVER log Gemini API keys or authorization headers.
3. Only log HTTP method, path, response status, and processing duration.
"""
from __future__ import annotations

import logging
import time
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

# Configure standard root logger
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("pcos_saathi.backend")


class PrivacyLoggingMiddleware(BaseHTTPMiddleware):
    """Logs HTTP requests without logging request bodies, health data, or secrets."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.perf_counter()
        method = request.method
        path = request.url.path

        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start_time) * 1000
            # Safe log: only method, path, status, and latency. Zero health body data logged.
            logger.info("%s %s -> %s (%.2f ms)", method, path, response.status_code, duration_ms)
            return response
        except Exception as exc:
            duration_ms = (time.perf_counter() - start_time) * 1000
            # Never include request body or health content in exception logs
            logger.error("%s %s FAILED with %s (%.2f ms)", method, path, exc.__class__.__name__, duration_ms)
            raise
