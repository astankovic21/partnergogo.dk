import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaignById, campaigns } from "@/lib/mock-data";
import CampaignDetailView from "@/components/CampaignDetailView";

export function generateStaticParams() {
  return campaigns.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) return { title: "Campaign not found" };
  return {
    title: campaign.name,
    description: `${campaign.brand}: ${campaign.commissionModel} campaign in ${campaign.vertical}, ${campaign.countries.join(", ")}. ${campaign.commissionAmount} · ${campaign.cookieDurationDays}-day cookie.`,
  };
}

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) notFound();

  return <CampaignDetailView campaign={campaign} />;
}
