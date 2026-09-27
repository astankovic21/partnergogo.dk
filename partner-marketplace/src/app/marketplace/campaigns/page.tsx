"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Megaphone } from "lucide-react";
import CampaignCard from "@/components/CampaignCard";
import { FilterSelect } from "@/components/ui/Field";
import { campaigns } from "@/lib/mock-data";
import { VERTICALS, COMMISSION_MODELS } from "@/types";
import { PAYOUT_BANDS, matchesPayoutBand } from "@/lib/payout";

const ANY = "Any";

export default function CampaignMarketplacePage() {
  const countries = useMemo(
    () => [ANY, ...Array.from(new Set(campaigns.flatMap((c) => c.countries))).sort()],
    []
  );

  const [country, setCountry] = useState(ANY);
  const [vertical, setVertical] = useState(ANY);
  const [commissionModel, setCommissionModel] = useState(ANY);
  const [payoutBand, setPayoutBand] = useState<string>(PAYOUT_BANDS[0]);

  const filtered = campaigns.filter((c) => {
    if (c.status !== "active") return false;
    if (country !== ANY && !c.countries.includes(country)) return false;
    if (vertical !== ANY && c.vertical !== vertical) return false;
    if (commissionModel !== ANY && c.commissionModel !== commissionModel) return false;
    if (!matchesPayoutBand(c.commissionAmount, payoutBand)) return false;
    return true;
  });

  return (
    <div className="container-page py-14">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-brand">
          <Megaphone className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Campaign marketplace</h1>
          <p className="text-sm text-muted">
            Browse live campaigns and apply with the audience that fits best.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-4">
        <FilterSelect label="Country / GEO" value={country} onChange={setCountry} options={countries} />
        <FilterSelect label="Vertical" value={vertical} onChange={setVertical} options={[ANY, ...VERTICALS]} />
        <FilterSelect
          label="Commission model"
          value={commissionModel}
          onChange={setCommissionModel}
          options={[ANY, ...COMMISSION_MODELS]}
        />
        <FilterSelect
          label="Payout range"
          value={payoutBand}
          onChange={setPayoutBand}
          options={[...PAYOUT_BANDS]}
        />
      </div>

      <p className="mt-5 text-sm text-muted">
        {filtered.length} campaign{filtered.length === 1 ? "" : "s"} match your filters
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CampaignCard
            key={c.id}
            campaign={c}
            footer={
              <div className="flex items-center gap-2">
                <Link
                  href={`/campaigns/${c.id}`}
                  className="flex-1 rounded-lg border border-border px-3 py-2 text-center text-xs font-semibold text-foreground transition-colors hover:bg-slate-50"
                >
                  View Campaign
                </Link>
                <Link
                  href={`/campaigns/${c.id}`}
                  className="flex-1 rounded-lg bg-brand px-3 py-2 text-center text-xs font-semibold text-brand-foreground transition-colors hover:bg-indigo-700"
                >
                  Apply
                </Link>
              </div>
            }
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted">
          No campaigns match those filters. Try widening your search.
        </div>
      )}
    </div>
  );
}
