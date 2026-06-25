"use client";

import { FormEvent, useEffect, useRef, useState, type ReactNode } from "react";

interface ChatAction {
  label: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  actions?: ChatAction[];
}

const MAX_HISTORY = 20;

const FALLBACK_REPLY =
  "Sorry — I'm having trouble right now. For consulting or resourcing, email info@viltis.com or visit our contact page.";

const FALLBACK_ACTIONS: ChatAction[] = [
  { label: "Contact", url: "https://viltis.com/contact" },
  { label: "Schedule a Call", url: "https://viltis.com/schedule-a-call" },
];

function renderMarkdownLinks(text: string): ReactNode[] {
  const parts: React.ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\((https:\/\/viltis\.com[^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={`link-${key++}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="chatbot__link"
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi — I'm the Viltis assistant. Ask about our quality, regulatory, clinical, or resourcing services and we'll help you get pointed in the right direction.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef("");

  useEffect(() => {
    sessionIdRef.current = crypto.randomUUID();
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages, sending]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    const historyForApi = [...messages.filter((m) => m.id !== "welcome"), userMsg]
      .slice(-MAX_HISTORY)
      .map((m) => ({ role: m.role, content: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          messages: historyForApi,
        }),
      });

      const data = (await res.json().catch(() => null)) as {
        reply?: string;
        actions?: ChatAction[];
      } | null;

      const reply = data?.reply?.trim() || FALLBACK_REPLY;
      const actions =
        Array.isArray(data?.actions) && data.actions.length > 0
          ? data.actions
          : !res.ok
            ? FALLBACK_ACTIONS
            : undefined;

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply, actions },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: FALLBACK_REPLY,
          actions: FALLBACK_ACTIONS,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chatbot" data-open={open}>
      {open && (
        <div className="chatbot__panel" role="dialog" aria-label="Viltis chat assistant">
          <header className="chatbot__header">
            <div className="chatbot__header-brand">
              <span className="chatbot__avatar" aria-hidden="true">
                V
              </span>
              <div>
                <p className="chatbot__title">Viltis Assistant</p>
                <p className="chatbot__status">Life sciences support</p>
              </div>
            </div>
            <button
              type="button"
              className="chatbot__close"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </header>

          <div className="chatbot__messages" ref={listRef}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot__message-group${msg.role === "user" ? " chatbot__message-group--user" : ""}`}
              >
                <div className={`chatbot__bubble chatbot__bubble--${msg.role}`}>
                  {renderMarkdownLinks(msg.text)}
                </div>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="chatbot__actions">
                    {msg.actions.map((action) => (
                      <a
                        key={`${msg.id}-${action.url}`}
                        href={action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="chatbot__action-btn"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {sending && (
              <div className="chatbot__bubble chatbot__bubble--assistant chatbot__bubble--typing">
                Typing…
              </div>
            )}
          </div>

          <form className="chatbot__form" onSubmit={sendMessage}>
            <input
              type="text"
              className="chatbot__input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our services…"
              aria-label="Chat message"
              disabled={sending}
            />
            <button type="submit" className="chatbot__send" disabled={sending || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="chatbot__launcher"
        aria-label={open ? "Close chat" : "Open chat assistant"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          "✕"
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
