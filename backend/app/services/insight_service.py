"""Safe orchestration for optional AI-assisted SakhiCare insights."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Callable

from .ai_client import AIClient
from ..safety.output_validator import DISCLAIMER, validate_output
from ..safety.red_flags import detect_red_flags

ALLOWED_URGENCY = {"routine", "soon", "urgent"}
REQUIRED_FIELDS = {"id", "title", "message", "evidence", "urgency", "suggestedAction", "relatedEntryIds"}


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
    if not isinstance(cleaned["relatedEntryIds"], list) or not all(isinstance(item, str) for item in cleaned["relatedEntryIds"]):
        return None
    cleaned = validate_output(cleaned)
    if cleaned is None:
        return None
    cleaned.update({
        "source": "ai_assisted",
        "dismissed": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "whyItAppeared": "AI-assisted insight based only on the cycle and symptom summary you approved.",
        "education": DISCLAIMER,
    })
    return cleaned


def _red_flag_insights(period_logs: list[dict[str, Any]], symptom_logs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Create visible insight cards from deterministic checks before any AI call."""
    warnings = detect_red_flags({"period_logs": period_logs, "symptom_logs": symptom_logs})
    return [{
        "id": warning["id"],
        "title": warning["title"],
        "message": warning["message"],
        "evidence": warning["matchedTerms"],
        "urgency": "urgent",
        "suggestedAction": warning["message"],
        "relatedEntryIds": [],
        "source": "rule_based",
        "dismissed": False,
        "whyItAppeared": "A deterministic urgent-symptom safety rule matched the note.",
        "education": DISCLAIMER,
        "disclaimer": DISCLAIMER,
    } for warning in warnings]


def personalized_insights(period_logs: list[dict[str, Any]], symptom_logs: list[dict[str, Any]], *, consent: bool,
                          local_rule_builder: Callable[[], list[dict[str, Any]]], ai_client: AIClient | None = None) -> list[dict[str, Any]]:
    """Use local rules by default; safely enrich them only after consent.

    Any unavailable service, timeout, parse error, or unsafe AI response falls back
    to local rules without interrupting the user flow. Raw prompts are never saved.
    """
    # Inspect local symptom data first, independent of AI availability or consent.
    urgent_insights = _red_flag_insights(period_logs, symptom_logs)
    local_insights = [
        safe for item in local_rule_builder()
        if (safe := validate_output(item)) is not None
    ]
    if not consent or not ai_client:
        return urgent_insights + local_insights
    try:
        candidates = ai_client.generate_structured_insights(minimum_necessary_context(period_logs, symptom_logs), consent=True)
        valid = [insight for item in candidates if (insight := validate_ai_insight(item))]
        # Urgent local safety findings remain first and are never displaced by AI output.
        return urgent_insights + local_insights + [item for item in valid if item["id"] not in {local["id"] for local in local_insights + urgent_insights}]
    except Exception:
        # An AI transport or parsing failure must never hide deterministic warnings.
        return urgent_insights + local_insights
