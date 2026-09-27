"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Signal } from "lucide-react";
import Badge from "@/components/ui/Badge";
import CreatedBanner from "@/components/ui/CreatedBanner";
import { trafficListings, getTrafficOffersByListing } from "@/lib/mock-data";
import { useCurrentPublisher } from "@/context/demo-user-context";

export default function PublisherTrafficPage() {
  const publisher = useCurrentPublisher();
  const listings = trafficListings.filter((t) => t.publisherId === publisher.id);

  return (
    <div className="container-page py-14">
      <Suspense fallback={null}>
        <CreatedBanner message="Traffic listed! Advertisers can now send you offers." />
      </Suspense>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-accent">
            <Signal className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your traffic listings</h1>
            <p className="text-sm text-muted">{publisher.companyName}</p>
          </div>
        </div>
        <Link
          href="/publisher/traffic/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          List Traffic
        </Link>
      </div>

      <div className="mt-8 space-y-6">
        {listings.map((t) => {
          const offers = getTrafficOffersByListing(t.id);
          return (
            <div key={t.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {t.country} &middot; {t.vertical}
                    </h3>
                    <Badge status={t.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {t.channel} &middot; {t.monthlyTraffic.toLocaleString()} monthly traffic
                  </p>
                </div>
                <Link href={`/traffic/${t.id}`} className="text-xs font-semibold text-brand hover:underline">
                  View public page
                </Link>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Offers received ({offers.length})
                </p>
                {offers.length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No offers yet.</p>
                ) : (
                  <div className="mt-2 space-y-2">
                    {offers.map((o) => (
                      <div
                        key={o.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                      >
                        <span className="font-medium text-foreground">{o.proposedTerms}</span>
                        <span className="text-xs text-muted line-clamp-1">{o.message}</span>
                        <Badge status={o.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {listings.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          You haven&apos;t listed any traffic yet.
        </div>
      )}
    </div>
  );
}
