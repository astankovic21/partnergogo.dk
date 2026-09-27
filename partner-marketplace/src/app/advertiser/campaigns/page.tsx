"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Megaphone } from "lucide-react";
import CampaignCard from "@/components/CampaignCard";
import CreatedBanner from "@/components/ui/CreatedBanner";
import { getCampaignsByAdvertiser } from "@/lib/mock-data";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

export default function AdvertiserCampaignsPage() {
  const advertiser = useCurrentAdvertiser();
  const campaigns = getCampaignsByAdvertiser(advertiser.id);

  return (
    <div className="container-page py-14">
      <Suspense fallback={null}>
        <CreatedBanner message="Campaign created! It's now live in the marketplace." />
      </Suspense>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-brand">
            <Megaphone className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your campaigns</h1>
            <p className="text-sm text-muted">{advertiser.companyName}</p>
          </div>
        </div>
        <Link
          href="/advertiser/campaigns/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            showStatus
            footer={
              <Link
                href={`/campaigns/${c.id}`}
                className="block w-full rounded-lg border border-border px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
              >
                View details
              </Link>
            }
          />
        ))}
      </div>

      {campaigns.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          You haven&apos;t created any campaigns yet.
        </div>
      )}
    </div>
  );
}
