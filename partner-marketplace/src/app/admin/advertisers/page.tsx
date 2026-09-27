"use client";

import { useState } from "react";
import Link from "next/link";
import { advertisers as initialAdvertisers, getCampaignsByAdvertiser } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import type { AdvertiserProfile } from "@/types";

export default function AdminAdvertisersPage() {
  const [advertisers, setAdvertisers] = useState<AdvertiserProfile[]>(initialAdvertisers);

  function setApproved(id: string, approved: boolean) {
    setAdvertisers((prev) => prev.map((a) => (a.id === id ? { ...a, approved } : a)));
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Advertisers ({advertisers.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Industry</th>
              <th className="px-6 py-3 font-medium">Website</th>
              <th className="px-6 py-3 font-medium">Campaigns</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {advertisers.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium text-foreground">{a.companyName}</td>
                <td className="px-6 py-3 text-muted">{a.industry}</td>
                <td className="px-6 py-3 text-muted">
                  <Link href={a.website} target="_blank" className="hover:text-brand">
                    {a.website.replace(/^https?:\/\//, "")}
                  </Link>
                </td>
                <td className="px-6 py-3 text-muted">{getCampaignsByAdvertiser(a.id).length}</td>
                <td className="px-6 py-3">
                  <Badge status={a.approved ? "approved" : "pending"} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    {!a.approved && (
                      <button
                        type="button"
                        onClick={() => setApproved(a.id, true)}
                        className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-teal-100"
                      >
                        Approve
                      </button>
                    )}
                    {a.approved && (
                      <button
                        type="button"
                        onClick={() => setApproved(a.id, false)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
