
import os
import re
import joblib
import numpy as np

from deep_translator import GoogleTranslator
from langdetect import detect, DetectorFactory


# ============================================================
# Language Detection Configuration
# ============================================================

DetectorFactory.seed = 0


# ============================================================
# GuardianAI V3 Model
# ============================================================

MODEL_PATH = os.path.abspath(
    os.path.join(
        os.path.dirname(__file__),
        "..",
        "..",
        "models",
        "guardianai_tfidf_char_word_v3_weighted.joblib",
    )
)

print("=" * 60)
print("Loading GuardianAI V3 model...")
print("=" * 60)
print("Model path:", MODEL_PATH)

try:
    model = joblib.load(MODEL_PATH)
    print("GuardianAI V3 model loaded successfully.")
    print("Model type:", type(model).__name__)
except Exception as e:
    print("ERROR loading GuardianAI V3 model:")
    print(repr(e))
    model = None


# ============================================================
# Labels
# ============================================================

LABEL_NAMES = {
    "safe": "Safe",
    "cyberbullying": "Cyberbullying",
    "offensive": "Offensive",
    "toxic": "Toxic",
    "hate": "Hate",
}

RISK_LEVELS = {
    "safe": "low",
    "cyberbullying": "high",
    "offensive": "medium",
    "toxic": "high",
    "hate": "high",
}

HARMFUL_LABELS = {
    "cyberbullying",
    "offensive",
    "toxic",
    "hate",
}

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "bn": "Bengali",
    "gu": "Gujarati",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "ur": "Urdu",
}


# ============================================================
# Explicit Abuse Patterns
# ============================================================

OBVIOUS_ABUSE_PATTERNS = [
    r"\byou are stupid\b",
    r"\byou're stupid\b",
    r"\byou are an idiot\b",
    r"\byou're an idiot\b",
    r"\byou are dumb\b",
    r"\byou're dumb\b",
    r"\byou are useless\b",
    r"\byou're useless\b",
    r"\byou are terrible\b",
    r"\byou're terrible\b",
    r"\byou are a terrible person\b",
    r"\byou're a terrible person\b",
    r"\byou are so bad\b",
    r"\byou are bad\b",
    r"\byou're so bad\b",
    r"\byou're bad\b",
    r"\byou are a bad person\b",
    r"\byou are a horrible person\b",
    r"\byou're a horrible person\b",
    r"\bi hate you\b",
    r"\bshut up\b",
]


# ============================================================
# Explicit Violent Intent / Threat Patterns
# ============================================================

VIOLENT_INTENT_PATTERNS = [
    (
        r"\b(?:i|we)\s+(?:want|wanna|wish|plan|intend)\s+to\s+"
        r"(?:kill|murder|hurt|harm|stab|shoot)\b"
    ),
    (
        r"\b(?:i|we)\s+(?:will|shall)\s+"
        r"(?:kill|murder|hurt|harm|stab|shoot)\b"
    ),
    (
        r"\b(?:i|we)\s+(?:am|are)\s+going\s+to\s+"
        r"(?:kill|murder|hurt|harm|stab|shoot)\b"
    ),
    (
        r"\b(?:i|we)\s+gonna\s+"
        r"(?:kill|murder|hurt|harm|stab|shoot)\b"
    ),
    (
        r"\b(?:kill|murder|hurt|harm|stab|shoot)\s+"
        r"(?:him|her|them|you|that\s+person|this\s+person)\b"
    ),
    (
        r"\b(?:i|we)\s+(?:want|wish)\s+"
        r"(?:him|her|them|you)\s+dead\b"
    ),
    r"\byou\s+(?:will|are\s+going\s+to)\s+die\b",
    r"\bi\s+(?:will|am\s+going\s+to)\s+kill\s+you\b",
]


