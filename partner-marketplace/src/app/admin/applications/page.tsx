"use client";

import { useState } from "react";
import Link from "next/link";
import { campaignApplications as initialApplications, getCampaignById, getPublisherById } from "@/lib/mock-data";
import Badge from "@/components/ui/Badge";
import type { CampaignApplication } from "@/types";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<CampaignApplication[]>(initialApplications);

  function setStatus(id: string, status: CampaignApplication["status"]) {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Campaign applications ({applications.length})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-6 py-3 font-medium">Campaign</th>
              <th className="px-6 py-3 font-medium">Publisher</th>
              <th className="px-6 py-3 font-medium">Message</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => {
              const campaign = getCampaignById(a.campaignId);
              const publisher = getPublisherById(a.publisherId);
              return (
                <tr key={a.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-foreground">
                    {campaign ? (
                      <Link href={`/campaigns/${campaign.id}`} className="hover:text-brand">
                        {campaign.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-3 text-muted">
                    {publisher ? (
                      <Link href={`/publishers/${publisher.id}`} className="hover:text-brand">
                        {publisher.companyName}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="max-w-xs truncate px-6 py-3 text-muted">{a.message ?? "—"}</td>
                  <td className="px-6 py-3 text-muted">{a.createdAt}</td>
                  <td className="px-6 py-3">
                    <Badge status={a.status} />
                  </td>
                  <td className="px-6 py-3">
                    {a.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setStatus(a.id, "approved")}
                          className="rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-teal-100"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(a.id, "rejected")}
                          className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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
