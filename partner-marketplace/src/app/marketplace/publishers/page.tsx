"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import PublisherCard from "@/components/PublisherCard";
import InviteToCampaignModal from "@/components/InviteToCampaignModal";
import { FilterSelect } from "@/components/ui/Field";
import { publishers, getCampaignsByAdvertiser } from "@/lib/mock-data";
import { useCurrentAdvertiser } from "@/context/demo-user-context";
import { VERTICALS, TRAFFIC_SOURCES, COMMISSION_MODELS } from "@/types";

const ANY = "Any";
const TRAFFIC_BANDS = [ANY, "Under 100k", "100k – 300k", "300k – 600k", "600k+"];

function matchesTrafficBand(traffic: number, band: string): boolean {
  if (band === ANY) return true;
  if (band === "Under 100k") return traffic < 100_000;
  if (band === "100k – 300k") return traffic >= 100_000 && traffic < 300_000;
  if (band === "300k – 600k") return traffic >= 300_000 && traffic < 600_000;
  return traffic >= 600_000;
}

export default function PublisherMarketplacePage() {
  const advertiser = useCurrentAdvertiser();
  const advertiserCampaigns = useMemo(() => getCampaignsByAdvertiser(advertiser.id), [advertiser.id]);

  const countries = useMemo(
    () => [ANY, ...Array.from(new Set(publishers.map((p) => p.country))).sort()],
    []
  );

  const [country, setCountry] = useState(ANY);
  const [vertical, setVertical] = useState(ANY);
  const [trafficSource, setTrafficSource] = useState(ANY);
  const [dealModel, setDealModel] = useState(ANY);
  const [trafficBand, setTrafficBand] = useState(ANY);
  const [inviteTarget, setInviteTarget] = useState<string | null>(null);

  const filtered = publishers.filter((p) => {
    if (!p.approved) return false;
    if (country !== ANY && p.country !== country && !p.primaryGeos.includes(country)) return false;
    if (vertical !== ANY && !p.categories.includes(vertical as (typeof VERTICALS)[number])) return false;
    if (
      trafficSource !== ANY &&
      !p.trafficSources.includes(trafficSource as (typeof TRAFFIC_SOURCES)[number])
    )
      return false;
    if (
      dealModel !== ANY &&
      !p.preferredDealModels.includes(dealModel as (typeof COMMISSION_MODELS)[number])
    )
      return false;
    if (!matchesTrafficBand(p.monthlyTraffic, trafficBand)) return false;
    return true;
  });

  const invitePublisher = publishers.find((p) => p.id === inviteTarget) ?? null;

  return (
    <div className="container-page py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-accent">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Publisher marketplace</h1>
          <p className="text-sm text-muted">
            Browse approved publishers and invite the best fits to your campaigns.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-5">
        <FilterSelect label="Country / GEO" value={country} onChange={setCountry} options={countries} />
        <FilterSelect label="Vertical" value={vertical} onChange={setVertical} options={[ANY, ...VERTICALS]} />
        <FilterSelect
          label="Traffic source"
          value={trafficSource}
          onChange={setTrafficSource}
          options={[ANY, ...TRAFFIC_SOURCES]}
        />
        <FilterSelect
          label="Deal model"
          value={dealModel}
          onChange={setDealModel}
          options={[ANY, ...COMMISSION_MODELS]}
        />
        <FilterSelect
          label="Monthly traffic"
          value={trafficBand}
          onChange={setTrafficBand}
          options={TRAFFIC_BANDS}
        />
      </div>

      <p className="mt-5 text-sm text-muted">
        {filtered.length} publisher{filtered.length === 1 ? "" : "s"} match your filters
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PublisherCard
            key={p.id}
            publisher={p}
            footer={
              <div className="flex items-center gap-2">
                <Link
                  href={`/publishers/${p.id}`}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                >
                  View Publisher
                </Link>
                <button
                  type="button"
                  onClick={() => setInviteTarget(p.id)}
                  className="flex-1 rounded-lg bg-brand px-3 py-2 text-center text-xs font-semibold text-brand-foreground transition-colors hover:bg-indigo-700"
                >
                  Invite to Campaign
                </button>
              </div>
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No publishers match those filters. Try widening your search.
        </div>
      )}

      {invitePublisher && (
        <InviteToCampaignModal
          open={!!invitePublisher}
          onClose={() => setInviteTarget(null)}
          publisher={invitePublisher}
          campaigns={advertiserCampaigns}
        />
      )}
    </div>
  );
}
