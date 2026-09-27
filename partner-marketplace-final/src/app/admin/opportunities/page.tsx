import Link from "next/link";
import { distributionRequests, trafficListings, getAdvertiserById, getPublisherById } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";

export default function AdminOpportunitiesPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Distribution requests ({distributionRequests.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="px-6 py-3 font-medium">Advertiser</th>
                <th className="px-6 py-3 font-medium">Market</th>
                <th className="px-6 py-3 font-medium">Vertical</th>
                <th className="px-6 py-3 font-medium">Deal model</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {distributionRequests.map((r) => {
                const advertiser = getAdvertiserById(r.advertiserId);
                return (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3 font-medium text-foreground">
                      {advertiser?.companyName ?? r.brand}
                    </td>
                    <td className="px-6 py-3 text-muted">{r.market}</td>
                    <td className="px-6 py-3 text-muted">{r.vertical}</td>
                    <td className="px-6 py-3 text-muted">{r.dealModel}</td>
                    <td className="px-6 py-3">
                      <Badge status={r.status} />
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/distribution/${r.id}`}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Traffic listings ({trafficListings.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="px-6 py-3 font-medium">Publisher</th>
                <th className="px-6 py-3 font-medium">Country</th>
                <th className="px-6 py-3 font-medium">Vertical</th>
                <th className="px-6 py-3 font-medium">Channel</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trafficListings.map((t) => {
                const publisher = getPublisherById(t.publisherId);
                return (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3 font-medium text-foreground">
                      {publisher?.companyName ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-muted">{t.country}</td>
                    <td className="px-6 py-3 text-muted">{t.vertical}</td>
                    <td className="px-6 py-3 text-muted">{t.channel}</td>
                    <td className="px-6 py-3">
                      <Badge status={t.status} />
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/traffic/${t.id}`}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
