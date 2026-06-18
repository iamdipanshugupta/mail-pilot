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

    const list = await c.gmail.api.messages.list({
      maxResults: 25,
      labelIds: ["INBOX"],
    });

    const messages = list?.messages ?? [];

    const detailed = await Promise.all(
      messages.map(async (msg: any) => {
        try {
          const detail = await c.gmail.api.messages.get({
            id: msg.id,
            format: "full",
          });
          const headers = detail.payload?.headers ?? [];
          const get = (name: string) =>
            headers.find((h: any) => h.name.toLowerCase() === name)?.value ?? "";
          return {
            id: detail.id,
            threadId: detail.threadId,
            subject: get("subject"),
            from: get("from"),
            snippet: detail.snippet,
            internalDate: detail.internalDate,
            payload: detail.payload,
            isRead: !detail.labelIds?.includes("UNREAD"),
            isStarred: detail.labelIds?.includes("STARRED") ?? false,
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json(detailed.filter(Boolean));
  } catch (e: any) {
    // Auth missing → user hasn't connected Gmail yet
    if (e?.name === "AuthMissingError" || e?.message?.includes("auth-missing")) {
      return NextResponse.json({ error: "gmail_not_connected" }, { status: 403 });
    }
    console.error("Inbox GET error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { to, subject, body } = await request.json();
    if (!to || !subject)
      return NextResponse.json({ error: "Missing to/subject" }, { status: 400 });

    const c = getCorsair(session.user.email) as any;

    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "Content-Type: text/plain; charset=utf-8",
      "",
      body ?? "",
    ].join("\r\n");

    const raw = Buffer.from(email)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const result = await c.gmail.api.messages.send({ raw });
    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    console.error("Send email error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Failed to send" }, { status: 500 });
  }
}
