"use client";

import { useState } from "react";
import Link from "next/link";
import { Wallet, MousePointerClick, Target, Percent, Repeat, Megaphone, Check, X } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import MatchBar from "@/components/ui/MatchBar";
import Badge from "@/components/ui/Badge";
import {
  campaigns,
  getDealsByPublisher,
  getCampaignById,
  getPrivateOffersByPublisher,
  getAdvertiserById,
  distributionRequests,
} from "@/lib/mock-data";
import { computePublisherStats } from "@/lib/dashboard-stats";
import { rankCampaignsForPublisher } from "@/lib/matching";
import { useCurrentPublisher } from "@/context/demo-user-context";

export default function PublisherDashboardPage() {
  const publisher = useCurrentPublisher();
  const stats = computePublisherStats(publisher);
  const deals = getDealsByPublisher(publisher.id);
  const offers = getPrivateOffersByPublisher(publisher.id).slice(0, 4);

  const recommended = rankCampaignsForPublisher(publisher, campaigns.filter((c) => c.status === "active")).slice(
    0,
    5
  );

  const opportunities = distributionRequests
    .filter(
      (r) =>
        r.status === "open" &&
        (publisher.categories.includes(r.vertical) || publisher.primaryGeos.includes(r.market))
    )
    .slice(0, 4);

  // A couple of the publisher's best-fit active campaigns get flagged as
  // simulated "advertiser invitations" so this section has something to
  // show and act on (no separate invite-store exists yet in the mock data).
  const invitationPool = recommended.filter(({ score }) => score >= 55).slice(0, 2);
  const [invitations, setInvitations] = useState(
    invitationPool.map(({ campaign }) => ({ campaign, status: "pending" as "pending" | "accepted" | "declined" }))
  );

  return (
    <div className="container-page py-14">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Publisher dashboard</h1>
          <p className="text-sm text-muted">{publisher.companyName}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/marketplace/campaigns"
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
          >
            Browse campaigns
          </Link>
          <Link
            href={`/publishers/${publisher.id}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            View public profile
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Wallet} label="Revenue" value={`${stats.revenue.toLocaleString()} DKK`} />
        <StatCard icon={MousePointerClick} label="Clicks" value={stats.clicks.toLocaleString()} />
        <StatCard icon={Target} label="Conversions" value={stats.conversions.toLocaleString()} />
        <StatCard icon={Percent} label="EPC" value={`${stats.epc.toFixed(2)} DKK`} />
        <StatCard icon={Repeat} label="Conversion rate" value={`${(stats.conversionRate * 100).toFixed(1)}%`} />
        <StatCard icon={Megaphone} label="Active campaigns" value={stats.activeCampaigns.toString()} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Top campaigns */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Top campaigns</h2>
          <div className="mt-4 space-y-3">
            {deals.map((d) => {
              const c = d.campaignId ? getCampaignById(d.campaignId) : undefined;
              return (
                <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{c?.name ?? "General deal"}</span>
                  <Badge status={d.status} />
                </div>
              );
            })}
            {deals.length === 0 && <p className="text-sm text-muted">No active deals yet.</p>}
          </div>
        </div>

        {/* Recommended campaigns */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Recommended campaigns</h2>
          <div className="mt-4 space-y-3">
            {recommended.map(({ campaign, score }) => (
              <div key={campaign.id} className="flex items-center justify-between gap-3">
                <Link href={`/campaigns/${campaign.id}`} className="text-sm font-medium text-foreground hover:text-brand">
                  {campaign.name}
                </Link>
                <MatchBar score={score} />
              </div>
            ))}
            {recommended.length === 0 && <p className="text-sm text-muted">No recommendations yet.</p>}
          </div>
        </div>

        {/* New advertiser invitations */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">New invitations</h2>
          <div className="mt-4 space-y-3">
            {invitations.map(({ campaign, status }) => (
              <div key={campaign.id} className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">{campaign.brand}</p>
                <p className="text-xs text-muted">invited you to {campaign.name}</p>
                {status === "pending" ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setInvitations((prev) =>
                          prev.map((i) => (i.campaign.id === campaign.id ? { ...i, status: "accepted" } : i))
                        )
                      }
                      className="flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                    >
                      <Check className="h-3 w-3" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setInvitations((prev) =>
                          prev.map((i) => (i.campaign.id === campaign.id ? { ...i, status: "declined" } : i))
                        )
                      }
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-muted hover:bg-slate-50"
                    >
                      <X className="h-3 w-3" />
                      Decline
                    </button>
                  </div>
                ) : (
                  <span className="mt-2 inline-block">
                    <Badge status={status} />
                  </span>
                )}
              </div>
            ))}
            {invitations.length === 0 && <p className="text-sm text-muted">No new invitations.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Private offers */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Private offers</h2>
            <Link href="/publisher/offers" className="text-xs font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {offers.map((o) => {
              const advertiser = getAdvertiserById(o.advertiserId);
              return (
                <div key={o.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{advertiser?.companyName ?? o.brand}</p>
                    <p className="text-xs text-accent">{o.privateCpa}</p>
                  </div>
                  <Badge status={o.status} />
                </div>
              );
            })}
            {offers.length === 0 && <p className="text-sm text-muted">No private offers yet.</p>}
          </div>
        </div>

        {/* Available opportunities */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Available opportunities</h2>
            <Link href="/distribution" className="text-xs font-semibold text-brand hover:underline">
              Browse all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {opportunities.map((r) => (
              <Link
                key={r.id}
                href={`/distribution/${r.id}`}
                className="block rounded-lg border border-border p-3 text-sm transition-colors hover:border-brand"
              >
                <p className="font-medium text-foreground">{r.brand}</p>
                <p className="text-xs text-muted">
                  {r.market} &middot; {r.vertical} &middot; {r.budget.toLocaleString()} DKK budget
                </p>
              </Link>
            ))}
            {opportunities.length === 0 && <p className="text-sm text-muted">No matching opportunities right now.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
