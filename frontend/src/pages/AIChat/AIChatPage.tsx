import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ChatLayout from "../../components/chat/ChatLayout";

export default function AIChatPage() {
  return (
    <DashboardLayout>
      <div className="flex h-full min-h-0 flex-col">
        <h1 className="mb-6 shrink-0 text-4xl font-bold text-white">
          GuardianAI Chat
        </h1>

        <div className="min-h-0 flex-1">
          <ChatLayout />
        </div>
      </div>
    </DashboardLayout>
  );
}