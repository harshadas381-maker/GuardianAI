from typing import Dict


def generate_ai_response(
    message: str,
    prediction: str,
    confidence: float,
) -> Dict[str, object]:
    """
    Generate a GuardianAI response based on the
    toxicity analysis result.
    """

    clean_message = message.strip()
    normalized_prediction = prediction.strip().lower()

    confidence = float(confidence)

    # ---------------------------------------
    # Determine risk level from confidence
    # ---------------------------------------
    def get_risk_level(
        prediction_value: str,
        confidence_value: float,
    ) -> str:

        if prediction_value == "toxic":

            if confidence_value >= 90:
                return "high"

            elif confidence_value >= 70:
                return "medium"

            else:
                return "low"

        if prediction_value == "safe":
            return "low"

        return "unknown"

    risk_level = get_risk_level(
        normalized_prediction,
        confidence,
    )

    # ---------------------------------------
    # Toxic message
    # ---------------------------------------
    if normalized_prediction == "toxic":

        reply = (
            "⚠️ This message appears to contain "
            "potentially toxic or harmful content.\n\n"
            f"Toxicity confidence: {confidence:.2f}%\n\n"
            "GuardianAI recommends expressing your concern "
            "without using insulting, abusive, or harmful "
            "language."
        )

        safer_response = (
            "I'm frustrated with this situation. "
            "Can we discuss it calmly?"
        )

        return {
            "reply": reply,
            "prediction": prediction,
            "confidence": confidence,
            "risk_level": risk_level,
            "safer_response": safer_response,
        }

    # ---------------------------------------
    # Safe message
    # ---------------------------------------
    if normalized_prediction == "safe":

        reply = (
            "✅ This message appears safe. "
            "No significant toxic content was detected.\n\n"
            f"Safety confidence: {confidence:.2f}%\n\n"
            "How can I help you today?"
        )

        return {
            "reply": reply,
            "prediction": prediction,
            "confidence": confidence,
            "risk_level": "low",
            "safer_response": None,
        }

    # ---------------------------------------
    # Unknown / other prediction
    # ---------------------------------------
    return {
        "reply": (
            "GuardianAI analyzed your message, but the "
            "result could not be classified clearly."
        ),
        "prediction": prediction,
        "confidence": confidence,
        "risk_level": "unknown",
        "safer_response": None,
    }