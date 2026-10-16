import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
      return;
    }

    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500">
            <ShieldCheck
              size={24}
              className="text-slate-950"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              GuardianAI
            </h1>

            <p className="hidden text-xs text-slate-500 sm:block">
              AI Safety Platform
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <Link
            to="/"
            className="font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection("features")}
            className="font-medium text-slate-300 transition hover:text-cyan-400"
          >
            Features
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
            className="font-medium text-slate-300 transition hover:text-cyan-400"
          >
            About
          </button>

        </div>

        {/* Login / Signup */}
        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="rounded-xl border border-cyan-500 px-4 py-2 font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-slate-950"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="hidden rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400 sm:block"
          >
            Get Started
          </Link>

        </div>

      </div>
    </nav>
  );
}