"""Deterministic, privacy-safe local clinical analyzer.

Serves as the guaranteed offline fallback and primary rule engine for /api/analyze.
Strictly non-diagnostic, explainable, and zero-telemetry.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List, Tuple
from ..schemas.analyze import AnalyzeResponse

DISCLAIMER = "This is information, not a diagnosis."

# Multilingual pattern definitions for symptom extraction
SYMPTOM_PATTERNS: List[Dict[str, Any]] = [
    {
        "id": "irregular_periods",
        "name": "Irregular or infrequent periods",
        "patterns": [
            r"\b(irregular|infrequent|missed|late|skipped|unpredictable|delay(?:ed)?)\s+(periods?|menstrual cycles?|cycles?|menses)\b",
            r"\b(periods?|cycles?)\s+(?:come\s+|arrive\s+|are\s+)?(?:every\s+)?(?:2[\s–-]3|two[\s–-]three|\d+)\s+months?\b",
            r"\b(periods?|cycles?)\b.{0,45}\b(irregular|infrequent|late|unpredictable)\b",
            r"\b(no\s+period|period.{0,20}(?:three|3|two|2|several)\s+months?)\b",
            r"अनियमित|महीनों से पीरियड|पीरियड नहीं|माहवारी में देरी|मासिक धर्म",
            r"ಅನಿಯಮಿತ|ಮುಟ್ಟು.*ತಡ|ಋತುಚಕ್ರ.*ಆಲಸ್ಯ|ತಿಂಗಳು.*ಬರಲಿಲ್ಲ",
            r"ஒழுங்கற்ற|மாதவிடாய்.*தாமதம்|மாதவிடாய்.*வரவில்லை",
            r"ക്രമരഹിതമായ|ആർത്തവം.*വൈക|മാസമുറ.*തടസ്സം",
        ],
        "category": "Cycle",
        "severity": "Moderate",
    },
    {
        "id": "acne",
        "name": "Acne and skin breakouts",
        "patterns": [
            r"\b(acne|pimples?|breakouts?|zits|cystic acne)\b",
            r"मुंहासे|कील-मुंहासे|दाने|चेहरे के दाने",
            r"ಮೊಡವೆಗಳು|ಮುಖದಲ್ಲಿ ಮೊಡವೆ",
            r"பருக்கள்|முகப்பரு",
            r"മുഖക്കുരു|കുരുക്കൾ",
        ],
        "category": "Dermatological",
        "severity": "Moderate",
    },
    {
        "id": "hirsutism",
        "name": "Increased facial or body hair (Hirsutism)",
        "patterns": [
            r"\b(increased|extra|excess|more|unwanted)\s+(?:facial|body|face|chin|jawline)\s+hair\b",
            r"\b(facial\s+hair|hair\s+growth\s+(?:on|around)\s+(?:my\s+)?(?:face|chin|jawline|chest))\b",
            r"\b(hirsutism)\b",
            r"चेहरे पर बाल|अनचाहे बाल|दाढ़ी पर बाल",
            r"ಮುಖದ ಮೇಲೆ ಕೂದಲು|ಅನಗತ್ಯ ಕೂದಲು",
            r"முகத்தில் முடி|தேவையற்ற முடி வளர்ச்சி",
            r"മുഖത്തെ രോമം|താടിയിൽ രോമം",
        ],
        "category": "Hormonal",
        "severity": "Moderate",
    },
    {
        "id": "severe_pain",
        "name": "Severe pelvic or menstrual pain (Dysmenorrhea)",
        "patterns": [
            r"\b(severe|intense|unbearable|excruciating|terrible|sharp)\s+(pain|cramps?|pelvic pain|belly pain)\b",
            r"\b(pain|cramps?)\s+(?:is|are)\s+(?:very\s+)?(severe|unbearable|intense)\b",
            r"बहुत तेज़ दर्द|असहनीय दर्द|पेट में भीषण दर्द|ऐंठन",
            r"ತೀವ್ರವಾದ ನೋವು|ಅಸಹನೀಯ ನೋವು|ಹೊಟ್ಟೆ ನೋವು",
            r"கடுமையான வலி|தாங்க முடியாத வலி|வயிற்று வலி",
            r"അതികഠിനമായ വേദന|സഹിക്കാനാവാത്ത വേദന",
        ],
        "category": "Pain",
        "severity": "Severe",
        "is_red_flag": True,
    },
    {
        "id": "heavy_bleeding",
        "name": "Very heavy menstrual bleeding (Menorrhagia)",
        "patterns": [
            r"\b(very heavy|heavy|excessive|soaking|flooding)\s+(?:vaginal\s+|menstrual\s+)?bleeding\b",
            r"\b(bleeding|periods?)\s+(?:is|are)\s+(?:very\s+)?heavy\b",
            r"\b(soaking|soak(?:ing)? through)\s+(?:a\s+)?(?:pad|tampon)s?\b",
            r"बहुत ज़्यादा खून|भारी रक्तस्राव|ब्लीडिंग बहुत तेज़",
            r"ಅಧಿಕ ರಕ್ತಸ್ರಾವ|ವಿಪರೀತ ರಕ್ತಸ್ರಾವ",
            r"அதிக உதிரப்போக்கு|அதிக ரத்தப்போக்கு",
            r"അമിത രക്തസ്രാവം|കനത്ത ബ്ലീഡിങ്",
        ],
        "category": "Menstrual",
        "severity": "Severe",
        "is_red_flag": True,
    },
    {
        "id": "weight_changes",
        "name": "Weight changes or difficulty losing weight",
        "patterns": [
            r"\b(weight\s+gain|gained\s+weight|trouble\s+losing\s+weight|unexplained\s+weight|weight\s+changes?)\b",
            r"वजन बढ़|वज़न में बदलाव|मोटापा बढ़ रहा",
            r"ತೂಕ ಹೆಚ್ಚಳ|ತೂಕ ಏರಿಕೆ",
            r"எடை அதிகரிப்பு|உடல் எடை கூடுதல்",
            r"ശരീരഭാരം കൂടുക|തടി കൂടുന്നു",
        ],
        "category": "Metabolic",
        "severity": "Moderate",
    },
    {
        "id": "hair_thinning",
        "name": "Scalp hair thinning or hair loss",
        "patterns": [
            r"\b(hair\s+thinning|thinning\s+hair|hair\s+loss|hair\s+fall|bald\s+spots?)\b",
            r"बाल झड़ना|बाल पतले होना|गंजापन",
            r"ಕೂದಲು ಉದುರುವುದು|ಕೂದಲು ತೆಳುವಾಗುವುದು",
            r"முடி உதிர்தல்|முடி கொட்டுதல்",
            r"മുടി കൊഴിച്ചിൽ|മുടി നേർത്തുപോകുന്നത്",
        ],
        "category": "Dermatological",
        "severity": "Mild",
    },
    {
        "id": "pelvic_discomfort",
        "name": "Pelvic discomfort or fullness",
        "patterns": [
            r"\b(pelvic|lower\s+abdominal|lower\s+belly)\s+(?:discomfort|cramps?|ache|pressure|fullness)\b",
            r"पेट के निचले हिस्से में दर्द|पेल्विक में भारीपन",
            r"ಕಿಬ್ಬೊಟ್ಟೆ ನೋವು|ಕಟಿ ಭಾಗದಲ್ಲಿ ಭಾರ",
            r"அடிவயிற்று வலி|இடுப்பு வலி",
            r"അടിവയറ്റിലെ വേദന|പെൽവിക് അസ്വസ്ഥത",
        ],
        "category": "Pain",
        "severity": "Mild",
    },
    {
        "id": "dizziness_fainting",
        "name": "Dizziness, lightheadedness, or feeling faint",
        "patterns": [
            r"\b(dizz(?:y|iness)|lightheaded(?:ness)?|faint(?:ed|ing)?|blackout|passed\s+out)\b",
            r"चक्कर आना|बेहोशी|सिर घूमना",
            r"ತಲೆ ತಿರುಗುವುದು|ಮೂರ್ಛೆ",
            r"தலைச்சுற்றல்|மயக்கம்",
            r"തലകറക്കം|ബോധക്ഷയം",
        ],
        "category": "Vital",
        "severity": "Severe",
        "is_red_flag": True,
    },
    {
        "id": "pregnancy_warning",
        "name": "Possible pregnancy warning signs",
        "patterns": [
            r"\b(pregnan(?:t|cy)|might be pregnant|possible pregnancy)\b.{0,70}\b(bleeding|spotting|pain|cramps?|dizz(?:y|iness)|faint(?:ed|ing)?)\b",
            r"\b(bleeding|spotting|pain|cramps?|dizz(?:y|iness)|faint(?:ed|ing)?)\b.{0,70}\b(pregnan(?:t|cy)|might be pregnant|possible pregnancy)\b",
        ],
        "category": "Obstetric",
        "severity": "Severe",
        "is_red_flag": True,
    },
]

RED_FLAG_COMBINATIONS = [
    {
        "test": lambda text: bool(re.search(r"\b(fever|high temperature|chills)\b", text, re.I) and re.search(r"\b(pelvic|cramp|belly|abdominal)\s+pain\b", text, re.I)),
        "alert": "Fever accompanied by pelvic pain requires prompt clinical assessment to rule out acute infection.",
        "urgency": "urgent",
    },
    {
        "test": lambda text: bool(re.search(r"\b(faint|dizz|lightheaded|blackout|passed out)\b", text, re.I) and re.search(r"\b(bleeding|heavy flow|blood)\b", text, re.I)),
        "alert": "Fainting or severe dizziness while experiencing menstrual bleeding warrants immediate medical attention.",
        "urgency": "urgent",
    },
    {
        "test": lambda text: bool(re.search(r"\b(soaking|flood(?:ing)?|changing pad every hour)\b", text, re.I)),
        "alert": "Extremely heavy menstrual flow (soaking through a pad or tampon hourly) requires urgent clinical evaluation.",
        "urgency": "urgent",
    },
    {
        "test": lambda text: bool(re.search(r"\b(pregnant|possible pregnancy)\b", text, re.I) and re.search(r"\b(bleeding|severe pain|cramp)\b", text, re.I)),
        "alert": "Pain or bleeding with suspected pregnancy requires immediate emergency evaluation.",
        "urgency": "emergency",
    },
    {
        "test": lambda text: bool(re.search(r"\b(sudden|excruciating|unbearable)\s+(pelvic|abdominal)\s+pain\b", text, re.I)),
        "alert": "Sudden or severe pelvic pain requires urgent in-person medical care.",
        "urgency": "urgent",
    },
]


def detect_language(text: str, default_lang: str = "en") -> str:
    """Simple script-based language detector for supported Indian languages."""
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"  # Devanagari / Hindi
    if re.search(r"[\u0C80-\u0CFF]", text):
        return "kn"  # Kannada
    if re.search(r"[\u0B80-\u0BFF]", text):
        return "ta"  # Tamil
    if re.search(r"[\u0D00-\u0D7F]", text):
        return "ml"  # Malayalam
    return default_lang or "en"


def local_analyze(
    text: str,
    language: str = "en",
    age: int | None = None,
    follow_up_answers: dict[str, Any] | None = None,
) -> AnalyzeResponse:
    """Execute deterministic local clinical extraction, follow-up generation, and suggestion synthesis."""
    detected_lang = detect_language(text, default_lang=language)
    detected_symptoms: List[str] = []
    red_flags: List[str] = []
    has_irregular_cycle = False
    has_androgenic = False
    has_metabolic = False

    # 1. Match symptoms against dictionary patterns
    for sym_def in SYMPTOM_PATTERNS:
        matched = False
        for pattern in sym_def["patterns"]:
            if re.search(pattern, text, re.IGNORECASE):
                matched = True
                break

        if matched:
            detected_symptoms.append(sym_def["name"])
            if sym_def.get("is_red_flag"):
                red_flags.append(f"{sym_def['name']}: Warrants medical review.")
            if sym_def["id"] == "irregular_periods":
                has_irregular_cycle = True
            if sym_def["id"] in ("acne", "hirsutism", "hair_thinning"):
                has_androgenic = True
            if sym_def["id"] == "weight_changes":
                has_metabolic = True

    # 2. Check clinical red flag combinations
    urgency = "routine"
    for rfc in RED_FLAG_COMBINATIONS:
        if rfc["test"](text):
            red_flags.append(rfc["alert"])
            if rfc["urgency"] == "emergency":
                urgency = "emergency"
            elif urgency != "emergency":
                urgency = "urgent"

    # If no symptoms were specifically matched by regex but user wrote something
    if not detected_symptoms:
        detected_symptoms = ["Reported cycle/wellness observation"]

    # Deduplicate red flags
    red_flags = list(dict.fromkeys(red_flags))

    # Determine urgency level if not already emergency or urgent
    if urgency not in ("emergency", "urgent"):
        if len(detected_symptoms) >= 2 or has_irregular_cycle:
            urgency = "soon"
        else:
            urgency = "routine"

    # Determine recommended specialist
    if has_irregular_cycle and has_androgenic:
        recommended_specialist = "gynecologist"
    elif has_metabolic:
        recommended_specialist = "endocrinologist"
    else:
        recommended_specialist = "gynecologist"

    # Possible relation explanation
    if has_irregular_cycle and has_androgenic:
        possible_relation = (
            "The combination of infrequent/irregular cycles and skin or hair changes (such as acne or hirsutism) "
            "is commonly seen in hormonal imbalances such as Polycystic Ovary Syndrome (PCOS). "
            "However, these symptoms can also arise from thyroid changes, stress, or other endocrine factors."
        )
    elif has_irregular_cycle:
        possible_relation = (
            "Menstrual cycles that arrive every 2 to 3 months (longer than the standard 21–35 day interval) "
            "indicate an oligomenorrhea pattern. This can occur with ovulatory delays, hormonal shifts, or metabolic factors."
        )
    elif has_androgenic:
        possible_relation = (
            "Skin breakouts and unwanted facial or body hair can be related to androgen sensitivity or hormonal fluctuations."
        )
    else:
        possible_relation = (
            "These symptoms can reflect normal cycle variations or hormonal shifts. "
            "Tracking your observations helps provide clear context for your doctor."
        )

    # Targeted clinician questions
    questions_for_doctor = [
        "What clinical evaluations (such as pelvic ultrasound or hormone blood tests) are recommended for my cycle pattern?",
        "Could my symptoms be linked to PCOS, thyroid function, or another underlying hormonal balance?",
        "What symptom diary parameters would be most helpful to track before our next consultation?",
    ]
    if has_metabolic or (age and age < 25):
        questions_for_doctor.append("Would evaluating metabolic markers (like Fasting Glucose and Fasting Insulin) be appropriate?")

    # Safe, non-prescriptive lifestyle guidance
    self_care_tips = [
        "Focus on balanced, nutrient-dense meals containing fiber, healthy fats, and protein to support steady blood sugar.",
        "Aim for 7 to 9 hours of restful sleep each night to help regulate cortisol and reproductive hormones.",
        "Engage in regular, enjoyable movement such as brisk walking, swimming, or strength training.",
        "Maintain a daily cycle and symptom log to share with your healthcare provider.",
    ]

    # Generate structured follow-up questions to clarify context
    follow_up_questions: List[Dict[str, Any]] = []
    if has_irregular_cycle or (not has_androgenic and not has_metabolic):
        follow_up_questions.append({
            "id": "cycle_duration",
            "title": "Duration of Irregularity",
            "question": "How long have your menstrual cycles been irregular, delayed, or unpredictable?",
            "hint": "Helps determine whether this is a recent temporary shift or a recurring pattern.",
            "allow_multiple": False,
            "options": [
                {"id": "under_2m", "label": "Recent (Last 1–2 months)"},
                {"id": "3_to_6m", "label": "3 to 6 months"},
                {"id": "over_6m", "label": "Over 6 months / 1+ year"},
                {"id": "since_puberty", "label": "Irregular since my teenage years"},
            ],
        })
        follow_up_questions.append({
            "id": "cycle_gap",
            "title": "Typical Cycle Length",
            "question": "What is the typical gap between your periods?",
            "hint": "A normal menstrual cycle length is usually between 21 and 35 days.",
            "allow_multiple": False,
            "options": [
                {"id": "gap_normal", "label": "21 to 35 days (Regular range)"},
                {"id": "gap_long", "label": "36 to 50 days (Longer cycles)"},
                {"id": "gap_very_long", "label": "More than 50–60 days or skips completely"},
                {"id": "gap_random", "label": "Completely unpredictable / random"},
            ],
        })

    if has_androgenic or has_irregular_cycle:
        follow_up_questions.append({
            "id": "androgen_signs",
            "title": "Skin & Hair Changes",
            "question": "Have you noticed any of these skin or hair changes recently?",
            "hint": "Clinicians evaluate androgen sensitivity under Rotterdam guidelines.",
            "allow_multiple": True,
            "options": [
                {"id": "jawline_acne", "label": "Deep or cystic acne along jawline & chin"},
                {"id": "facial_hair", "label": "Coarse dark hair on chin, upper lip, or abdomen"},
                {"id": "hair_thinning", "label": "Hair thinning or shedding on scalp"},
                {"id": "dark_patches", "label": "Dark, velvety skin patches on neck/underarms"},
                {"id": "no_skin_hair", "label": "None of these apply to me"},
            ],
        })

    # If user provided follow-up answers, synthesize tailored suggestions
    synthesized_suggestions = None
    if follow_up_answers:
        answered_notes = []
        cycle_dur = follow_up_answers.get("cycle_duration")
        if cycle_dur == "3_to_6m":
            answered_notes.append("Cycle delays lasting 3 to 6 months")
            questions_for_doctor.insert(0, "My cycles have been delayed for 3 to 6 months. Would you recommend a pelvic ultrasound to check ovarian morphology?")
        elif cycle_dur == "over_6m":
            answered_notes.append("Cycle delays lasting over 6 months")
            questions_for_doctor.insert(0, "My cycles have exceeded 45–60 days for over 6 months. Could we evaluate baseline reproductive hormone levels (LH, FSH, Estradiol)?")

        androgen_ans = follow_up_answers.get("androgen_signs")
        if isinstance(androgen_ans, list) and any(a in ("jawline_acne", "facial_hair", "hair_thinning") for a in androgen_ans):
            answered_notes.append("Co-occurring androgenic skin/hair changes")
            questions_for_doctor.append("Because I have noticeable skin/hair changes, could we check Total and Free Testosterone and DHEA-S?")
            self_care_tips.insert(0, "Use gentle, non-comedogenic skincare and avoid aggressive scrubbing that disrupts inflamed skin barriers.")

        synthesized_suggestions = {
            "summary": f"Based on your input and follow-up answers ({'; '.join(answered_notes) if answered_notes else 'provided'}), we tailored your clinical questions and lifestyle tips.",
            "answered_count": len([k for k, v in follow_up_answers.items() if v]),
        }

    return AnalyzeResponse(
        detected_language=detected_lang,
        symptoms=detected_symptoms,
        possible_relation=possible_relation,
        urgency=urgency,
        red_flags=red_flags,
        recommended_specialist=recommended_specialist,
        questions_for_doctor=questions_for_doctor,
        self_care_tips=self_care_tips,
        disclaimer=DISCLAIMER,
        reply_text=possible_relation,
        follow_up_questions=follow_up_questions[:3],
        synthesized_suggestions=synthesized_suggestions,
    )
