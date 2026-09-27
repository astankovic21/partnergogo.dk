"use client";

import { useState } from "react";
import Link from "next/link";
import { campaigns as initialCampaigns, getAdvertiserById } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import type { Campaign } from "@/types";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);

  function setStatus(id: string, status: Campaign["status"]) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Campaigns ({campaigns.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-6 py-3 font-medium">Campaign</th>
              <th className="px-6 py-3 font-medium">Advertiser</th>
              <th className="px-6 py-3 font-medium">Model</th>
              <th className="px-6 py-3 font-medium">Payout</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const advertiser = getAdvertiserById(c.advertiserId);
              return (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-foreground">
                    <Link href={`/campaigns/${c.id}`} className="hover:text-brand">
                      {c.name}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-muted">{advertiser?.companyName ?? "—"}</td>
                  <td className="px-6 py-3 text-muted">{c.commissionModel}</td>
                  <td className="px-6 py-3 text-muted">{c.commissionAmount}</td>
                  <td className="px-6 py-3">
                    <Badge status={c.status} />
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      {c.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, "active")}
                          className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-teal-100"
                        >
                          Approve
                        </button>
                      )}
                      {c.status === "active" && (
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, "paused")}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                        >
                          Disable
                        </button>
                      )}
                      {c.status === "paused" && (
                        <button
                          type="button"
                          onClick={() => setStatus(c.id, "active")}
                          className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-teal-100"
                        >
                          Reactivate
                        </button>
                      )}
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                      >
                        View
                      </Link>
                    </div>
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
