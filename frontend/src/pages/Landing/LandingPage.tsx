import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Brain,
  CheckCircle,
  ChevronDown,
  FileText,
  Globe2,
  Lock,
  MessageCircle,
  Play,
  Shield,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import FeatureCard from "../../components/common/FeatureCard";
import StatsCard from "../../components/common/StatsCard";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);

  const goToSignup = () => {
    navigate("/signup");
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <MainLayout>
      {/* =====================================================
          HERO / HOME
      ====================================================== */}
      <section
        id="home"
        className="relative flex min-h-[88vh] items-center overflow-hidden px-6 py-20"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-400">
              <Shield size={17} />
              AI Powered Safety Platform
            </div>

            <h1 className="mt-7 text-5xl font-extrabold leading-tight text-white lg:text-7xl">
              Detect
              <span className="text-cyan-400"> Cyberbullying </span>
              Using AI
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              GuardianAI helps identify potentially harmful online content
              using Artificial Intelligence, Machine Learning, Deep Learning
              and Natural Language Processing.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                text="Get Started"
                onClick={goToSignup}
              />

              <button
                type="button"
                onClick={() => setShowDemo(true)}
                className="flex items-center gap-2 rounded-xl border border-cyan-500 px-6 py-3 font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-white"
              >
                <Play size={18} />
                Watch Demo
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-400" />
                Text Analysis
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-400" />
                Image Analysis
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle size={17} className="text-green-400" />
                AI Assistance
              </div>
            </div>
          </div>

          {/* RIGHT - AI VISUAL */}
          <div className="flex justify-center">
            <div className="relative flex h-[380px] w-[380px] items-center justify-center rounded-full border border-cyan-500/40 bg-slate-900 shadow-2xl shadow-cyan-500/10 lg:h-[470px] lg:w-[470px]">
              <div className="absolute h-[320px] w-[320px] rounded-full border border-cyan-500/20 lg:h-[400px] lg:w-[400px]" />

              <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/20">
                <Bot
                  size={110}
                  strokeWidth={1.2}
                  className="text-cyan-400"
                />
              </div>

              <div className="absolute right-8 top-20 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-xl">
                <p className="text-xs text-slate-400">
                  GuardianAI
                </p>
                <p className="font-semibold text-cyan-400">
                  Protection Active
                </p>
              </div>

              <div className="absolute bottom-20 left-4 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-3 shadow-xl">
                <p className="text-xs text-slate-400">
                  AI Detection
                </p>
                <p className="font-semibold text-green-400">
                  Real-time
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("features")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 transition hover:text-cyan-400"
          aria-label="Scroll to features"
        >
          <ChevronDown size={30} className="animate-bounce" />
        </button>
      </section>

      {/* =====================================================
          FEATURES
      ====================================================== */}
      <section
        id="features"
        className="scroll-mt-20 bg-slate-900 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
              <Sparkles size={16} />
              Powerful Features
            </div>

            <h2 className="mt-5 text-4xl font-bold text-white lg:text-5xl">
              Intelligent Safety Features
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-400">
              GuardianAI combines modern AI technologies to help identify
              harmful online content and provide useful safety insights.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🤖"
              title="AI Chatbot"
              description="Ask GuardianAI questions about cyberbullying, online safety and responsible digital communication."
            />

            <FeatureCard
              icon="🌐"
              title="Multilingual Detection"
              description="Designed to support harmful-content detection across different languages and communication styles."
            />

            <FeatureCard
              icon="🧠"
              title="Deep Learning"
              description="Uses machine learning and deep learning techniques for intelligent text analysis."
            />

            <FeatureCard
              icon="📊"
              title="Real-time Dashboard"
              description="Monitor analysis results, statistics, recent activity and detection trends."
            />

            <FeatureCard
              icon="⚡"
              title="Fast Prediction"
              description="Analyze submitted content and receive prediction results quickly."
            />

            <FeatureCard
              icon="🔒"
              title="Secure Platform"
              description="Authentication and protected dashboard access help keep user information secure."
            />
          </div>

          <div className="mt-14 text-center">
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              Learn More About GuardianAI →
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT
      ====================================================== */}
      <section
        id="about"
        className="scroll-mt-20 bg-slate-950 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
                <Brain size={17} />
                About GuardianAI
              </div>

              <h2 className="mt-5 text-4xl font-bold text-white lg:text-5xl">
                Making Digital Spaces Safer with AI
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                GuardianAI is an AI-powered cyberbullying detection platform
                designed to analyze digital content and identify potentially
                harmful communication.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                The platform combines NLP, Machine Learning, Deep Learning,
                OCR and analytics to provide a complete safety-oriented
                workflow.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <FileText className="text-cyan-400" size={25} />
                  <h3 className="mt-3 font-semibold text-white">
                    Text Analysis
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Analyze written messages for potentially harmful content.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <Globe2 className="text-cyan-400" size={25} />
                  <h3 className="mt-3 font-semibold text-white">
                    Digital Safety
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Promote safer and more responsible online communication.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8">
              <h3 className="text-2xl font-bold text-white">
                GuardianAI Workflow
              </h3>

              <div className="mt-8 space-y-5">
                {[
                  "User submits digital content",
                  "GuardianAI preprocesses the input",
                  "AI model analyzes the content",
                  "Prediction and confidence are generated",
                  "Results are stored for analytics",
                  "Dashboard displays useful insights",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 font-bold text-cyan-400">
                      {index + 1}
                    </div>

                    <p className="text-slate-300">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATISTICS
      ====================================================== */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold text-white lg:text-5xl">
            Platform Capabilities
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
            A unified platform for AI-powered content analysis and safety
            monitoring.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              number="AI"
              title="Powered Detection"
            />

            <StatsCard
              number="24/7"
              title="Safety Assistance"
            />

            <StatsCard
              number="2"
              title="Analysis Modes"
            />

            <StatsCard
              number="1"
              title="Unified Dashboard"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          TECHNOLOGY
      ====================================================== */}
      <section className="bg-slate-950 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold text-white lg:text-5xl">
            Technology Stack
          </h2>

          <div className="mt-14 grid grid-cols-2 gap-5 md:grid-cols-4">
            {[
              ["Python", "🐍"],
              ["Machine Learning", "🤖"],
              ["Deep Learning", "🧠"],
              ["NLP", "💬"],
              ["FastAPI", "⚡"],
              ["PostgreSQL", "🐘"],
              ["React", "⚛️"],
              ["AI Analytics", "📊"],
            ].map(([title, icon]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-7 text-center transition hover:-translate-y-1 hover:border-cyan-500/40"
              >
                <div className="text-4xl">{icon}</div>

                <h3 className="mt-4 font-semibold text-white">
                  {title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WORKFLOW
      ====================================================== */}
      <section className="bg-slate-900 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-4xl font-bold text-white lg:text-5xl">
            How GuardianAI Works
          </h2>

          <p className="mt-4 text-center text-slate-400">
            A simple workflow from content submission to intelligent analysis.
          </p>

          <div className="mt-14 space-y-4">
            {[
              ["01", "User submits a message or image"],
              ["02", "GuardianAI preprocesses the input"],
              ["03", "AI/ML model analyzes the content"],
              ["04", "Toxicity prediction is generated"],
              ["05", "Confidence score is calculated"],
              ["06", "Result is stored in the analysis history"],
              ["07", "Dashboard displays analytics"],
            ].map(([number, text]) => (
              <div
                key={number}
                className="flex items-center gap-5 rounded-2xl border border-slate-800 bg-slate-950 p-5 transition hover:border-cyan-500/40"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 font-bold text-cyan-400">
                  {number}
                </span>

                <span className="text-slate-200">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="bg-cyan-600 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Lock
            size={45}
            className="mx-auto text-white"
          />

          <h2 className="mt-6 text-4xl font-bold text-white lg:text-5xl">
            Ready to Make Social Media Safer?
          </h2>

          <p className="mt-6 text-lg leading-8 text-cyan-50">
            Start using GuardianAI to analyze content, understand detection
            results and explore AI-powered digital safety tools.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={goToSignup}
              className="rounded-xl bg-white px-7 py-3 font-semibold text-cyan-700 transition hover:bg-slate-100"
            >
              Get Started
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="rounded-xl border border-white px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-cyan-700"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FLOATING AI ASSISTANT
      ====================================================== */}
      <div className="fixed bottom-6 right-6 z-[1000]">
        {showAssistant && (
          <div className="mb-4 w-[320px] overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-900 shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10">
                  <Bot size={20} className="text-cyan-400" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    GuardianAI
                  </p>

                  <p className="text-xs text-green-400">
                    AI Assistant
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAssistant(false)}
                className="text-slate-500 hover:text-white"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl bg-slate-800 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  Hi! I&apos;m GuardianAI. I can help you understand
                  cyberbullying, online safety and our AI platform.
                </p>
              </div>

              <button
                type="button"
                onClick={goToLogin}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-400"
              >
                <MessageCircle size={18} />
                Open Full AI Chat
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAssistant((prev) => !prev)}
          className="ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500 text-white shadow-xl shadow-cyan-500/30 transition hover:scale-105 hover:bg-cyan-400"
          aria-label="Open GuardianAI assistant"
        >
          {showAssistant ? (
            <X size={28} />
          ) : (
            <Bot size={30} />
          )}
        </button>
      </div>

      {/* =====================================================
          WATCH DEMO MODAL
      ====================================================== */}
      {showDemo && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm"
          onClick={() => setShowDemo(false)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowDemo(false)}
              className="absolute right-5 top-5 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              aria-label="Close demo"
            >
              <X size={22} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                <Play className="text-cyan-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  GuardianAI Demo
                </h2>

                <p className="text-sm text-slate-500">
                  See how the platform works
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-8">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/10">
                <Bot size={55} className="text-cyan-400" />
              </div>

              <h3 className="mt-6 text-center text-xl font-bold text-white">
                AI-Powered Cyberbullying Detection
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-center leading-7 text-slate-400">
                GuardianAI accepts text and image-based content, analyzes the
                input using AI models and presents the prediction,
                confidence and history through the dashboard.
              </p>

              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-900 p-4 text-center">
                  <FileText className="mx-auto text-cyan-400" />
                  <p className="mt-2 text-sm text-slate-300">
                    Submit Content
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 text-center">
                  <Zap className="mx-auto text-yellow-400" />
                  <p className="mt-2 text-sm text-slate-300">
                    AI Analysis
                  </p>
                </div>

                <div className="rounded-xl bg-slate-900 p-4 text-center">
                  <CheckCircle className="mx-auto text-green-400" />
                  <p className="mt-2 text-sm text-slate-300">
                    Get Result
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={goToSignup}
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-400"
                >
                  Try GuardianAI
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}