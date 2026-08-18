import {
  MessageSquare,
  FileText,
  Image,
  FileBarChart,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Analyze Text",
    description: "Detect cyberbullying and toxic content in text.",
    icon: FileText,
    path: "/text-analysis",
  },
  {
    title: "Upload Image",
    description: "Analyze images and detect harmful content using OCR.",
    icon: Image,
    path: "/image-analysis",
  },
  {
    title: "AI Chat",
    description: "Talk with GuardianAI about cyberbullying concerns.",
    icon: MessageSquare,
    path: "/ai-chat",
  },
  {
    title: "View Reports",
    description: "Review your complete analysis history and results.",
    icon: FileBarChart,
    path: "/reports",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Quickly access GuardianAI's main features.
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.path)}
              className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800/80 hover:shadow-lg hover:shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              {/* Icon */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 transition-colors group-hover:bg-cyan-500">
                <Icon
                  size={24}
                  className="text-cyan-400 transition-colors group-hover:text-white"
                />
              </div>

              {/* Title */}
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {action.title}
                </h3>

                <ArrowRight
                  size={18}
                  className="text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cyan-400"
                />
              </div>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {action.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}