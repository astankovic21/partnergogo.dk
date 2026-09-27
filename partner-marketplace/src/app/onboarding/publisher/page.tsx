"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { VERTICALS, TRAFFIC_SOURCES, COMMISSION_MODELS } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import BackendNotice from "@/components/ui/BackendNotice";

// Real profile creation: inserts a row into `publisher_profiles`, owned by
// the signed-in user (RLS requires user_id = auth.uid()). Requires having
// just signed up/in via Supabase Auth — if there's no session, this sends
// the user to /login instead of silently failing.

function toNumber(value: FormDataEntryValue | null): number {
  if (!value) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function toOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (!value || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export default function PublisherOnboardingPage() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const primaryGeos = String(formData.get("primaryGeos") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const trafficSources = formData.getAll("trafficSources").map(String);
    const categories = formData.getAll("categories").map(String);
    const preferredDealModels = formData.getAll("preferredDealModels").map(String);

    const { error: insertError } = await supabase.from("publisher_profiles").insert({
      user_id: user.id,
      company_name: String(formData.get("companyName") ?? ""),
      website: String(formData.get("website") ?? ""),
      country: String(formData.get("country") ?? ""),
      primary_geos: primaryGeos,
      categories,
      traffic_sources: trafficSources,
      monthly_traffic: toNumber(formData.get("monthlyTraffic")),
      newsletter_subscribers: toOptionalNumber(formData.get("newsletterSubscribers")),
      instagram_followers: toOptionalNumber(formData.get("instagramFollowers")),
      tiktok_followers: toOptionalNumber(formData.get("tiktokFollowers")),
      youtube_subscribers: toOptionalNumber(formData.get("youtubeSubscribers")),
      app_users: toOptionalNumber(formData.get("appUsers")),
      preferred_deal_models: preferredDealModels,
      description: String(formData.get("description") ?? ""),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/publisher/campaigns/live");
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Set up your publisher profile</h1>
        <p className="mt-2 text-muted">
          Tell advertisers about your audience so we can match you with relevant campaigns.
        </p>

        {!supabase && (
          <div className="mt-6">
            <BackendNotice />
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Company
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Company name" id="companyName" placeholder="NordicDeals" required />
              <Field label="Website" id="website" placeholder="https://yoursite.com" required />
              <Field label="Country" id="country" placeholder="Denmark" required />
              <Field label="Primary geos" id="primaryGeos" placeholder="Denmark, Sweden, Norway" />
            </div>
            <div className="mt-4">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="What is your site/audience about?"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Audience & traffic
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Monthly traffic" id="monthlyTraffic" type="number" placeholder="150000" />
              <Field label="Newsletter subscribers" id="newsletterSubscribers" type="number" placeholder="20000" />
              <Field label="Instagram followers" id="instagramFollowers" type="number" placeholder="10000" />
              <Field label="TikTok followers" id="tiktokFollowers" type="number" placeholder="0" />
              <Field label="YouTube subscribers" id="youtubeSubscribers" type="number" placeholder="0" />
              <Field label="App users" id="appUsers" type="number" placeholder="0" />
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Traffic sources</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {TRAFFIC_SOURCES.map((source) => (
                  <label
                    key={source}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-brand"
                  >
                    <input type="checkbox" name="trafficSources" value={source} className="accent-indigo-600" />
                    {source}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-foreground">Categories / verticals</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {VERTICALS.map((vertical) => (
                  <label
                    key={vertical}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-brand"
                  >
                    <input type="checkbox" name="categories" value={vertical} className="accent-indigo-600" />
                    {vertical}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Preferred deal models
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {COMMISSION_MODELS.map((model) => (
                <label
                  key={model}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:border-brand"
                >
                  <input type="checkbox" name="preferredDealModels" value={model} className="accent-indigo-600" />
                  {model}
                </label>
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={!supabase || loading}
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating profile…" : "Create publisher profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
