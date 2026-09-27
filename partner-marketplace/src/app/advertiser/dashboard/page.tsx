"use client";

import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Target,
  Users,
  Megaphone,
  Percent,
  Gauge,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import MatchBar from "@/components/ui/MatchBar";
import Badge from "@/components/ui/Badge";
import {
  getCampaignsByAdvertiser,
  getDealsByAdvertiser,
  getPrivateOffersByAdvertiser,
  getPublisherById,
  getCampaignApplicationsByCampaign,
  conversions,
  publishers,
} from "@/lib/mock-data";
import { computeAdvertiserStats, computeCampaignPerformance } from "@/lib/dashboard-stats";
import { rankPublishersForCampaign } from "@/lib/matching";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

export default function AdvertiserDashboardPage() {
  const advertiser = useCurrentAdvertiser();
  const campaigns = getCampaignsByAdvertiser(advertiser.id);
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const deals = getDealsByAdvertiser(advertiser.id);
  const offers = getPrivateOffersByAdvertiser(advertiser.id).slice(0, 4);
  const stats = computeAdvertiserStats(advertiser.id);
  const performance = computeCampaignPerformance(campaigns);
  const recentConversions = conversions.filter((c) => c.advertiserId === advertiser.id);

  const matchCampaign = activeCampaigns[0] ?? campaigns[0];
  const matches = matchCampaign ? rankPublishersForCampaign(matchCampaign, publishers).slice(0, 5) : [];

  const pendingApplications = campaigns.flatMap((c) =>
    getCampaignApplicationsByCampaign(c.id)
      .filter((a) => a.status === "pending")
      .map((a) => ({ application: a, campaign: c }))
  );

  return (
    <div className="container-page py-14">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Advertiser dashboard</h1>
          <p className="text-sm text-muted">{advertiser.companyName}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/marketplace/publishers"
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-slate-50"
          >
            Browse publishers
          </Link>
          <Link
            href="/advertiser/campaigns/new"
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-indigo-700"
          >
            New campaign
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard icon={Wallet} label="Spend" value={`${stats.spend.toLocaleString()} DKK`} />
        <StatCard icon={TrendingUp} label="Revenue" value={`${stats.revenue.toLocaleString()} DKK`} />
        <StatCard icon={Target} label="Conversions" value={stats.conversions.toLocaleString()} />
        <StatCard icon={Users} label="Active publishers" value={stats.activePublishers.toString()} />
        <StatCard icon={Megaphone} label="Active campaigns" value={stats.activeCampaigns.toString()} />
        <StatCard icon={Percent} label="Avg. CPA" value={`${stats.avgCpa.toLocaleString()} DKK`} />
        <StatCard icon={Gauge} label="ROAS" value={`${stats.roas.toFixed(1)}x`} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Campaign performance table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Campaign performance</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted">
                  <th className="pb-2 pr-4 font-medium">Campaign</th>
                  <th className="pb-2 pr-4 font-medium">Status</th>
                  <th className="pb-2 pr-4 font-medium">Clicks</th>
                  <th className="pb-2 pr-4 font-medium">Conversions</th>
                  <th className="pb-2 font-medium">Spend</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((row) => (
                  <tr key={row.campaign.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pr-4">
                      <Link href={`/campaigns/${row.campaign.id}`} className="font-medium text-foreground hover:text-brand">
                        {row.campaign.name}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4">
                      <Badge status={row.campaign.status} />
                    </td>
                    <td className="py-2.5 pr-4 text-muted">{row.clicks.toLocaleString()}</td>
                    <td className="py-2.5 pr-4 text-muted">{row.conversions.toLocaleString()}</td>
                    <td className="py-2.5 text-muted">{row.spend.toLocaleString()} DKK</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {performance.length === 0 && <p className="py-4 text-sm text-muted">No campaigns yet.</p>}
          </div>
        </div>

        {/* Publisher recommendations */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Top publisher matches</h2>
          <p className="mt-1 text-xs text-muted">
            {matchCampaign ? `For "${matchCampaign.name}"` : "Create a campaign to see matches"}
          </p>
          <div className="mt-4 space-y-3">
            {matches.map(({ publisher, score }) => (
              <div key={publisher.id} className="flex items-center justify-between gap-3">
                <Link href={`/publishers/${publisher.id}`} className="text-sm font-medium text-foreground hover:text-brand">
                  {publisher.companyName}
                </Link>
                <MatchBar score={score} />
              </div>
            ))}
            {matches.length === 0 && <p className="text-sm text-muted">No matches yet.</p>}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Top publishers (from deals) */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Top publishers</h2>
          <div className="mt-4 space-y-3">
            {deals.slice(0, 5).map((d) => {
              const p = getPublisherById(d.publisherId);
              if (!p) return null;
              return (
                <div key={d.id} className="flex items-center justify-between gap-3 text-sm">
                  <Link href={`/publishers/${p.id}`} className="font-medium text-foreground hover:text-brand">
                    {p.companyName}
                  </Link>
                  <Badge status={d.status} />
                </div>
              );
            })}
            {deals.length === 0 && <p className="text-sm text-muted">No active deals yet.</p>}
          </div>
        </div>

        {/* Recent conversions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Recent conversions</h2>
          <div className="mt-4 space-y-3">
            {recentConversions.map((c) => {
              const p = getPublisherById(c.publisherId);
              return (
                <div key={c.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{p?.companyName ?? "Publisher"}</span>
                  <span className="text-muted">{c.commission.toLocaleString()} DKK</span>
                  <Badge status={c.status} />
                </div>
              );
            })}
            {recentConversions.length === 0 && (
              <p className="text-sm text-muted">No conversions recorded yet for this account.</p>
            )}
          </div>
        </div>

        {/* Pending applications */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Pending applications</h2>
          <div className="mt-4 space-y-3">
            {pendingApplications.map(({ application, campaign }) => {
              const p = getPublisherById(application.publisherId);
              return (
                <div key={application.id} className="text-sm">
                  <p className="font-medium text-foreground">{p?.companyName ?? "Publisher"}</p>
                  <p className="text-xs text-muted">wants to join {campaign.name}</p>
                </div>
              );
            })}
            {pendingApplications.length === 0 && (
              <p className="text-sm text-muted">No pending applications.</p>
            )}
          </div>
        </div>
      </div>

      {/* Private offers */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Private offers (recent)</h2>
          <Link href="/advertiser/offers" className="text-xs font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {offers.map((o) => {
            const p = getPublisherById(o.publisherId);
            return (
              <div key={o.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{p?.companyName ?? "Publisher"}</span>
                  <Badge status={o.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{o.privateCpa}</p>
              </div>
            );
          })}
          {offers.length === 0 && <p className="text-sm text-muted">No private offers sent yet.</p>}
        </div>
      </div>
    </div>
  );
}
