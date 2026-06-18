/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/inbox/classify
 * Body: { emails: [{ id, subject, snippet, from }] }
 *
 * Classifies each email's priority using a single fast/cheap LLM call.
 * This is the core "workflow improvement" feature — instead of a flat
 * inbox list, users see urgent things first.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { emails } = await request.json();

    if (!Array.isArray(emails) || emails.length === 0)
      return NextResponse.json({ error: "emails array required" }, { status: 400 });

    const capped = emails.slice(0, 30); // safety cap per request

    const emailList = capped
      .map((e: any, i: number) => `[${i}] From: ${e.from}\nSubject: ${e.subject}\nSnippet: ${e.snippet}`)
      .join("\n\n");

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an email triage assistant. Classify each email's priority as exactly one of: urgent, important, normal, low. " +
            "urgent = needs action today (deadlines, time-sensitive requests, direct asks from real people). " +
            "important = relevant but not time-critical (work updates, real conversations). " +
            "normal = routine notifications (order updates, confirmations, receipts). " +
            "low = marketing, newsletters, promotions, automated noise. " +
            "Respond ONLY with valid JSON, no markdown, no explanation: " +
            '{"results": [{"index": 0, "priority": "urgent", "reason": "short reason under 10 words"}]}',
        },
        { role: "user", content: emailList },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);

    return NextResponse.json({ classifications: parsed.results ?? [] });
  } catch (e: any) {
    console.error("Classify error:", e?.message ?? e);
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
