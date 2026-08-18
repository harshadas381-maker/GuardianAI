import { useEffect, useState } from "react";

interface User {
  id: number;
  full_name: string;
  email: string;
}

export default function ProfileCard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Unable to load user profile:", error);
    }
  }, []);

  const fullName = user?.full_name || "GuardianAI User";
  const email = user?.email || "Email not available";

  const initial =
    fullName.trim().charAt(0).toUpperCase() || "G";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center gap-4">
        {/* Profile Initial */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-white">
          {initial}
        </div>

        {/* User Name */}
        <div>
          <h2 className="text-xl font-semibold text-white">
            {fullName}
          </h2>

          <p className="text-slate-400">
            AI & Data Science Student
          </p>
        </div>
      </div>

      {/* User Information */}
      <div className="mt-6 space-y-2 text-slate-300">
        <p>📧 {email}</p>
        <p>🎓 MCA Student</p>
        <p>📍 Pune, India</p>
      </div>
    </div>
  );
}