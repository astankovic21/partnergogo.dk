"use client";

import { useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";

// Shows a publisher's unique tracking link for a campaign they're approved
// on, with a one-click copy button. The link itself (/go/<campaignId>/
// <publisherId>) is generated automatically — publishers never build it by
// hand.
export default function TrackingLinkBox({ trackingUrl }: { trackingUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (permissions, insecure context) — nothing
      // destructive to do, the URL is still selectable/visible as text.
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand">
        <Link2 className="h-3.5 w-3.5" />
        Your tracking link
      </div>
      <p className="mt-1 text-xs text-muted">
        Share this link wherever you promote this campaign — clicks and conversions are tracked
        automatically.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground">
          {trackingUrl}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand px-2.5 py-1.5 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
