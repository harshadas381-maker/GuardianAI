import SignupForm from "../../components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div className="hidden lg:block">
          <h1 className="text-6xl font-bold text-cyan-400">
            Join GuardianAI
          </h1>

          <p className="mt-6 text-slate-300 text-xl leading-8">
            Create your account and start using AI-powered cyberbullying
            detection, multilingual analysis, and intelligent chatbot support.
          </p>

          <div className="mt-10 text-8xl">
            🛡️🚀
          </div>
        </div>

        {/* Right Side */}
        <SignupForm />

      </div>
    </div>
  );
}