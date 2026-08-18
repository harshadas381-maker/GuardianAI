import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function SignupForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!fullName || !email || !password || !confirmPassword) {
      alert("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        full_name: fullName,
        email,
        password,
      });

      alert("Account created successfully!");

      navigate("/login");
    } catch (error: any) {
      console.log("Signup Error:", error.response);
    
      alert(
        JSON.stringify(error.response?.data) ||
        error.message ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-slate-900 p-10 shadow-2xl border border-slate-800">
      <h2 className="text-4xl font-bold text-center text-cyan-400">
        Create Account
      </h2>

      <p className="mt-3 text-center text-slate-400">
        Welcome to GuardianAI
      </p>

      <form
        onSubmit={handleSignup}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="mb-2 block text-slate-300">
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-slate-300">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-slate-300">
            Password
          </label>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Create a password"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="mt-2 text-sm text-cyan-400 hover:text-cyan-300"
          >
            {showPassword
              ? "Hide Password"
              : "Show Password"}
          </button>
        </div>

        <div>
          <label className="mb-2 block text-slate-300">
            Confirm Password
          </label>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            placeholder="Confirm password"
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-cyan-400"
          />
        </div>

        <label className="flex items-center text-sm text-slate-300">
          <input
            type="checkbox"
            className="mr-2"
            required
          />
          I agree to the Terms & Conditions
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-400">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="cursor-pointer text-cyan-400 hover:underline"
        >
          Login
        </span>
      </p>
    </div>
  );
}