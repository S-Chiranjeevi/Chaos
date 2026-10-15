"""PCOS Saathi Stateless FastAPI Application Entrypoint.

Architectural Guarantees:
1. Zero Database: No MongoDB, PostgreSQL, SQLite, or Firebase.
2. Completely Stateless: No persistent storage of symptoms, cycles, or notes.
3. Privacy-First: Never logs raw symptom text or sensitive inputs.
4. Fallback Resilient: Full local deterministic rule engine operates offline or if AI times out.
5. Secure: API keys are strictly guarded and never exposed.
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from .core.config import settings
from .core.exceptions import setup_exception_handlers
from .core.logging import PrivacyLoggingMiddleware, logger
from .routes.analyze import router as analyze_router
from .routes.cycle import router as cycle_router
from .routes.health import router as health_router
from .routes.summary import router as summary_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler for startup and shutdown."""
    ai_status = "ENABLED (Gemini)" if settings.has_gemini else "OFFLINE FALLBACK MODE"
    logger.info("Starting PCOS Saathi Backend [%s] in %s environment", ai_status, settings.ENVIRONMENT)
    logger.info("CORS allowed origins: %s", ", ".join(settings.cors_origins))
    yield
    logger.info("Shutting down PCOS Saathi Backend")


app = FastAPI(
    title="PCOS Saathi Stateless API",
    description="Stateless, privacy-first companion API for PCOS symptom analysis, cycle regularity tracking, and clinician summaries.",
    version="3.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# 1. Register Privacy Logging Middleware
app.add_middleware(PrivacyLoggingMiddleware)

# 2. Register Cross-Origin Resource Sharing (CORS) Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Setup useful structured error handlers
setup_exception_handlers(app)

# 4. Register application routers
app.include_router(health_router)
app.include_router(analyze_router)
app.include_router(cycle_router)
app.include_router(summary_router)


@app.get("/", include_in_schema=False)
async def root():
    """Redirect root path to interactive documentation."""
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )
