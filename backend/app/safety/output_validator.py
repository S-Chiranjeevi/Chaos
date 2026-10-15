"""Block unsafe generated health advice and add a required non-diagnostic notice."""
from __future__ import annotations

import copy
import re
from collections.abc import Mapping, Sequence
from typing import Any

DISCLAIMER = "This is information, not a diagnosis."
UNSAFE_RULES: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("diagnosis_claim", re.compile(
        r"\b(?:you\s+)?(?:definitely\s+|probably\s+|likely\s+|may\s+|might\s+)?have\s+(?:(?:a|an)\s+)?(?:pcos|polycystic\s+ovary\s+syndrome|endometriosis|fibroids?|ovarian\s+cysts?|anemia|anaemia|hypothyroidism|hyperthyroidism|thyroid\s+disease|cancer|diabetes|asthma|infection|hypertension|depression|migraine|sti|std|hiv|a\s+condition|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b|\b(?:you\s+do\s+not|you\s+don't)\s+have\s+(?:pcos|endometriosis|fibroids?|ovarian\s+cysts?|anemia|anaemia|cancer|diabetes|asthma|infection|hypertension|depression|migraine|sti|std|hiv|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b|\b(?:you\s+are|you're|you've\s+been)\s+diagnosed\s+with\b|\bdiagnosis\s*(?:is|:|-)\s*(?!not\b|unknown\b|unclear\b|uncertain\b)[a-z]|\b(?:this|that|these\s+symptoms)\s+(?:is|are|means|mean|indicate|indicates|confirm|confirms)\s+(?:definitely\s+)?(?:pcos|polycystic\s+ovary\s+syndrome|endometriosis|fibroids?|ovarian\s+cysts?|anemia|anaemia|cancer|diabetes|asthma|infection|hypertension|depression|migraine|sti|std|hiv|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b|\b(?:your\s+)?symptoms?\s+(?:are|is)\s+(?:caused\s+by|due\s+to)\s+(?:pcos|endometriosis|fibroids?|anemia|anaemia|cancer|diabetes|asthma|infection|hypertension|depression|migraine|[a-z-]+\s+(?:syndrome|disease|disorder|condition|infection|cancer))\b",
        re.IGNORECASE,
    )),
    ("medicine_instruction", re.compile(
        r"\b(?:take|start|stop|use|increase|decrease|skip|avoid|continue|prescribe)\s+(?:(?:your|the|a|an|this)\s+)?(?:[\w-]+\s+){0,2}(?:medicine|medication|drug|pills?|tablets?|capsules?)\b|\b(?:take|start|stop|use|increase|decrease|skip|avoid|continue)\s+(?:[\w-]+\s+){0,2}(?:ibuprofen|aspirin|paracetamol|acetaminophen|metformin|hormones?|antibiotics?|painkillers?)\b|\b(?:don't|do\s+not|never|shouldn't|should\s+not)\s+(?:take|start|stop|use|increase|decrease|skip|avoid|continue)\s+(?:(?:your|the|a|an|this)\s+)?(?:[\w-]+\s+){0,2}(?:medicine|medication|drug|pills?|tablets?|capsules?|ibuprofen|aspirin|paracetamol|acetaminophen|metformin|antibiotics?)\b",
        re.IGNORECASE,
    )),
    ("dosage_instruction", re.compile(
        r"\b\d+(?:\.\d+)?\s*(?:mg|mcg|μg|g|ml|units?|tablets?|capsules?)\b|\b(?:dose|dosage)\s*(?:of\s*)?\d+(?:\.\d+)?\b|\b(?:take|use|change|adjust|increase|decrease)\s+(?:your\s+|the\s+)?(?:dose|dosage)\b",
        re.IGNORECASE,
    )),
    ("cure_promise", re.compile(
        r"\b(?:will|can|could|guarantee(?:s|d)?\s+to|promise(?:s)?\s+to)\s+(?:completely\s+)?cure\b|\b(?:will|can|could)\s+be\s+cured\b|\bguaranteed?\s+(?:to\s+)?cure\b|\bguarantees?\s+(?:a\s+)?cure\b|\b(?:this|it)\s+is\s+(?:a\s+)?(?:complete\s+)?cure\b|\bpermanent\s+cure\b|\bcures?\s+(?:pcos|endometriosis|fibroids?|any\s+condition)\b",
        re.IGNORECASE,
    )),
    ("false_reassurance", re.compile(
        r"\b(?:nothing\s+to\s+worry\s+about|no\s+cause\s+for\s+concern|you\s+(?:don't|do\s+not)\s+need\s+to\s+worry|don't\s+worry|do\s+not\s+worry|you(?:'re|\s+are)\s+(?:completely\s+)?fine|your\s+symptoms?\s+(?:are\s+(?:harmless|not\s+serious)|aren't\s+serious|aren't\s+anything\s+serious)|this\s+is\s+harmless|(?:probably|likely)\s+nothing\s+serious|definitely\s+not\s+serious|there\s+is\s+nothing\s+wrong|you\s+are\s+not\s+at\s+risk|(?:this\s+is\s+)?not\s+urgent)\b",
        re.IGNORECASE,
    )),
    ("delay_urgent_care", re.compile(
        r"\b(?:(?<!do not )(?<!don't )(?<!should not )(?<!shouldn't )(?<!never )(?:wait|waiting)\s+(?:and\s+see|until\s+(?:tomorrow|next\s+week|later)|a\s+few\s+days|for\s+(?:a\s+)?(?:routine|regular|scheduled)\s+(?:appointment|visit)|(?:to\s+)?(?:seek|get|receive|obtain)\s+(?:urgent\s+|medical\s+)?(?:care|help)|(?:a\s+day|a\s+week|several\s+days|\d+\s*(?:hours?|days?))\s+before\s+(?:seeking|getting|going\s+for|seeing)\s+(?:medical\s+)?(?:care|help|a\s+doctor|doctor|hospital)|before\s+(?:seeking|getting|going\s+for|seeing)\s+(?:medical\s+)?(?:care|help|a\s+doctor|doctor|hospital)|to\s+(?:see|visit|contact)\s+(?:a\s+)?doctor)|(?:this\s+)?(?:can|could|may)\s+wait|(?<!do not )(?<!don't )(?<!should not )(?<!shouldn't )(?<!never )delay\s+(?:seeking\s+)?(?:urgent\s+)?(?:medical\s+)?care|(?<!do not )(?<!don't )(?<!should not )(?<!shouldn't )(?<!never )put\s+off\s+(?:seeing\s+a\s+)?(?:doctor|medical\s+care)|(?:doesn't|does\s+not|no)\s+(?:need|require)\s+(?:urgent\s+|medical\s+)?(?:care|attention)|(?:don't|do\s+not|shouldn't|should\s+not|no\s+need\s+to)\s+(?:seek|get|go\s+for|visit|contact)\s+(?:urgent\s+|medical\s+)?(?:care|help|a\s+doctor|the\s+hospital)|no\s+need\s+to\s+see\s+(?:a\s+)?doctor)\b",
        re.IGNORECASE,
    )),
)


