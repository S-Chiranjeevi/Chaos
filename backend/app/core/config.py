"""Configuration settings for PCOS Saathi Stateless FastAPI Backend.

Loaded securely from environment variables or .env file.
API keys and secrets are never exposed in string representations or logs.
"""
from __future__ import annotations

import os
from typing import List, Optional
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings schema."""
    GEMINI_API_KEY: Optional[str] = Field(
        default=None,
        description="Optional API key for Google Gemini AI features"
    )
    GEMINI_MODEL: str = Field(
        default="gemini-1.5-flash",
        description="Gemini model name to use for AI inference"
    )
    FRONTEND_ORIGIN: str = Field(
        default="http://localhost:5173",
        description="Allowed origin(s) for CORS, comma-separated"
    )
    ENVIRONMENT: str = Field(
        default="development",
        description="Runtime environment (development, test, production)"
    )
    HOST: str = Field(default="0.0.0.0", description="FastAPI host")
    PORT: int = Field(default=8000, description="FastAPI port")
    REQUEST_TIMEOUT_SECONDS: float = Field(
        default=8.0,
        description="HTTP client timeout for outgoing AI requests"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins(self) -> List[str]:
        """Parse comma-separated origins and always include standard dev ports."""
        origins = set()
        if self.FRONTEND_ORIGIN:
            for item in self.FRONTEND_ORIGIN.split(","):
                cleaned = item.strip().rstrip("/")
                if cleaned:
                    origins.add(cleaned)

        # Standard local development frontends (Vite: 5173, Next/CRA: 3000)
        origins.update([
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:3000",
        ])
        return sorted(list(origins))

    @property
    def has_gemini(self) -> bool:
        """Check if Gemini API key is validly configured."""
        return bool(self.GEMINI_API_KEY and self.GEMINI_API_KEY.strip())


# Singleton settings instance
settings = Settings()
