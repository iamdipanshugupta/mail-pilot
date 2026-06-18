import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var dbPool: Pool | undefined;
}

const pool =
  global.dbPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.dbPool = pool;
}

export const db = drizzle(pool, {
  schema,
});

export { pool };