import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}