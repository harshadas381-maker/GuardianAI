import OTPVerificationForm from "../../components/auth/OTPVerificationForm";

export default function OTPVerificationPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <OTPVerificationForm />
      </div>
    </div>
  );
}