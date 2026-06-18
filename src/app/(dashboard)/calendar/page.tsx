"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* ─── Types ─────────────────────────────────────────────── */
type CalEvent = {
  id: string;
  googleEventId?: string | null;
  title: string;
  description?: string | null;
  startTime: string;
  endTime: string;
  note?: string;
};

/* ─── Helpers ────────────────────────────────────────────── */
const IST = "Asia/Kolkata";

function fmtTime(d: Date) {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: IST,
  });
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: IST,
  });
}
function isoDay(d: Date) {
  return d.toLocaleDateString("en-CA", { timeZone: IST }); // YYYY-MM-DD
}
function todayKey() {
  return isoDay(new Date());
}
function hoursBlocked(events: CalEvent[]) {
  const today = todayKey();
  return events
    .filter((e) => isoDay(new Date(e.startTime)) === today)
    .reduce((sum, e) => {
      const mins =
        (new Date(e.endTime).getTime() - new Date(e.startTime).getTime()) /
        60000;
      return sum + mins / 60;
    }, 0);
}
function groupByDay(events: CalEvent[]): [string, CalEvent[]][] {
  const map = new Map<string, CalEvent[]>();
  for (const ev of events) {
    const key = isoDay(new Date(ev.startTime));
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ev);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
}

/* ─── Mini Calendar ─────────────────────────────────────── */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function MiniCal({
  events,
  selected,
  onSelect,
}: {
  events: CalEvent[];
  selected: string;
  onSelect: (d: string) => void;
}) {
  const [vd, setVd] = useState(() => new Date());
  const y = vd.getFullYear(),
    m = vd.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const eventDays = new Set(events.map((e) => isoDay(new Date(e.startTime))));
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">
          {MONTHS[m]} {y}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setVd(new Date(y, m - 1))}
            className="rounded-lg p-1.5 hover:bg-card-hover"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setVd(new Date(y, m + 1))}
            className="rounded-lg p-1.5 hover:bg-card-hover"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {DAYS.map((d) => (
          <div
            key={d}
            className="pb-1 text-[10px] font-semibold text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const isSel = selected === key;
          const isToday = key === todayKey();
          const hasEv = eventDays.has(key);
          return (
            <button
              key={i}
              onClick={() => onSelect(key)}
              className={cn(
                "relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors",
                isSel && "bg-primary text-primary-foreground font-bold",
                !isSel &&
                  isToday &&
                  "border border-primary text-primary font-bold",
                !isSel && !isToday && "hover:bg-card-hover",
              )}
            >
              {day}
              {hasEv && !isSel && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Event Card ─────────────────────────────────────────── */
function EventCard({
  ev,
  onNoteChange,
}: {
  ev: CalEvent;
  onNoteChange: (id: string, note: string) => void;
}) {
  const [note, setNote] = useState(ev.note ?? "");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const gid = ev.googleEventId ?? ev.id;
  const start = new Date(ev.startTime);
  const end = new Date(ev.endTime);
  const durationMin = Math.round((end.getTime() - start.getTime()) / 60000);

  async function saveNote() {
    setSaving(true);
    try {
      await fetch("/api/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ googleEventId: gid, note }),
      });
      onNoteChange(gid, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  return (
    <div className="group rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{ev.title}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {fmtTime(start)} – {fmtTime(end)}
            <span className="rounded-full bg-muted px-2 py-0.5">
              {durationMin}m
            </span>
          </div>
          {ev.description && (
            <p className="mt-1 text-xs text-muted-foreground truncate">
              {ev.description}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="text-[10px] font-semibold">
            {MONTHS[start.getMonth()]}
          </span>
          <span className="text-base font-bold leading-none">
            {start.getDate()}
          </span>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-3 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
          <FileText className="h-3.5 w-3.5" /> Private note
        </div>
        {editing ? (
          <div>
            <textarea
              ref={textRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a private note for this event…"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <div className="mt-1.5 flex gap-2">
              <button
                onClick={saveNote}
                disabled={saving}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : saved ? (
                  <Check className="h-3 w-3" />
                ) : null}
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card-hover"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setEditing(true);
              setTimeout(() => textRef.current?.focus(), 50);
            }}
            className="w-full text-left text-xs text-muted-foreground hover:text-foreground"
          >
            {note ? (
              <span className="text-foreground/80">{note}</span>
            ) : (
              <span className="italic">Click to add a note…</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Create Event Modal ─────────────────────────────────── */
function CreateModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    start: "09:00",
    end: "10:00",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!form.title.trim()) return setError("Title is required");
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          startTime: `${form.date}T${form.start}:00`,
          endTime: `${form.date}T${form.end}:00`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">New Meeting</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-card-hover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              placeholder="Meeting title"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              placeholder="Optional description"
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Start
              </label>
              <input
                type="time"
                value={form.start}
                onChange={(e) =>
                  setForm((p) => ({ ...p, start: e.target.value }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                End
              </label>
              <input
                type="time"
                value={form.end}
                onChange={(e) =>
                  setForm((p) => ({ ...p, end: e.target.value }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          {error && (
            <p className="rounded-lg bg-accent-red/10 px-3 py-2 text-xs text-accent-red">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-card-hover"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {loading ? "Creating…" : "Create Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function CalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [source, setSource] = useState<"cache" | "google" | "">("");
  const [selectedDay, setSelectedDay] = useState(todayKey());
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  const fetchCalendar = async (forceRefresh = false) => {
    const res = await fetch(
      `/api/calendar${forceRefresh ? "?refresh=true" : ""}`,
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Failed to load events");
    return data;
  };

  const load = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await fetchCalendar(forceRefresh);
      setEvents(data.events ?? []);
      setSource(data.source ?? "");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const data = await fetchCalendar();
        setEvents(data.events ?? []);
        setSource(data.source ?? "");
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, []);

  function handleNoteChange(googleEventId: string, note: string) {
    setEvents((prev) =>
      prev.map((ev) =>
        (ev.googleEventId ?? ev.id) === googleEventId ? { ...ev, note } : ev,
      ),
    );
  }

  // Stats
  const today = todayKey();
  const todayEvents = events.filter(
    (e) => isoDay(new Date(e.startTime)) === today,
  );
  const weekEvents = events.filter((e) => {
    const d = new Date(e.startTime);
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() + 7);
    return d >= now && d <= weekEnd;
  });
  const nextEvent = [...events]
    .filter((e) => new Date(e.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )[0];
  const blocked = hoursBlocked(events);

  // Selected day events
  const selectedEvents = events.filter(
    (e) => isoDay(new Date(e.startTime)) === selectedDay,
  );

  // Upcoming grouped
  const upcoming = groupByDay(
    events.filter(
      (e) => new Date(e.startTime) >= new Date(new Date().setHours(0, 0, 0, 0)),
    ),
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h1 className="text-xl font-bold">Calendar</h1>
          <p className="text-xs text-muted-foreground">
            Google Calendar via Corsair
            {source &&
              ` · ${source === "cache" ? "Loaded from cache" : "Synced from Google"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-card-hover disabled:opacity-60"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            {refreshing ? "Syncing…" : "Refresh"}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
          >
            <Plus className="h-4 w-4" /> New Meeting
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-6 mt-4 rounded-xl bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading from cache…</span>
        </div>
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="flex w-72 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border p-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Today", value: todayEvents.length },
                { label: "This week", value: weekEvents.length },
                { label: "Hours blocked", value: `${blocked.toFixed(1)}h` },
                {
                  label: "Next meeting",
                  value: nextEvent
                    ? fmtTime(new Date(nextEvent.startTime))
                    : "—",
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-card p-3 text-center"
                >
                  <p className="text-xl font-bold text-primary">{value}</p>
                  <p className="text-[11px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <MiniCal
              events={events}
              selected={selectedDay}
              onSelect={setSelectedDay}
            />

            {/* Today's agenda */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {selectedDay === today
                  ? "Today's agenda"
                  : fmtDate(new Date(selectedDay + "T00:00:00"))}
              </p>
              {selectedEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  No events this day.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5"
                    >
                      <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {ev.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {fmtTime(new Date(ev.startTime))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: upcoming events */}
          <div className="flex-1 overflow-y-auto p-6">
            {upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <CalendarClock className="h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No upcoming events</p>
                <p className="text-sm text-muted-foreground">
                  Click `New Meeting` to create one, or click Refresh to sync
                  from Google.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {upcoming.map(([day, dayEvents]) => (
                  <div key={day}>
                    <div className="mb-3 flex items-center gap-3">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          day === today ? "text-primary" : "text-foreground",
                        )}
                      >
                        {day === today
                          ? "Today"
                          : fmtDate(new Date(day + "T00:00:00"))}
                      </p>
                      <div className="h-px flex-1 bg-border" />
                      <span className="text-xs text-muted-foreground">
                        {dayEvents.length} event
                        {dayEvents.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {dayEvents.map((ev) => (
                        <EventCard
                          key={ev.id}
                          ev={ev}
                          onNoteChange={handleNoteChange}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() => load(true)}
        />
      )}
    </div>
  );
}
