from transformers import pipeline


# Load toxicity detection model once
toxicity_classifier = pipeline(
    "text-classification",
    model="unitary/toxic-bert"
)


def analyze_toxicity(text: str):
    """
    Analyze text for toxicity using unitary/toxic-bert.
    """

    text = text.strip()

    # No text extracted
    if not text:
        return {
            "prediction": "Safe",
            "confidence": 0.0,
        }

    try:
        result = toxicity_classifier(
            text,
            truncation=True,
            max_length=512
        )[0]

        label = result["label"].lower()
        score = float(result["score"])

        # Toxic prediction
        if label == "toxic":
            prediction = "Toxic"
            confidence = score * 100

        # Non-toxic prediction
        else:
            prediction = "Safe"
            confidence = score * 100

        return {
            "prediction": prediction,
            "confidence": round(confidence, 2),
        }

    except Exception as e:
        print("Toxicity analysis error:", e)

        return {
            "prediction": "Safe",
            "confidence": 0.0,
        }