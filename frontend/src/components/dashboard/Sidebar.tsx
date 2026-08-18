import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Image,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: MessageSquare,
      label: "AI Chat",
      path: "/ai-chat",
    },
    {
      icon: FileText,
      label: "Text Analysis",
      path: "/text-analysis",
    },
    {
      icon: Image,
      label: "Image Analysis",
      path: "/image-analysis",
    },
    {
      icon: BarChart3,
      label: "Reports",
      path: "/reports",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen">

      {/* Logo */}
      <div className="p-8 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-cyan-400">
          GuardianAI
        </h1>

        <p className="text-slate-400 mt-2">
          AI Dashboard
        </p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-5 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-4 rounded-xl px-4 py-3 transition cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-white"
                  : "text-slate-300 hover:bg-cyan-500 hover:text-white"
              }`}
            >
              <Icon size={22} />

              <span>
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>

      {/* Logout */}
      <div className="p-5 border-t border-slate-800">

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white transition cursor-pointer"
        >
          <LogOut size={22} />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}