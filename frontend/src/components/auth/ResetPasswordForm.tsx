import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 shadow-2xl">

      <h2 className="text-4xl font-bold text-center text-cyan-400">
        Reset Password
      </h2>

      <p className="mt-3 text-center text-slate-400">
        Enter your new password.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Password Updated Successfully!");
          navigate("/login");
        }}
      >

        <div>
          <label className="block text-slate-300 mb-2">
            New Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-300 mb-2">
            Confirm Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-cyan-400"
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </button>

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white hover:bg-cyan-600 transition"
        >
          Update Password
        </button>

      </form>

    </div>
  );
}