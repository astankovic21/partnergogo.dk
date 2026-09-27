"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Image as ImageIcon, UploadCloud } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CampaignCreativeRow } from "@/lib/supabase/types";

const MAX_FILE_BYTES = 2 * 1024 * 1024; // ~2MB, MVP limit — no image processing/resizing.

// Advertiser-side banner manager for one campaign: lists existing creatives
// and uploads new ones (file → Supabase Storage bucket "creatives", then a
// campaign_creatives row pointing at the resulting public URL).
export default function CreativeManager({
  campaignId,
  creatives,
}: {
  campaignId: string;
  creatives: CampaignCreativeRow[];
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);

    const formData = new FormData(e.currentTarget);
    const file = fileInputRef.current?.files?.[0];
    const name = String(formData.get("name") ?? "").trim();
    const width = Number(formData.get("width"));
    const height = Number(formData.get("height"));

    if (!file) {
      setError("Choose an image file to upload.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError("File is too large — please keep banners under 2MB.");
      return;
    }
    if (!name || !width || !height) {
      setError("Name, width and height are all required.");
      return;
    }

    setLoading(true);

    const extension = file.name.includes(".") ? file.name.split(".").pop() : "png";
    const path = `${campaignId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("creatives").upload(path, file, {
      contentType: file.type || "image/png",
      upsert: false,
    });

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("creatives").getPublicUrl(path);

    const { error: insertError } = await supabase.from("campaign_creatives").insert({
      campaign_id: campaignId,
      name,
      image_url: publicUrl,
      width,
      height,
      format: file.type || "image/png",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="mt-4 border-t border-border pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <ImageIcon className="h-3.5 w-3.5" />
          Banners
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          {open ? "Cancel" : "Upload banner"}
        </button>
      </div>

      {creatives.length > 0 ? (
        <div className="mt-2 grid grid-cols-3 gap-2">
          {creatives.map((creative) => (
            <div key={creative.id} className="rounded-lg border border-border bg-background p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element -- advertiser-supplied external image URL, domain unknown at build time */}
              <img
                src={creative.image_url}
                alt={creative.name}
                className="h-12 w-full rounded-md object-contain"
              />
              <p className="mt-1 truncate text-[10px] text-muted">
                {creative.width}×{creative.height}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted">No banners uploaded yet.</p>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2.5 rounded-lg border border-border bg-background p-3">
          {error && (
            <div className="flex items-start gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label htmlFor={`creative-file-${campaignId}`} className="text-xs font-medium text-foreground">
              Image (max 2MB)
            </label>
            <input
              ref={fileInputRef}
              id={`creative-file-${campaignId}`}
              name="file"
              type="file"
              accept="image/*"
              required
              className="mt-1 w-full text-xs text-muted"
            />
          </div>
          <div>
            <label htmlFor={`creative-name-${campaignId}`} className="text-xs font-medium text-foreground">
              Name
            </label>
            <input
              id={`creative-name-${campaignId}`}
              name="name"
              type="text"
              placeholder="Leaderboard 728x90"
              required
              className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`creative-width-${campaignId}`} className="text-xs font-medium text-foreground">
                Width (px)
              </label>
              <input
                id={`creative-width-${campaignId}`}
                name="width"
                type="number"
                min={1}
                placeholder="728"
                required
                className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor={`creative-height-${campaignId}`} className="text-xs font-medium text-foreground">
                Height (px)
              </label>
              <input
                id={`creative-height-${campaignId}`}
                name="height"
                type="number"
                min={1}
                placeholder="90"
                required
                className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-brand px-3 py-2 text-xs font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Uploading…" : "Upload banner"}
          </button>
        </form>
      )}
    </div>
  );
}
