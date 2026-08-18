import api from "./api";

export interface Chat {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: number;
  sender: "user" | "ai";
  text: string;
  prediction?: string;
  confidence?: number | string;
  risk_level?: string;
  safer_response?: string;
  created_at?: string;
}

export interface AIResponse {
  risk_level: string;
  safer_response: string;
}

export interface ChatResponse {
  user_message: ChatMessage;
  ai_message: ChatMessage;
  prediction: string;
  confidence: number;
  ai_response: AIResponse;
  chat?: {
    id: number;
    title: string;
    updated_at: string;
  };
}

// ---------------------------------------
// Create a new chat
// ---------------------------------------
export const createChat = async (
  title: string = "New Chat"
): Promise<Chat> => {
  const response = await api.post<Chat>("/chat/create", {
    title,
  });

  return response.data;
};

// ---------------------------------------
// Get chat history
// ---------------------------------------
export const getChatHistory = async (): Promise<Chat[]> => {
  const response = await api.get<Chat[]>("/chat/history");

  return response.data;
};

// ---------------------------------------
// Get messages for a specific chat
// ---------------------------------------
export const getChatMessages = async (
  chatId: number
): Promise<ChatMessage[]> => {
  const response = await api.get<ChatMessage[]>(
    `/chat/${chatId}/messages`
  );

  return response.data;
};

// ---------------------------------------
// Send message to GuardianAI
// ---------------------------------------
export const sendChatMessage = async (
  chatId: number,
  message: string
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>(
    `/chat/${chatId}/message`,
    {
      message,
    }
  );

  return response.data;
};