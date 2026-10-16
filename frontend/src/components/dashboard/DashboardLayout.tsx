import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Navbar */}
        <header className="relative z-40 shrink-0 border-b border-slate-800 bg-slate-950 p-6">
          <TopNavbar />
        </header>

        {/* Page Content */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
          <div className="mx-auto w-full max-w-[1800px]">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}