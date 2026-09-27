"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Radio } from "lucide-react";
import Badge from "@/components/ui/Badge";
import CreatedBanner from "@/components/ui/CreatedBanner";
import { distributionRequests, getProposalsByRequest, getPublisherById } from "@/lib/mock-data";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

export default function AdvertiserDistributionPage() {
  const advertiser = useCurrentAdvertiser();
  const requests = distributionRequests.filter((r) => r.advertiserId === advertiser.id);

  return (
    <div className="container-page py-14">
      <Suspense fallback={null}>
        <CreatedBanner message="Distribution request posted! Publishers can now submit proposals." />
      </Suspense>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-brand">
            <Radio className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your distribution requests</h1>
            <p className="text-sm text-muted">{advertiser.companyName}</p>
          </div>
        </div>
        <Link
          href="/advertiser/distribution/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {requests.map((r) => {
          const proposals = getProposalsByRequest(r.id);
          return (
            <div key={r.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{r.brand}</h3>
                    <Badge status={r.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {r.market} &middot; {r.vertical} &middot; {r.dealModel} &middot; {r.budget.toLocaleString()} DKK
                  </p>
                </div>
                <Link href={`/distribution/${r.id}`} className="text-xs font-semibold text-brand hover:underline">
                  View public page
                </Link>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Proposals received ({proposals.length})
                </p>
                {proposals.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No proposals yet.</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {proposals.map((p) => {
                      const publisher = getPublisherById(p.publisherId);
                      return (
                        <div
                          key={p.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-foreground">
                            {publisher?.companyName ?? "Unknown publisher"}
                          </span>
                          <span className="text-xs text-muted">
                            {p.expectedVolume.toLocaleString()}/mo &middot; {p.requestedCpa} &middot; {p.trafficSource}
                          </span>
                          <Badge status={p.status} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {requests.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          You haven&apos;t posted any distribution requests yet.
        </div>
      )}
    </div>
  );
}
