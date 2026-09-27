import type { Campaign, PublisherProfile } from "@/types";

// ---------------------------------------------------------------------------
// Placeholder matching engine.
//
// This is a simple, transparent, weighted-rules scorer meant to power
// "recommended for you" style surfaces in the MVP. It is deliberately
// simple and deterministic so it's easy to reason about and demo.
//
// A future version of this should be replaced by a proper recommendation
// engine (e.g. collaborative filtering / learned ranking based on actual
// conversion performance), likely computed server-side against real
// Deal/Conversion history rather than static profile attributes.
// ---------------------------------------------------------------------------

/** Relative importance of each signal. Weights sum to 100. */
const WEIGHTS = {
  geo: 30,
  vertical: 25,
  trafficSource: 20,
  commissionModel: 15,
  audienceSize: 10,
} as const;

/** Traffic bands used for the "audience size fit" heuristic. */
const AUDIENCE_FIT_TARGET = 250_000; // sweet-spot monthly traffic
const AUDIENCE_FIT_TOLERANCE = 500_000; // scoring falls off over this range

function scoreGeoOverlap(campaign: Campaign, publisher: PublisherProfile): number {
  if (campaign.countries.length === 0 || publisher.primaryGeos.length === 0) return 0;
  const overlap = campaign.countries.filter((c) => publisher.primaryGeos.includes(c));
  if (overlap.length === 0) return 0;
  // Reward publishers whose geos are mostly covered by the campaign, and
  // campaigns whose target countries are mostly covered by the publisher.
  const coverageOfCampaign = overlap.length / campaign.countries.length;
  const coverageOfPublisher = overlap.length / publisher.primaryGeos.length;
  return WEIGHTS.geo * Math.max(coverageOfCampaign, coverageOfPublisher);
}

function scoreVerticalMatch(campaign: Campaign, publisher: PublisherProfile): number {
  return publisher.categories.includes(campaign.vertical) ? WEIGHTS.vertical : 0;
}

function scoreTrafficSourceOverlap(campaign: Campaign, publisher: PublisherProfile): number {
  if (campaign.allowedTraffic.length === 0) return WEIGHTS.trafficSource * 0.5; // no restriction stated
  const usable = publisher.trafficSources.filter(
    (s) => campaign.allowedTraffic.includes(s) && !campaign.restrictedTraffic.includes(s)
  );
  if (usable.length === 0) return 0;
  const ratio = usable.length / publisher.trafficSources.length;
  return WEIGHTS.trafficSource * ratio;
}

function scoreCommissionModelMatch(campaign: Campaign, publisher: PublisherProfile): number {
  if (publisher.preferredDealModels.length === 0) return WEIGHTS.commissionModel * 0.5;
  return publisher.preferredDealModels.includes(campaign.commissionModel)
    ? WEIGHTS.commissionModel
    : 0;
}

function scoreAudienceSizeFit(publisher: PublisherProfile): number {
  const distance = Math.abs(publisher.monthlyTraffic - AUDIENCE_FIT_TARGET);
  const fit = Math.max(0, 1 - distance / AUDIENCE_FIT_TOLERANCE);
  return WEIGHTS.audienceSize * fit;
}

/**
 * Scores how good a match a publisher is for a given campaign, on a 0-100
 * scale. Symmetric enough to be read either as "how good is this publisher
 * for this campaign" or "how good is this campaign for this publisher" —
 * both directions use the same underlying signals.
 */
export function calculateMatchScore(campaign: Campaign, publisher: PublisherProfile): number {
  const raw =
    scoreGeoOverlap(campaign, publisher) +
    scoreVerticalMatch(campaign, publisher) +
    scoreTrafficSourceOverlap(campaign, publisher) +
    scoreCommissionModelMatch(campaign, publisher) +
    scoreAudienceSizeFit(publisher);

  return Math.round(Math.min(100, Math.max(0, raw)));
}

export interface MatchBreakdown {
  score: number;
  geo: number;
  vertical: number;
  trafficSource: number;
  commissionModel: number;
  audienceSize: number;
}

/** Same as calculateMatchScore, but returns the per-signal breakdown too. */
export function calculateMatchBreakdown(
  campaign: Campaign,
  publisher: PublisherProfile
): MatchBreakdown {
  const geo = scoreGeoOverlap(campaign, publisher);
  const vertical = scoreVerticalMatch(campaign, publisher);
  const trafficSource = scoreTrafficSourceOverlap(campaign, publisher);
  const commissionModel = scoreCommissionModelMatch(campaign, publisher);
  const audienceSize = scoreAudienceSizeFit(publisher);
  const score = Math.round(
    Math.min(100, Math.max(0, geo + vertical + trafficSource + commissionModel + audienceSize))
  );
  return { score, geo, vertical, trafficSource, commissionModel, audienceSize };
}

/** Ranks all publishers against a single campaign, best match first. */
export function rankPublishersForCampaign(
  campaign: Campaign,
  publishers: PublisherProfile[]
): { publisher: PublisherProfile; score: number }[] {
  return publishers
    .map((publisher) => ({ publisher, score: calculateMatchScore(campaign, publisher) }))
    .sort((a, b) => b.score - a.score);
}

/** Ranks all campaigns against a single publisher, best match first. */
export function rankCampaignsForPublisher(
  publisher: PublisherProfile,
  campaigns: Campaign[]
): { campaign: Campaign; score: number }[] {
  return campaigns
    .map((campaign) => ({ campaign, score: calculateMatchScore(campaign, publisher) }))
    .sort((a, b) => b.score - a.score);
}
