import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Login button clicked");
    console.log("Email:", email);

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending login request...");

      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      console.log("Login response:", response.data);

      localStorage.setItem(
        "token",
        response.data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Login Successful!");

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Login Error:", error);

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );

        alert(
          error.response.data?.detail ||
          "Login Failed"
        );
      } else {
        console.error(
          "Network Error:",
          error.message
        );

        alert("Network Error");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">

      <h2 className="text-4xl font-bold text-center text-cyan-400">
        Login
      </h2>

      <p className="mt-3 text-center text-slate-400">
        Welcome back to GuardianAI
      </p>

      <form
        onSubmit={handleLogin}
        className="mt-10 space-y-6"
      >

        {/* Email */}
        <div>
          <label className="block text-slate-300 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white outline-none border border-slate-700 focus:border-cyan-400"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-slate-300 mb-2">
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
            placeholder="Enter your password"
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white outline-none border border-slate-700 focus:border-cyan-400"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="mt-2 text-cyan-400 text-sm"
          >
            {showPassword
              ? "Hide Password"
              : "Show Password"}
          </button>
        </div>

        {/* Remember / Forgot */}
        <div className="flex justify-between items-center text-sm">

          <label className="text-slate-300">
            <input
              type="checkbox"
              className="mr-2"
            />
            Remember Me
          </label>

          <Link
            to="/forgot-password"
            className="text-cyan-400 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan-500 py-3 text-white font-semibold hover:bg-cyan-600 transition disabled:opacity-50"
        >
          {loading
            ? "Logging In..."
            : "Login"}
        </button>

      </form>

      {/* Signup */}
      <p className="mt-8 text-center text-slate-400">
        Don't have an account?{" "}

        <Link
          to="/signup"
          className="text-cyan-400 hover:underline"
        >
          Sign Up
        </Link>
      </p>

    </div>
  );
}