def detect_obvious_abuse(text: str):
    """Detect configured explicit abuse and violent-threat patterns."""

    normalized = re.sub(
        r"\s+",
        " ",
        text.lower().strip(),
    )

    for pattern in VIOLENT_INTENT_PATTERNS:
        if re.search(pattern, normalized):
            return {
                "prediction": "Toxic",
                "confidence": 95.0,
                "risk_level": "high",
                "is_harmful": True,
                "harm_type": "Violent Threat",
            }

    for pattern in OBVIOUS_ABUSE_PATTERNS:
        if re.search(pattern, normalized):
            return {
                "prediction": "Toxic",
                "confidence": 90.0,
                "risk_level": "high",
                "is_harmful": True,
                "harm_type": "Abusive Language",
            }

    return None


# ============================================================
# Unicode Script Detection
# ============================================================

def detect_script(text: str) -> str:
    """Identify the writing script used in the input."""

    if re.search(r"[\u0900-\u097F]", text):
        return "Devanagari"

    if re.search(r"[\u0980-\u09FF]", text):
        return "Bengali"

    if re.search(r"[\u0A80-\u0AFF]", text):
        return "Gujarati"

    if re.search(r"[\u0A00-\u0A7F]", text):
        return "Punjabi"

    if re.search(r"[\u0B80-\u0BFF]", text):
        return "Tamil"

    if re.search(r"[\u0C00-\u0C7F]", text):
        return "Telugu"

    if re.search(r"[\u0C80-\u0CFF]", text):
        return "Kannada"

    if re.search(r"[\u0D00-\u0D7F]", text):
        return "Malayalam"

    if re.search(r"[\u0600-\u06FF]", text):
        return "Urdu"

    return "Latin"


# ============================================================
# Hinglish Detection
# ============================================================

HINGLISH_WORDS = {
    "hai", "ho", "hoga", "hogi", "tha", "thi", "the",
    "tum", "tumhe", "tumko", "tumse", "aap", "apko",
    "mujhe", "mujhse", "mujhko", "mera", "meri", "mere",
    "hum", "ham", "bahut", "bohot", "kya", "kyun", "kyon",
    "kaise", "kaisa", "kaisi", "accha", "acha", "achha",
    "bekar", "bura", "buri", "pagal", "ladka", "ladki",
    "insaan", "nahi", "nahin", "mat", "kar", "karo",
    "karta", "karte", "kuch", "sab", "yaar", "bhai",
    "behen", "apna", "apni", "apne", "tera", "teri",
    "tere", "tu", "toh", "to", "kyunki", "lekin",
    "magar", "chal", "chalo", "dekh", "dekho", "ja",
    "jao", "aaja", "aao",
}


def is_hinglish(text: str) -> bool:
    """Detect common Hindi words written in Roman script."""

    words = re.findall(r"[a-zA-Z]+", text.lower())

    if not words:
        return False

    matches = sum(word in HINGLISH_WORDS for word in words)
    return matches >= 2


# ============================================================
# Language Detection
# ============================================================

