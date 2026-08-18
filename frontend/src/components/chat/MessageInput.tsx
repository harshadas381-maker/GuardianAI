import { useState } from "react";
import { Paperclip, Mic, Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  disabled = false,
}: Props) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const cleanMessage = message.trim();

    if (!cleanMessage || disabled) {
      return;
    }

    onSend(cleanMessage);
    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-900 p-4">
      <div className="flex items-center gap-3">

        <button
          type="button"
          disabled={disabled}
          className="rounded-xl bg-slate-800 p-3 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Paperclip size={20} className="text-white" />
        </button>

        <input
          type="text"
          value={message}
          disabled={disabled}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? "GuardianAI is analyzing..."
              : "Message GuardianAI..."
          }
          autoComplete="off"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          disabled={disabled}
          className="rounded-xl bg-slate-800 p-3 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Mic size={20} className="text-white" />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="rounded-xl bg-cyan-500 p-3 transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send size={20} className="text-white" />
        </button>

      </div>
    </div>
  );
}