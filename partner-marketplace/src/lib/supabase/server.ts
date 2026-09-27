// ---------------------------------------------------------------------------
// Server Supabase client, for Server Components and Route Handlers. Reads
// and writes auth cookies via next/headers, so a session started in the
// browser is visible on the server and vice versa.
//
// Returns `null` instead of throwing when env vars aren't set — any
// page/route that calls this must handle the null case (show "Backend not
// configured yet" or similar) rather than assume a client exists. This is
// what keeps `next build` clean with no Supabase env vars: nothing at
// module-eval time touches env vars, only this function call does, and it
// never throws.
// ---------------------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

export async function getSupabaseServerClient(): Promise<SupabaseClient | null> {
  const env = getSupabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `set` from a Server Component (not a Route Handler/Server Action)
          // throws — safe to ignore as long as middleware or the browser
          // client refreshes the session elsewhere. Nothing to do here.
        }
      },
    },
  });
}
