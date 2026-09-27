"use client";

import { useRouter } from "next/navigation";
import { Field, TextAreaField, SelectField, CheckboxGroupField } from "@/components/ui/Field";
import { VERTICALS, TRAFFIC_SOURCES, COMMISSION_MODELS } from "@/types";
import { useCurrentAdvertiser } from "@/context/demo-user-context";

export default function NewDistributionRequestPage() {
  const router = useRouter();
  const advertiser = useCurrentAdvertiser();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/advertiser/distribution?created=1");
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Post a distribution request</h1>
        <p className="mt-2 text-muted">
          Let publishers know you&apos;re looking for reach in a new market.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Opportunity</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Brand" id="brand" defaultValue={advertiser.companyName} required />
              <Field label="Target market" id="market" placeholder="Norway" required />
              <SelectField label="Vertical" id="vertical" options={[...VERTICALS]} defaultValue={advertiser.industry} />
              <SelectField label="Deal model" id="dealModel" options={[...COMMISSION_MODELS]} />
              <Field label="Budget (DKK)" id="budget" type="number" placeholder="180000" required />
            </div>
            <div className="mt-4">
              <Field
                label="Target customers"
                id="targetCustomers"
                placeholder="e.g. Adults 25-45 looking to consolidate debt"
                required
              />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="Description"
                id="description"
                placeholder="What are you trying to achieve, and what kind of publisher fits?"
                required
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <CheckboxGroupField label="Preferred channels" name="preferredChannels" options={[...TRAFFIC_SOURCES]} />
          </section>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-indigo-700"
          >
            Post distribution request
          </button>
        </form>
      </div>
    </div>
  );
}
