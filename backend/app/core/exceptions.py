"""Useful, structured error handlers for PCOS Saathi backend."""
from __future__ import annotations

from typing import Any, List
from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


def setup_exception_handlers(app: Any) -> None:
    """Register custom exception handlers with FastAPI app."""

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        """Format Pydantic validation errors into clear, useful feedback without leaking secrets."""
        formatted_details: List[dict[str, str]] = []
        for err in exc.errors():
            loc = " -> ".join(str(part) for part in err.get("loc", []) if part != "body")
            msg = err.get("msg", "Invalid value")
            err_type = err.get("type", "value_error")
            formatted_details.append({
                "field": loc or "request_body",
                "issue": msg,
                "type": err_type
            })

        return JSONResponse(
            status_code=422,

            content={
                "error": "VALIDATION_ERROR",
                "message": "The request contains invalid or missing parameters.",
                "details": formatted_details,
            },
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        """Format standard HTTP errors (404, 400, 405, etc.)."""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": f"HTTP_{exc.status_code}",
                "message": str(exc.detail),
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """Catch-all for unhandled exceptions, returning a safe response without exposing stack traces."""
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred while processing your request. Please try again or use offline fallback.",
            },
        )
