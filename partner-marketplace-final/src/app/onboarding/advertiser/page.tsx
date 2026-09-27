"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { VERTICALS } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import BackendNotice from "@/components/ui/BackendNotice";

// Real profile creation: inserts a row into `advertiser_profiles`, owned by
// the signed-in user (RLS requires user_id = auth.uid()).

export default function AdvertiserOnboardingPage() {
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

    const { error: insertError } = await supabase.from("advertiser_profiles").insert({
      user_id: user.id,
      company_name: String(formData.get("companyName") ?? ""),
      website: String(formData.get("website") ?? ""),
      industry: String(formData.get("industry") ?? VERTICALS[0]),
      description: String(formData.get("description") ?? ""),
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/advertiser/campaigns/live");
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Set up your advertiser profile</h1>
        <p className="mt-2 text-muted">
          Tell publishers about your brand so we can match you with relevant partners.
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
              <Field label="Company name" id="companyName" placeholder="Lumora Home" required />
              <Field label="Website" id="website" placeholder="https://yourcompany.com" required />
            </div>

            <div className="mt-4">
              <label htmlFor="industry" className="text-sm font-medium text-foreground">
                Industry / vertical
              </label>
              <select
                id="industry"
                name="industry"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                {VERTICALS.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                placeholder="What does your company sell, and to whom?"
                className="mt-1.5 w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </section>

          <button
            type="submit"
            disabled={!supabase || loading}
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating profile…" : "Create advertiser profile"}
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
