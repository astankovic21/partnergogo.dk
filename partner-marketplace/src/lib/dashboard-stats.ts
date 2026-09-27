import {
  getCampaignsByAdvertiser,
  getDealsByAdvertiser,
  getDealsByPublisher,
  clicks,
  conversions,
} from "@/lib/mock-data";
import type { Campaign, PublisherProfile } from "@/types";

// ---------------------------------------------------------------------------
// Lightweight, deterministic "aggregate stats" for the dashboards.
//
// The mock tracking data (src/lib/mock/tracking.ts) only has a handful of
// sample clicks/conversions, so dashboards derive realistic-looking
// aggregates from each advertiser's/publisher's campaigns and deals
// instead. Numbers are deterministic (seeded from the entity id) so they
// stay stable across renders and differ sensibly between demo companies,
// without needing a real backend.
// ---------------------------------------------------------------------------

function seedFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  }
  return hash;
}

function parseAmount(commissionAmount: string): number {
  const match = commissionAmount.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export interface AdvertiserStats {
  spend: number;
  revenue: number;
  conversions: number;
  activePublishers: number;
  activeCampaigns: number;
  avgCpa: number;
  roas: number;
}

export function computeAdvertiserStats(advertiserId: string): AdvertiserStats {
  const campaigns = getCampaignsByAdvertiser(advertiserId);
  const deals = getDealsByAdvertiser(advertiserId);
  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const seed = seedFromId(advertiserId);

  const utilization = 0.45 + (seed % 30) / 100; // 0.45–0.74
  const spend = Math.round(
    activeCampaigns.reduce((sum, c) => sum + (c.budget ?? 40000), 0) * utilization
  );

  const targetConversions = activeCampaigns.reduce(
    (sum, c) => sum + (c.monthlyTarget ?? 100) * 0.7,
    0
  );
  const conversionsCount = Math.max(1, Math.round(targetConversions));

  const avgCpa = conversionsCount > 0 ? Math.round(spend / conversionsCount) : 0;
  const roas = Math.round((2.8 + (seed % 25) / 10) * 10) / 10; // ~2.8–5.3x
  const revenue = Math.round(spend * roas);

  const activePublishers = new Set(
    deals.filter((d) => d.status === "active" || d.status === "negotiating").map((d) => d.publisherId)
  ).size;

  return {
    spend,
    revenue,
    conversions: conversionsCount,
    activePublishers,
    activeCampaigns: activeCampaigns.length,
    avgCpa,
    roas,
  };
}

export interface CampaignPerformanceRow {
  campaign: Campaign;
  clicks: number;
  conversions: number;
  spend: number;
}

export function computeCampaignPerformance(campaigns: Campaign[]): CampaignPerformanceRow[] {
  return campaigns.map((campaign) => {
    const seed = seedFromId(campaign.id);
    const conversionsCount = Math.round((campaign.monthlyTarget ?? 100) * (0.4 + (seed % 40) / 100));
    const clickCount = Math.round(conversionsCount / (0.01 + (seed % 6) / 100));
    const amount = parseAmount(campaign.commissionAmount);
    const spend = campaign.commissionModel.includes("CP") && !campaign.commissionAmount.includes("%")
      ? Math.round(amount * conversionsCount)
      : Math.round((campaign.budget ?? 50000) * (0.3 + (seed % 30) / 100));
    return { campaign, clicks: clickCount, conversions: conversionsCount, spend };
  });
}

export interface PublisherStats {
  revenue: number;
  clicks: number;
  conversions: number;
  epc: number;
  conversionRate: number;
  activeCampaigns: number;
}

export function computePublisherStats(publisher: PublisherProfile): PublisherStats {
  const deals = getDealsByPublisher(publisher.id);
  const activeCampaigns = deals.filter((d) => d.status === "active").length;
  const { avgEpc, conversionRate, lifetimeRevenue, conversions: conversionCount } =
    publisher.performanceStats;
  const clicksTotal = conversionRate > 0 ? Math.round(conversionCount / conversionRate) : 0;

  return {
    revenue: lifetimeRevenue,
    clicks: clicksTotal,
    conversions: conversionCount,
    epc: avgEpc,
    conversionRate,
    activeCampaigns,
  };
}

export const sampleClicks = clicks;
export const sampleConversions = conversions;
