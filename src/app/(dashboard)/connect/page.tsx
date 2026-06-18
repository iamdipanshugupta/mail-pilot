"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarClock, CheckCircle2, Mail, XCircle, Zap } from "lucide-react";

type IntegrationStatus = "idle" | "connecting" | "connected" | "error";

export default function ConnectPage() {
  const searchParams = useSearchParams();
  const connectedPlugin = searchParams.get("connected");
  const errorType = searchParams.get("error");

  // Initialize statuses from the current query params to avoid setting state
  // synchronously inside an effect (which can cause cascading renders).
  const [gmailStatus, setGmailStatus] = useState<IntegrationStatus>(() =>
    connectedPlugin === "gmail" ? "connected" : "idle"
  );
  const [calendarStatus, setCalendarStatus] = useState<IntegrationStatus>(() =>
    connectedPlugin === "googlecalendar" ? "connected" : "idle"
  );

  // Log OAuth errors if present
  useEffect(() => {
    if (errorType) {
      console.error("OAuth error:", errorType);
    }
  }, [errorType]);

  function connectGmail() {
    setGmailStatus("connecting");
    // Routes to /api/connect?plugin=gmail → generateOAuthUrl → Google consent
    window.location.href = "/api/connect?plugin=gmail";
  }

  function connectCalendar() {
    setCalendarStatus("connecting");
    // Routes to /api/connect/calendar → /api/connect?plugin=googlecalendar
    window.location.href = "/api/connect/calendar";
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Zap className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold">Connect your Google account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            MailPilot needs access to your Gmail and Calendar to work. Your data stays in your own database — never shared.
          </p>
          {errorType && (
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-red-500">
              <XCircle className="h-4 w-4" />
              Connection failed ({errorType}). Please try again.
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Gmail */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">Gmail</p>
                <p className="text-sm text-muted-foreground">
                  Read, send and manage your emails
                </p>
              </div>
              {gmailStatus === "connected" ? (
                <div className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                  <CheckCircle2 className="h-4 w-4" /> Connected
                </div>
              ) : (
                <button
                  onClick={connectGmail}
                  disabled={gmailStatus === "connecting"}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
                >
                  {gmailStatus === "connecting" ? "Redirecting…" : "Connect"}
                </button>
              )}
            </div>
          </div>

          {/* Google Calendar */}
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#6366f1]/10 text-[#6366f1]">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="font-semibold">Google Calendar</p>
                <p className="text-sm text-muted-foreground">
                  View and create calendar events
                </p>
              </div>
              {calendarStatus === "connected" ? (
                <div className="flex items-center gap-1.5 text-sm font-medium text-green-500">
                  <CheckCircle2 className="h-4 w-4" /> Connected
                </div>
              ) : (
                <button
                  onClick={connectCalendar}
                  disabled={calendarStatus === "connecting"}
                  className="rounded-xl bg-[#6366f1] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                >
                  {calendarStatus === "connecting" ? "Redirecting…" : "Connect"}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          OAuth is handled by Corsair. Tokens are encrypted and stored in your own PostgreSQL database.
        </p>
      </div>
    </div>
  );
}
