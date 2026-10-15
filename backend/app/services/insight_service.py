"""Safe orchestration for optional AI-assisted SakhiCare insights."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Callable

from .ai_client import AIClient, ConsentRequiredError

ALLOWED_URGENCY = {"routine", "soon", "urgent"}
REQUIRED_FIELDS = {"id", "title", "message", "evidence", "urgency", "suggestedAction", "relatedEntryIds"}
UNSAFE_LANGUAGE = ("diagnos", "you have pcos", "take ", " mg", "medication", "prescription", "dosage")


def minimum_necessary_context(period_logs: list[dict[str, Any]], symptom_logs: list[dict[str, Any]]) -> dict[str, Any]:
    """Strip direct identifiers and free-form unrelated fields before any AI call."""
    return {
        "cycle_lengths_days": [log.get("cycleLengthDays") for log in period_logs if isinstance(log.get("cycleLengthDays"), int)],
        "symptoms": [{
            "label": str(log.get("symptom", ""))[:80],
            "date": str(log.get("date", ""))[:10],
            "severity": str(log.get("severity", ""))[:12],
        } for log in symptom_logs],
    }


def validate_ai_insight(value: Any) -> dict[str, Any] | None:
    if not isinstance(value, dict) or not REQUIRED_FIELDS.issubset(value):
        return None
    if value.get("urgency") not in ALLOWED_URGENCY or not isinstance(value.get("evidence"), list):
        return None
    if not all(isinstance(item, str) and len(item) <= 220 for item in value["evidence"]):
        return None
    cleaned = {field: value[field] for field in REQUIRED_FIELDS}
    if not all(isinstance(cleaned[field], str) for field in ("id", "title", "message", "suggestedAction")):
        return None
    combined = " ".join([cleaned["title"], cleaned["message"], cleaned["suggestedAction"], *cleaned["evidence"]]).lower()
    if any(term in combined for term in UNSAFE_LANGUAGE):
        return None
    if not isinstance(cleaned["relatedEntryIds"], list) or not all(isinstance(item, str) for item in cleaned["relatedEntryIds"]):
        return None
    cleaned.update({
        "source": "ai_assisted",
        "dismissed": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "whyItAppeared": "AI-assisted insight based only on the cycle and symptom summary you approved.",
        "education": "This is information, not a diagnosis.",
    })
    return cleaned


def personalized_insights(period_logs: list[dict[str, Any]], symptom_logs: list[dict[str, Any]], *, consent: bool,
                          local_rule_builder: Callable[[], list[dict[str, Any]]], ai_client: AIClient | None = None) -> list[dict[str, Any]]:
    """Use local rules by default; safely enrich them only after consent.

    Any unavailable service, timeout, parse error, or unsafe AI response falls back
    to local rules without interrupting the user flow. Raw prompts are never saved.
    """
    local_insights = local_rule_builder()
    if not consent or not ai_client:
        return local_insights
    try:
        candidates = ai_client.generate_structured_insights(minimum_necessary_context(period_logs, symptom_logs), consent=True)
        valid = [insight for item in candidates if (insight := validate_ai_insight(item))]
        # Urgent local safety findings remain first and are never displaced by AI output.
        return local_insights + [item for item in valid if item["id"] not in {local["id"] for local in local_insights}]
    except (ConsentRequiredError, TimeoutError, ValueError, OSError, KeyError):
        return local_insights
