"""Opt-in AI transport for SakhiCare insights.

The client is deliberately small: consent is mandatory, only a sanitized structured
summary is transmitted, requests time out, and neither prompts nor responses are
persisted or logged here.
"""
from __future__ import annotations

import json
from typing import Any, Callable
from urllib.request import Request, urlopen


class ConsentRequiredError(ValueError):
    """Raised when code tries to send health information without explicit consent."""


class AIClient:
    def __init__(self, endpoint: str | None = None, api_key: str | None = None, timeout_seconds: float = 8.0,
                 transport: Callable[[dict[str, Any], float], dict[str, Any]] | None = None) -> None:
        self.endpoint = endpoint
        self.api_key = api_key
        self.timeout_seconds = timeout_seconds
        self.transport = transport

    def generate_structured_insights(self, minimum_necessary_context: dict[str, Any], *, consent: bool) -> list[dict[str, Any]]:
        if not consent:
            raise ConsentRequiredError("Explicit consent is required before sending health information to an AI service.")
        if not self.endpoint and not self.transport:
            raise RuntimeError("No AI endpoint is configured.")

        payload = {
            "task": "Return safe, educational health-pattern insights as JSON only.",
            "rules": [
                "Never diagnose or state certainty.",
                "Never recommend medication or dosages.",
                "Use only the supplied cycle and symptom summaries.",
                "Return an object with an insights array.",
            ],
            "context": minimum_necessary_context,
        }
        if self.transport:
            response = self.transport(payload, self.timeout_seconds)
        else:
            data = json.dumps(payload).encode("utf-8")
            request = Request(self.endpoint, data=data, headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {self.api_key}",
            }, method="POST")
            with urlopen(request, timeout=self.timeout_seconds) as http_response:  # nosec B310: explicit configured endpoint
                response = json.loads(http_response.read().decode("utf-8"))

        if isinstance(response, dict) and isinstance(response.get("insights"), list):
            return response["insights"]
        # Common chat-completions shape; still require JSON content.
        content = response.get("choices", [{}])[0].get("message", {}).get("content") if isinstance(response, dict) else None
        if isinstance(content, str):
            parsed = json.loads(content)
            return parsed.get("insights", []) if isinstance(parsed, dict) else []
        return []
