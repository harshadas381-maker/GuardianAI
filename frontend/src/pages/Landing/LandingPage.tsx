import MainLayout from "../../components/layout/MainLayout";
import Button from "../../components/common/Button";
import FeatureCard from "../../components/common/FeatureCard";
import StatsCard from "../../components/common/StatsCard";


export default function LandingPage() {
  return (
    <MainLayout>
      <section className="min-h-[85vh] flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Side */}
          <div>
            <span className="inline-block rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-400 font-medium">
              🛡 AI Powered Safety Platform
            </span>

            <h1 className="mt-6 text-5xl lg:text-6xl font-extrabold leading-tight">
              Detect
              <span className="text-cyan-400"> Cyberbullying </span>
              Using AI
            </h1>

            <p className="mt-6 text-slate-300 text-lg leading-8">
              GuardianAI detects harmful messages in multiple languages using
              Artificial Intelligence, Machine Learning, Deep Learning and NLP.
            </p>

            <div className="mt-10 flex gap-4">
              <Button text="Get Started" />
              <Button text="Watch Demo" variant="secondary" />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex justify-center">
            <div className="h-96 w-96 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-500">
              <span className="text-8xl">🤖</span>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
<section className="py-24 bg-slate-900">
  <div className="max-w-7xl mx-auto px-6">

    <div className="text-center">
      <h2 className="text-5xl font-bold text-cyan-400">
        Powerful AI Features
      </h2>

      <p className="mt-4 text-slate-400 text-lg">
        GuardianAI combines Artificial Intelligence, Machine Learning,
        Deep Learning and NLP to provide intelligent cyberbullying detection.
      </p>
    </div>

    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      <FeatureCard
        icon="🤖"
        title="AI Chatbot"
        description="Intelligent chatbot for cyberbullying awareness and guidance."
      />

      <FeatureCard
        icon="🌍"
        title="Multilingual Detection"
        description="Detects harmful messages in multiple languages."
      />

      <FeatureCard
        icon="🧠"
        title="Deep Learning"
        description="Uses Transformer and Neural Network models for accurate prediction."
      />

      <FeatureCard
        icon="📊"
        title="Real-time Dashboard"
        description="Visualize analytics, reports and cyberbullying statistics."
      />

      <FeatureCard
        icon="⚡"
        title="Fast Prediction"
        description="Instant prediction with optimized AI models."
      />

      <FeatureCard
        icon="🔒"
        title="Secure Platform"
        description="User authentication and encrypted data storage."
      />

    </div>

  </div>
</section>
<section className="py-24 bg-slate-950">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-5xl font-bold text-center text-cyan-400">
      Platform Statistics
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">

      <StatsCard
        number="99%"
        title="Detection Accuracy"
      />

      <StatsCard
        number="100+"
        title="Supported Languages"
      />

      <StatsCard
        number="1M+"
        title="Messages Analysed"
      />

      <StatsCard
        number="24/7"
        title="AI Monitoring"
      />

    </div>

  </div>
</section>


<section className="py-24 bg-slate-900">

    <div className="max-w-7xl mx-auto px-6">

      <h2 className="text-5xl font-bold text-center text-cyan-400">
        Technology Stack
      </h2>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          🐍
          <h3 className="mt-4 font-bold">Python</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          🤖
          <h3 className="mt-4 font-bold">Machine Learning</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          🧠
          <h3 className="mt-4 font-bold">Deep Learning</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          💬
          <h3 className="mt-4 font-bold">NLP</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          ⚡
          <h3 className="mt-4 font-bold">FastAPI</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          🐘
          <h3 className="mt-4 font-bold">PostgreSQL</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          ⚛️
          <h3 className="mt-4 font-bold">React</h3>
        </div>

        <div className="rounded-xl bg-slate-800 p-8 text-center">
          ☁️
          <h3 className="mt-4 font-bold">Cloud Deployment</h3>
        </div>

      </div>

    </div>

  </section>


  {/* Workflow Section */}
<section className="py-24 bg-slate-950">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-5xl font-bold text-center text-cyan-400">
      How GuardianAI Works
    </h2>

    <p className="text-center text-slate-400 mt-4">
      End-to-end AI workflow for detecting and preventing cyberbullying.
    </p>

    <div className="mt-16 flex flex-col items-center gap-6">

      {[
        "👤 User Posts a Message",
        "📱 Social Media Platform",
        "⚡ FastAPI Backend Receives Request",
        "🧠 AI/ML/NLP Model Analyzes Text",
        "🚨 Cyberbullying Detection",
        "📊 Severity Score Generated",
        "🤖 AI Chatbot Responds",
        "📈 Dashboard Displays Analytics",
        "🛡️ Admin Panel Monitors Reports"
      ].map((step, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="rounded-xl bg-slate-900 border border-slate-700 px-8 py-4 text-lg font-medium w-80 text-center">
            {step}
          </div>

          {index < 8 && (
            <div className="text-cyan-400 text-3xl my-2">
              ↓
            </div>
          )}
        </div>
      ))}

    </div>

  </div>
</section>


{/* Call To Action Section */}
<section className="py-24 bg-cyan-600">
  <div className="max-w-5xl mx-auto px-6 text-center">

    <h2 className="text-5xl font-bold text-white">
      Ready to Make Social Media Safer?
    </h2>

    <p className="mt-6 text-xl text-cyan-100">
      Join GuardianAI and use the power of Artificial Intelligence,
      Machine Learning, Deep Learning, and NLP to detect and prevent
      cyberbullying across multiple social media platforms.
    </p>

    <div className="mt-10 flex flex-wrap justify-center gap-6">

      <Button text="Get Started" />

      <Button
        text="Learn More"
        variant="secondary"
      />

    </div>

  </div>
</section>

    </MainLayout>
  );
}