import { useEffect, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import WeeklyAnalysisChart from "../../components/dashboard/charts/WeeklyAnalysisChart";
import DetectionPieChart from "../../components/dashboard/charts/DetectionPieChart";
import ProfileCard from "../../components/dashboard/ProfileCard";
import RecentActivity from "../../components/dashboard/RecentActivity";
import QuickActions from "../../components/dashboard/QuickActions";

import {
  getDashboardStats,
  type DashboardStats,
} from "../../api/dashboardApi";

import {
  DASHBOARD_REFRESH_EVENT,
} from "../../api/dashboardEvents";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardStats = async () => {
      try {
        const data = await getDashboardStats();

        console.log("Dashboard stats:", data);

        if (isMounted) {
          setStats(data);
          setError("");
        }
      } catch (err: any) {
        console.error("Dashboard stats error:", err);

        if (isMounted) {
          setError(
            err?.response?.data?.detail ||
              "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Initial fetch
    fetchDashboardStats();

    // Refresh immediately after a new analysis
    const handleDashboardRefresh = () => {
      console.log("Dashboard refresh event received.");
      fetchDashboardStats();
    };

    window.addEventListener(
      DASHBOARD_REFRESH_EVENT,
      handleDashboardRefresh
    );

    // Backup refresh every 10 seconds
    const interval = setInterval(() => {
      fetchDashboardStats();
    }, 10000);

    return () => {
      isMounted = false;

      window.removeEventListener(
        DASHBOARD_REFRESH_EVENT,
        handleDashboardRefresh
      );

      clearInterval(interval);
    };
  }, []);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

            <p className="mt-4 text-lg text-cyan-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
          <h2 className="text-xl font-bold text-red-400">
            Dashboard Error
          </h2>

          <p className="mt-2 text-red-300">
            {error}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ============================================================
  // NO DATA
  // ============================================================

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-slate-400">
            No dashboard data available.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome to GuardianAI Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            AI-Powered Multilingual Cyberbullying Detection Platform
          </p>
        </div>

        {/* =====================================================
            MAIN STATISTICS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Total Analyses"
            value={stats.total}
            color="text-cyan-400"
          />

          <StatCard
            title="Toxic Content"
            value={stats.toxic}
            color="text-red-400"
          />

          <StatCard
            title="Safe Content"
            value={stats.safe}
            color="text-green-400"
          />

          <StatCard
            title="Cyberbullying"
            value={stats.cyberbullying}
            color="text-purple-400"
          />

          <StatCard
            title="Harmful Rate"
            value={`${stats.harmful_rate.toFixed(2)}%`}
            color="text-yellow-400"
          />

        </div>

        {/* =====================================================
            KEY INSIGHTS
        ====================================================== */}

        <div>
          <h2 className="mb-4 text-xl font-bold text-white">
            Key Insights
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

            {/* Harmful Rate */}
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">
                  Harmful Rate
                </p>

                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400">
                  Risk
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-yellow-400">
                {stats.harmful_rate.toFixed(2)}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Percentage of analyses classified as harmful
              </p>
            </div>

            {/* Cyberbullying Rate */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">
                  Cyberbullying Rate
                </p>

                <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                  Detection
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-purple-400">
                {stats.cyberbullying_rate.toFixed(2)}%
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Percentage of total analyses identified as cyberbullying
              </p>
            </div>

            {/* Safe Rate */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-400">
                  Safe Rate
                </p>

                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                  Safe
                </span>
              </div>

              <p className="mt-3 text-3xl font-bold text-green-400">
                {stats.total > 0
                  ? ((stats.safe / stats.total) * 100).toFixed(2)
                  : "0.00"}
                %
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Percentage of analyses classified as safe
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            ANALYSIS SOURCES
        ====================================================== */}

        <div>
          <h2 className="mb-4 text-xl font-bold text-white">
            Analysis Sources
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

            <StatCard
              title="Text Analyses"
              value={stats.text_analyses}
              color="text-blue-400"
            />

            <StatCard
              title="Image Analyses"
              value={stats.image_analyses}
              color="text-purple-400"
            />

          </div>
        </div>

        {/* =====================================================
            DETECTION SUMMARY
        ====================================================== */}

        <div>
          <h2 className="mb-4 text-xl font-bold text-white">
            Detection Summary
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

            {/* Safe */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
              <p className="text-sm text-slate-400">
                Safe Content
              </p>

              <p className="mt-2 text-3xl font-bold text-green-400">
                {stats.safe}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Content classified as safe
              </p>
            </div>

            {/* Toxic */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
              <p className="text-sm text-slate-400">
                Toxic Content
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                {stats.toxic}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Potentially harmful content
              </p>
            </div>

            {/* Cyberbullying */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5">
              <p className="text-sm text-slate-400">
                Cyberbullying
              </p>

              <p className="mt-2 text-3xl font-bold text-purple-400">
                {stats.cyberbullying}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Potential cyberbullying detected
              </p>
            </div>

            {/* Harmful */}
            <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
              <p className="text-sm text-slate-400">
                Harmful Content
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-400">
                {stats.harmful}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                All non-safe classifications
              </p>
            </div>

          </div>
        </div>

        {/* =====================================================
            CHARTS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <WeeklyAnalysisChart
            data={stats.weekly}
          />

        <DetectionPieChart
          toxic={stats.toxic}
          safe={stats.safe}
          cyberbullying={stats.cyberbullying}
        />
        </div>

        {/* =====================================================
            PROFILE + RECENT ACTIVITY
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <ProfileCard />

          <RecentActivity
            activities={stats.recent_activity}
          />

        </div>

        {/* =====================================================
            QUICK ACTIONS
        ====================================================== */}

        <div>
          <QuickActions />
        </div>

      </div>
    </DashboardLayout>
  );
}