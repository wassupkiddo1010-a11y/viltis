"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const WEBHOOK_URL = process.env.NEXT_PUBLIC_CHATBOT_WEBHOOK_URL ?? "";
const SESSION_STORAGE_KEY = "viltis-chat-session-id";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

type WebhookResponse = {
  reply?: string;
  message?: string;
  output?: string;
  text?: string;
  response?: string;
};

function extractReply(data: WebhookResponse | null, ok: boolean): string {
  const reply =
    data?.reply ??
    data?.message ??
    data?.output ??
    data?.text ??
    data?.response;

  if (reply) return reply;
  return ok
    ? "Thanks — a Viltis team member will follow up shortly."
    : "Something went wrong. Please email info@viltis.com and we'll respond promptly.";
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
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [open, messages]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      if (!WEBHOOK_URL) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: "assistant",
            text: "Thanks for your message. Live chat routing is being connected — for immediate help, email info@viltis.com or schedule a consultation on our site.",
          },
        ]);
        return;
      }

      const sessionId = sessionIdRef.current || getOrCreateSessionId();

      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          chatInput: text,
          message: text,
          source: "viltis-website",
        }),
      });

      const data = (await res.json().catch(() => null)) as WebhookResponse | null;
      const reply = extractReply(data, res.ok);

      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "Unable to reach the assistant right now. Please email info@viltis.com or use our contact form.",
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
                className={`chatbot__bubble chatbot__bubble--${msg.role}`}
              >
                {msg.text}
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
