import { notFound } from "next/navigation";
import { deals, getNegotiationByDeal } from "@/lib/mock-data";
import NegotiationThread from "@/components/NegotiationThread";

export function generateStaticParams() {
  return deals.map((d) => ({ id: d.id }));
}

export default async function DealNegotiationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = deals.find((d) => d.id === id);
  if (!deal) notFound();
  const negotiation = getNegotiationByDeal(deal.id);

  return (
    <div className="container-page py-14">
      <h1 className="mb-2 text-center text-2xl font-bold text-foreground">Negotiation</h1>
      <p className="mb-8 text-center text-sm text-muted">
        Deal #{deal.id.replace("deal_", "")} &middot; started {deal.createdAt}
      </p>
      <NegotiationThread deal={deal} initialMessages={negotiation?.messages ?? []} />
    </div>
  );
}
