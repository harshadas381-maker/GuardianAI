import { useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
    const navigate = useNavigate();
    return (
      <div className="rounded-3xl border border-slate-700 bg-slate-900 p-10 shadow-2xl">
        <h2 className="text-4xl font-bold text-center text-cyan-400">
          Forgot Password
        </h2>
  
        <p className="mt-3 text-center text-slate-400">
          Enter your registered email address to receive an OTP.
        </p>
  
        <form className="mt-8 space-y-6"onSubmit={(e) => {
            e.preventDefault();
            navigate("/verify-otp");
            }}>

        <div>
            <label className="block text-slate-300 mb-2">
                Email Address
            </label>

            <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-cyan-400"/>
        </div>

        <button
            type="submit"
            className="w-full rounded-xl bg-cyan-500 py-3 text-white font-semibold hover:bg-cyan-600 transition">
            Send OTP
        </button>
        </form>
      </div>
    );
  }