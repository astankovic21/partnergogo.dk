import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, Database } from "lucide-react";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import BackendNotice from "@/components/ui/BackendNotice";
import type {
  CampaignApplicationRow,
  CampaignCreativeRow,
  CampaignRow,
  PublisherProfileRow,
} from "@/lib/supabase/types";
import ApplyButton from "./ApplyButton";
import TrackingLinkBox from "./TrackingLinkBox";
import BannerGrid from "./BannerGrid";

export const metadata: Metadata = {
  title: "Browse live campaigns",
  robots: { index: false, follow: false },
};

// This page reads live Supabase data, so it must never be statically
// generated.
export const dynamic = "force-dynamic";

// Real, database-backed campaign browsing + applications for signed-in
// publishers — separate from the mock /marketplace/campaigns demo, which is
// untouched. Requires a real Supabase session; redirects to /login if there
// isn't one.
export default async function PublisherCampaignsLivePage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-foreground">Browse live campaigns</h1>
          <p className="mt-2 text-muted">Real, database-backed campaigns you can apply to.</p>
          <div className="mt-6">
            <BackendNotice />
          </div>
        </div>
      </div>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: publisherProfile } = await supabase
    .from("publisher_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<PublisherProfileRow>();

  if (!publisherProfile) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-bold text-foreground">Finish setting up your publisher profile</h1>
          <p className="mt-2 text-sm text-muted">
            You&apos;re signed in, but there&apos;s no publisher profile for this account yet.
          </p>
          <Link
            href="/onboarding/publisher"
            className="mt-6 inline-flex rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
          >
            Complete publisher onboarding
          </Link>
        </div>
      </div>
    );
  }

  const [{ data: campaigns }, { data: applications }] = await Promise.all([
    supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<CampaignRow[]>(),
    supabase
      .from("campaign_applications")
      .select("*")
      .eq("publisher_id", publisherProfile.id)
      .returns<CampaignApplicationRow[]>(),
  ]);

  const liveCampaigns = campaigns ?? [];
  const applicationsList = applications ?? [];
  const appliedCampaignIds = new Set(applicationsList.map((a) => a.campaign_id));
  const approvedCampaignIds = new Set(
    applicationsList.filter((a) => a.status === "approved").map((a) => a.campaign_id)
  );

  const campaignIds = liveCampaigns.map((c) => c.id);
  const { data: creatives } =
    campaignIds.length > 0
      ? await supabase
          .from("campaign_creatives")
          .select("*")
          .in("campaign_id", campaignIds)
          .order("created_at", { ascending: false })
          .returns<CampaignCreativeRow[]>()
      : { data: [] as CampaignCreativeRow[] };
  const creativesByCampaign = new Map<string, CampaignCreativeRow[]>();
  for (const creative of creatives ?? []) {
    const list = creativesByCampaign.get(creative.campaign_id) ?? [];
    list.push(creative);
    creativesByCampaign.set(creative.campaign_id, list);
  }

  const siteUrl = await getSiteUrl();

  return (
    <div className="container-page py-14">
      <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-medium text-accent">
        <Database className="h-3.5 w-3.5 shrink-0" />
        Real data — backed by your Supabase project, not the demo.
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-accent">
          <Briefcase className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse live campaigns</h1>
          <p className="text-sm text-muted">{publisherProfile.company_name}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {liveCampaigns.map((c) => (
          <div key={c.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-foreground">{c.name}</h3>
              <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted">
                {c.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{c.brand}</p>
            <p className="mt-3 line-clamp-2 flex-1 text-sm text-foreground">{c.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted">
              <div>
                <dt className="font-medium text-foreground">Commission</dt>
                <dd>{c.commission_model} · {c.commission_amount}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Vertical</dt>
                <dd>{c.vertical}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <ApplyButton
                campaignId={c.id}
                publisherId={publisherProfile.id}
                alreadyApplied={appliedCampaignIds.has(c.id)}
              />
            </div>
            {approvedCampaignIds.has(c.id) && (
              <>
                <TrackingLinkBox trackingUrl={`${siteUrl}/go/${c.id}/${publisherProfile.id}`} />
                <BannerGrid
                  creatives={creativesByCampaign.get(c.id) ?? []}
                  trackingUrl={`${siteUrl}/go/${c.id}/${publisherProfile.id}`}
                  brand={c.brand}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {liveCampaigns.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No real campaigns yet. Once an advertiser creates one at{" "}
          <span className="font-medium text-foreground">/advertiser/campaigns/live</span>, it&apos;ll show up
          here.
        </div>
      )}
    </div>
  );
}
