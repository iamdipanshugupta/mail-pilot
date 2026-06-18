import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL("/api/connect", request.url);
  url.searchParams.set("plugin", "googlecalendar");
  return NextResponse.redirect(url.toString());
}