def _strings(value: Any) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, Mapping):
        return [item for child in value.values() for item in _strings(child)]
    if isinstance(value, Sequence) and not isinstance(value, (bytes, bytearray)):
        return [item for child in value for item in _strings(child)]
    return []


def unsafe_output_reasons(value: Any) -> list[str]:
    text = " ".join(_strings(value))
    return [name for name, pattern in UNSAFE_RULES if pattern.search(text)]


def _with_disclaimer(value: Any) -> Any:
    if isinstance(value, str):
        return value if DISCLAIMER in value else f"{value.strip()}\n\n{DISCLAIMER}"
    if isinstance(value, list):
        return [_with_disclaimer(item) for item in value]
    if isinstance(value, dict):
        result = copy.deepcopy(value)
        result["disclaimer"] = DISCLAIMER
        for field in ("message", "response", "text", "explanation", "education"):
            if isinstance(result.get(field), str):
                if DISCLAIMER not in result[field]:
                    result[field] = f"{result[field].strip()} {DISCLAIMER}".strip()
                break
        return result
    return {"value": value, "disclaimer": DISCLAIMER}


def validate_output(value: Any) -> Any | None:
    """Return a disclaimer-bearing safe copy, or ``None`` to block unsafe output."""
    if value is None or value == "" or value == [] or value == {}:
        return None
    if unsafe_output_reasons(value):
        return None
    return _with_disclaimer(value)
