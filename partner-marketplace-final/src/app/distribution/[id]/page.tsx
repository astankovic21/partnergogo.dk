import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, Wallet, Users, Radio } from "lucide-react";
import Badge from "@/components/ui/Badge";
import ProposalForm from "@/components/ProposalForm";
import {
  getDistributionRequestById,
  getProposalsByRequest,
  getPublisherById,
  distributionRequests,
} from "@/lib/mock-data";

export function generateStaticParams() {
  return distributionRequests.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const request = getDistributionRequestById(id);
  if (!request) return { title: "Opportunity not found" };
  return {
    title: `${request.brand} is looking for publishers in ${request.market}`,
    description: `${request.brand}: ${request.vertical} distribution opportunity in ${request.market}. Budget ${request.budget.toLocaleString()} DKK, ${request.dealModel}. Submit a proposal.`,
  };
}

export default async function DistributionRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = getDistributionRequestById(id);
  if (!request) notFound();
  const proposals = getProposalsByRequest(request.id);

  return (
    <div className="container-page py-14">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-8 shadow-sm sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">{request.brand}</h1>
            <Badge status={request.status} />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4" />
            {request.market}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-brand">
              {request.vertical}
            </span>
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-accent">
              {request.dealModel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm">
          <Wallet className="h-4 w-4 text-muted" />
          <span className="font-semibold text-foreground">{request.budget.toLocaleString()} DKK</span>
          <span className="text-muted">budget</span>
        </div>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Opportunity</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{request.description}</p>
            <div className="mt-4 flex items-start gap-1.5 text-sm text-muted">
              <Users className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                <span className="font-medium text-foreground">Target customers: </span>
                {request.targetCustomers}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-xs font-medium text-muted">Preferred channels</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {request.preferredChannels.map((c) => (
                  <span key={c} className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div id="proposal" className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Submit a proposal</h2>
            <div className="mt-4">
              <ProposalForm />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
            <Radio className="h-3.5 w-3.5" />
            Proposals so far ({proposals.length})
          </h2>
          <div className="mt-4 space-y-3">
            {proposals.length === 0 && <p className="text-sm text-muted">No proposals yet.</p>}
            {proposals.map((p) => {
              const publisher = getPublisherById(p.publisherId);
              return (
                <div key={p.id} className="rounded-lg border border-border p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {publisher?.companyName ?? "Unknown publisher"}
                    </span>
                    <Badge status={p.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {p.expectedVolume.toLocaleString()} / mo &middot; {p.requestedCpa}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
