import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Filter,
  X,
  ShieldCheck,
  ShieldAlert,
  MessageCircleWarning,
  BarChart3,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../api/api";

interface Report {
  id: number;
  text: string;
  prediction: string;
  confidence: number;
  source: "text" | "image" | string;
  filename?: string | null;
  created_at: string | null;
}

type PredictionFilter =
  | "all"
  | "toxic"
  | "safe"
  | "cyberbullying"
  | "offensive"
  | "hate";

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [predictionFilter, setPredictionFilter] =
    useState<PredictionFilter>("all");

  // =========================================================
  // LOAD REPORTS
  // =========================================================

  const fetchReports = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get<Report[]>("/reports");

      console.log("GuardianAI Reports:", response.data);

      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error("Reports error:", err);

      setError(
        err?.response?.data?.detail ||
          "Unable to load reports. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // =========================================================
  // NORMALIZE PREDICTION
  // =========================================================

  const normalizePrediction = (prediction?: string) => {
    return prediction?.trim().toLowerCase() || "unknown";
  };

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary = useMemo(() => {
    const toxic = reports.filter(
      (report) =>
        normalizePrediction(report.prediction) === "toxic"
    ).length;

    const safe = reports.filter(
      (report) =>
        normalizePrediction(report.prediction) === "safe"
    ).length;

    const cyberbullying = reports.filter(
      (report) =>
        normalizePrediction(report.prediction) ===
        "cyberbullying"
    ).length;

    const image = reports.filter(
      (report) =>
        report.source?.trim().toLowerCase() === "image"
    ).length;

    const text = reports.filter(
      (report) =>
        report.source?.trim().toLowerCase() !== "image"
    ).length;

    return {
      total: reports.length,
      toxic,
      safe,
      cyberbullying,
      image,
      text,
    };
  }, [reports]);

  // =========================================================
  // FILTER REPORTS
  // =========================================================

  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const text = report.text?.toLowerCase() || "";
      const filename = report.filename?.toLowerCase() || "";
      const prediction =
        normalizePrediction(report.prediction);
      const source =
        report.source?.trim().toLowerCase() || "";

      const matchesSearch =
        normalizedSearch === "" ||
        text.includes(normalizedSearch) ||
        filename.includes(normalizedSearch) ||
        prediction.includes(normalizedSearch) ||
        source.includes(normalizedSearch) ||
        String(report.id).includes(normalizedSearch);

      const matchesSource =
        sourceFilter === "all" ||
        source === sourceFilter;

      const matchesPrediction =
        predictionFilter === "all" ||
        prediction === predictionFilter;

      return (
        matchesSearch &&
        matchesSource &&
        matchesPrediction
      );
    });
  }, [
    reports,
    search,
    sourceFilter,
    predictionFilter,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setSourceFilter("all");
    setPredictionFilter("all");
  };

  const hasFilters =
    search.trim() !== "" ||
    sourceFilter !== "all" ||
    predictionFilter !== "all";

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date: string | null) => {
    if (!date) {
      return "Unknown date";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  // =========================================================
  // CONFIDENCE
  // =========================================================

  const getConfidence = (confidence: number) => {
    return Math.min(
      Math.max(Number(confidence) || 0, 0),
      100
    );
  };

  // =========================================================
  // PREDICTION CONFIG
  // =========================================================

  const getPredictionConfig = (prediction: string) => {
    const normalized = normalizePrediction(prediction);

    if (normalized === "toxic") {
      return {
        label: "Toxic",
        icon: <ShieldAlert size={15} />,
        badge:
          "bg-red-500/10 text-red-400 border border-red-500/20",
        progress: "bg-red-500",
        message: "Potentially harmful content detected",
      };
    }

    if (normalized === "safe") {
      return {
        label: "Safe",
        icon: <ShieldCheck size={15} />,
        badge:
          "bg-green-500/10 text-green-400 border border-green-500/20",
        progress: "bg-green-500",
        message: "No significant toxicity detected",
      };
    }

    if (normalized === "cyberbullying") {
      return {
        label: "Cyberbullying",
        icon: <MessageCircleWarning size={15} />,
        badge:
          "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        progress: "bg-orange-500",
        message: "Potential cyberbullying detected",
      };
    }

    return {
      label: prediction || "Unknown",
      icon: <BarChart3 size={15} />,
      badge:
        "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
      progress: "bg-yellow-500",
      message: "Analysis result available",
    };
  };

  // =========================================================
  // SOURCE CONFIG
  // =========================================================

  const getSourceConfig = (source: string) => {
    const normalized =
      source?.trim().toLowerCase();

    if (normalized === "image") {
      return {
        label: "Image Analysis",
        icon: <ImageIcon size={15} />,
        badge:
          "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      };
    }

    return {
      label: "Text Analysis",
      icon: <FileText size={15} />,
      badge:
        "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    };
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <RefreshCw
              size={40}
              className="mx-auto animate-spin text-cyan-400"
            />

            <p className="mt-4 text-lg font-medium text-slate-300">
              Loading GuardianAI reports...
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Fetching your analysis history
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
          <div className="flex items-start gap-4">
            <ShieldAlert
              size={32}
              className="shrink-0 text-red-400"
            />

            <div>
              <h2 className="text-xl font-bold text-red-400">
                Reports Error
              </h2>

              <p className="mt-2 text-red-300">
                {error}
              </p>

              <button
                type="button"
                onClick={() => fetchReports()}
                className="mt-5 flex items-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
              >
                <RefreshCw size={17} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* ===================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/10 p-2.5">
                <FileText
                  size={25}
                  className="text-cyan-400"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Reports
              </h1>
            </div>

            <p className="mt-3 text-slate-400">
              View your complete GuardianAI analysis history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchReports(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-300 shadow-sm transition hover:border-cyan-500/40 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={
                refreshing ? "animate-spin" : ""
              }
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>
        </div>

        {/* ===================================================
            SUMMARY CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">

          {/* Total */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-cyan-500/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Total Reports
              </p>

              <FileText
                size={20}
                className="text-cyan-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-cyan-400">
              {summary.total}
            </p>
          </div>

          {/* Toxic */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-red-500/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Toxic
              </p>

              <ShieldAlert
                size={20}
                className="text-red-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {summary.toxic}
            </p>
          </div>

          {/* Safe */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-green-500/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Safe
              </p>

              <ShieldCheck
                size={20}
                className="text-green-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-green-400">
              {summary.safe}
            </p>
          </div>

          {/* Cyberbullying */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-orange-500/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Cyberbullying
              </p>

              <MessageCircleWarning
                size={20}
                className="text-orange-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-orange-400">
              {summary.cyberbullying}
            </p>
          </div>

          {/* Text */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-blue-500/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Text Analysis
              </p>

              <FileText
                size={20}
                className="text-blue-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-blue-400">
              {summary.text}
            </p>
          </div>

          {/* Image */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm transition hover:border-purple-500/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-400">
                Image Analysis
              </p>

              <ImageIcon
                size={20}
                className="text-purple-400"
              />
            </div>

            <p className="mt-3 text-3xl font-bold text-purple-400">
              {summary.image}
            </p>
          </div>
        </div>

        {/* ===================================================
            SEARCH + FILTERS
        ==================================================== */}

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm">

          <div className="flex flex-col gap-4 xl:flex-row">

            {/* Search */}
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search text, filename, ID or prediction..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-11 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Source */}
            <div className="flex items-center gap-2">
              <Filter
                size={18}
                className="text-slate-500"
              />

              <select
                value={sourceFilter}
                onChange={(e) =>
                  setSourceFilter(e.target.value)
                }
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none transition focus:border-cyan-500"
              >
                <option value="all">
                  All Sources
                </option>

                <option value="text">
                  Text Analysis
                </option>

                <option value="image">
                  Image Analysis
                </option>
              </select>
            </div>

            {/* Prediction */}
            <select
              value={predictionFilter}
              onChange={(e) =>
                setPredictionFilter(
                  e.target.value as PredictionFilter
                )
              }
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none transition focus:border-cyan-500"
            >
              <option value="all">
                All Predictions
              </option>

              <option value="toxic">
                Toxic
              </option>

              <option value="safe">
                Safe
              </option>

              <option value="cyberbullying">
                Cyberbullying
              </option>

              <option value="offensive">
                Offensive
              </option>

              <option value="hate">
                Hate
              </option>

            </select>

            {/* Clear */}
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={17} />
                Clear
              </button>
            )}
          </div>

          {/* Result count */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-slate-500">
              Showing{" "}
              <span className="font-semibold text-cyan-400">
                {filteredReports.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {reports.length}
              </span>{" "}
              reports
            </span>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-cyan-400 transition hover:text-cyan-300"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* ===================================================
            ANALYSIS HISTORY
        ==================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">

          <div className="border-b border-slate-800 p-6">
            <div className="flex items-center gap-3">
              <BarChart3
                size={21}
                className="text-cyan-400"
              />

              <h2 className="text-xl font-bold text-white">
                Analysis History
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Text and image analyses are shown here.
            </p>
          </div>

          {/* =================================================
              NO REPORTS
          ================================================= */}

          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText
                size={44}
                className="mx-auto text-slate-700"
              />

              <p className="mt-4 text-slate-400">
                No analysis reports available yet.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Analyze some text or images to generate
                reports.
              </p>
            </div>
          ) : filteredReports.length === 0 ? (

            /* ===============================================
               NO FILTER RESULTS
            ================================================ */

            <div className="p-12 text-center">
              <Search
                size={44}
                className="mx-auto text-slate-700"
              />

              <p className="mt-4 text-slate-400">
                No reports match your filters.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Clear Filters
              </button>
            </div>

          ) : (

            /* ===============================================
               REPORT LIST
            ================================================ */

            <div className="divide-y divide-slate-800">

              {filteredReports.map((report) => {
                const prediction =
                  normalizePrediction(
                    report.prediction
                  );

                const source =
                  report.source?.trim().toLowerCase() ||
                  "text";

                const isImage =
                  source === "image";

                const predictionConfig =
                  getPredictionConfig(
                    report.prediction
                  );

                const sourceConfig =
                  getSourceConfig(report.source);

                const confidence =
                  getConfidence(report.confidence);

                return (
                  <div
                    key={report.id}
                    className="p-5 transition hover:bg-slate-800/30 md:p-6"
                  >
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                      {/* =================================
                          MAIN REPORT INFORMATION
                      ================================== */}

                      <div className="min-w-0 flex-1">

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">

                          {/* Source */}
                          <span
                            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${sourceConfig.badge}`}
                          >
                            {sourceConfig.icon}
                            {sourceConfig.label}
                          </span>

                          {/* Prediction */}
                          <span
                            className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${predictionConfig.badge}`}
                          >
                            {predictionConfig.icon}
                            {predictionConfig.label}
                          </span>

                          {/* ID */}
                          <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-medium text-slate-500">
                            #{report.id}
                          </span>
                        </div>

                        {/* Image filename */}
                        {isImage &&
                          report.filename && (
                            <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                              <div className="flex items-center gap-2">
                                <ImageIcon
                                  size={16}
                                  className="text-purple-400"
                                />

                                <p className="text-xs font-semibold uppercase tracking-wide text-purple-400">
                                  Image File
                                </p>
                              </div>

                              <p className="mt-1 break-all text-sm text-slate-200">
                                {report.filename}
                              </p>
                            </div>
                          )}

                        {/* Text / OCR */}
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {isImage
                              ? "Extracted Text (OCR)"
                              : "Analyzed Text"}
                          </p>

                          <div className="mt-2 rounded-xl border border-slate-800 bg-slate-950 p-4">
                            {report.text ? (
                              <p
                                dir="auto"
                                className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200"
                              >
                                {report.text}
                              </p>
                            ) : (
                              <p className="text-sm italic text-slate-500">
                                No text available.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Date */}
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>
                            Analyzed on
                          </span>

                          <span className="text-slate-400">
                            {formatDate(
                              report.created_at
                            )}
                          </span>
                        </div>
                      </div>

                      {/* =================================
                          CONFIDENCE
                      ================================== */}

                      <div className="w-full shrink-0 rounded-xl border border-slate-800 bg-slate-950/60 p-4 xl:w-52">

                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-400">
                            Confidence
                          </p>

                          <span
                            className={`text-xs font-semibold ${
                              prediction === "toxic"
                                ? "text-red-400"
                                : prediction === "safe"
                                ? "text-green-400"
                                : prediction ===
                                  "cyberbullying"
                                ? "text-orange-400"
                                : "text-yellow-400"
                            }`}
                          >
                            {predictionConfig.label}
                          </span>
                        </div>

                        <p className="mt-2 text-2xl font-bold text-white">
                          {confidence.toFixed(2)}%
                        </p>

                        {/* Progress */}
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all ${predictionConfig.progress}`}
                            style={{
                              width: `${confidence}%`,
                            }}
                          />
                        </div>

                        <p className="mt-3 text-xs leading-5 text-slate-500">
                          {predictionConfig.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===================================================
            FOOTER INFORMATION
        ==================================================== */}

        {reports.length > 0 && (
          <div className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-slate-500">
              <BarChart3
                size={17}
                className="text-cyan-400"
              />

              <span>
                GuardianAI has processed{" "}
                <span className="font-semibold text-white">
                  {reports.length}
                </span>{" "}
                analyses.
              </span>
            </div>

            <span className="text-slate-600">
              Live data from GuardianAI backend
            </span>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}