import type { Campaign } from "@/types";
import { MapPin, Percent, Clock } from "lucide-react";
import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";

export default function CampaignCard({
  campaign,
  footer,
  showStatus = false,
}: {
  campaign: Campaign;
  /** Optional extra actions (buttons/links) rendered below the stats row. */
  footer?: ReactNode;
  showStatus?: boolean;
}) {
  const { stats } = campaign;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{campaign.brand}</h3>
          <p className="mt-1 text-xs text-muted">{campaign.name}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand">
            {campaign.vertical}
          </span>
          {showStatus && <Badge status={campaign.status} />}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2">{campaign.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {campaign.countries.slice(0, 3).join(", ")}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {campaign.cookieDurationDays}-day cookie
        </span>
      </div>

      <div className="mt-4 flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-sm">
        <Percent className="h-4 w-4 text-brand" />
        <span className="font-semibold text-brand">
          {campaign.commissionModel} &middot; {campaign.commissionAmount}
        </span>
      </div>

      {/* All the numbers a publisher needs to decide, without clicking in */}
      <div className="mt-4 grid flex-1 grid-cols-3 gap-2 border-t border-border pt-4 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Avg. EPC</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {stats ? `${stats.avgEpc.toFixed(2)} DKK` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Conv. rate</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {stats ? `${(stats.conversionRate * 100).toFixed(1)}%` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Approval</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {stats ? `${(stats.approvalRate * 100).toFixed(0)}%` : "—"}
          </p>
        </div>
      </div>
      {!stats && (
        <p className="mt-2 text-center text-[11px] text-muted">New campaign — no performance data yet.</p>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
