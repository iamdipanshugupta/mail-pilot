import { NextResponse } from "next/server";
import { getCorsair } from "@/server/corsair";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const c = getCorsair("tenant-id-placeholder"); // Replace with actual tenant ID logic

  const email = await (c as any).gmail.api.messages.get({
    id,
    format: "full",
  });

  return NextResponse.json(email);
}