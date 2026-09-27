import type { Metadata } from "next";
import Link from "next/link";
import { Signal, MapPin, Mail } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { trafficListings, getPublisherById } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Available traffic — open publisher listings",
  description:
    "Publishers with distribution ready to sell: browse available traffic by GEO, vertical and channel, and send an offer.",
};

export default function TrafficListingsPage() {
  const open = trafficListings.filter((t) => t.status !== "closed");

  return (
    <div className="container-page py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-accent">
          <Signal className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Available traffic</h1>
          <p className="text-sm text-muted">
            Publishers with inventory ready for new advertiser partnerships.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {open.map((t) => {
          const publisher = getPublisherById(t.publisherId);
          return (
            <div key={t.id} className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {publisher?.companyName ?? "Publisher"}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5" />
                    {t.country}
                  </p>
                </div>
                <Badge status={t.status} />
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
                {t.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand">
                  {t.vertical}
                </span>
                <span className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                  {t.channel}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                <div>
                  <p className="text-xs text-muted">Monthly traffic</p>
                  <p className="font-semibold text-foreground">{t.monthlyTraffic.toLocaleString()}</p>
                </div>
                {t.newsletterSubscribers && (
                  <div className="flex items-center gap-1 text-muted">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="text-xs">{t.newsletterSubscribers.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {t.lookingForDealModels.map((m) => (
                  <span key={m} className="rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-accent">
                    {m}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/traffic/${t.id}`}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                >
                  View
                </Link>
                <Link
                  href={`/traffic/${t.id}#offer`}
                  className="flex-1 rounded-lg bg-brand px-3 py-2 text-center text-xs font-semibold text-brand-foreground transition-colors hover:bg-indigo-700"
                >
                  Send Offer
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
