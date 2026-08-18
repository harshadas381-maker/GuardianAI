import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTPVerificationForm() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  return (
    <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 shadow-2xl">

      <h2 className="text-4xl font-bold text-center text-cyan-400">
        Verify OTP
      </h2>

      <p className="mt-3 text-center text-slate-400">
        Enter the 6-digit OTP sent to your email.
      </p>

      <form
        className="mt-8 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/reset-password");
        }}
      >

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-center text-2xl tracking-[8px] text-white outline-none focus:border-cyan-400"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white hover:bg-cyan-600 transition"
        >
          Verify OTP
        </button>

      </form>

    </div>
  );
}