def detect_language(text: str) -> str:
    """
    Detect supported languages using script, vocabulary,
    and langdetect. Short text may still be ambiguous.
    """

    text = text.strip()

    if not text:
        return "Unknown"

    script = detect_script(text)

    # --------------------------------------------------------
    # Latin / Roman script
    # --------------------------------------------------------

    if script == "Latin":
        if is_hinglish(text):
            return "Hinglish"

        try:
            detected = detect(text)
            return LANGUAGE_NAMES.get(detected, "English")
        except Exception as e:
            print("Language detection warning:", repr(e))
            return "Unknown"

    # --------------------------------------------------------
    # Devanagari: Hindi or Marathi
    # --------------------------------------------------------

    if script == "Devanagari":
        normalized = re.sub(r"\s+", " ", text.lower().strip())

        words = set(
            re.findall(r"[\u0900-\u097F]+", normalized)
        )

        marathi_words = {
            "आहे", "आहेस", "आहेत", "होतो", "होते", "होती",
            "होता", "तू", "तुला", "तुम्ही", "तुम्हाला",
            "मला", "माझा", "माझी", "माझे", "आपण", "काय",
            "का", "कसे", "कशी", "कसा", "कुठे", "कुठला",
            "कुठली", "इथे", "तिथे", "नाही", "नको", "करतो",
            "करते", "करत", "जाते", "जातो", "येते", "येतो",
            "खूप", "मूर्ख", "वेडा", "वेडी", "चांगला",
            "चांगली", "चांगले",
        }

        hindi_words = {
            "है", "हूँ", "हूं", "हैं", "हो", "था", "थी",
            "थे", "तुम", "तुम्हें", "तुम्हारा", "तुम्हारी",
            "मुझे", "मेरा", "मेरी", "मेरे", "हम", "हमारा",
            "आप", "आपको", "क्या", "क्यों", "कैसे", "कैसा",
            "कैसी", "कहाँ", "यहाँ", "वहाँ", "नहीं", "मत",
            "करो", "करता", "करती", "करते", "जाता", "जाती",
            "जाते", "आता", "आती", "आते", "बहुत", "बेवकूफ",
            "मूर्ख", "पागल", "अच्छा", "अच्छी", "अच्छे",
        }

        marathi_score = len(words.intersection(marathi_words))
        hindi_score = len(words.intersection(hindi_words))

        if marathi_score > hindi_score:
            return "Marathi"

        if hindi_score > marathi_score:
            return "Hindi"

        if words.intersection({"आहेस", "तुला", "मला", "तुम्हाला"}):
            return "Marathi"

        if "मुझे" in words or "तुम्हें" in words:
            return "Hindi"

        try:
            detected = detect(text)

            if detected == "mr":
                return "Marathi"

            if detected == "hi":
                return "Hindi"
        except Exception as e:
            print("Devanagari detection warning:", repr(e))

        return "Hindi / Marathi"

    script_to_language = {
        "Bengali": "Bengali",
        "Gujarati": "Gujarati",
        "Tamil": "Tamil",
        "Telugu": "Telugu",
        "Kannada": "Kannada",
        "Malayalam": "Malayalam",
        "Punjabi": "Punjabi",
        "Urdu": "Urdu",
    }

    return script_to_language.get(script, "Unknown")


# ============================================================
# Translation
# ============================================================

def translate_to_english(text: str) -> tuple[str, str, bool]:
    """
    Return (processed_text, detected_language, translation_succeeded).

    English is returned unchanged. If translation fails for
    non-English text, the status is False so classification stops.
    """

    text = text.strip()
    language = detect_language(text)

    if not text:
        return text, language, False

    if language == "English":
        return text, language, True

    try:
        translated = GoogleTranslator(
            source="auto",
            target="en",
        ).translate(text)

        if translated and translated.strip():
            return translated.strip(), language, True

        print("Translation warning: empty translation returned.")

    except Exception as e:
        print("Translation warning:", repr(e))

    # Never pretend the original untranslated text was translated.
    return text, language, False


# ============================================================
# Standard Needs Review Result
# ============================================================

def needs_review_result(
    language: str,
    processed_text: str,
    message: str,
    translation_failed: bool = False,
) -> dict:
    """Create a neutral result when classification is unreliable."""

    return {
        "prediction": "Needs Review",
        "confidence": 0.0,
        "risk_level": "unknown",
        "is_harmful": None,
        "harm_type": None,
        "class_scores": {},
        "language": language,
        "processed_text": processed_text,
        "translation_failed": translation_failed,
        "message": message,
    }


# ============================================================
# Analyze Toxicity
# ============================================================

