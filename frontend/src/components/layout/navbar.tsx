import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        <Link
          to="/"
          className="text-3xl font-bold text-cyan-400"
        >
          GuardianAI
        </Link>

        <div className="flex gap-8">
          <Link
            to="/"
            className="text-white hover:text-cyan-400"
          >
            Home
          </Link>

          <Link
            to="/"
            className="text-white hover:text-cyan-400"
          >
            Features
          </Link>

          <Link
            to="/"
            className="text-white hover:text-cyan-400"
          >
            About
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}