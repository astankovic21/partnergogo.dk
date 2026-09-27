import type { PublisherProfile } from "@/types";
import { Globe } from "lucide-react";
import type { ReactNode } from "react";

export default function PublisherCard({
  publisher,
  footer,
}: {
  publisher: PublisherProfile;
  /** Optional extra actions (buttons/links) rendered below the stats row. */
  footer?: ReactNode;
}) {
  const stats = publisher.performanceStats;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{publisher.companyName}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted">
            <Globe className="h-3.5 w-3.5" />
            {publisher.country}
          </p>
        </div>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-accent">
          {publisher.categories[0]}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted line-clamp-2">{publisher.description}</p>

      <div className="mt-4 flex items-center justify-between rounded-lg bg-teal-50 px-3 py-2 text-sm">
        <span className="text-xs text-muted">Monthly traffic</span>
        <span className="font-semibold text-accent">{publisher.monthlyTraffic.toLocaleString()}</span>
      </div>

      {/* All the numbers an advertiser needs to decide, without clicking in */}
      <div className="mt-4 grid flex-1 grid-cols-4 gap-1.5 border-t border-border pt-4 text-center">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Avg. EPC</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{stats.avgEpc.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Conv. rate</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {(stats.conversionRate * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Cancel.</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">
            {(stats.cancellationRate * 100).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted">Deals</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{stats.successfulPartnerships}</p>
        </div>
      </div>

      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}
