import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Mail, Signal } from "lucide-react";
import Badge from "@/components/ui/Badge";
import SendTrafficOfferForm from "@/components/SendTrafficOfferForm";
import {
  getTrafficListingById,
  getTrafficOffersByListing,
  getPublisherById,
  trafficListings,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return trafficListings.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = getTrafficListingById(id);
  if (!listing) return { title: "Traffic listing not found" };
  const publisher = getPublisherById(listing.publisherId);
  return {
    title: `${publisher?.companyName ?? "Publisher"}: ${listing.monthlyTraffic.toLocaleString()} monthly traffic in ${listing.country}`,
    description: `${listing.vertical} traffic via ${listing.channel} in ${listing.country}, looking for ${listing.lookingForDealModels.join(", ")} deals. Send an offer.`,
  };
}

export default async function TrafficListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = getTrafficListingById(id);
  if (!listing) notFound();
  const publisher = getPublisherById(listing.publisherId);
  const offers = getTrafficOffersByListing(listing.id);

  return (
    <div className="container-page py-14">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">
              {publisher?.companyName ?? "Publisher"}
            </h1>
            <Badge status={listing.status} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {listing.country}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand">
              {listing.vertical}
            </span>
            <span className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
              {listing.channel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm">
          <Signal className="h-4 w-4 text-muted" />
          <span className="font-semibold text-foreground">{listing.monthlyTraffic.toLocaleString()}</span>
          <span className="text-muted">monthly traffic</span>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">About this traffic</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{listing.description}</p>
            {listing.newsletterSubscribers && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                <Mail className="h-4 w-4" />
                {listing.newsletterSubscribers.toLocaleString()} newsletter subscribers
              </p>
            )}
            <div className="mt-4">
              <p className="text-xs font-medium text-muted">Looking for deal models</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.lookingForDealModels.map((m) => (
                  <span key={m} className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-accent">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div id="offer" className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Send an offer</h2>
            <div className="mt-4">
              <SendTrafficOfferForm />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Offers received ({offers.length})
          </h2>
          <div className="mt-4 space-y-3">
            {offers.length === 0 && <p className="text-sm text-muted">No offers yet.</p>}
            {offers.map((o) => (
              <div key={o.id} className="rounded-lg border border-border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{o.proposedTerms}</span>
                  <Badge status={o.status} />
                </div>
                <p className="mt-1 text-xs text-muted line-clamp-2">{o.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
