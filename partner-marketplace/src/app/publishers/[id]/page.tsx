import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublisherById, publishers } from "@/lib/mock-data";
import PublisherProfileView from "@/components/PublisherProfileView";

export function generateStaticParams() {
  return publishers.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const publisher = getPublisherById(id);
  if (!publisher) return { title: "Publisher not found" };
  return {
    title: publisher.companyName,
    description: `${publisher.companyName} — ${publisher.country} publisher with ${publisher.monthlyTraffic.toLocaleString()} monthly visitors across ${publisher.categories.join(", ")}. View traffic, channels and performance stats.`,
  };
}

export default async function PublisherProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const publisher = getPublisherById(id);
  if (!publisher) notFound();

  return <PublisherProfileView publisher={publisher} />;
}
