import { useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/api";
import { notifyDashboardRefresh } from "../../api/dashboardEvents";

interface AnalysisResult {
  prediction: string;
  confidence: number;
}

function TextAnalysisPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

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
        {
          text: text.trim(),
        }
      );

      console.log("Text analysis result:", response.data);

      // Show the analysis result
      setResult(response.data);

      // Immediately notify the dashboard
      // so statistics and recent activity refresh.
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

  const handleClear = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const isToxic =
    result !== null &&
    result.prediction.toLowerCase() === "toxic";

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-white">
          Text Analysis
        </h1>

        <p className="mt-2 text-slate-400">
          Analyze text for cyberbullying, toxicity, and harmful content.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <label className="mb-3 block text-lg font-semibold text-white">
          Enter Text
        </label>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);

            if (error) {
              setError("");
            }
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

      {result && (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-white">
            Analysis Result
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Prediction
              </p>

              <p
                className={
                  "mt-2 text-2xl font-bold " +
                  (isToxic
                    ? "text-red-400"
                    : "text-green-400")
                }
              >
                {result.prediction}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {isToxic
                  ? "Potentially harmful or toxic content detected."
                  : "No significant toxicity detected."}
              </p>
            </div>

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Confidence
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                {result.confidence}%
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={
                    "h-full rounded-full " +
                    (isToxic
                      ? "bg-red-500"
                      : "bg-green-500")
                  }
                  style={{
                    width:
                      Math.min(
                        Math.max(result.confidence, 0),
                        100
                      ) + "%",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              Analyzed Text
            </p>

            <p className="mt-2 whitespace-pre-wrap text-slate-200">
              {text}
            </p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TextAnalysisPage;