/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { processOAuthCallback } from "corsair/oauth";
import { corsair } from "@/server/corsair";

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

// Must exactly match the URI registered in Google Cloud Console
// AND the one passed to generateOAuthUrl()
const REDIRECT_URI = `${APP_URL}/api/connect/callback`;


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const storedState = request.cookies.get("corsair_oauth_state")?.value;

  // Always clear the state cookie in the response
  function clearStateCookie(response: NextResponse) {
    response.cookies.set("corsair_oauth_state", "", {
      maxAge: 0,
      path: "/",
    });
    return response;
  }

  if (!code || !state) {
    const res = NextResponse.redirect(`${APP_URL}/connect?error=missing_params`);
    return clearStateCookie(res);
  }

  // CSRF check — state from Google must match what we stored in the cookie
  if (!storedState || state !== storedState) {
    console.error("[oauth-callback] State mismatch — possible CSRF attack");
    const res = NextResponse.redirect(`${APP_URL}/connect?error=state_mismatch`);
    return clearStateCookie(res);
  }

  try {
    // This is the key call that actually saves tokens into corsair_accounts.config
    // After this, getCorsair(tenantId).gmail.api.* will work
    const result = await processOAuthCallback(corsair, {
      code,
      state,
      redirectUri: REDIRECT_URI,
    });

    console.log(`[oauth-callback] Saved credentials for plugin: ${result.plugin}, tenant: ${result.tenantId}`);

    const res = NextResponse.redirect(`${APP_URL}/connect?connected=${result.plugin}`);
    return clearStateCookie(res);
  } catch (e: any) {
    console.error("[oauth-callback] Error:", e?.message ?? e);
    const res = NextResponse.redirect(`${APP_URL}/connect?error=oauth_failed`);
    return clearStateCookie(res);
  }
}
