"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Gift } from "lucide-react";
import PrivateOfferRow from "@/components/PrivateOfferRow";
import CreatedBanner from "@/components/ui/CreatedBanner";
import { getPrivateOffersByAdvertiser, getPublisherById } from "@/lib/mock-data";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

export default function AdvertiserOffersPage() {
  const advertiser = useCurrentAdvertiser();
  const offers = getPrivateOffersByAdvertiser(advertiser.id);

  return (
    <div className="container-page py-14">
      <Suspense fallback={null}>
        <CreatedBanner message="Private offer sent to the publisher." />
      </Suspense>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-brand">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Private offers sent</h1>
            <p className="text-sm text-muted">{advertiser.companyName}</p>
          </div>
        </div>
        <Link
          href="/advertiser/offers/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Offer
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {offers.map((o) => {
          const publisher = getPublisherById(o.publisherId);
          return (
            <PrivateOfferRow key={o.id} offer={o} counterpartyName={publisher?.companyName ?? "Publisher"} />
          );
        })}
      </div>

      {offers.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          You haven&apos;t sent any private offers yet.
        </div>
      )}
    </div>
  );
}
