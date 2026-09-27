// ---------------------------------------------------------------------------
// Service-role Supabase client — bypasses Row Level Security. Server-only,
// for privileged writes such as recording clicks/conversions from tracking
// route handlers. NEVER import this from a Client Component — it reads
// `SUPABASE_SERVICE_ROLE_KEY`, which must never reach the browser bundle.
//
// Like the other clients, this never throws at module-eval time. Only
// `getSupabaseAdminClient()` reads env vars, and only when actually called —
// which should never happen during `next build`'s static generation, since
// nothing that touches this module is statically generated.
// ---------------------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SupabaseNotConfiguredError } from "./env";

let adminClient: SupabaseClient | null | undefined;

export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw new SupabaseNotConfiguredError();

  adminClient = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}
