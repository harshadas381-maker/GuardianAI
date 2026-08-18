import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import LoginPage from "../pages/Login/LoginPage";
import SignupPage from "../pages/Signup/SignupPage";
import ForgotPasswordPage from "../pages/ForgotPassword/ForgotPasswordPage";
import OTPVerificationPage from "../pages/OTPVerification/OTPVerificationPage";
import ResetPasswordPage from "../pages/ResetPassword/ResetPasswordPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import AIChatPage from "../pages/AIChat/AIChatPage";
import TextAnalysisPage from "../pages/TextAnalysis/TextAnalysisPage";
import ImageAnalysisPage from "../pages/ImageAnalysis/ImageAnalysisPage";
import ReportsPage from "../pages/Reports/ReportsPage";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/verify-otp"
          element={<OTPVerificationPage />}
        />

        <Route
          path="/reset-password"
          element={<ResetPasswordPage />}
        />


        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/ai-chat"
            element={<AIChatPage />}
          />

          <Route
            path="/text-analysis"
            element={<TextAnalysisPage />}
          />

          <Route
            path="/image-analysis"
            element={<ImageAnalysisPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}