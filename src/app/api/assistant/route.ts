import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/server/auth/auth";
import { AIService } from "@/server/ai/openai.service";

export async function POST(
  request: NextRequest
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { message } =
      await request.json();

    const response =
      await AIService.chat(message);

    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Assistant failed",
      },
      {
        status: 500,
      }
    );
  }
}