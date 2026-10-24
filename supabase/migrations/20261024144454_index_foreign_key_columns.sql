-- Add indexes for common user/chat joins and foreign-key lookups.
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses (user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_id ON public.chat_messages (chat_id);
