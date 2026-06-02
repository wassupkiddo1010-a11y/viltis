import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ─── Lazy singleton ──────────────────────────────────────────────────────────
// Initialised on first use (at request time), not at module-load time.
// This prevents "undefined env var" errors during Next.js route compilation.

let _client: SupabaseClient | null = null;

/**
 * Returns the server-side Supabase client (service-role key, full access).
 * Only call this inside API routes or Server Components — never in browser code.
 */
export function getSupabaseClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
    );
  }

  _client = createClient(url, key, { auth: { persistSession: false } });
  return _client;
}

// Convenience alias so call-sites can use `supabase.from(...)` directly
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseClient() as unknown as Record<string, unknown>)[prop as string];
  },
});

// ─── Row type (mirrors the `jobs` table) ─────────────────────────────────────

export interface JobRow {
  id: number;
  title: string;
  description: string | null;
  employment_type: string | null;
  on_site: string | null;
  location: string | null;
  salary: number | null;
  pay_rate: number | null;
  salary_unit: string | null;
  num_openings: number | null;
  category: string | null;
  date_added: number | null;
  synced_at: string;
}
