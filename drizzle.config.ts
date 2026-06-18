import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts", // Tumhara schema path yaha set kar diya hai
  out: "./drizzle",
  dialect: "postgresql", // Agar Supabase/Neon use kar rahe ho. Change to "sqlite" or "mysql" if needed
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
