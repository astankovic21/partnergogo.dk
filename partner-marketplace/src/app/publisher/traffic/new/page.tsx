"use client";

import { useRouter } from "next/navigation";
import { Field, TextAreaField, SelectField, CheckboxGroupField } from "@/components/ui/Field";
import { VERTICALS, TRAFFIC_SOURCES, COMMISSION_MODELS } from "@/types";
import { useCurrentPublisher } from "@/context/demo-user-context";

export default function NewTrafficListingPage() {
  const router = useRouter();
  const publisher = useCurrentPublisher();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/publisher/traffic?created=1");
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">List available traffic</h1>
        <p className="mt-2 text-muted">
          Post inventory from {publisher.companyName} for advertisers to bid on.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Traffic details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Country" id="country" defaultValue={publisher.country} required />
              <SelectField
                label="Vertical"
                id="vertical"
                options={[...VERTICALS]}
                defaultValue={publisher.categories[0]}
              />
              <Field label="Monthly traffic" id="monthlyTraffic" type="number" defaultValue={publisher.monthlyTraffic} required />
              <SelectField
                label="Channel"
                id="channel"
                options={[...TRAFFIC_SOURCES]}
                defaultValue={publisher.trafficSources[0]}
              />
              <Field
                label="Newsletter subscribers (optional)"
                id="newsletterSubscribers"
                type="number"
                defaultValue={publisher.newsletterSubscribers}
              />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="Description"
                id="description"
                placeholder="What kind of traffic is this and who's the audience?"
                required
              />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <CheckboxGroupField
              label="Looking for deal models"
              name="lookingForDealModels"
              options={[...COMMISSION_MODELS]}
              defaultChecked={publisher.preferredDealModels}
            />
          </section>

          <button
            type="submit"
            className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            List traffic
          </button>
        </form>
      </div>
    </div>
  );
}
