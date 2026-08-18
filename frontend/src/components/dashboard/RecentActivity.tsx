import {
  FileText,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Paperclip,
} from "lucide-react";

interface RecentActivityData {
  id: number;
  text: string;
  prediction: string;
  confidence: number;
  source: "text" | "image" | string;
  filename: string | null;
  created_at: string;
}

interface RecentActivityProps {
  activities: RecentActivityData[];
}

export default function RecentActivity({
  activities,
}: RecentActivityProps) {
  // ---------------------------------------
  // Format date
  // ---------------------------------------
  const formatDate = (date: string) => {
    if (!date) return "Unknown time";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown time";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------------------------------------
  // Confidence helper
  // ---------------------------------------
  const getConfidence = (confidence: number) => {
    return Math.min(
      Math.max(Number(confidence) || 0, 0),
      100
    );
  };

  // ---------------------------------------
  // Prediction helper
  // ---------------------------------------
  const isToxicPrediction = (prediction: string) => {
    return prediction?.toLowerCase() === "toxic";
  };

  // ---------------------------------------
  // Render
  // ---------------------------------------
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-6 shadow-xl">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Your latest GuardianAI analyses
          </p>
        </div>

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2">
          <Clock className="h-5 w-5 text-cyan-400" />
        </div>
      </div>

      {/* =====================================
          EMPTY STATE
      ====================================== */}
      {activities.length === 0 ? (
        <div className="flex min-h-[180px] items-center justify-center text-center">
          <div>
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-slate-600" />

            <p className="font-medium text-slate-400">
              No analysis history yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Start analyzing content to see your activity here.
            </p>
          </div>
        </div>
      ) : (
        /* =====================================
           ACTIVITY LIST
        ====================================== */
        <div className="space-y-4">
          {activities.map((activity) => {
            const isToxic = isToxicPrediction(
              activity.prediction
            );

            const isImage =
              activity.source?.toLowerCase() === "image";

            const confidence = getConfidence(
              activity.confidence
            );

            return (
              <div
                key={activity.id}
                className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-4 transition-all duration-200 hover:border-cyan-500/30 hover:bg-slate-800/70"
              >

                {/* =================================
                    TOP ROW
                ================================= */}
                <div className="flex items-start justify-between gap-4">

                  {/* Source */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`rounded-lg p-2 ${
                        isImage
                          ? "bg-purple-500/10"
                          : "bg-cyan-500/10"
                      }`}
                    >
                      {isImage ? (
                        <ImageIcon className="h-5 w-5 text-purple-400" />
                      ) : (
                        <FileText className="h-5 w-5 text-cyan-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {isImage
                          ? "Image Analysis"
                          : "Text Analysis"}
                      </p>

                      <p className="text-xs text-slate-500">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* =================================
                      PREDICTION BADGE
                  ================================= */}
                  <div
                    className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isToxic
                        ? "bg-red-500/10 text-red-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {isToxic ? (
                      <ShieldAlert className="h-3.5 w-3.5" />
                    ) : (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    )}

                    {activity.prediction || "Unknown"}
                  </div>
                </div>

                {/* =================================
                    IMAGE FILE
                ================================= */}
                {isImage && activity.filename && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2">
                    <Paperclip className="h-3.5 w-3.5 shrink-0 text-purple-400" />

                    <p className="truncate text-xs text-purple-300">
                      {activity.filename}
                    </p>
                  </div>
                )}

                {/* =================================
                    ANALYZED TEXT / OCR
                ================================= */}
                <div className="mt-3">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                    {isImage
                      ? "Extracted Text"
                      : "Analyzed Text"}
                  </p>

                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-300">
                    {activity.text ||
                      "No extracted text available."}
                  </p>
                </div>

                {/* =================================
                    CONFIDENCE
                ================================= */}
                <div className="mt-4">

                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Confidence
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        isToxic
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {confidence.toFixed(2)}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isToxic
                          ? "bg-red-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${confidence}%`,
                      }}
                    />
                  </div>
                </div>

                {/* =================================
                    FOOTER
                ================================= */}
                <div className="mt-4 flex items-center justify-between border-t border-slate-700/50 pt-3">

                  <span className="text-xs text-slate-600">
                    Analysis #{activity.id}
                  </span>

                  <span
                    className={`text-xs font-medium ${
                      isToxic
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {isToxic
                      ? "Potentially harmful"
                      : "No significant toxicity"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}