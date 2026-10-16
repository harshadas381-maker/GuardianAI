import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/api";
import { notifyDashboardRefresh } from "../../api/dashboardEvents";

interface ImageAnalysisResult {
  id?: number;
  filename: string;
  extracted_text: string;
  prediction: string;
  confidence: number;
  source?: string;
  message?: string;
}

function ImageAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<ImageAnalysisResult | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ============================================================
  // CLEANUP IMAGE PREVIEW URL
  // ============================================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // ============================================================
  // FILE SELECTION
  // ============================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // Supported image types
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFile(null);
      setResult(null);
      setError(
        "Only JPG, JPEG, PNG, and WEBP images are supported."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // Maximum 10 MB
    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setFile(null);
      setResult(null);
      setError("Image size must be less than 10 MB.");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    // Create preview
    const imageUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreview(imageUrl);
    setResult(null);
    setError("");
  };

  // ============================================================
  // IMAGE ANALYSIS
  // ============================================================

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

      // IMPORTANT:
      // Backend expects multipart/form-data field named "file"
      formData.append("file", file);

      console.log("Uploading image:", file.name);
      console.log("Image size:", file.size);
      console.log("Image type:", file.type);

      const response = await api.post<ImageAnalysisResult>(
        "/image-analysis/analyze",
        formData
      );

      console.log(
        "Image analysis response:",
        response.data
      );

      setResult(response.data);

      // Refresh dashboard statistics
      setTimeout(() => {
        notifyDashboardRefresh();
      }, 0);
    } catch (err: any) {
      console.error("Image analysis error:", err);

      const backendError =
        err?.response?.data?.detail;

      if (Array.isArray(backendError)) {
        setError(
          backendError
            .map((item: any) => item?.msg || "Validation error")
            .join(", ")
        );
      } else {
        setError(
          backendError ||
            "Unable to analyze image. Please make sure the backend server is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // CLEAR
  // ============================================================

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview("");
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // RESULT HELPERS
  // ============================================================

  const prediction =
    result?.prediction?.toLowerCase() || "";

  const getPredictionMessage = () => {
    switch (prediction) {
      case "safe":
        return "No harmful content detected.";

      case "cyberbullying":
        return "Cyberbullying-related content detected.";

      case "offensive":
        return "Offensive or insulting content detected.";

      case "toxic":
        return "Potentially harmful or toxic content detected.";

      case "hate":
        return "Potential hate-related content detected.";

      case "no text":
        return (
          result?.message ||
          "No readable text was detected in the image."
        );

      default:
        return "Analysis result available.";
    }
  };

  const getPredictionColor = () => {
    switch (prediction) {
      case "safe":
        return "text-green-400";

      case "cyberbullying":
        return "text-orange-400";

      case "offensive":
        return "text-yellow-400";

      case "toxic":
        return "text-red-400";

      case "hate":
        return "text-purple-400";

      default:
        return "text-slate-300";
    }
  };

  const getProgressColor = () => {
    switch (prediction) {
      case "safe":
        return "bg-green-500";

      case "cyberbullying":
        return "bg-orange-500";

      case "offensive":
        return "bg-yellow-500";

      case "toxic":
        return "bg-red-500";

      case "hate":
        return "bg-purple-500";

      default:
        return "bg-cyan-500";
    }
  };

  const getStatusStyle = () => {
    switch (prediction) {
      case "safe":
        return "border-green-500/30 bg-green-500/10 text-green-400";

      case "cyberbullying":
        return "border-orange-500/30 bg-orange-500/10 text-orange-400";

      case "offensive":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

      case "toxic":
        return "border-red-500/30 bg-red-500/10 text-red-400";

      case "hate":
        return "border-purple-500/30 bg-purple-500/10 text-purple-400";

      default:
        return "border-slate-700 bg-slate-800 text-slate-300";
    }
  };

  const confidence = Math.min(
    Math.max(Number(result?.confidence) || 0, 0),
    100
  );

  // ============================================================
  // UI
  // ============================================================

  return (
    <DashboardLayout>
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div>
        <h1 className="text-4xl font-bold text-white">
          Image Analysis
        </h1>

        <p className="mt-4 text-slate-400">
          Upload an image and GuardianAI will extract text
          using OCR and analyze it for toxic, harmful,
          offensive, hate, or cyberbullying content.
        </p>
      </div>

      {/* ========================================================
          UPLOAD SECTION
      ======================================================== */}

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <label className="mb-3 block text-lg font-semibold text-white">
          Select Image
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          disabled={loading}
          className="block w-full cursor-pointer rounded-xl border border-slate-700 bg-slate-800 p-3 text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <p className="mt-2 text-sm text-slate-500">
          Supported formats: JPG, JPEG, PNG, WEBP · Maximum
          size: 10 MB
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

        {/* Image Preview */}

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

        {/* Buttons */}

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
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-medium text-red-400">
              {error}
            </p>
          </div>
        )}
      </div>

      {/* ========================================================
          RESULT
      ======================================================== */}

      {result && (
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-white">
              Image Analysis Result
            </h2>

            {result.id && (
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
                Analysis ID: #{result.id}
              </span>
            )}
          </div>

          {/* File */}

          <div className="mt-4 rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">
              File
            </p>

            <p className="mt-1 break-all text-slate-200">
              {result.filename}
            </p>

            {result.source && (
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                Source: {result.source}
              </p>
            )}
          </div>

          {/* Status */}

          <div
            className={
              "mt-5 rounded-xl border p-4 " +
              getStatusStyle()
            }
          >
            <p className="font-semibold">
              {result.prediction}
            </p>

            <p className="mt-1 text-sm opacity-80">
              {getPredictionMessage()}
            </p>
          </div>

          {/* Prediction + Confidence */}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {/* Prediction */}

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Prediction
              </p>

              <p
                className={
                  "mt-2 text-3xl font-bold " +
                  getPredictionColor()
                }
              >
                {result.prediction}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                GuardianAI image classification result.
              </p>
            </div>

            {/* Confidence */}

            <div className="rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Confidence
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {confidence.toFixed(2)}%
              </p>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={
                    "h-full rounded-full transition-all " +
                    getProgressColor()
                  }
                  style={{
                    width: `${confidence}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* OCR TEXT */}

          <div className="mt-5 rounded-xl bg-slate-800 p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-400">
                Extracted Text (OCR)
              </p>

              {result.extracted_text && (
                <span className="text-xs text-slate-500">
                  {result.extracted_text.length} characters
                </span>
              )}
            </div>

            <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900 p-4">
              {result.extracted_text ? (
                <p className="whitespace-pre-wrap break-words text-slate-200">
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

          {/* Analyzed Image */}

          {preview && (
            <div className="mt-5 rounded-xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Analyzed Image
              </p>

              <div className="mt-3 flex justify-center rounded-lg border border-slate-700 bg-slate-900 p-4">
                <img
                  src={preview}
                  alt="Analyzed"
                  className="max-h-80 max-w-full rounded-lg object-contain"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ImageAnalysisPage;