// ---------------------------------------------------------------------------
// Shared env-var reading for the Supabase clients.
//
// This app must still build and run with zero Supabase env vars configured
// (the whole mock-data demo has to keep working). So reading these values is
// split from *requiring* them: `getSupabaseEnv()` never throws — callers
// decide whether a missing value is fatal, and only real backend-gated code
// paths (never anything touched during static generation) call
// `requireSupabaseEnv()`.
// ---------------------------------------------------------------------------

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Backend not configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable real accounts."
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

export function requireSupabaseEnv(): SupabaseEnv {
  const env = getSupabaseEnv();
  if (!env) throw new SupabaseNotConfiguredError();
  return env;
}
