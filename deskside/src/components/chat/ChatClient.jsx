"use client";

import { useState, useRef, useEffect } from "react";
import VerdictBadge from "./VerdictBadge";

export default function ChatClient() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Something went wrong");

      setConversationId(body.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: body.content, verdict: body.verdict },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {messages.length === 0 && (
          <div className="card p-6 text-sm" style={{ color: "var(--muted)" }}>
            Ask about compatibility (&ldquo;will this monitor work with my laptop?&rdquo;) or any
            general IT question. Answers are grounded in the devices you&apos;ve logged.
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
              m.role === "user" ? "self-end text-white" : "self-start card"
            }`}
            style={m.role === "user" ? { background: "var(--brand)" } : undefined}
          >
            {m.content}
            {m.verdict && (
              <div className="mt-2">
                <VerdictBadge verdict={m.verdict} />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="self-start card px-4 py-3 text-sm" style={{ color: "var(--muted)" }}>
            Thinking…
          </div>
        )}

        {error && (
          <div className="text-sm" style={{ color: "var(--verdict-not-fg)" }}>
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your gear…"
          className="flex-1 rounded-lg border px-3 py-2 text-sm bg-transparent"
          style={{ borderColor: "var(--border)" }}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "var(--brand)" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
