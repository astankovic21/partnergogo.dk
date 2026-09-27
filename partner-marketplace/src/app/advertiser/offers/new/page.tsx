"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { publishers, getCampaignsByAdvertiser } from "@/lib/mock-data";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

export default function NewPrivateOfferPage() {
  const router = useRouter();
  const advertiser = useCurrentAdvertiser();
  const campaigns = getCampaignsByAdvertiser(advertiser.id);
  const [publisherId, setPublisherId] = useState(publishers[0]?.id ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/advertiser/offers?created=1");
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg">
        <h1 className="text-2xl font-bold text-foreground">Send a private offer</h1>
        <p className="mt-2 text-muted">
          Extend an above-standard rate directly to one publisher, outside the public campaign terms.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-xl border border-border bg-card p-6">
          <div>
            <label htmlFor="publisher" className="text-sm font-medium text-foreground">
              Publisher
            </label>
            <select
              id="publisher"
              value={publisherId}
              onChange={(e) => setPublisherId(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {publishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName}
                </option>
              ))}
            </select>
          </div>

          {campaigns.length > 0 && (
            <div>
              <label htmlFor="campaign" className="text-sm font-medium text-foreground">
                Related campaign (optional)
              </label>
              <select
                id="campaign"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">General / not tied to a campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="privateCpa" className="text-sm font-medium text-foreground">
              Private CPA / commission
            </label>
            <input
              id="privateCpa"
              required
              placeholder="e.g. 12% or 500 DKK"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <div>
            <label htmlFor="requirement" className="text-sm font-medium text-foreground">
              Requirement (optional)
            </label>
            <textarea
              id="requirement"
              rows={2}
              placeholder="e.g. Minimum 200 conversions per month"
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
            Send private offer
          </button>
        </form>
      </div>
    </div>
  );
}
