"""Service for calling the official APIVerve Menstrual Cycle Calculator API.

Documentation: https://docs.apiverve.com/ref/menstrualcycle
Endpoint: GET https://api.apiverve.com/v1/menstrualcycle
Authentication: x-api-key header

Invariants:
- API key is read strictly on the server from environment variable APIVERVE_API_KEY.
- Never hardcodes or returns the secret API key.
- Never substitutes fabricated results when the API fails or is unconfigured.
- Validates real response structure before returning.
"""
from __future__ import annotations

from typing import Any, Dict, Optional
import httpx

from ..core.config import settings
from ..core.logging import logger

APIVERVE_ENDPOINT = "https://api.apiverve.com/v1/menstrualcycle"


class APIVerveError(Exception):
    """Base exception for APIVerve API issues."""
    def __init__(self, message: str, code: str = "APIVERVE_ERROR", status_code: int = 502) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code


class APIVerveKeyMissingError(APIVerveError):
    def __init__(self) -> None:
        super().__init__(
            message="APIVERVE_API_KEY is not configured on the server. Please set APIVERVE_API_KEY in your backend .env file.",
            code="APIVERVE_KEY_MISSING",
            status_code=503,
        )


class APIVerveAuthError(APIVerveError):
    def __init__(self, detail: str = "Invalid or expired API key.") -> None:
        super().__init__(
            message=f"APIVerve authentication failed: {detail}",
            code="APIVERVE_AUTH_FAILED",
            status_code=401,
        )


class APIVerveRateLimitError(APIVerveError):
    def __init__(self) -> None:
        super().__init__(
            message="APIVerve credit limit or rate limit exceeded. Check your APIVerve dashboard plan.",
            code="APIVERVE_RATE_LIMITED",
            status_code=429,
        )


class APIVerveService:
    """Server-side client for APIVerve Menstrual Cycle Calculator."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.APIVERVE_API_KEY

    @property
    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    async def calculate_forecast(
        self,
        last_period: str,
        cycle_length: int = 28,
        period_length: int = 5,
        cycles: int = 3,
    ) -> Dict[str, Any]:
        """Call APIVerve menstrualcycle endpoint with verified query parameters."""
        if not self.is_configured:
            raise APIVerveKeyMissingError()

        params = {
            "last_period": last_period.strip(),
            "cycle_length": cycle_length,
            "period_length": period_length,
            "cycles": cycles,
        }

        headers = {
            "x-api-key": self.api_key.strip(),
            "Accept": "application/json",
            "User-Agent": "PCOSSaathi-Backend/3.0.0",
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(
                    APIVERVE_ENDPOINT,
                    params=params,
                    headers=headers,
                )

            # Handle HTTP errors according to APIVerve documentation
            if response.status_code == 401:
                logger.warning("APIVerve returned 401 Unauthorized")
                raise APIVerveAuthError()
            elif response.status_code == 403:
                logger.warning("APIVerve returned 403 Forbidden")
                raise APIVerveError("Access forbidden by APIVerve key restrictions.", code="APIVERVE_FORBIDDEN", status_code=403)
            elif response.status_code == 429:
                logger.warning("APIVerve returned 429 Rate Limit / Out of Credits")
                raise APIVerveRateLimitError()
            elif response.status_code >= 400 and response.status_code < 500:
                error_body = response.text
                logger.warning("APIVerve parameter validation error: %s", error_body)
                raise APIVerveError(f"APIVerve rejected inputs: {error_body}", code="APIVERVE_BAD_REQUEST", status_code=400)
            elif response.status_code >= 500:
                logger.error("APIVerve upstream server error (%s)", response.status_code)
                raise APIVerveError(f"APIVerve service returned upstream error {response.status_code}.", code="APIVERVE_UPSTREAM_ERROR", status_code=502)

            # Parse JSON
            payload = response.json()
            if not isinstance(payload, dict) or payload.get("status") != "ok" or "data" not in payload:
                err_msg = payload.get("error") if isinstance(payload, dict) else "Unknown response format"
                raise APIVerveError(f"APIVerve returned unexpected format: {err_msg}", code="APIVERVE_INVALID_PAYLOAD", status_code=502)

            data = payload["data"]
            return {
                "status": "ok",
                "source": "apiverve_live_api",
                "data": data,
                "premium": payload.get("premium"),
            }

        except httpx.TimeoutException as exc:
            logger.warning("APIVerve request timed out after 15 seconds")
            raise APIVerveError("APIVerve request timed out after 15 seconds.", code="APIVERVE_TIMEOUT", status_code=504) from exc
        except httpx.RequestError as exc:
            logger.error("Network error communicating with APIVerve: %s", exc.__class__.__name__)
            raise APIVerveError(f"Could not connect to APIVerve API: {exc.__class__.__name__}", code="APIVERVE_NETWORK_ERROR", status_code=502) from exc


apiverve_service = APIVerveService()
