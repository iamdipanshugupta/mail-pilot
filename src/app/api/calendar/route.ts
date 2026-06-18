/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { getCorsair } from "@/server/corsair";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const c = getCorsair(session.user.email) as any;

    const now = new Date();
    now.setHours(0, 0, 0, 0); // start of today — includes events created earlier today

    const oneMonthLater = new Date();
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    const result = await c.googlecalendar.api.events.getMany({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: oneMonthLater.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 50,
    });

    const rawItems = result?.items ?? [];
    const eventIds = rawItems.map((item: any) => item.id).filter(Boolean);

    // Fetch private notes for these events from our own Postgres DB
    let notesMap = new Map<string, string>();
    if (eventIds.length > 0) {
      const { db } = await import("@/server/db");
      const { users, eventNotes } = await import("@/server/db/schema");
      const { eq, and, inArray } = await import("drizzle-orm");

      const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

      if (user) {
        const notes = await db
          .select()
          .from(eventNotes)
          .where(and(eq(eventNotes.userId, user.id), inArray(eventNotes.googleEventId, eventIds)));
        notesMap = new Map(notes.map((n) => [n.googleEventId, n.note]));
      }
    }

    const items = rawItems.map((item: any) => ({
      id: item.id,
      googleEventId: item.id,
      title: item.summary ?? "Untitled",
      description: item.description ?? null,
      startTime: item.start?.dateTime ?? item.start?.date,
      endTime: item.end?.dateTime ?? item.end?.date,
      note: notesMap.get(item.id) ?? "",
    }));

    return NextResponse.json({ events: items, source: "google" });
  } catch (e: any) {
    if (e?.name === "AuthMissingError" || e?.message?.includes("auth-missing")) {
      return NextResponse.json({ error: "calendar_not_connected" }, { status: 403 });
    }
    console.error("Calendar GET error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, description, startTime, endTime } = body;

    if (!title || !startTime || !endTime)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const c = getCorsair(session.user.email) as any;

    const event = await c.googlecalendar.api.events.create({
      calendarId: "primary",
      event: {
        summary: title,
        description: description ?? "",
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: new Date(endTime).toISOString(),
          timeZone: "Asia/Kolkata",
        },
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (e: any) {
    if (e?.name === "AuthMissingError" || e?.message?.includes("auth-missing")) {
      return NextResponse.json({ error: "calendar_not_connected" }, { status: 403 });
    }
    console.error("Calendar POST error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

/**
 * PATCH /api/calendar
 * Body: { googleEventId, note }
 *
 * Saves a private note for a calendar event. Notes live in our own
 * Postgres DB (not Google Calendar) — they're local annotations only
 * the user can see, separate from the actual event data.
 */
export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { googleEventId, note } = body;

    if (!googleEventId)
      return NextResponse.json({ error: "googleEventId required" }, { status: 400 });

    const { db } = await import("@/server/db");
    const { users, eventNotes } = await import("@/server/db/schema");
    const { eq, and } = await import("drizzle-orm");

    const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [existing] = await db
      .select()
      .from(eventNotes)
      .where(and(eq(eventNotes.userId, user.id), eq(eventNotes.googleEventId, googleEventId)));

    if (existing) {
      await db
        .update(eventNotes)
        .set({ note: note ?? "", updatedAt: new Date() })
        .where(eq(eventNotes.id, existing.id));
    } else {
      await db.insert(eventNotes).values({
        userId: user.id,
        googleEventId,
        note: note ?? "",
      });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Calendar PATCH error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
