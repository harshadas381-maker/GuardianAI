import unittest
from unittest.mock import patch

from app.services import toxicity_model


class MultilingualRoutingTests(unittest.TestCase):
    def test_romanized_marathi_is_not_misidentified_as_english(self):
        self.assertEqual(
            toxicity_model.detect_language("Mala tu khup avadtos"),
            "Marathi",
        )

    def test_common_romanized_marathi_insult_is_not_misidentified_as_english(self):
        self.assertEqual(
            toxicity_model.detect_language("tu kamjor ahes"),
            "Marathi",
        )

    def test_romanized_hindi_is_detected_as_hinglish(self):
        self.assertEqual(
            toxicity_model.detect_language("Tum mujhe bahut pasand ho"),
            "Hinglish",
        )

    def test_devanagari_marathi_detection(self):
        self.assertEqual(
            toxicity_model.detect_language("मला खूप आवडते"),
            "Marathi",
        )

    def test_devanagari_hindi_detection(self):
        self.assertEqual(
            toxicity_model.detect_language("मुझे यह बहुत अच्छा लगता है"),
            "Hindi",
        )

    def test_unknown_latin_language_does_not_default_to_english(self):
        with patch.object(toxicity_model, "detect", return_value="xx"):
            self.assertEqual(
                toxicity_model.detect_language("some unfamiliar words here"),
                "Unknown",
            )

    def test_non_english_text_is_sent_to_translation(self):
        class FakeTranslator:
            def __init__(self, source, target):
                self.source = source
                self.target = target

            def translate(self, text):
                return "You are a kind person"

        with patch.object(toxicity_model, "detect", return_value="es"), patch.object(
            toxicity_model, "GoogleTranslator", FakeTranslator
        ):
            translated, language, succeeded = toxicity_model.translate_to_english(
                "Eres una persona amable"
            )

        self.assertEqual(language, "Spanish")
        self.assertEqual(translated, "You are a kind person")
        self.assertTrue(succeeded)

    def test_translation_failure_is_not_reported_as_success(self):
        class FailingTranslator:
            def __init__(self, source, target):
                pass

            def translate(self, text):
                raise RuntimeError("translator unavailable")

        with patch.object(toxicity_model, "detect", return_value="es"), patch.object(
            toxicity_model, "GoogleTranslator", FailingTranslator
        ):
            translated, language, succeeded = toxicity_model.translate_to_english(
                "Eres una persona amable"
            )

        self.assertEqual(language, "Spanish")
        self.assertEqual(translated, "Eres una persona amable")
        self.assertFalse(succeeded)


if __name__ == "__main__":
    unittest.main()
