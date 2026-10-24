import unittest
from unittest.mock import patch

from app.services import toxicity_model


class MultilingualDetectionRegressionTests(unittest.TestCase):
    def test_roman_marathi_is_not_treated_as_english(self):
        self.assertEqual(
            toxicity_model.detect_language(
                "mi tula sangitle ki mala madat pahije"
            ),
            "Marathi",
        )

    def test_roman_marathi_short_phrase(self):
        self.assertEqual(
            toxicity_model.detect_language("mala khup vait vatat aahe"),
            "Marathi",
        )

    def test_unsupported_detected_language_is_not_defaulted_to_english(self):
        with patch.object(toxicity_model, "detect", return_value="es"):
            self.assertEqual(
                toxicity_model.detect_language("bonjour merci beaucoup"),
                "Unknown",
            )

    def test_devanagari_marathi_is_detected(self):
        self.assertEqual(
            toxicity_model.detect_language("तू मूर्ख आहेस"),
            "Marathi",
        )

    def test_devanagari_hindi_is_detected(self):
        self.assertEqual(
            toxicity_model.detect_language("तुम बेवकूफ हो"),
            "Hindi",
        )

    def test_translation_failure_stops_before_model_classification(self):
        with (
            patch.object(
                toxicity_model,
                "translate_to_english",
                return_value=("तू मूर्ख आहेस", "Marathi", False),
            ),
            patch.object(toxicity_model, "model") as model,
        ):
            result = toxicity_model.analyze_toxicity("तू मूर्ख आहेस")

        self.assertEqual(result["prediction"], "Needs Review")
        self.assertTrue(result["translation_failed"])
        model.predict.assert_not_called()

    def test_unknown_language_still_goes_through_translation(self):
        with (
            patch.object(toxicity_model, "detect_language", return_value="Unknown"),
            patch.object(toxicity_model, "GoogleTranslator") as translator,
        ):
            translator.return_value.translate.return_value = "hello there"
            translated, language, succeeded = toxicity_model.translate_to_english(
                "bonjour tout le monde"
            )

        self.assertEqual(translated, "hello there")
        self.assertEqual(language, "Unknown")
        self.assertTrue(succeeded)

    def test_translation_failure_is_reported(self):
        with (
            patch.object(toxicity_model, "detect_language", return_value="Marathi"),
            patch.object(toxicity_model, "GoogleTranslator") as translator,
        ):
            translator.return_value.translate.side_effect = RuntimeError(
                "translation unavailable"
            )
            translated, language, succeeded = toxicity_model.translate_to_english(
                "mi thik aahe"
            )

        self.assertEqual(translated, "mi thik aahe")
        self.assertEqual(language, "Marathi")
        self.assertFalse(succeeded)


if __name__ == "__main__":
    unittest.main()
