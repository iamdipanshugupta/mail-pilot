"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState, useCallback } from "react";
import {
  Archive,
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Folder,
  Inbox as InboxIcon,
  Keyboard,
  Lightbulb,
  Mail,
  Move,
  MoreHorizontal,
  MoreVertical,
  RefreshCw,
  Reply,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "urgent" | "important" | "normal" | "low";

type GmailMessage = {
  id: string;
  sender?: string;
  from?: string;
  senderEmail?: string;
  subject?: string;
  snippet?: string;
  preview?: string;
  body?: string;
  isRead?: boolean;
  isStarred?: boolean;
  receivedAt?: string;
  // Raw Gmail fields
  payload?: { headers?: { name: string; value: string }[] };
  internalDate?: string;
  // AI-assigned fields
  priority?: Priority;
  priorityReason?: string;
};

function getHeader(msg: GmailMessage, name: string): string {
  return (
    msg.payload?.headers?.find(
      (h) => h.name.toLowerCase() === name.toLowerCase(),
    )?.value ?? ""
  );
}
function senderName(msg: GmailMessage): string {
  const raw = msg.sender ?? msg.from ?? getHeader(msg, "from") ?? "Unknown";
  const m = raw.match(/^([^<]+)</);
  return m ? m[1].trim() : raw;
}
function senderEmail(msg: GmailMessage): string {
  const raw = msg.sender ?? msg.from ?? getHeader(msg, "from") ?? "";
  const m = raw.match(/<([^>]+)>/);
  return m ? m[1] : raw;
}
function msgSubject(msg: GmailMessage) {
  return msg.subject ?? getHeader(msg, "subject") ?? "(no subject)";
}
function msgSnippet(msg: GmailMessage) {
  return msg.snippet ?? msg.preview ?? "";
}
function msgTime(msg: GmailMessage) {
  const raw = msg.receivedAt ?? msg.internalDate;
  if (!raw) return "";
  const d = new Date(isNaN(Number(raw)) ? raw : Number(raw));
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString("en", { month: "short", day: "numeric" });
}

const PRIORITY_ORDER: Record<Priority, number> = {
  urgent: 0,
  important: 1,
  normal: 2,
  low: 3,
};

const PRIORITY_CONFIG: Record<Priority, { label: string; classes: string; dot: string }> = {
  urgent: { label: "Urgent", classes: "bg-red-500/15 text-red-500", dot: "bg-red-500" },
  important: { label: "Important", classes: "bg-amber-500/15 text-amber-500", dot: "bg-amber-500" },
  normal: { label: "Normal", classes: "bg-blue-500/15 text-blue-500", dot: "bg-blue-500" },
  low: { label: "Low", classes: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
};

function PriorityBadge({ priority }: { priority?: Priority }) {
  if (!priority) return null;
  const c = PRIORITY_CONFIG[priority];
  if (!c) return null;
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", c.classes)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
}

const SHORTCUT_GROUPS = [
  {
    title: "General",
    items: [
      { label: "Compose", keys: ["C"] },
      { label: "Search", keys: ["/"] },
      { label: "Refresh", keys: ["R"] },
      { label: "Toggle sidebar", keys: ["B"] },
    ],
  },
  {
    title: "Navigation",
    items: [
      { label: "Inbox", keys: ["I"] },
      { label: "Starred", keys: ["S"] },
      { label: "Sent", keys: ["E"] },
      { label: "All Mail", keys: ["A"] },
    ],
  },
  {
    title: "Actions",
    items: [
      { label: "Archive", keys: ["E"] },
      { label: "Delete", keys: ["Del"] },
      { label: "Mark read", keys: ["Shift", "R"] },
      { label: "Star", keys: ["S"] },
      { label: "Snooze", keys: ["Z"] },
    ],
  },
];

function MailRow({
  msg,
  active,
  onSelect,
  onToggleStar,
}: {
  msg: GmailMessage;
  active: boolean;
  onSelect: () => void;
  onToggleStar: () => void;
}) {
  const unread = !msg.isRead;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={cn(
        "flex cursor-pointer items-start gap-3 border-l-2 px-4 py-3 transition-colors",
        active
          ? "border-l-primary bg-primary/10"
          : "border-l-transparent hover:bg-card-hover",
      )}
    >
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary-hover">
        {senderName(msg).charAt(0).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm",
              unread ? "font-semibold text-foreground" : "text-muted-foreground",
            )}
          >
            {senderName(msg)}
          </p>
          <PriorityBadge priority={msg.priority} />
        </div>
        <p
          className={cn(
            "mt-0.5 truncate text-sm",
            unread ? "font-medium text-foreground" : "text-muted-foreground",
          )}
        >
          {unread && (
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />
          )}
          {msgSubject(msg)}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
          {msgSnippet(msg)}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2 pl-2">
        <span className="text-xs text-muted-foreground">{msgTime(msg)}</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          className="text-muted-foreground hover:text-accent-amber"
        >
          <Star
            className={cn(
              "h-4 w-4",
              msg.isStarred && "fill-accent-amber text-accent-amber",
            )}
          />
        </button>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const [emails, setEmails] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(true);
  const [composing, setComposing] = useState(false);
  const [composeData, setComposeData] = useState({
    to: "",
    subject: "",
    body: "",
  });
  const [sending, setSending] = useState(false);

  // AI priority classification state
  const [classifying, setClassifying] = useState(false);
  const [sortByPriority, setSortByPriority] = useState(false);

  const classifyEmails = useCallback(async (list: GmailMessage[]) => {
    if (list.length === 0) return;
    setClassifying(true);
    try {
      const payload = list.map((e) => ({
        id: e.id,
        from: senderName(e),
        subject: msgSubject(e),
        snippet: msgSnippet(e),
      }));

      const res = await fetch("/api/inbox/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: payload }),
      });
      const data = await res.json();
      const classifications = data?.classifications ?? [];

      setEmails((prev) =>
        prev.map((e, i) => {
          const match = classifications.find((c: any) => c.index === i);
          return match
            ? { ...e, priority: match.priority as Priority, priorityReason: match.reason }
            : e;
        }),
      );
    } catch {
      /* classification is a nice-to-have — fail silently */
    } finally {
      setClassifying(false);
    }
  }, []);

  const loadEmails = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const response = await fetch("/api/inbox");
        const data = await response.json();
        const list: GmailMessage[] = Array.isArray(data)
          ? data
          : (data?.messages ?? data?.emails ?? []);
        setEmails(list);
        setSelectedId(
          (prevId) => prevId ?? (list.length > 0 ? list[0].id : null),
        );
        void classifyEmails(list);
      } catch {
        setEmails([]);
      } finally {
        setLoading(false);
      }
    },
    [classifyEmails],
  );

  useEffect(() => {
    const init = async () => {
      await loadEmails(false);
    };

    void init();
  }, [loadEmails]);

  const selected = emails.find((e) => e.id === selectedId) ?? null;
  const unreadCount = emails.filter((e) => !e.isRead).length;
  // Whether Gmail is connected. Default to false; can be set based on API response.
  const notConnected = false;

  const displayedEmails = sortByPriority
    ? [...emails].sort(
        (a, b) =>
          (PRIORITY_ORDER[a.priority ?? "normal"] ?? 2) -
          (PRIORITY_ORDER[b.priority ?? "normal"] ?? 2),
      )
    : emails;

  function handleSelect(id: string) {
    setSelectedId(id);
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isRead: true } : e)),
    );
  }
  function toggleStar(id: string) {
    setEmails((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isStarred: !e.isStarred } : e)),
    );
  }

  async function handleSend() {
    if (!composeData.to.trim() || !composeData.subject.trim()) return;
    setSending(true);
    try {
      await fetch("/api/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(composeData),
      });
      setComposing(false);
      setComposeData({ to: "", subject: "", body: "" });
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  }

  if (notConnected) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <p className="text-base font-semibold">Gmail not connected</p>
          <p className="mt-1 text-sm text-muted-foreground">Connect your Gmail account to see your inbox.</p>
        </div>
        <a href="/api/connect?plugin=gmail" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover">
          Connect Gmail
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Mail list */}
      <div className="flex w-full max-w-sm shrink-0 flex-col overflow-hidden border-r border-border md:max-w-md">
        <div className="flex items-center justify-between px-6 pb-3 pt-5">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Inbox</h1>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary-hover">
                {unreadCount} unread
              </span>
            )}
          </div>
          <button
            onClick={() => void loadEmails()}
            className="rounded-md p-2 text-muted-foreground hover:bg-card-hover"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>

        <div className="px-6 pb-3">
          <input
            type="text"
            placeholder="Search emails..."
            className="w-full rounded-xl border border-border bg-card px-4 py-2 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-1 border-b border-border px-3 pb-2">
          {[Archive, Trash2, Move].map((Icon, i) => (
            <button
              key={i}
              type="button"
              className="rounded-md p-2 text-muted-foreground hover:bg-card-hover"
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}

          {/* AI priority sort toggle — core workflow improvement */}
          <button
            onClick={() => setSortByPriority((p) => !p)}
            className={cn(
              "ml-2 flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
              sortByPriority
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-card-hover",
            )}
          >
            {classifying ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <AlertCircle className="h-3.5 w-3.5" />
            )}
            {classifying ? "Scoring…" : sortByPriority ? "Priority: ON" : "Sort by priority"}
          </button>

          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <span>1–{emails.length}</span>
            <button className="rounded p-1 hover:bg-card-hover">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded p-1 hover:bg-card-hover">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 divide-y divide-border overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading via Corsair…</span>
            </div>
          ) : displayedEmails.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <InboxIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No emails found</p>
            </div>
          ) : (
            displayedEmails.map((msg) => (
              <MailRow
                key={msg.id}
                msg={msg}
                active={msg.id === selectedId}
                onSelect={() => handleSelect(msg.id)}
                onToggleStar={() => toggleStar(msg.id)}
              />
            ))
          )}
        </div>

        {/* Compose button */}
        <div className="border-t border-border p-3">
          <button
            onClick={() => setComposing(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            <Send className="h-4 w-4" /> Compose
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="flex items-center gap-1 border-b border-border px-3 py-2.5">
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-md p-2 text-muted-foreground hover:bg-card-hover"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="mx-1 h-5 w-px bg-border" />
              {[Archive, AlertCircle, Trash2, Mail, Clock, Folder].map(
                (Icon, i) => (
                  <button
                    key={i}
                    className="rounded-md p-2 text-muted-foreground hover:bg-card-hover"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ),
              )}
              {selected.priority && (
                <div className="ml-2">
                  <PriorityBadge priority={selected.priority} />
                </div>
              )}
              <button className="ml-auto rounded-md p-2 text-muted-foreground hover:bg-card-hover">
                <MoreVertical className="h-4 w-4" />
              </button>
              <button className="rounded-md p-2 text-muted-foreground hover:bg-card-hover">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary-hover">
                {senderName(selected).charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">
                    {senderName(selected)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    &lt;{senderEmail(selected)}&gt;
                  </span>
                </div>
                <button className="flex items-center gap-1 text-xs text-muted-foreground">
                  to me <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {msgTime(selected)}
              </span>
              <button
                onClick={() => toggleStar(selected.id)}
                className="text-muted-foreground hover:text-accent-amber"
              >
                <Star
                  className={cn(
                    "h-4 w-4",
                    selected.isStarred && "fill-accent-amber text-accent-amber",
                  )}
                />
              </button>
              <button className="rounded-md p-1.5 text-muted-foreground hover:bg-card-hover">
                <Reply className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <h2 className="mb-4 text-xl font-bold">{msgSubject(selected)}</h2>
              {selected.priorityReason && (
                <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-primary" />
                  AI: {selected.priorityReason}
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                {selected.body ??
                  selected.snippet ??
                  selected.preview ??
                  "(No content available)"}
              </p>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card-hover">
              <InboxIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No email selected</p>
            <p className="text-xs text-muted-foreground">
              Pick an email from the list to read it here.
            </p>
          </div>
        )}
      </div>

      {/* Shortcuts */}
      <aside
        className={cn(
          "flex h-full shrink-0 flex-col overflow-hidden border-l border-border bg-sidebar transition-all duration-200",
          shortcutsOpen ? "w-64" : "w-0 border-l-0",
        )}
      >
        <div className="flex h-full w-64 flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Shortcuts</h2>
            <button
              onClick={() => setShortcutsOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-card-hover"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {SHORTCUT_GROUPS.map((g) => (
              <div key={g.title}>
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {g.title}
                </p>
                <ul className="space-y-1.5">
                  {g.items.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-foreground/80">{item.label}</span>
                      <span className="flex gap-1">
                        {item.keys.map((k) => (
                          <kbd
                            key={k}
                            className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            {k}
                          </kbd>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Lightbulb className="h-3.5 w-3.5 text-accent-amber" />
              Tip
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Press ? to view shortcuts
            </p>
          </div>
        </div>
      </aside>

      {!shortcutsOpen && (
        <button
          onClick={() => setShortcutsOpen(true)}
          className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary-hover"
        >
          <Keyboard className="h-5 w-5" />
        </button>
      )}

      {/* Compose modal */}
      {composing && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-sm font-semibold">New Message</span>
              <button
                onClick={() => setComposing(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-card-hover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-0 divide-y divide-border">
              <input
                value={composeData.to}
                onChange={(e) =>
                  setComposeData((p) => ({ ...p, to: e.target.value }))
                }
                placeholder="To"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <input
                value={composeData.subject}
                onChange={(e) =>
                  setComposeData((p) => ({ ...p, subject: e.target.value }))
                }
                placeholder="Subject"
                className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
              <textarea
                value={composeData.body}
                onChange={(e) =>
                  setComposeData((p) => ({ ...p, body: e.target.value }))
                }
                placeholder="Write your message…"
                rows={6}
                className="w-full resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <button
                onClick={() => setComposing(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Discard
              </button>
              <button
                onClick={handleSend}
                disabled={sending}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
              >
                {sending ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {sending ? "Sending…" : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
