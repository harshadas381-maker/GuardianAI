import { useCallback, useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";

export default function ChatLayout() {
  const [selectedChatId, setSelectedChatId] =
    useState<number | null>(null);

  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const handleChatCreated = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  const handleMessageSent = useCallback(() => {
    // Tell the sidebar to reload chat history.
    setHistoryRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="flex h-[calc(100vh-180px)] min-h-[600px] w-full min-w-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

      <ChatSidebar
        selectedChatId={selectedChatId}
        onChatSelect={setSelectedChatId}
        onChatCreated={handleChatCreated}
        refreshKey={historyRefreshKey}
      />

      <ChatWindow
        chatId={selectedChatId}
        onMessageSent={handleMessageSent}
      />

    </div>
  );
}