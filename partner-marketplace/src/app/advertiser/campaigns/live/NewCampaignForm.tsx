"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Plus, X } from "lucide-react";
import { Field, TextAreaField, SelectField, CheckboxGroupField } from "@/components/ui/Field";
import { VERTICALS, TRAFFIC_SOURCES, COMMISSION_MODELS } from "@/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Real "new campaign" form — same fields as the mock
// /advertiser/campaigns/new form, but this one inserts an actual row into
// `campaigns` for the signed-in advertiser.
export default function NewCampaignForm({
  advertiserId,
  advertiserCompanyName,
  advertiserIndustry,
}: {
  advertiserId: string;
  advertiserCompanyName: string;
  advertiserIndustry: string;
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const countries = String(formData.get("countries") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const allowedTraffic = formData.getAll("allowedTraffic").map(String);
    const restrictedTraffic = formData.getAll("restrictedTraffic").map(String);
    const monthlyTargetRaw = String(formData.get("monthlyTarget") ?? "").trim();
    const budgetRaw = String(formData.get("budget") ?? "").trim();
    const endDateRaw = String(formData.get("endDate") ?? "").trim();

    const { error: insertError } = await supabase.from("campaigns").insert({
      advertiser_id: advertiserId,
      name: String(formData.get("name") ?? ""),
      brand: String(formData.get("brand") ?? ""),
      description: String(formData.get("description") ?? ""),
      landing_page_url: String(formData.get("landingPageUrl") ?? ""),
      countries,
      vertical: String(formData.get("vertical") ?? VERTICALS[0]),
      conversion_goal: String(formData.get("conversionGoal") ?? ""),
      commission_model: String(formData.get("commissionModel") ?? COMMISSION_MODELS[0]),
      commission_amount: String(formData.get("commissionAmount") ?? ""),
      cookie_duration_days: Number(formData.get("cookieDurationDays") ?? 30) || 30,
      allowed_traffic: allowedTraffic,
      restricted_traffic: restrictedTraffic,
      monthly_target: monthlyTargetRaw ? Number(monthlyTargetRaw) : null,
      budget: budgetRaw ? Number(budgetRaw) : null,
      start_date: String(formData.get("startDate") ?? new Date().toISOString().slice(0, 10)),
      end_date: endDateRaw || null,
      status: "draft",
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

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        New campaign
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">New campaign</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 text-sm text-muted">
        Launching as <span className="font-medium text-foreground">{advertiserCompanyName}</span>. This writes
        a real row to your Supabase project.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Campaign name" id="name" placeholder="Autumn Collection" required />
          <Field label="Brand" id="brand" defaultValue={advertiserCompanyName} required />
          <Field label="Landing page URL" id="landingPageUrl" placeholder="https://yourbrand.com/offer" required />
          <SelectField label="Vertical" id="vertical" options={[...VERTICALS]} defaultValue={advertiserIndustry} />
        </div>
        <TextAreaField
          label="Description"
          id="description"
          placeholder="What should publishers know about this campaign?"
          required
        />
        <Field label="Target countries" id="countries" placeholder="Denmark, Sweden, Norway" required />

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Commission model" id="commissionModel" options={[...COMMISSION_MODELS]} />
          <Field label="Commission amount" id="commissionAmount" placeholder="e.g. 8% or 150 DKK" required />
          <Field label="Cookie duration (days)" id="cookieDurationDays" type="number" defaultValue={30} required />
          <Field label="Conversion goal" id="conversionGoal" placeholder="Completed purchase" required />
          <Field label="Monthly target (optional)" id="monthlyTarget" type="number" placeholder="500" />
          <Field label="Budget in DKK (optional)" id="budget" type="number" placeholder="150000" />
        </div>

        <CheckboxGroupField label="Allowed traffic sources" name="allowedTraffic" options={[...TRAFFIC_SOURCES]} />
        <CheckboxGroupField label="Restricted traffic sources" name="restrictedTraffic" options={[...TRAFFIC_SOURCES]} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date" id="startDate" type="date" required />
          <Field label="End date (optional)" id="endDate" type="date" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating…" : "Create campaign"}
        </button>
      </form>
    </div>
  );
}
