"""Stateless Gemini API Client with Strict Timeouts and Non-Diagnostic Safeguards.

Invariants:
- Requests strictly time out via async httpx.
- Never logs API keys, prompts containing health text, or authorization headers.
- Never diagnoses or recommends medication/dosages.
- Returns None on any error, timeout, or missing key so callers seamlessly fall back to local logic.
"""
from __future__ import annotations

import json
from typing import Any, Dict, Optional
import httpx

from ..core.config import settings
from ..core.logging import logger

GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models"


class GeminiService:
    """Ephemeral AI transport for non-diagnostic educational insights."""

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, timeout: Optional[float] = None) -> None:
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model = model or settings.GEMINI_MODEL
        self.timeout = timeout or settings.REQUEST_TIMEOUT_SECONDS

    @property
    def is_available(self) -> bool:
        """Check if API key is present."""
        return bool(self.api_key and self.api_key.strip())

    async def generate_json(self, system_instruction: str, prompt: str) -> Optional[Dict[str, Any]]:
        """Call Gemini API and parse structured JSON response within strict timeout.

        Returns None if unavailable, timed out, or invalid, triggering local fallback.
        """
        if not self.is_available:
            return None

        endpoint = f"{GEMINI_BASE_URL}/{self.model}:generateContent?key={self.api_key}"

        payload = {
            "system_instruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.2,
                "max_output_tokens": 1500,
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    endpoint,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )

            if response.status_code != 200:
                logger.warning("Gemini API returned status %s; falling back to local logic.", response.status_code)
                return None

            data = response.json()
            candidates = data.get("candidates", [])
            if not candidates:
                return None

            content_parts = candidates[0].get("content", {}).get("parts", [])
            if not content_parts:
                return None

            text_output = content_parts[0].get("text", "").strip()
            if not text_output:
                return None

            # Remove possible markdown code block wrappers
            if text_output.startswith("```json"):
                text_output = text_output[7:]
            if text_output.startswith("```"):
                text_output = text_output[3:]
            if text_output.endswith("```"):
                text_output = text_output[:-3]

            parsed = json.loads(text_output.strip())
            if isinstance(parsed, dict):
                return parsed
            return None

        except httpx.TimeoutException:
            logger.warning("Gemini API request timed out after %.1fs; falling back to local logic.", self.timeout)
            return None
        except Exception as exc:
            logger.warning("Gemini API request failed (%s); falling back to local logic.", exc.__class__.__name__)
            return None


gemini_service = GeminiService()
