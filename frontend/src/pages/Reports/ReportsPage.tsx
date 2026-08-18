import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  RefreshCw,
  Search,
  Filter,
  X,
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
  created_at: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [predictionFilter, setPredictionFilter] = useState("all");

  // ---------------------------------------
  // Load reports
  // ---------------------------------------
  const fetchReports = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get<Report[]>("/reports");

      console.log("Reports:", response.data);

      setReports(response.data);
    } catch (err: any) {
      console.error("Reports error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ---------------------------------------
  // Summary
  // ---------------------------------------
  const summary = useMemo(() => {
    const toxic = reports.filter(
      (report) =>
        report.prediction?.toLowerCase() === "toxic"
    ).length;

    const safe = reports.filter(
      (report) =>
        report.prediction?.toLowerCase() === "safe"
    ).length;

    const image = reports.filter(
      (report) =>
        report.source?.toLowerCase() === "image"
    ).length;

    const text = reports.filter(
      (report) =>
        report.source?.toLowerCase() !== "image"
    ).length;

    return {
      total: reports.length,
      toxic,
      safe,
      image,
      text,
    };
  }, [reports]);

  // ---------------------------------------
  // Filter reports
  // ---------------------------------------
  const filteredReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reports.filter((report) => {
      const text = report.text?.toLowerCase() || "";
      const filename = report.filename?.toLowerCase() || "";
      const prediction =
        report.prediction?.toLowerCase() || "";
      const source =
        report.source?.toLowerCase() || "";

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

  // ---------------------------------------
  // Clear filters
  // ---------------------------------------
  const clearFilters = () => {
    setSearch("");
    setSourceFilter("all");
    setPredictionFilter("all");
  };

  const hasFilters =
    search.trim() !== "" ||
    sourceFilter !== "all" ||
    predictionFilter !== "all";

  // ---------------------------------------
  // Date formatting
  // ---------------------------------------
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString();
  };

  // ---------------------------------------
  // Confidence
  // ---------------------------------------
  const getConfidence = (confidence: number) => {
    return Math.min(
      Math.max(Number(confidence) || 0, 0),
      100
    );
  };

  // ---------------------------------------
  // Loading
  // ---------------------------------------
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-xl text-cyan-400">
            Loading reports...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ---------------------------------------
  // Error
  // ---------------------------------------
  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h2 className="text-xl font-bold text-red-400">
            Reports Error
          </h2>

          <p className="mt-2 text-red-300">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchReports()}
            className="mt-5 rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* =====================================
          HEADER
      ====================================== */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Reports
          </h1>

          <p className="mt-2 text-slate-400">
            View your complete GuardianAI analysis history.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchReports(true)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
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

      {/* =====================================
          SUMMARY
      ====================================== */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Total Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {summary.total}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Toxic Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-red-400">
            {summary.toxic}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Safe Reports
          </p>

          <p className="mt-2 text-3xl font-bold text-green-400">
            {summary.safe}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Text Analysis
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-400">
            {summary.text}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">
            Image Analysis
          </p>

          <p className="mt-2 text-3xl font-bold text-purple-400">
            {summary.image}
          </p>
        </div>
      </div>

      {/* =====================================
          SEARCH + FILTERS
      ====================================== */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div className="flex flex-col gap-4 xl:flex-row">

          {/* Search */}
          <div className="relative flex-1">
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
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-11 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
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
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none focus:border-cyan-500"
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
              setPredictionFilter(e.target.value)
            }
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none focus:border-cyan-500"
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
          <span>
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
              className="text-cyan-400 hover:text-cyan-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* =====================================
          REPORT LIST
      ====================================== */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

        <div className="border-b border-slate-800 p-6">
          <h2 className="text-xl font-bold text-white">
            Analysis History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Text and image analyses are shown here.
          </p>
        </div>

        {/* No reports */}
        {reports.length === 0 ? (
          <div className="p-10 text-center">
            <FileText
              size={40}
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

          /* No filtered results */
          <div className="p-10 text-center">
            <Search
              size={40}
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

          <div className="divide-y divide-slate-800">

            {filteredReports.map((report) => {
              const prediction =
                report.prediction?.toLowerCase() || "";

              const source =
                report.source?.toLowerCase() || "";

              const isToxic =
                prediction === "toxic";

              const isSafe =
                prediction === "safe";

              const isImage =
                source === "image";

              const confidence =
                getConfidence(report.confidence);

              return (
                <div
                  key={report.id}
                  className="p-6 transition hover:bg-slate-800/40"
                >
                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                    {/* Main Information */}
                    <div className="min-w-0 flex-1">

                      {/* Source + Prediction */}
                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={
                            "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold " +
                            (isImage
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-blue-500/10 text-blue-400")
                          }
                        >
                          {isImage ? (
                            <ImageIcon size={15} />
                          ) : (
                            <FileText size={15} />
                          )}

                          {isImage
                            ? "Image Analysis"
                            : "Text Analysis"}
                        </span>

                        <span
                          className={
                            "rounded-full px-3 py-1 text-sm font-semibold " +
                            (isToxic
                              ? "bg-red-500/10 text-red-400"
                              : isSafe
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400")
                          }
                        >
                          {report.prediction}
                        </span>

                        <span className="text-sm text-slate-500">
                          #{report.id}
                        </span>
                      </div>

                      {/* Filename */}
                      {isImage &&
                        report.filename && (
                          <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-purple-400">
                              Image File
                            </p>

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
                            <p className="whitespace-pre-wrap break-words text-slate-200">
                              {report.text}
                            </p>
                          ) : (
                            <p className="text-slate-500">
                              No text available.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <p className="mt-3 text-sm text-slate-500">
                        Analyzed on{" "}
                        {formatDate(
                          report.created_at
                        )}
                      </p>
                    </div>

                    {/* Confidence */}
                    <div className="w-full shrink-0 xl:w-44">
                      <p className="text-sm text-slate-400">
                        Confidence
                      </p>

                      <p className="mt-1 text-2xl font-bold text-white">
                        {confidence.toFixed(2)}%
                      </p>

                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={
                            "h-full rounded-full transition-all " +
                            (isToxic
                              ? "bg-red-500"
                              : isSafe
                              ? "bg-green-500"
                              : "bg-yellow-500")
                          }
                          style={{
                            width: `${confidence}%`,
                          }}
                        />
                      </div>

                      <p className="mt-2 text-xs text-slate-500">
                        {isToxic
                          ? "Potentially harmful content detected"
                          : isSafe
                          ? "No significant toxicity detected"
                          : "Analysis result available"}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}