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
            err.response?.data?.detail ||
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

    // Refresh immediately when a new analysis is completed
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

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-xl text-cyan-400">
            Loading dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
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

  // ==========================================
  // NO DATA
  // ==========================================
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

        {/* =====================================
            HEADER
        ====================================== */}
        <div>
          <h1 className="text-4xl font-bold text-white">
            Welcome to GuardianAI Dashboard
          </h1>

          <p className="mt-2 text-slate-400">
            AI Powered Cyberbullying Detection Platform
          </p>
        </div>

        {/* =====================================
            MAIN STATISTICS
        ====================================== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

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
            title="Toxicity Rate"
            value={`${stats.toxicity_rate}%`}
            color="text-yellow-400"
          />

        </div>

        {/* =====================================
            TEXT / IMAGE STATISTICS
        ====================================== */}
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

        {/* =====================================
            CHARTS
        ====================================== */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <WeeklyAnalysisChart
            data={stats.weekly}
          />

          <DetectionPieChart
            toxic={stats.toxic}
            safe={stats.safe}
          />

        </div>

        {/* =====================================
            PROFILE + RECENT ACTIVITY
        ====================================== */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

          <ProfileCard />

          <RecentActivity
            activities={stats.recent_activity}
          />

        </div>

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}
        <div>
          <QuickActions />
        </div>

      </div>
    </DashboardLayout>
  );
}