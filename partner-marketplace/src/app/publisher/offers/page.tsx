"use client";

import { Gift } from "lucide-react";
import PrivateOfferRow from "@/components/PrivateOfferRow";
import { getPrivateOffersByPublisher, getAdvertiserById } from "@/lib/mock-data";
import { useCurrentPublisher } from "@/context/demo-user-context";

export default function PublisherOffersPage() {
  const publisher = useCurrentPublisher();
  const offers = getPrivateOffersByPublisher(publisher.id);

  return (
    <div className="container-page py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-accent">
          <Gift className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Private offers</h1>
          <p className="text-sm text-muted">Above-standard offers sent directly to {publisher.companyName}.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {offers.map((o) => {
          const advertiser = getAdvertiserById(o.advertiserId);
          return (
            <PrivateOfferRow key={o.id} offer={o} counterpartyName={advertiser?.companyName ?? "Advertiser"} />
          );
        })}
      </div>

      {offers.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No private offers yet.
        </div>
      )}
    </div>
  );
}
