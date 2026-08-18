import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex bg-slate-950">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Top Navbar */}
        <div className="relative z-40 p-6 border-b border-slate-800">
          <TopNavbar />
        </div>

        {/* Page Content */}
        <main className="min-h-0 flex-1 overflow-hidden p-8">
          {children}
        </main>

      </div>

    </div>
  );
}