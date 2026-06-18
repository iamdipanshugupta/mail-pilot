"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  CalendarClock,
  Bot,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  RefreshCw,
  BarChart3,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";

type EmailItem = {
  id: string;
  subject?: string;
  sender?: string;
  from?: string;
  snippet?: string;
  preview?: string;
  receivedAt?: string;
};

type CalendarEvent = {
  id: string;
  title?: string;
  summary?: string;
  startTime?: string;
  start?: { dateTime?: string; date?: string };
  endTime?: string;
};

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white", color)}>
          <Icon className="h-5 w-5" />
        </span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      <p className="mt-4 text-3xl font-bold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  useEffect(() => {
    fetch("/api/inbox")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.messages ?? data?.emails ?? [];
        setEmails(list.slice(0, 5));
      })
      .catch(() => setEmails([]))
      .finally(() => setLoadingEmails(false));

    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.items ?? data?.events ?? [];
        setEvents(list.slice(0, 4));
      })
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, []);

  const unread = emails.filter((e: EmailItem & { isRead?: boolean }) => !e.isRead).length;
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Good morning 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">{today}</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Inbox} label="Emails fetched" value={emails.length || "—"} sub="via Corsair" color="bg-[#0f9d8a]" />
          <StatCard icon={Mail} label="Unread" value={unread || 0} color="bg-[#f59e0b]" />
          <StatCard icon={CalendarClock} label="Upcoming events" value={events.length || "—"} color="bg-[#6366f1]" />
          <StatCard icon={TrendingUp} label="AI calls today" value="12" sub="GPT-4o-mini" color="bg-[#ec4899]" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Emails */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">Recent Emails</h2>
              <Link href="/inbox" className="flex items-center gap-1 text-xs text-primary-hover hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {loadingEmails ? (
                <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Fetching from Gmail via Corsair…
                </div>
              ) : emails.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No emails found.</p>
              ) : (
                emails.map((email: EmailItem) => (
                  <div key={email.id} className="flex items-start gap-3 px-5 py-3 hover:bg-card-hover">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary-hover">
                      {(email.sender ?? email.from ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{email.sender ?? email.from ?? "Unknown"}</p>
                      <p className="truncate text-xs text-muted-foreground">{email.subject ?? "(no subject)"}</p>
                      <p className="truncate text-xs text-muted-foreground/60">{email.snippet ?? email.preview ?? ""}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold">Upcoming Events</h2>
              <Link href="/calendar" className="flex items-center gap-1 text-xs text-primary-hover hover:underline">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {loadingEvents ? (
                <div className="flex items-center justify-center gap-2 p-6 text-sm text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" /> Fetching from Google Calendar…
                </div>
              ) : events.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">No upcoming events.</p>
              ) : (
                events.map((event: CalendarEvent) => {
                  const start = event.startTime ?? event.start?.dateTime ?? event.start?.date;
                  const title = event.title ?? event.summary ?? "Untitled Event";
                  const d = start ? new Date(start) : null;
                  return (
                    <div key={event.id} className="flex items-center gap-3 px-5 py-3 hover:bg-card-hover">
                      <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary-hover">
                        <span className="text-[11px] font-semibold uppercase">{d ? d.toLocaleDateString("en", { month: "short" }) : "—"}</span>
                        <span className="text-lg font-bold leading-none">{d ? d.getDate() : "—"}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{title}</p>
                        {d && <p className="text-xs text-muted-foreground">{d.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</p>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link href="/inbox" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-card-hover">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f9d8a]/15 text-[#0f9d8a]"><Mail className="h-5 w-5" /></span>
            <div><p className="text-sm font-semibold">Open Inbox</p><p className="text-xs text-muted-foreground">Read & reply to emails</p></div>
          </Link>
          <Link href="/calendar" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-card-hover">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6366f1]/15 text-[#6366f1]"><CalendarClock className="h-5 w-5" /></span>
            <div><p className="text-sm font-semibold">Calendar</p><p className="text-xs text-muted-foreground">View & create events</p></div>
          </Link>
          <Link href="/assistant" className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:bg-card-hover">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ec4899]/15 text-[#ec4899]"><Bot className="h-5 w-5" /></span>
            <div><p className="text-sm font-semibold">AI Assistant</p><p className="text-xs text-muted-foreground">Chat to send or schedule</p></div>
          </Link>
        </div>
      </div>
    </div>
  );
}
