import { getCorsair } from "@/server/corsair";
/* eslint-disable @typescript-eslint/no-explicit-any */
export class CalendarService {
  static async getEvents(tenantId: string) {
    const c = getCorsair(tenantId);
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // ✅ events.getMany (not events.list)
    return await (c as any).googlecalendar.api.events.getMany({
      calendarId: "primary",
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      timeMax: twoWeeksLater.toISOString(),
    });
  }

  static async createEvent(
    tenantId: string,
    summary: string,
    start: string,
    end: string,
    description?: string
  ) {
    const c = getCorsair(tenantId);

    // ✅ event fields inside `event: {}` wrapper
    return await (c as any).googlecalendar.api.events.create({
      calendarId: "primary",
      event: {
        summary,
        description: description ?? "",
        start: { dateTime: start, timeZone: "Asia/Kolkata" },
        end: { dateTime: end, timeZone: "Asia/Kolkata" },
      },
    });
  }
}
