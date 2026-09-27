"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, AlertCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Real "Apply" action — inserts a row into `campaign_applications` for the
// signed-in publisher. Disabled once already applied (the campaign_id +
// publisher_id pair is also unique-constrained in the schema, so a
// duplicate insert would fail anyway — this just avoids that round trip).
export default function ApplyButton({
  campaignId,
  publisherId,
  alreadyApplied,
}: {
  campaignId: string;
  publisherId: string;
  alreadyApplied: boolean;
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [applied, setApplied] = useState(alreadyApplied);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApply() {
    if (!supabase || applied) return;
    setLoading(true);
    setError(null);

    const { error: insertError } = await supabase.from("campaign_applications").insert({
      campaign_id: campaignId,
      publisher_id: publisherId,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setApplied(true);
    setLoading(false);
    router.refresh();
  }

  if (applied) {
    return (
      <span className="flex items-center justify-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold text-accent">
        <Check className="h-3.5 w-3.5" />
        Applied
      </span>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleApply}
        disabled={loading}
        className="w-full rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Applying…" : "Apply"}
      </button>
      {error && (
        <p className="mt-1.5 flex items-start gap-1 text-xs text-rose-600">
          <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
