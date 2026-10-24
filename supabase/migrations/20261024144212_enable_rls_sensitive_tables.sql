-- Keep sensitive application tables inaccessible through the Supabase Data API
-- unless explicit, reviewed row-level security policies are added later.
-- The FastAPI backend uses its server-side PostgreSQL connection.
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