def analyze_toxicity(text: str) -> dict:
    """Analyze text and return its classification result."""

    original_text = text.strip()

    # --------------------------------------------------------
    # Empty input
    # --------------------------------------------------------

    if not original_text:
        return {
            "prediction": "No Text",
            "confidence": 0.0,
            "risk_level": "unknown",
            "is_harmful": None,
            "harm_type": None,
            "class_scores": {},
            "language": "Unknown",
            "processed_text": "",
            "translation_failed": False,
            "message": "Please enter some text to analyze.",
        }

    # --------------------------------------------------------
    # Detect language and translate
    # --------------------------------------------------------

    processed_text, language, translation_succeeded = (
        translate_to_english(original_text)
    )

    print("=" * 60)
    print("GuardianAI Text Analysis")
    print("Language:", language)
    print("Original:", original_text)
    print("Processed:", processed_text)
    print("Translation successful:", translation_succeeded)
    print("=" * 60)

    # --------------------------------------------------------
    # Do not classify untranslated non-English text
    # --------------------------------------------------------

    if language != "English" and not translation_succeeded:
        return needs_review_result(
            language=language,
            processed_text=original_text,
            translation_failed=True,
            message=(
                "Translation failed. Please try again later. "
                "This text has not been reliably classified."
            ),
        )

    # --------------------------------------------------------
    # Explicit abuse / violent intent rules
    # --------------------------------------------------------

    rule_result = detect_obvious_abuse(processed_text)

    if rule_result:
        return {
            "prediction": rule_result["prediction"],
            "confidence": rule_result["confidence"],
            "risk_level": rule_result["risk_level"],
            "is_harmful": rule_result["is_harmful"],
            "harm_type": rule_result.get(
                "harm_type",
                "Abusive Language",
            ),
            "class_scores": {
                "Safe": 1.0,
                "Cyberbullying": 1.0,
                "Offensive": 2.0,
                "Toxic": rule_result["confidence"],
                "Hate": 1.0,
            },
            "language": language,
            "processed_text": processed_text,
            "translation_failed": False,
            "message": None,
        }

    # --------------------------------------------------------
    # Model unavailable
    # --------------------------------------------------------

    if model is None:
        return needs_review_result(
            language=language,
            processed_text=processed_text,
            message=(
                "The classification model is unavailable. "
                "Please check the model file and restart the backend."
            ),
        )

    # --------------------------------------------------------
    # Model prediction
    # --------------------------------------------------------

    try:
        prediction = model.predict([processed_text])[0]
        prediction_key = str(prediction).lower()

        prediction_name = LABEL_NAMES.get(
            prediction_key,
            prediction_key.capitalize(),
        )

        confidence = 0.0
        class_scores = {}

        # ----------------------------------------------------
        # Decision scores
        # ----------------------------------------------------

        if hasattr(model, "decision_function"):
            scores = np.asarray(
                model.decision_function([processed_text])
            ).flatten()

            classes = getattr(model, "classes_", [])

            if len(scores) == len(classes) and len(scores) > 0:
                # Convert scores to relative normalized values.
                # These are NOT calibrated probabilities.
                shifted = scores - np.max(scores)
                exp_scores = np.exp(shifted)
                denominator = np.sum(exp_scores)

                if denominator > 0 and np.isfinite(denominator):
                    probabilities = exp_scores / denominator

                    for class_name, probability in zip(
                        classes,
                        probabilities,
                    ):
                        class_key = str(class_name).lower()
                        display_name = LABEL_NAMES.get(
                            class_key,
                            class_key.capitalize(),
                        )

                        class_scores[display_name] = round(
                            float(probability) * 100,
                            2,
                        )

                    predicted_index = int(np.argmax(scores))
                    confidence = (
                        float(probabilities[predicted_index]) * 100
                    )

        # ----------------------------------------------------
        # Risk level and harmful flag
        # ----------------------------------------------------

        risk_level = RISK_LEVELS.get(
            prediction_key,
            "unknown",
        )

        is_harmful = prediction_key in HARMFUL_LABELS
        harm_type = prediction_name if is_harmful else None

        # ----------------------------------------------------
        # Final successful result
        # ----------------------------------------------------

        return {
            "prediction": prediction_name,
            "confidence": round(confidence, 2),
            "risk_level": risk_level,
            "is_harmful": is_harmful,
            "harm_type": harm_type,
            "class_scores": class_scores,
            "language": language,
            "processed_text": processed_text,
            "translation_failed": False,
            "message": None,
        }

    except Exception as e:
        print("GuardianAI V3 analysis error:")
        print(repr(e))

        return needs_review_result(
            language=language,
            processed_text=processed_text,
            message=(
                "An analysis error occurred. This text could not "
                "be reliably classified. Please try again."
            ),
        )