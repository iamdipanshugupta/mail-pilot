import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth/auth";
import { generateOAuthUrl } from "corsair/oauth";
import { corsair, provisionTenant } from "@/server/corsair";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

// Shared redirect URI — Google must have this exact URL in its allowed list
const REDIRECT_URI = `${APP_URL}/api/connect/callback`;

/**
 * GET /api/connect?plugin=gmail
 * GET /api/connect?plugin=googlecalendar
 *
 * Redirects the user to Google's OAuth consent screen.
 * The `state` cookie is set so the callback can verify CSRF and
 * look up which plugin + tenant to write tokens for.
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plugin = request.nextUrl.searchParams.get("plugin");
  if (plugin !== "gmail" && plugin !== "googlecalendar") {
    return NextResponse.json(
      { error: "plugin must be 'gmail' or 'googlecalendar'" },
      { status: 400 }
    );
  }

  const tenantId = session.user.email;

  // Idempotent — safe to call on every connection attempt
  await provisionTenant(tenantId);

  // generateOAuthUrl returns the Google consent URL and a signed `state`
  // string that encodes tenantId + plugin so the callback knows where to
  // store the tokens.
  const { url, state } = await generateOAuthUrl(corsair, plugin, {
    tenantId,
    redirectUri: REDIRECT_URI,
  });


  const response = NextResponse.redirect(url);

  // Store state in a cookie so the callback can verify it (CSRF protection)
  response.cookies.set("corsair_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 10, // 10 minutes
  });

  return response;
}
