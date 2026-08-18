import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Plus, RefreshCw } from "lucide-react";

import {
  createChat,
  getChatHistory,
  type Chat,
} from "../../api/chat";

interface Props {
  selectedChatId: number | null;
  onChatSelect: (chatId: number) => void;
  onChatCreated: (chatId: number) => void;
  refreshKey?: number;
}

export default function ChatSidebar({
  selectedChatId,
  onChatSelect,
  onChatCreated,
  refreshKey = 0,
}: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // ---------------------------------------
  // Load chat history
  // ---------------------------------------
  const loadChats = useCallback(
    async (autoSelect = true) => {
      try {
        setHistoryLoading(true);

        const data = await getChatHistory();

        setChats(data);

        // Select first chat when nothing is selected.
        if (
          autoSelect &&
          data.length > 0 &&
          selectedChatId === null
        ) {
          onChatSelect(data[0].id);
        }

        // If selected chat no longer exists,
        // select the newest available chat.
        if (
          selectedChatId !== null &&
          data.length > 0 &&
          !data.some((chat) => chat.id === selectedChatId)
        ) {
          onChatSelect(data[0].id);
        }

        // If there are no chats, clear selection.
        if (data.length === 0 && selectedChatId !== null) {
          onChatSelect(0);
        }
      } catch (error: any) {
        console.error(
          "Failed to load chat history:",
          error?.response?.data || error
        );
      } finally {
        setHistoryLoading(false);
      }
    },
    [onChatSelect, selectedChatId]
  );

  // Initial load.
  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // Refresh after a message is sent.
  useEffect(() => {
    if (refreshKey > 0) {
      loadChats(false);
    }
  }, [refreshKey, loadChats]);

  // ---------------------------------------
  // Create new chat
  // ---------------------------------------
  const handleNewChat = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const newChat = await createChat("New Chat");

      setChats((prev) => [
        newChat,
        ...prev.filter((chat) => chat.id !== newChat.id),
      ]);

      onChatCreated(newChat.id);
    } catch (error: any) {
      console.error(
        "Failed to create chat:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------
  // Select existing chat
  // ---------------------------------------
  const handleChatSelect = (chatId: number) => {
    onChatSelect(chatId);
  };

  return (
    <aside className="flex h-full min-h-0 w-72 shrink-0 flex-col border-r border-slate-800 bg-slate-950">

      {/* Header */}
      <div className="shrink-0 border-b border-slate-800 p-4">
        <button
          type="button"
          onClick={handleNewChat}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-cyan-600 hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={20} />

          <span>
            {loading ? "Creating..." : "New Chat"}
          </span>
        </button>
      </div>

      {/* History Header */}
      <div className="flex shrink-0 items-center justify-between px-4 pt-4">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Chat History
        </p>

        <button
          type="button"
          onClick={() => loadChats(false)}
          disabled={historyLoading}
          title="Refresh chat history"
          className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={historyLoading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* History */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3">

        {historyLoading && (
          <div className="flex items-center justify-center py-6">
            <div className="text-sm text-slate-500">
              Loading chats...
            </div>
          </div>
        )}

        {!historyLoading && chats.length === 0 && (
          <div className="px-2 py-6 text-center">
            <MessageSquare
              size={28}
              className="mx-auto mb-2 text-slate-700"
            />

            <p className="text-sm text-slate-500">
              No conversations yet.
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Click "New Chat" to start.
            </p>
          </div>
        )}

        {!historyLoading && chats.length > 0 && (
          <div className="space-y-2">
            {chats.map((chat) => {
              const isActive =
                selectedChatId === chat.id;

              return (
                <button
                  key={chat.id}
                  type="button"
                  onClick={() =>
                    handleChatSelect(chat.id)
                  }
                  className={`group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all duration-150 ${
                    isActive
                      ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/10"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <MessageSquare
                    size={18}
                    className={`shrink-0 ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />

                  <span className="min-w-0 flex-1 truncate">
                    {chat.title?.trim() || "New Chat"}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}