"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, RefreshCw, Send, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
};

function createMessage(role: "user" | "assistant", content: string): Message {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date(),
  };
}

const SUGGESTIONS = [
  "Summarize my unread emails",
  "Schedule a meeting tomorrow at 10 AM",
  "Draft a reply to the latest email from GitHub",
  "What events do I have this week?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey! I'm MailPilot AI. I can help you manage your emails, schedule meetings, draft replies, and much more.\n\nTry asking me something like:\n• \"What emails did I get today?\"\n• \"Schedule a call with Rohan tomorrow at 3 PM\"\n• \"Draft a reply to the Notion update\"",
      createdAt: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg = createMessage("user", msg);
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      const reply = data.response ?? data.error ?? "Something went wrong.";
      setMessages((prev) => [...prev, createMessage("assistant", reply)]);
    } catch {
      setMessages((prev) => [...prev, createMessage("assistant", "Sorry, I couldn't connect to the AI service. Please check your OpenAI key.")]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary-hover">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-semibold">AI Assistant</h1>
          <p className="text-xs text-muted-foreground">Powered by GPT-4o-mini · Gmail + Calendar access</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                msg.role === "assistant" ? "bg-primary/15 text-primary-hover" : "bg-[#1c1b1a] text-white"
              )}>
                {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                msg.role === "assistant"
                  ? "bg-card border border-border text-foreground"
                  : "bg-primary text-primary-foreground"
              )}>
                {msg.content}
                <p className={cn("mt-1 text-[11px] opacity-60", msg.role === "user" ? "text-right" : "")}>
                  {msg.createdAt.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-hover">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Suggestions (only when no user messages yet) */}
      {messages.length === 1 && (
        <div className="px-6 pb-2">
          <div className="mx-auto max-w-2xl">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Suggestions
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs hover:bg-card-hover"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-end gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask me to send an email, schedule a meeting, summarize emails…"
            rows={1}
            className="flex-1 resize-none overflow-hidden rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mx-auto mt-2 max-w-2xl text-center text-[11px] text-muted-foreground">
          AI has access to your Gmail & Calendar via Corsair. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  );
}
