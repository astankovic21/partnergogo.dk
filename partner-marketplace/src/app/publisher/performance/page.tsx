"use client";

import { Wallet, Target, TrendingUp, Repeat, XCircle, Award } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { useCurrentPublisher } from "@/context/demo-user-context";

export default function PublisherPerformancePage() {
  const publisher = useCurrentPublisher();
  const stats = publisher.performanceStats;

  const healthScore = Math.round(
    Math.min(100, Math.max(0, (1 - stats.cancellationRate) * 70 + stats.conversionRate * 600))
  );

  return (
    <div className="container-page py-14">
      <h1 className="text-2xl font-bold text-foreground">Lifetime performance</h1>
      <p className="mt-2 text-sm text-muted">{publisher.companyName} &middot; all-time stats across the platform</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={Wallet} label="Lifetime revenue" value={`${stats.lifetimeRevenue.toLocaleString()} DKK`} />
        <StatCard icon={Target} label="Conversions" value={stats.conversions.toLocaleString()} />
        <StatCard icon={TrendingUp} label="Avg. EPC" value={`${stats.avgEpc.toFixed(2)} DKK`} />
        <StatCard icon={Repeat} label="Conversion rate" value={`${(stats.conversionRate * 100).toFixed(1)}%`} />
        <StatCard icon={XCircle} label="Cancellation rate" value={`${(stats.cancellationRate * 100).toFixed(1)}%`} />
        <StatCard icon={Award} label="Successful partnerships" value={stats.successfulPartnerships.toString()} />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Partnership health</h2>
        <p className="mt-2 text-sm text-muted">
          A simple blend of conversion rate and cancellation rate — higher is healthier.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${Math.max(4, healthScore)}%` }}
            />
          </div>
          <span className="w-12 text-right text-sm font-semibold text-foreground">{healthScore}%</span>
        </div>
      </div>
    </div>
  );
}
