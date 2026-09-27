import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { SupabaseNotConfiguredError } from "@/lib/supabase/env";
import type { CampaignRow } from "@/lib/supabase/types";

// Public tracking-link redirect: https://<site>/go/<campaignId>/<publisherId>
// Hit directly by real end-users' browsers (from a banner or text link a
// publisher placed on their own site) — never gated behind auth, and never
// statically generated since it always does a fresh DB lookup + write.
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ campaignId: string; publisherId: string }> }
) {
  const { campaignId, publisherId } = await params;

  // Where we send people when the link can't be resolved for any reason.
  // NOTE: this deliberately points at "/", not "/campaigns/[id]" — that
  // page is still the mock-data demo page (generateStaticParams only knows
  // the hardcoded demo IDs) and would 404 on a real campaign UUID. Once a
  // real, database-backed public campaign detail page exists, point this
  // there instead.
  const fallbackUrl = new URL("/", request.nextUrl.origin);

  let admin;
  try {
    admin = getSupabaseAdminClient();
  } catch (err) {
    if (err instanceof SupabaseNotConfiguredError) {
      fallbackUrl.searchParams.set("notice", "tracking-unavailable");
      return NextResponse.redirect(fallbackUrl);
    }
    throw err;
  }

  const { data: campaign } = await admin
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .eq("status", "active")
    .maybeSingle<CampaignRow>();

  if (!campaign) {
    fallbackUrl.searchParams.set("notice", "campaign-unavailable");
    return NextResponse.redirect(fallbackUrl);
  }

  let destination: URL;
  try {
    destination = new URL(campaign.landing_page_url);
  } catch {
    // A campaign with a malformed landing page URL — send the user to our
    // own campaign page rather than crash or redirect somewhere broken.
    fallbackUrl.searchParams.set("notice", "invalid-landing-page");
    return NextResponse.redirect(fallbackUrl);
  }

  const clickId = crypto.randomUUID();
  const geo = request.headers.get("x-vercel-ip-country");

  // Logging the click must never block or break the user's redirect — if
  // the DB write fails for any reason, they still go through.
  try {
    const { error } = await admin.from("clicks").insert({
      campaign_id: campaignId,
      publisher_id: publisherId,
      click_id: clickId,
      geo: geo || null,
    });
    if (error) console.error("[/go] failed to record click:", error.message);
  } catch (err) {
    console.error("[/go] failed to record click:", err);
  }

  destination.searchParams.set("pmid", clickId);

  return NextResponse.redirect(destination, { status: 302 });
}
