
import { useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/api";
import { notifyDashboardRefresh } from "../../api/dashboardEvents";

interface AnalysisResult {
  id?: number;
  prediction: string;
  confidence: number;
  risk_level?: string;
  is_harmful?: boolean | null;
  harm_type?: string | null;
  class_scores?: Record<string, number>;
  language?: string;
  processed_text?: string;
  translation_failed?: boolean;
  message?: string | null;
}

function TextAnalysisPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const harmfulLabels = [
    "toxic",
    "cyberbullying",
    "offensive",
    "hate",
  ];

  const prediction = result?.prediction?.toLowerCase() || "";

  // An uncertain result must never be displayed as Safe.
  const isNeedsReview =
    prediction === "needs review" ||
    result?.translation_failed === true;

  const isNoText = prediction === "no text";

  const isHarmful = isNeedsReview
    ? false
    : (result?.is_harmful ??
      harmfulLabels.includes(prediction));

  const riskLevel = isNeedsReview
    ? "unknown"
    : result?.risk_level?.toLowerCase() ||
      (isHarmful ? "high" : prediction === "safe" ? "low" : "unknown");

  // ============================================================
  // ANALYZE TEXT
  // ============================================================

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await api.post<AnalysisResult>(
        "/analysis/text",
        { text: text.trim() }
      );

      console.log("GuardianAI analysis result:", response.data);
      setResult(response.data);

      notifyDashboardRefresh();
    } catch (err: any) {
      console.error("Analysis error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to analyze text. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CLEAR
  // ============================================================

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
  };

  // ============================================================
  // STATUS HELPERS
  // ============================================================

  const getStatusBadge = () => {
    if (!result) return "";
    if (isNeedsReview) return "Review Required";
    if (isNoText) return "No Text";
    if (isHarmful) return "Potentially Harmful Content Detected";
    if (prediction === "safe") return "Content Classified as Safe";
    return "Classification Result";
  };

  const getStatusMessage = () => {
    if (!result) return "";

    if (isNeedsReview) {
      return (
        result.message ||
        "This text could not be reliably classified. Please try again later."
      );
    }

    if (isNoText) {
      return "No text was provided for analysis.";
    }

    if (isHarmful) {
      return "Potentially harmful or inappropriate content detected. Review the message carefully.";
    }

    if (prediction === "safe") {
      return "The model classified this text as Safe. Automated classification may still make mistakes.";
    }

    return "The model returned a classification. Review the result carefully.";
  };

  const getStatusStyle = () => {
    if (isNeedsReview) {
      return "border-yellow-500/30 bg-yellow-500/10";
    }

    if (isHarmful) {
      return "border-red-500/30 bg-red-500/10";
    }

    if (prediction === "safe") {
      return "border-green-500/30 bg-green-500/10";
    }

    return "border-slate-700 bg-slate-800";
  };

  const getStatusTextStyle = () => {
    if (isNeedsReview) return "text-yellow-300";
    if (isHarmful) return "text-red-400";
    if (prediction === "safe") return "text-green-400";
    return "text-slate-300";
  };

  const getPredictionColor = () => {
    if (isNeedsReview) return "text-yellow-300";
    if (isNoText) return "text-slate-300";
    if (isHarmful) return "text-red-400";
    if (prediction === "safe") return "text-green-400";
    return "text-slate-300";
  };

  const getRiskColor = () => {
    if (isNeedsReview) return "text-yellow-300";

    switch (riskLevel) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-slate-300";
    }
  };

  const getRiskBackground = () => {
    if (isNeedsReview) {
      return "bg-yellow-500/10 text-yellow-300";
    }

    switch (riskLevel) {
      case "high":
        return "bg-red-500/10 text-red-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-400";
      case "low":
        return "bg-green-500/10 text-green-400";
      default:
        return "bg-slate-500/10 text-slate-300";
    }
  };

  const confidenceValue = Number(result?.confidence) || 0;

  return (
    <DashboardLayout>
      {/* PAGE HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Text Analysis
        </h1>

        <p className="mt-2 text-slate-400">
          Analyze text for cyberbullying, toxicity, offensive,
          hate, and other harmful content.
        </p>
      </div>

      {/* INPUT SECTION */}

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <label className="mb-3 block text-lg font-semibold text-white">
          Enter Text
        </label>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter a message or comment to analyze..."
          rows={8}
          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 p-4 text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
        />

        <div className="mt-2 text-right text-sm text-slate-500">
          {text.length} characters
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Text"}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* ANALYSIS RESULT */}

      {result && (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-white">
              Analysis Result
            </h2>

            {result.id && (
              <span className="text-sm text-slate-500">
                Analysis ID: #{result.id}
              </span>
            )}
          </div>

          {/* STATUS */}

          <div className={`mt-5 rounded-xl border p-4 ${getStatusStyle()}`}>
            <p className={`font-semibold ${getStatusTextStyle()}`}>
              {getStatusBadge()}
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {getStatusMessage()}
            </p>
          </div>

          {/* PREDICTION AND CONFIDENCE */}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Prediction
              </p>

              <p className={`mt-2 text-3xl font-bold ${getPredictionColor()}`}>
                {result.prediction}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {isNeedsReview
                  ? "A reliable classification was not produced."
                  : "Automated classification result."}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Confidence
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {isNeedsReview
                  ? "N/A"
                  : `${confidenceValue.toFixed(2)}%`}
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    isNeedsReview
                      ? "bg-yellow-400"
                      : isHarmful
                      ? "bg-red-500"
                      : prediction === "safe"
                      ? "bg-green-500"
                      : "bg-slate-500"
                  }`}
                  style={{
                    width: isNeedsReview
                      ? "0%"
                      : `${Math.min(Math.max(confidenceValue, 0), 100)}%`,
                  }}
                />
              </div>

              {isNeedsReview && (
                <p className="mt-2 text-sm text-yellow-300">
                  Confidence is unavailable because classification failed.
                </p>
              )}
            </div>
          </div>

          {/* LANGUAGE */}

          {result.language && (
            <div className="mt-5 rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Detected Language
              </p>

              <p className="mt-2 text-2xl font-bold text-cyan-400">
                {result.language}
              </p>
            </div>
          )}

          {/* RISK LEVEL */}

          <div className="mt-5 rounded-xl bg-slate-800 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  Risk Level
                </p>

                <p className={`mt-2 text-2xl font-bold capitalize ${getRiskColor()}`}>
                  {isNeedsReview ? "Unknown" : riskLevel}
                </p>
              </div>

              <div className={`rounded-full px-4 py-2 text-sm font-semibold ${getRiskBackground()}`}>
                {isNeedsReview
                  ? "Unable to Determine"
                  : isHarmful
                  ? "Potential Risk"
                  : prediction === "safe"
                  ? "Model Classified Safe"
                  : "Undetermined"}
              </div>
            </div>
          </div>

          {/* CLASSIFICATION SCORES */}

          {!isNeedsReview &&
            result.class_scores &&
            Object.keys(result.class_scores).length > 0 && (
              <div className="mt-5 rounded-xl bg-slate-800 p-5">
                <p className="text-sm font-medium text-slate-300">
                  Classification Scores
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Relative model scores; these are not calibrated probabilities.
                </p>

                <div className="mt-4 space-y-4">
                  {Object.entries(result.class_scores).map(([label, score]) => {
                    const numericScore = Number(score) || 0;
                    const harmfulClass = harmfulLabels.includes(
                      label.toLowerCase()
                    );

                    return (
                      <div key={label}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-300">
                            {label}
                          </span>

                          <span className="text-sm font-semibold text-white">
                            {numericScore.toFixed(2)}%
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className={`h-full rounded-full transition-all ${
                              harmfulClass ? "bg-red-500" : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(Math.max(numericScore, 0), 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* PROCESSED TEXT */}

          {result.processed_text &&
            result.processed_text !== text.trim() && (
              <div className="mt-5 rounded-xl bg-slate-800 p-5">
                <p className="text-sm text-slate-400">
                  Processed Text
                </p>

                <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900 p-4">
                  <p className="whitespace-pre-wrap break-words text-slate-200">
                    {result.processed_text}
                  </p>
                </div>
              </div>
            )}

          {/* ORIGINAL ANALYZED TEXT */}

          <div className="mt-5 rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              Analyzed Text
            </p>

            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900 p-4">
              <p className="whitespace-pre-wrap break-words text-slate-200">
                {text.trim()}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TextAnalysisPage;