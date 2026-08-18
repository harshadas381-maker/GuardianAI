import {
  Bell,
  Search,
  Moon,
  Settings,
  User,
  LogOut,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function TopNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("LOGOUT CLICKED");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <header className="relative z-[999] flex w-full items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-5">

        <h2 className="text-2xl font-bold text-white">
          Dashboard
        </h2>

        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400 pointer-events-none"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-72 rounded-xl bg-slate-800 py-2 pl-10 pr-4 text-white outline-none border border-slate-700 focus:border-cyan-500"
          />

        </div>

      </div>

      {/* RIGHT */}
      <div className="relative z-[999] flex items-center gap-4">

        <button
          type="button"
          className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700"
        >
          <Moon size={20} className="text-white" />
        </button>

        <button
          type="button"
          className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700"
        >
          <Bell size={20} className="text-white" />
        </button>

        <button
          type="button"
          className="rounded-xl bg-slate-800 p-3 hover:bg-slate-700"
        >
          <Settings size={20} className="text-white" />
        </button>

        {/* USER */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-2">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500">
            <User size={18} className="text-white" />
          </div>

          <div>
            <h4 className="text-white font-medium">
              Harshada
            </h4>

            <p className="text-xs text-slate-400">
              AI Developer
            </p>
          </div>

        </div>

        {/* LOGOUT */}
        <div className="relative z-[999]">

          <button
            type="button"
            onClick={handleLogout}
            className="relative z-[1000] flex h-12 w-[120px] cursor-pointer select-none items-center justify-center gap-2 rounded-xl bg-red-500 px-4 text-white font-semibold shadow-lg hover:bg-red-600 active:bg-red-700"
          >
            <LogOut
              size={20}
              className="pointer-events-none"
            />

            <span className="pointer-events-none">
              Logout
            </span>

          </button>

        </div>

      </div>

    </header>
  );
}