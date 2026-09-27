"use client";

import { useRouter } from "next/navigation";
import { Field, TextAreaField, SelectField, CheckboxGroupField } from "@/components/ui/Field";
import { VERTICALS, TRAFFIC_SOURCES, COMMISSION_MODELS } from "@/types";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

// Visual-only form matching the Campaign type. Submitting simulates
// creating a campaign and navigates to the advertiser's campaign list with
// a success banner — nothing is persisted (in-memory only, MVP demo).
export default function NewCampaignPage() {
  const router = useRouter();
  const advertiser = useCurrentAdvertiser();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/advertiser/campaigns?created=1");
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Create a new campaign</h1>
        <p className="mt-2 text-muted">
          Launching as <span className="font-medium text-foreground">{advertiser.companyName}</span>.
          Set the terms publishers will see in the marketplace.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Basics</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Campaign name" id="name" placeholder="Autumn Collection" required />
              <Field label="Brand" id="brand" defaultValue={advertiser.companyName} required />
              <Field
                label="Landing page URL"
                id="landingPageUrl"
                placeholder="https://yourbrand.com/offer"
                required
              />
              <SelectField label="Vertical" id="vertical" options={[...VERTICALS]} defaultValue={advertiser.industry} />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="Description"
                id="description"
                placeholder="What should publishers know about this campaign?"
                required
              />
            </div>
            <div className="mt-4">
              <Field
                label="Target countries"
                id="countries"
                placeholder="Denmark, Sweden, Norway"
                required
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Commission terms</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SelectField label="Commission model" id="commissionModel" options={[...COMMISSION_MODELS]} />
              <Field label="Commission amount" id="commissionAmount" placeholder="e.g. 8% or 150 DKK" required />
              <Field
                label="Cookie duration (days)"
                id="cookieDurationDays"
                type="number"
                defaultValue={30}
                required
              />
              <Field label="Conversion goal" id="conversionGoal" placeholder="Completed purchase" required />
              <Field label="Monthly target (optional)" id="monthlyTarget" type="number" placeholder="500" />
              <Field label="Budget in DKK (optional)" id="budget" type="number" placeholder="150000" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Traffic policy</h2>
            <div className="mt-4">
              <CheckboxGroupField label="Allowed traffic sources" name="allowedTraffic" options={[...TRAFFIC_SOURCES]} />
            </div>
            <div className="mt-4">
              <CheckboxGroupField label="Restricted traffic sources" name="restrictedTraffic" options={[...TRAFFIC_SOURCES]} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Schedule</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Start date" id="startDate" type="date" required />
              <Field label="End date (optional)" id="endDate" type="date" />
            </div>
          </section>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
          >
            Create campaign
          </button>
        </form>
      </div>
    </div>
  );
}
