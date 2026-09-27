"use client";

// ---------------------------------------------------------------------------
// Browser Supabase client, for Client Components (real signup/login, the
// onboarding forms, the "/…/campaigns/live" pages, the navbar's real-auth
// indicator).
//
// Returns `null` instead of throwing when env vars aren't set, so pages that
// render fine without a backend (i.e. everything in the existing mock demo)
// never crash just because this module got imported. Callers that are
// actually backend-gated should show a "Backend not configured yet" message
// when this returns null rather than call into Supabase.
// ---------------------------------------------------------------------------

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

let browserClient: SupabaseClient | null | undefined;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (browserClient !== undefined) return browserClient;
  const env = getSupabaseEnv();
  if (!env) {
    browserClient = null;
    return browserClient;
  }
  browserClient = createBrowserClient(env.url, env.anonKey);
  return browserClient;
}
