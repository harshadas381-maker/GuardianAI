import { useEffect, useRef, useState } from "react";

import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

import {
  getChatMessages,
  sendChatMessage,
  type ChatMessage,
} from "../../api/chat";

interface Props {
  chatId: number | null;
  onMessageSent?: () => void;
}

export default function ChatWindow({
  chatId,
  onMessageSent,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------
  // Format time
  // ---------------------------------------
  const formatTime = (date?: string) => {
    if (!date) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------------------------------------
  // Load messages when chat changes
  // ---------------------------------------
  useEffect(() => {
    const loadMessages = async () => {
      if (!chatId) {
        setMessages([]);
        return;
      }

      try {
        setLoading(true);

        const data = await getChatMessages(chatId);

        setMessages(data);
      } catch (error: any) {
        console.error(
          "Failed to load chat messages:",
          error?.response?.data || error
        );

        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [chatId]);

  // ---------------------------------------
  // Scroll to bottom
  // ---------------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  // ---------------------------------------
  // Send message
  // ---------------------------------------
  const sendMessage = async (text: string) => {
    if (!chatId) {
      console.error("No chat selected.");
      return;
    }

    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    const temporaryId = Date.now();

    const temporaryUserMessage: ChatMessage = {
      id: temporaryId,
      sender: "user",
      text: cleanText,
    };

    // Show user's message immediately
    setMessages((prev) => [
      ...prev,
      temporaryUserMessage,
    ]);

    setTyping(true);

    try {
      console.log("Sending chat message:", {
        chatId,
        message: cleanText,
      });

      const response = await sendChatMessage(
        chatId,
        cleanText
      );

      console.log("Chat API response:", response);

      // ---------------------------------------
      // Transfer ai_response into AI message
      // ---------------------------------------
      const aiMessage: ChatMessage = {
        ...response.ai_message,
        prediction: response.prediction,
        confidence: response.confidence,
        risk_level: response.ai_response?.risk_level,
        safer_response: response.ai_response?.safer_response,
      };

      // ---------------------------------------
      // Replace temporary message
      // with real structured messages
      // ---------------------------------------
      setMessages((prev) => {
        const withoutTemporary = prev.filter(
          (message) => message.id !== temporaryId
        );
      
        const aiMessage: ChatMessage = {
          ...response.ai_message,
          prediction: response.prediction,
          confidence: response.confidence,
          risk_level: response.ai_response?.risk_level,
          safer_response: response.ai_response?.safer_response,
        };
      
        return [
          ...withoutTemporary,
          response.user_message,
          aiMessage,
        ];
      });
      // Refresh chat history
      onMessageSent?.();

    } catch (error: any) {
      console.error(
        "CHAT ERROR:",
        error?.response?.status,
        error?.response?.data || error
      );

      const backendError =
        error?.response?.data?.detail ||
        "Unable to process your message.";

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: backendError,
      };

      setMessages((prev) => [
        ...prev.filter(
          (message) => message.id !== temporaryId
        ),
        temporaryUserMessage,
        errorMessage,
      ]);

    } finally {
      setTyping(false);
    }
  };

  // ---------------------------------------
  // Clear visible chat
  // ---------------------------------------
  const clearChat = () => {
    setMessages([]);
  };

  // ---------------------------------------
  // No chat selected
  // ---------------------------------------
  if (!chatId) {
    return (
      <div className="flex min-w-0 flex-1 items-center justify-center bg-slate-900">
        <div className="px-6 text-center">

          <h2 className="text-2xl font-bold text-white">
            Welcome to GuardianAI
          </h2>

          <p className="mt-2 text-slate-400">
            Create a new chat to start.
          </p>

        </div>
      </div>
    );
  }

  // ---------------------------------------
  // Chat window
  // ---------------------------------------
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-slate-900">

      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-5 py-4">

        <div className="min-w-0">

          <h2 className="font-semibold text-white">
            GuardianAI Chat
          </h2>

          <p className="text-xs text-slate-500">
            AI-powered toxicity detection
          </p>

        </div>

        <button
          type="button"
          onClick={clearChat}
          disabled={messages.length === 0}
          className="ml-4 shrink-0 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear View
        </button>

      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto p-6">

        {loading && (
          <div className="text-center text-sm text-slate-500">
            Loading conversation...
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className="flex min-h-full items-center justify-center text-center text-slate-500">
            Send a message to start the conversation.
          </div>
        )}

        <div className="space-y-4">

          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              sender={message.sender}
              text={message.text}
              time={formatTime(message.created_at)}
              prediction={message.prediction}
              confidence={message.confidence}
              risk_level={message.risk_level}
              safer_response={message.safer_response}
            />
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="italic text-slate-400">
              🤖 GuardianAI is analyzing...
            </div>
          )}

          <div ref={bottomRef} />

        </div>
      </div>

      {/* Message Input */}
      <div className="shrink-0 border-t border-slate-800">
        <MessageInput
          onSend={sendMessage}
          disabled={typing}
        />
      </div>

    </div>
  );
}