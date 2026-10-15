"""Deterministic urgent symptom screening that works without an AI service."""
from __future__ import annotations

import re
from collections.abc import Mapping, Sequence
from typing import Any


_DEFINITIONS: tuple[dict[str, Any], ...] = (
    {
        "id": "heavy_bleeding",
        "title": "Heavy bleeding may need urgent attention",
        "message": "Please seek urgent medical care.",
        "patterns": (
            r"\b(?:soak(?:s|ed|ing)?|saturat(?:e|es|ed|ing))\s+(?:through\s+)?(?:a|one|1)\s+(?:sanitary\s+)?pad\s+(?:every|per)\s+(?:single\s+)?hour\b",
            r"\bbleed(?:ing)?\s+through\s+(?:my\s+)?(?:clothes|clothing)\b.{0,35}\b(?:repeatedly|over\s+and\s+over|again\s+and\s+again|multiple\s+times)\b|\b(?:repeatedly|over\s+and\s+over|again\s+and\s+again)\b.{0,35}\bbleed(?:ing)?\s+through\s+(?:my\s+)?(?:clothes|clothing)\b",
            r"\bvery\s+large\s+(?:blood\s+)?clots?\b.{0,60}\bweak(?:ness|ening|ens)?\b|\bweak(?:ness|ening|ens)?\b.{0,60}\bvery\s+large\s+(?:blood\s+)?clots?\b",
        ),
    },
    {
        "id": "severe_pain",
        "title": "Severe pain may need urgent attention",
        "message": "Please seek urgent medical care.",
        "patterns": (
            r"\bunbearable\s+(?:(?:pelvic|abdominal|stomach)\s+)?pain\b|\bpain\b.{0,25}\bunbearable\b",
            r"\bsudden(?:ly)?\s+(?:and\s+)?severe\s+(?:pelvic\s+)?pain\b|\bsudden(?:ly)?\s+severe\s+pain\s+(?:in|around)\s+(?:my\s+)?pelvis\b",
            r"\bpain\b.{0,80}\b(?:prevent(?:s|ing)?|stops?|unable\s+to|cannot|can't)\s+(?:me\s+)?(?:from\s+)?(?:moving|move|walking|walk|normal\s+movement)\b|\b(?:unable|can't|cannot)\s+(?:to\s+)?(?:move|walk)\b.{0,50}\b(?:because\s+of|from|due\s+to)\s+(?:the\s+)?pain\b",
        ),
    },
    {
        "id": "fainting_weakness",
        "title": "Fainting or serious weakness may need urgent attention",
        "message": "Please seek urgent medical care.",
        "patterns": (
            r"\b(?:faint(?:ed|ing)?|passed\s+out|black(?:ed)?\s+out|nearly\s+faint(?:ed|ing)?|almost\s+faint(?:ed|ing)?)\b",
            r"\bsevere\s+dizz(?:y|iness)\b|\b(?:confus(?:ed|ion)|disoriented)\b",
            r"\b(?:severe|serious|extreme)\s+weakness\b|\b(?:very|extremely)\s+weak\b",
        ),
    },
    {
        "id": "other_urgent_concern",
        "title": "A symptom may need urgent attention",
        "message": "Please seek urgent medical care now. If you are in immediate danger, contact local emergency services or a trusted person now.",
        "patterns": (
            r"\bchest\s+pain\b",
            r"\b(?:trouble|difficulty)\s+breathing\b|\b(?:can't|cannot|unable\s+to)\s+breathe\b|\bshortness\s+of\s+breath\b",
            r"\b(?:sudden|suddenly)\s+(?:complete\s+)?vision\s+loss\b|\b(?:suddenly\s+)?lost\s+(?:all\s+)?(?:my\s+)?vision\b|\bsudden\s+blindness\b",
            r"\bsudden(?:ly)?\s+severe\s+headache\b",
            r"\b(?:self[- ]harm|suicidal|suicide|hurt\s+myself|harm\s+myself|kill\s+myself|end\s+my\s+life|want\s+to\s+die|wish\s+i\s+were\s+dead)\b",
            r"\b(?:in\s+)?immediate\s+danger\b|\bin\s+danger\b|\b(?:not\s+safe|unsafe)\s+right\s+now\b|\b(?:don't|do\s+not)\s+feel\s+safe\b|\bfeel(?:ing)?\s+unsafe\b|\bsomeone\s+(?:is\s+)?(?:threatening|trying\s+to\s+hurt)\s+me\b",
        ),
    },
)
_PREGNANCY = r"\b(?:possible\s+pregnancy|possibly\s+pregnant|might\s+be\s+pregnant|may\s+be\s+pregnant|could\s+be\s+pregnant|pregnan(?:t|cy))\b"
_PREGNANCY_SYMPTOMS = (
    r"\b(?:heavy\s+)?bleeding\b|\bspotting\b",
    r"\b(?:sudden(?:ly)?\s+)?severe\s+(?:pelvic\s+)?pain\b|\bunbearable\s+(?:pelvic\s+)?pain\b",
    r"\b(?:faint(?:ed|ing)?|passed\s+out|severe\s+dizz(?:y|iness)|dizz(?:y|iness))\b",
)
_NEGATION = re.compile(
    r"\b(?:no|not|never|without|denies|denied|don't|do\s+not|isn't|aren't)(?:\s+\w+){0,3}\s*$",
    re.IGNORECASE,
)


def _strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, Mapping):
        return [item for child in value.values() for item in _strings(child)]
    if isinstance(value, Sequence) and not isinstance(value, (bytes, bytearray)):
        return [item for child in value for item in _strings(child)]
    return []


def _is_negated(text: str, index: int) -> bool:
    return bool(_NEGATION.search(text[max(0, index - 45):index]))


def _matches(text: str, patterns: Sequence[str]) -> list[str]:
    found: list[str] = []
    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            if not _is_negated(text, match.start()):
                found.append(match.group(0).strip())
    return list(dict.fromkeys(found))


def _pregnancy_terms(text: str) -> list[str]:
    pregnancy_locations = [
        match.start()
        for match in re.finditer(_PREGNANCY, text, re.IGNORECASE)
        if not _is_negated(text, match.start())
    ]
    if not pregnancy_locations:
        return []
    terms = [
        (match.start(), match.group(0).strip())
        for pattern in _PREGNANCY_SYMPTOMS
        for match in re.finditer(pattern, text, re.IGNORECASE)
        if not _is_negated(text, match.start())
    ]
    return list(dict.fromkeys(
        term for location, term in terms
        if any(abs(location - pregnancy_index) <= 120 for pregnancy_index in pregnancy_locations)
    ))


def detect_red_flags(value: Any) -> list[dict[str, Any]]:
    """Return urgent warnings in stable priority order for text or structured data."""
    text = re.sub(r"\s+", " ", " ".join(_strings(value))).strip()
    if not text:
        return []

    warnings = []
    for definition in _DEFINITIONS:
        terms = _matches(text, definition["patterns"])
        if terms:
            warnings.append({
                "id": definition["id"],
                "severity": "urgent",
                "title": definition["title"],
                "message": definition["message"],
                "matchedTerms": terms,
            })

    terms = _pregnancy_terms(text)
    if terms:
        warnings.append({
            "id": "pregnancy_concern",
            "severity": "urgent",
            "title": "Pregnancy-related symptoms may need urgent attention",
            "message": "Please seek urgent medical care now.",
            "matchedTerms": terms,
        })
    return warnings
