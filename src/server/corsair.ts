/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pool } from "pg";
import { createCorsair, setupCorsair } from "corsair";
import { gmail } from "@corsair-dev/gmail";
import { googlecalendar } from "@corsair-dev/googlecalendar";

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const corsair = createCorsair({
  multiTenancy: true,           // ← REQUIRED for per-user credentials
  plugins: [gmail(), googlecalendar()],
  database: db,
  kek: process.env.CORSAIR_KEK!,
});

// Returns a tenant-scoped instance — use this for all API calls
export function getCorsair(tenantId: string) {
  return corsair.withTenant(tenantId);
}

// Call this when a new user signs up / first logs in
export async function provisionTenant(tenantId: string) {
  try {
    await setupCorsair(corsair, { tenantId });
  } catch (e: any) {
    // Idempotent — safe to call multiple times
    if (!e?.message?.includes("already exists")) {
      console.error("provisionTenant error:", e?.message);
    }
  }
}
