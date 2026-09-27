"use client";

import { useState } from "react";
import { Copy, Check, Image as ImageIcon } from "lucide-react";
import type { CampaignCreativeRow } from "@/lib/supabase/types";

// Grid of banners an advertiser made available for a campaign the publisher
// is approved on. Each one has a "Copy embed code" button that copies a
// ready-to-paste hyperlinked-image snippet — the standard affiliate-banner
// pattern — using the publisher's own tracking link as the href, so it just
// works once pasted into their site/CMS.
export default function BannerGrid({
  creatives,
  trackingUrl,
  brand,
}: {
  creatives: CampaignCreativeRow[];
  trackingUrl: string;
  brand: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(creative: CampaignCreativeRow) {
    const snippet = `<a href="${trackingUrl}" target="_blank" rel="noopener sponsored">
  <img src="${creative.image_url}" width="${creative.width}" height="${creative.height}" alt="${brand}" />
</a>`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedId(creative.id);
      setTimeout(() => setCopiedId((id) => (id === creative.id ? null : id)), 2000);
    } catch {
      // Nothing destructive to do if the clipboard API is unavailable.
    }
  }

  if (creatives.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <ImageIcon className="h-3.5 w-3.5" />
        Banners
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {creatives.map((creative) => (
          <div key={creative.id} className="rounded-lg border border-border bg-background p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- advertiser-supplied external image URL, domain unknown at build time */}
            <img
              src={creative.image_url}
              alt={creative.name}
              className="h-16 w-full rounded-md border border-border object-contain"
            />
            <p className="mt-1.5 truncate text-[11px] text-muted">
              {creative.name} · {creative.width}×{creative.height}
            </p>
            <button
              type="button"
              onClick={() => handleCopy(creative)}
              className="mt-1.5 flex w-full items-center justify-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-slate-50"
            >
              {copiedId === creative.id ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
              {copiedId === creative.id ? "Copied!" : "Copy embed code"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
