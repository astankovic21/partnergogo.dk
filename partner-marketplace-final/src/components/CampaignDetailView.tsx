"use client";

import { useState } from "react";
import { MapPin, Calendar, Cookie, Target, Wallet, Ban, CheckCircle2, Zap, TrendingUp, ShieldCheck, Users } from "lucide-react";
import type { Campaign } from "@/types";
import Badge from "@/components/ui/Badge";

export default function CampaignDetailView({ campaign }: { campaign: Campaign }) {
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="container-page py-14">
      <div className="flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{campaign.name}</h1>
            <Badge status={campaign.status} />
          </div>
          <p className="mt-1 text-sm text-muted">{campaign.brand}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand">
              {campaign.vertical}
            </span>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-accent">
              {campaign.commissionModel} &middot; {campaign.commissionAmount}
            </span>
          </div>
        </div>

        <div className="w-full shrink-0 sm:w-64">
          {applied ? (
            <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-accent">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Application submitted!
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setApplied(true);
              }}
              className="space-y-2"
            >
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Optional note to the advertiser..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
              >
                Apply to this campaign
              </button>
            </form>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Performance metrics</h2>
        {campaign.stats ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatTile icon={Zap} label="Avg. EPC" value={`${campaign.stats.avgEpc.toFixed(2)} DKK`} />
            <StatTile
              icon={TrendingUp}
              label="Conversion rate"
              value={`${(campaign.stats.conversionRate * 100).toFixed(1)}%`}
            />
            <StatTile
              icon={ShieldCheck}
              label="Approval rate"
              value={`${(campaign.stats.approvalRate * 100).toFixed(0)}%`}
            />
            <StatTile icon={Users} label="Active publishers" value={`${campaign.stats.activePublishers}`} />
          </div>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted">
            This campaign hasn&apos;t launched yet — no performance data to show until it&apos;s active.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Description</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{campaign.description}</p>
        <a
          href={campaign.landingPageUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
        >
          {campaign.landingPageUrl}
        </a>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Campaign terms</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <Row icon={MapPin} label="Countries" value={campaign.countries.join(", ")} />
            <Row icon={Target} label="Conversion goal" value={campaign.conversionGoal} />
            <Row icon={Cookie} label="Cookie duration" value={`${campaign.cookieDurationDays} days`} />
            {campaign.monthlyTarget && (
              <Row icon={Target} label="Monthly target" value={campaign.monthlyTarget.toLocaleString()} />
            )}
            {campaign.budget && (
              <Row icon={Wallet} label="Budget" value={`${campaign.budget.toLocaleString()} DKK`} />
            )}
            <Row icon={Calendar} label="Start date" value={campaign.startDate} />
            {campaign.endDate && <Row icon={Calendar} label="End date" value={campaign.endDate} />}
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Traffic policy</h2>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Allowed traffic</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {campaign.allowedTraffic.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-accent"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-muted">Restricted traffic</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {campaign.restrictedTraffic.length === 0 && (
                <span className="text-xs text-muted">None</span>
              )}
              {campaign.restrictedTraffic.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700"
                >
                  <Ban className="h-3 w-3" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-1.5 text-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
