import { useEffect, useState } from "react";
import {
  Moon,
  Bell,
  Shield,
  User,
  Save,
  Brain,
  Database,
  Trash2,
  Languages,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

interface GuardianAISettings {
  notifications: boolean;
  darkMode: boolean;
  safeMode: boolean;
  multilingualDetection: boolean;
  imageAnalysis: boolean;
  saveAnalysisHistory: boolean;
  language: string;
}

const DEFAULT_SETTINGS: GuardianAISettings = {
  notifications: true,
  darkMode: true,
  safeMode: true,
  multilingualDetection: true,
  imageAnalysis: true,
  saveAnalysisHistory: true,
  language: "English",
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<GuardianAISettings>(DEFAULT_SETTINGS);

  const [saved, setSaved] = useState(false);

  // ============================================================
  // LOAD SETTINGS
  // ============================================================

  useEffect(() => {
    try {
      const stored = localStorage.getItem(
        "guardianai_settings"
      );

      if (stored) {
        const parsed = JSON.parse(stored);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...parsed,
        });
      }
    } catch (error) {
      console.error("Unable to load GuardianAI settings:", error);
    }
  }, []);

  // ============================================================
  // UPDATE SETTING
  // ============================================================

  const updateSetting = <K extends keyof GuardianAISettings>(
    key: K,
    value: GuardianAISettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = () => {
    localStorage.setItem(
      "guardianai_settings",
      JSON.stringify(settings)
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  // ============================================================
  // CLEAR HISTORY
  // ============================================================

  const handleClearHistory = () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear locally stored GuardianAI settings?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("guardianai_settings");

    setSettings(DEFAULT_SETTINGS);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl pb-10">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your GuardianAI preferences and account settings.
          </p>
        </div>

        {/* =====================================================
            PROFILE
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <User
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Profile
              </h2>

              <p className="text-sm text-slate-500">
                Your GuardianAI account information
              </p>
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Name */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Name
              </label>

              <input
                type="text"
                defaultValue="Harshada"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
            </div>

            {/* Role */}

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Role
              </label>

              <input
                type="text"
                defaultValue="AI Developer"
                disabled
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-400 outline-none"
              />
            </div>

          </div>
        </section>

        {/* =====================================================
            PREFERENCES
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-purple-500/10 p-3">
              <Moon
                className="text-purple-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Preferences
              </h2>

              <p className="text-sm text-slate-500">
                Customize your GuardianAI experience
              </p>
            </div>

          </div>

          {/* Dark Mode */}

          <SettingToggle
            icon={<Moon size={20} />}
            title="Dark Mode"
            description="Use the dark GuardianAI dashboard interface"
            enabled={settings.darkMode}
            onChange={() =>
              updateSetting(
                "darkMode",
                !settings.darkMode
              )
            }
          />

          {/* Notifications */}

          <SettingToggle
            icon={<Bell size={20} />}
            title="Notifications"
            description="Receive alerts about detected harmful content"
            enabled={settings.notifications}
            onChange={() =>
              updateSetting(
                "notifications",
                !settings.notifications
              )
            }
          />

          {/* Safe Mode */}

          <SettingToggle
            icon={<Shield size={20} />}
            title="Safe Analysis Mode"
            description="Enable additional safety checks during analysis"
            enabled={settings.safeMode}
            onChange={() =>
              updateSetting(
                "safeMode",
                !settings.safeMode
              )
            }
            last
          />

        </section>

        {/* =====================================================
            DETECTION SETTINGS
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-cyan-500/10 p-3">
              <Brain
                className="text-cyan-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Detection Settings
              </h2>

              <p className="text-sm text-slate-500">
                Configure GuardianAI analysis capabilities
              </p>
            </div>

          </div>

          {/* Multilingual Detection */}

          <SettingToggle
            icon={<Languages size={20} />}
            title="Multilingual Detection"
            description="Detect harmful content across supported languages"
            enabled={settings.multilingualDetection}
            onChange={() =>
              updateSetting(
                "multilingualDetection",
                !settings.multilingualDetection
              )
            }
          />

          {/* Image Analysis */}

          <SettingToggle
            icon={<Brain size={20} />}
            title="Image & OCR Analysis"
            description="Analyze text extracted from uploaded images"
            enabled={settings.imageAnalysis}
            onChange={() =>
              updateSetting(
                "imageAnalysis",
                !settings.imageAnalysis
              )
            }
            last
          />

        </section>

        {/* =====================================================
            LANGUAGE
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-xl bg-blue-500/10 p-3">
              <Languages
                className="text-blue-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Language
              </h2>

              <p className="text-sm text-slate-500">
                Select your preferred dashboard language
              </p>
            </div>

          </div>

          <label className="mb-2 block text-sm text-slate-400">
            Interface Language
          </label>

          <select
            value={settings.language}
            onChange={(event) =>
              updateSetting(
                "language",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 md:w-1/2"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>

          <p className="mt-2 text-xs text-slate-600">
            Detection can support multiple languages independently
            of the dashboard interface language.
          </p>

        </section>

        {/* =====================================================
            DATA & PRIVACY
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-xl bg-green-500/10 p-3">
              <Database
                className="text-green-400"
                size={22}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Data & Privacy
              </h2>

              <p className="text-sm text-slate-500">
                Control how GuardianAI handles your analysis data
              </p>
            </div>

          </div>

          <SettingToggle
            icon={<Database size={20} />}
            title="Save Analysis History"
            description="Keep analysis results available in your dashboard reports"
            enabled={settings.saveAnalysisHistory}
            onChange={() =>
              updateSetting(
                "saveAnalysisHistory",
                !settings.saveAnalysisHistory
              )
            }
            last
          />

          <div className="mt-6 border-t border-slate-800 pt-6">

            <button
              type="button"
              onClick={handleClearHistory}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              <Trash2 size={17} />
              Reset Local Settings
            </button>

            <p className="mt-2 text-xs text-slate-600">
              This resets locally stored GuardianAI preferences.
              It does not delete database analysis records.
            </p>

          </div>

        </section>

        {/* =====================================================
            SAVE
        ====================================================== */}

        <div className="flex flex-wrap items-center justify-end gap-4">

          {saved && (
            <div className="flex items-center gap-2 text-sm font-medium text-green-400">
              <CheckCircle size={17} />
              Settings saved successfully
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            <Save size={18} />
            Save Settings
          </button>

        </div>

      </div>
    </DashboardLayout>
  );
}

/* ============================================================
   REUSABLE TOGGLE COMPONENT
============================================================ */

interface SettingToggleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
  last?: boolean;
}

function SettingToggle({
  icon,
  title,
  description,
  enabled,
  onChange,
  last = false,
}: SettingToggleProps) {
  return (
    <div
      className={`flex items-center justify-between gap-6 py-5 ${
        !last ? "border-b border-slate-800" : ""
      }`}
    >

      <div className="flex items-center gap-4">

        <div className="text-slate-400">
          {icon}
        </div>

        <div>
          <p className="font-semibold text-white">
            {title}
          </p>

          <p className="text-sm text-slate-500">
            {description}
          </p>
        </div>

      </div>

      <button
        type="button"
        aria-label={`Toggle ${title}`}
        aria-pressed={enabled}
        onClick={onChange}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          enabled
            ? "bg-cyan-500"
            : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            enabled
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>

    </div>
  );
}