import unittest
from types import SimpleNamespace

try:
    from backend.app.safety.output_validator import DISCLAIMER, validate_output
    from backend.app.safety.red_flags import detect_red_flags
    from backend.app.services.insight_service import personalized_insights, validate_ai_insight
except ImportError:
    from app.safety.output_validator import DISCLAIMER, validate_output
    from app.safety.red_flags import detect_red_flags
    from app.services.insight_service import personalized_insights, validate_ai_insight



class RedFlagTests(unittest.TestCase):
    def test_heavy_bleeding_is_detected_without_ai(self):
        warnings = detect_red_flags({"note": "I am soaking a pad every hour."})
        self.assertEqual(warnings[0]["id"], "heavy_bleeding")
        self.assertEqual(warnings[0]["severity"], "urgent")
        self.assertIn("matchedTerms", warnings[0])

    def test_severe_weakness_is_detected(self):
        self.assertIn("fainting_weakness", [warning["id"] for warning in detect_red_flags("I have severe weakness.")])

    def test_pregnancy_and_bleeding_is_detected(self):
        self.assertIn("pregnancy_concern", [warning["id"] for warning in detect_red_flags("Possible pregnancy with bleeding.")])

    def test_negated_symptoms_do_not_trigger(self):
        self.assertEqual(detect_red_flags("I have no chest pain."), [])

    def test_safe_responses_receive_the_required_disclaimer(self):
        result = validate_output({"message": "Please contact a health professional."})
        self.assertEqual(result["disclaimer"], DISCLAIMER)
        self.assertIn(DISCLAIMER, result["message"])


class OutputValidationTests(unittest.TestCase):
    def test_ai_diagnosis_is_rejected(self):
        self.assertIsNone(validate_ai_insight({
            "id": "unsafe", "title": "Pattern", "message": "You have anemia.",
            "evidence": [], "urgency": "routine", "suggestedAction": "Talk to a clinician.",
            "relatedEntryIds": [],
        }))

    def test_cure_promises_are_rejected(self):
        self.assertIsNone(validate_output("This is a guaranteed cure."))

    def test_unsafe_model_insight_is_not_returned(self):
        bad_response = [{
            "id": "unsafe", "title": "Pattern", "message": "You have PCOS.",
            "evidence": [], "urgency": "routine", "suggestedAction": "Talk to a clinician.",
            "relatedEntryIds": [],
        }]
        ai_client = SimpleNamespace(generate_structured_insights=lambda context, consent: bad_response)
        local = lambda: [{
            "id": "local", "title": "Pattern", "message": "Discuss this with a clinician.",
            "evidence": [], "urgency": "routine", "suggestedAction": "Discuss with a clinician.",
            "relatedEntryIds": [],
        }]
        result = personalized_insights([], [], consent=True, local_rule_builder=local, ai_client=ai_client)
        self.assertEqual([item["id"] for item in result], ["local"])
        self.assertEqual(result[0]["disclaimer"], DISCLAIMER)

    def test_local_red_flag_is_returned_first_without_ai(self):
        local = lambda: [{
            "id": "local", "title": "Pattern", "message": "Discuss this with a clinician.",
            "evidence": [], "urgency": "routine", "suggestedAction": "Discuss with a clinician.",
            "relatedEntryIds": [],
        }]
        result = personalized_insights(
            [], [{"symptom": "Soaking a pad every hour."}],
            consent=False, local_rule_builder=local, ai_client=None,
        )
        self.assertEqual(result[0]["id"], "heavy_bleeding")
        self.assertEqual(result[1]["id"], "local")
        self.assertEqual(result[0]["disclaimer"], DISCLAIMER)

    def test_malformed_ai_response_falls_back_to_local_safety_results(self):
        ai_client = SimpleNamespace(generate_structured_insights=lambda context, consent: None)
        local = lambda: [{
            "id": "local", "title": "Pattern", "message": "Discuss this with a clinician.",
            "evidence": [], "urgency": "routine", "suggestedAction": "Discuss with a clinician.",
            "relatedEntryIds": [],
        }]
        result = personalized_insights([], [], consent=True, local_rule_builder=local, ai_client=ai_client)
        self.assertEqual([item["id"] for item in result], ["local"])


if __name__ == "__main__":
    unittest.main()
