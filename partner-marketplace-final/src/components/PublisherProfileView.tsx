"use client";

import { useState } from "react";
import {
  Globe,
  MapPin,
  Mail,
  Camera,
  PlaySquare,
  Smartphone,
  TrendingUp,
  Target,
  Wallet,
  Repeat,
  Award,
  XCircle,
} from "lucide-react";
import type { PublisherProfile } from "@/types";
import { getCampaignsByAdvertiser } from "@/lib/mock-data";
import { useCurrentAdvertiser } from "@/context/demo-user-context";
import InviteToCampaignModal from "@/components/InviteToCampaignModal";
import SendPrivateOfferModal from "@/components/SendPrivateOfferModal";
import StatCard from "@/components/ui/StatCard";

export default function PublisherProfileView({ publisher }: { publisher: PublisherProfile }) {
  const advertiser = useCurrentAdvertiser();
  const advertiserCampaigns = getCampaignsByAdvertiser(advertiser.id);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  const stats = publisher.performanceStats;

  const audienceRows: { label: string; value?: number; icon: typeof Camera }[] = [
    { label: "Newsletter subscribers", value: publisher.newsletterSubscribers, icon: Mail },
    { label: "Instagram followers", value: publisher.instagramFollowers, icon: Camera },
    { label: "TikTok followers", value: publisher.tiktokFollowers, icon: TrendingUp },
    { label: "YouTube subscribers", value: publisher.youtubeSubscribers, icon: PlaySquare },
    { label: "App users", value: publisher.appUsers, icon: Smartphone },
  ].filter((r) => r.value !== undefined);

  return (
    <div className="container-page py-14">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{publisher.companyName}</h1>
            {!publisher.approved && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Pending approval
              </span>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <Globe className="h-4 w-4" />
            <a href={publisher.website} target="_blank" rel="noreferrer" className="hover:text-foreground">
              {publisher.website}
            </a>
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {publisher.country} &middot; Primary GEOs: {publisher.primaryGeos.join(", ")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {publisher.categories.map((c) => (
              <span key={c} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-accent">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:w-52">
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
          >
            Invite to Campaign
          </button>
          <button
            type="button"
            onClick={() => setOfferOpen(true)}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-slate-50"
          >
            Send Private Offer
          </button>
        </div>
      </div>

      {/* Description */}
      <section className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">About</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{publisher.description}</p>
      </section>

      {/* Audience & channels */}
      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Audience & traffic
          </h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Monthly traffic</span>
              <span className="font-semibold text-foreground">
                {publisher.monthlyTraffic.toLocaleString()}
              </span>
            </div>
            {audienceRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted">
                  <row.icon className="h-3.5 w-3.5" />
                  {row.label}
                </span>
                <span className="font-semibold text-foreground">{row.value!.toLocaleString()}</span>
              </div>
            ))}
            {publisher.otherAudience && (
              <p className="pt-2 text-xs text-muted">{publisher.otherAudience}</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Channels & deal models
          </h2>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Traffic sources</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {publisher.trafficSources.map((s) => (
                <span key={s} className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Preferred deal models</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {publisher.preferredDealModels.map((m) => (
                <span
                  key={m}
                  className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Performance metrics */}
      <section className="mt-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
          Performance metrics
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={Wallet} label="Lifetime revenue" value={`${stats.lifetimeRevenue.toLocaleString()} DKK`} />
          <StatCard icon={Target} label="Conversions" value={stats.conversions.toLocaleString()} />
          <StatCard icon={TrendingUp} label="Avg. EPC" value={`${stats.avgEpc.toFixed(2)} DKK`} />
          <StatCard icon={Repeat} label="Conversion rate" value={`${(stats.conversionRate * 100).toFixed(1)}%`} />
          <StatCard icon={XCircle} label="Cancellation rate" value={`${(stats.cancellationRate * 100).toFixed(1)}%`} />
          <StatCard icon={Award} label="Partnerships" value={stats.successfulPartnerships.toString()} />
        </div>
      </section>

      <InviteToCampaignModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        publisher={publisher}
        campaigns={advertiserCampaigns}
      />
      <SendPrivateOfferModal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        publisher={publisher}
        campaigns={advertiserCampaigns}
      />
    </div>
  );
}
