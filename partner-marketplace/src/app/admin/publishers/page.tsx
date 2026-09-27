"use client";

import { useState } from "react";
import Link from "next/link";
import { publishers as initialPublishers } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import type { PublisherProfile } from "@/types";

export default function AdminPublishersPage() {
  const [publishers, setPublishers] = useState<PublisherProfile[]>(initialPublishers);

  function setApproved(id: string, approved: boolean) {
    setPublishers((prev) => prev.map((p) => (p.id === id ? { ...p, approved } : p)));
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Publishers ({publishers.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Country</th>
              <th className="px-6 py-3 font-medium">Monthly traffic</th>
              <th className="px-6 py-3 font-medium">Lifetime revenue</th>
              <th className="px-6 py-3 font-medium">Conv. rate</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium text-foreground">
                  <Link href={`/publishers/${p.id}`} className="hover:text-brand">
                    {p.companyName}
                  </Link>
                </td>
                <td className="px-6 py-3 text-muted">{p.country}</td>
                <td className="px-6 py-3 text-muted">{p.monthlyTraffic.toLocaleString()}</td>
                <td className="px-6 py-3 text-muted">
                  {p.performanceStats.lifetimeRevenue.toLocaleString()} DKK
                </td>
                <td className="px-6 py-3 text-muted">
                  {(p.performanceStats.conversionRate * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-3">
                  <Badge status={p.approved ? "approved" : "pending"} />
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    {!p.approved && (
                      <button
                        type="button"
                        onClick={() => setApproved(p.id, true)}
                        className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-teal-100"
                      >
                        Approve
                      </button>
                    )}
                    {p.approved && (
                      <button
                        type="button"
                        onClick={() => setApproved(p.id, false)}
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
