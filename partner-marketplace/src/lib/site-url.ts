// ---------------------------------------------------------------------------
// Resolves the site's own public origin (for building tracking links etc.).
//
// Prefers `NEXT_PUBLIC_SITE_URL` when set (useful behind a proxy/CDN where
// the request's Host header may not be the canonical public domain).
// Otherwise falls back to the request's own Host header, which is right in
// every normal deployment without needing any env var configured. Only used
// from request-time code (Route Handlers, dynamic Server Components) — never
// called during static generation.
// ---------------------------------------------------------------------------

import { headers } from "next/headers";

// Keep in sync with the `siteUrl` constant in src/app/layout.tsx — this is
// the last-resort fallback when neither an env var nor request headers are
// available.
const FALLBACK_SITE_URL = "https://partnergogo.dk";

export async function getSiteUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "https";
    if (host) return `${proto}://${host}`;
  } catch {
    // headers() throws outside a request context — fall through to the
    // static fallback below.
  }

  return FALLBACK_SITE_URL;
}
