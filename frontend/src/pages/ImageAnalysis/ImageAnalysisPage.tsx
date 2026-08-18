import { useRef, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/api";
import { notifyDashboardRefresh } from "../../api/dashboardEvents";

interface ImageAnalysisResult {
  filename: string;
  extracted_text: string;
  prediction: string;
  confidence: number;
  message?: string;
}

export default function ImageAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // =========================
  // File Selection
  // =========================
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setPreview("");
      setResult(null);

      setError(
        "Only JPG, JPEG, PNG, and WEBP images are supported."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // Optional file size limit: 10 MB
    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setFile(null);
      setPreview("");
      setResult(null);

      setError("Image size must be less than 10 MB.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError("");

    const imageUrl = URL.createObjectURL(selectedFile);
    setPreview(imageUrl);
  };

  // =========================
  // Analyze Image
  // =========================
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await api.post<ImageAnalysisResult>(
        "/image-analysis/analyze",
        formData
      );

      console.log("Image analysis response:", response.data);

      setResult(response.data);
      notifyDashboardRefresh();
      
    } catch (err: any) {
      console.error("Image analysis error:", err);

      if (err.response) {
        console.error(
          "Status:",
          err.response.status
        );

        console.error(
          "Response:",
          err.response.data
        );
      }

      setError(
        err.response?.data?.detail ||
          "Unable to analyze image. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Clear
  // =========================
  const handleClear = () => {
    setFile(null);
    setPreview("");
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================
  // Prediction
  // =========================
  const isToxic =
    result !== null &&
    result.prediction.toLowerCase() === "toxic";

  return (
    <DashboardLayout>
      {/* =========================
          Page Header
      ========================= */}
      <div>
        <h1 className="text-4xl font-bold text-white">
          Image Analysis
        </h1>

        <p className="mt-4 text-slate-400">
          Upload an image and GuardianAI will extract
          text using OCR and analyze it for toxic,
          harmful, or cyberbullying content.
        </p>
      </div>

      {/* =========================
          Upload Section
      ========================= */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <label className="mb-3 block text-lg font-semibold text-white">
          Select Image
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-300"
        />

        <p className="mt-2 text-sm text-slate-500">
          Supported formats: JPG, JPEG, PNG, WEBP ·
          Maximum size: 10 MB
        </p>

        {/* Selected File */}
        {file && (
          <div className="mt-4 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              Selected File
            </p>

            <p className="mt-1 break-all text-slate-200">
              {file.name}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* =========================
            Image Preview
        ========================= */}
        {preview && (
          <div className="mt-6">
            <p className="mb-3 text-sm text-slate-400">
              Image Preview
            </p>

            <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-700 bg-slate-800 p-4">
              <img
                src={preview}
                alt="Selected image preview"
                className="max-h-96 max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        )}

        {/* =========================
            Buttons
        ========================= */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing Image..."
              : "Analyze Image"}
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

        {/* =========================
            Error
        ========================= */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-medium text-red-400">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* =========================
          Analysis Result
      ========================= */}
      {result && (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-bold text-white">
            Image Analysis Result
          </h2>

          {/* Filename */}
          <div className="mt-4 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              File
            </p>

            <p className="mt-1 break-all text-slate-200">
              {result.filename}
            </p>
          </div>

          {/* =========================
              Prediction + Confidence
          ========================= */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Prediction */}
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Prediction
              </p>

              <p
                className={
                  "mt-2 text-3xl font-bold " +
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
                  : result.prediction.toLowerCase() ===
                    "safe"
                  ? "No significant toxicity detected."
                  : "No readable text was detected in the image."}
              </p>
            </div>

            {/* Confidence */}
            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Confidence
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {result.confidence}%
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={
                    "h-full rounded-full transition-all " +
                    (isToxic
                      ? "bg-red-500"
                      : "bg-green-500")
                  }
                  style={{
                    width:
                      Math.min(
                        Math.max(
                          result.confidence,
                          0
                        ),
                        100
                      ) + "%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* =========================
              OCR Extracted Text
          ========================= */}
          <div className="mt-5 rounded-xl bg-slate-800 p-5">
            <p className="text-sm text-slate-400">
              Extracted Text (OCR)
            </p>

            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900 p-4">
              {result.extracted_text ? (
                <p className="whitespace-pre-wrap text-slate-200">
                  {result.extracted_text}
                </p>
              ) : (
                <p className="text-slate-500">
                  {result.message ||
                    "No readable text found in the image."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}