import Link from "next/link";
import { deals, getAdvertiserById, getPublisherById } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";

export default function AdminDealsPage() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Deals ({deals.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-6 py-3 font-medium">Advertiser</th>
              <th className="px-6 py-3 font-medium">Publisher</th>
              <th className="px-6 py-3 font-medium">Commission model</th>
              <th className="px-6 py-3 font-medium">Updated</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d) => {
              const advertiser = getAdvertiserById(d.advertiserId);
              const publisher = getPublisherById(d.publisherId);
              return (
                <tr key={d.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-foreground">
                    {advertiser?.companyName ?? "—"}
                  </td>
                  <td className="px-6 py-3 text-muted">{publisher?.companyName ?? "—"}</td>
                  <td className="px-6 py-3 text-muted">{d.commissionModel}</td>
                  <td className="px-6 py-3 text-muted">{d.updatedAt}</td>
                  <td className="px-6 py-3">
                    <Badge status={d.status} />
                  </td>
                  <td className="px-6 py-3">
                    <Link
                      href={`/deals/${d.id}`}
                      className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                    >
                      View thread
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
