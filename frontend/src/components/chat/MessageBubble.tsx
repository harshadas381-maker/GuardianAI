import {
  Copy,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

interface Props {
  sender: "user" | "ai";
  text: string;
  time: string;
  prediction?: string;
  confidence?: number | string;
  risk_level?: string;
  safer_response?: string;
}

export default function MessageBubble({
  sender,
  text,
  time,
  prediction,
  confidence,
  risk_level,
  safer_response,
}: Props) {
  const isUser = sender === "user";

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Message copied!");
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const isAnalysis =
    !isUser && Boolean(prediction);

  const isToxic =
    prediction?.toLowerCase() === "toxic";

  const numericConfidence =
    typeof confidence === "string"
      ? Number(confidence)
      : confidence ?? 0;

  const safeConfidence = Number.isNaN(
    numericConfidence
  )
    ? 0
    : numericConfidence;

  const formattedRisk = risk_level
    ? risk_level.charAt(0).toUpperCase() +
      risk_level.slice(1).toLowerCase()
    : "";

  /*
   * Remove duplicated prediction/confidence
   * information from the backend text.
   */
  const cleanText = text
    .replace(
      /Toxicity confidence:\s*[\d.]+%/gi,
      ""
    )
    .replace(
      /Safety confidence:\s*[\d.]+%/gi,
      ""
    )
    .replace(
      /GuardianAI recommends expressing your concern without using insulting, abusive, or harmful language\./gi,
      ""
    )
    .replace(
      /How can I help you today\?/gi,
      ""
    )
    .replace(/\n{2,}/g, "\n")
    .trim();

  return (
    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-xl rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-200"
        }`}
      >

        {/* ================================= */}
        {/* USER MESSAGE                      */}
        {/* ================================= */}

        {isUser && (
          <p className="whitespace-pre-wrap">
            {text}
          </p>
        )}

        {/* ================================= */}
        {/* GUARDIANAI ANALYSIS               */}
        {/* ================================= */}

        {isAnalysis && (
          <div>

            {/* Header */}
            <div className="flex items-center gap-3">

              <div
                className={`rounded-xl p-2 ${
                  isToxic
                    ? "bg-red-500/20"
                    : "bg-green-500/20"
                }`}
              >
                {isToxic ? (
                  <ShieldAlert
                    size={24}
                    className="text-red-400"
                  />
                ) : (
                  <ShieldCheck
                    size={24}
                    className="text-green-400"
                  />
                )}
              </div>

              <div>
                <p className="font-bold text-white">
                  GuardianAI Analysis
                </p>

                <p
                  className={`text-sm ${
                    isToxic
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {isToxic
                    ? "Toxic Content Detected"
                    : "Safe Content"}
                </p>
              </div>

            </div>

            {/* AI Explanation */}
            <p className="mt-4 whitespace-pre-wrap text-slate-300">
                {isToxic
                  ? "This message appears to contain potentially toxic or harmful content."
                  : "This message appears safe. No significant toxic content was detected."}
            </p>

            {/* Prediction */}
            <div className="mt-5 flex items-center justify-between">

              <span className="text-sm text-slate-400">
                Prediction
              </span>

              <span
                className={`font-bold ${
                  isToxic
                    ? "text-red-400"
                    : "text-green-400"
                }`}
              >
                {prediction}
              </span>

            </div>

            {/* Confidence */}
            <div className="mt-4">

              <div className="flex justify-between">

                <span className="text-sm text-slate-400">
                  Confidence
                </span>

                <span className="text-sm font-bold text-white">
                  {safeConfidence.toFixed(2)}%
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">

                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isToxic
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min(
                      Math.max(
                        safeConfidence,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>

            {/* Risk Level */}
            {risk_level && (
              <div className="mt-4 flex items-center justify-between">

                <span className="text-sm text-slate-400">
                  Risk Level
                </span>

                <span
                  className={`font-bold ${
                    isToxic
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {formattedRisk}
                </span>

              </div>
            )}

            {/* Suggested Safer Response */}
            {safer_response && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-900/60 p-4">

                <p className="text-sm font-semibold text-cyan-400">
                  Suggested Safer Response
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">
                  {safer_response}
                </p>

              </div>
            )}

          </div>
        )}

        {/* ================================= */}
        {/* NORMAL AI MESSAGE                 */}
        {/* ================================= */}

        {!isUser && !isAnalysis && (
          <p className="whitespace-pre-wrap text-slate-200">
            {text}
          </p>
        )}

        {/* ================================= */}
        {/* FOOTER                            */}
        {/* ================================= */}

        <div className="mt-4 flex items-center justify-between text-xs opacity-70">

          <span>{time}</span>

          <button
            type="button"
            onClick={copyMessage}
            className="transition hover:text-cyan-400"
            title="Copy message"
          >
            <Copy size={15} />
          </button>

        </div>

      </div>
    </div>
  );
}