import type { DistributionRequest, Proposal } from "@/types";

// Advertisers looking for publisher distribution.
export const distributionRequests: DistributionRequest[] = [
  {
    id: "dreq_01",
    advertiserId: "adv_02",
    brand: "Pennywise Finance",
    market: "Norway",
    vertical: "Finance",
    targetCustomers: "Adults 25-45 looking to consolidate debt",
    budget: 250000,
    preferredChannels: ["SEO", "Email"],
    dealModel: "CPA",
    description:
      "Expanding our personal loan product into Norway and looking for finance-focused publishers with SEO or email reach.",
    status: "open",
    createdAt: "2026-08-20",
  },
  {
    id: "dreq_02",
    advertiserId: "adv_06",
    brand: "SafeHarbor Insurance",
    market: "Germany",
    vertical: "Insurance",
    targetCustomers: "Homeowners and renters aged 30-60",
    budget: 180000,
    preferredChannels: ["SEO", "Paid Search"],
    dealModel: "CPL",
    description:
      "Looking for German comparison and content sites to scale qualified insurance quote leads.",
    status: "open",
    createdAt: "2026-09-01",
  },
  {
    id: "dreq_03",
    advertiserId: "adv_04",
    brand: "Verde Fashion",
    market: "Denmark",
    vertical: "Fashion",
    targetCustomers: "Women 20-35 interested in sustainable fashion",
    budget: 120000,
    preferredChannels: ["Influencer", "Organic Social"],
    dealModel: "CPS",
    description:
      "Seeking fashion and lifestyle influencers to launch our new collection in the Danish market.",
    status: "open",
    createdAt: "2026-09-05",
  },
  {
    id: "dreq_04",
    advertiserId: "adv_05",
    brand: "Flowline SaaS",
    market: "Sweden",
    vertical: "Software",
    targetCustomers: "SMB operations and finance teams",
    budget: 95000,
    preferredChannels: ["SEO", "Email", "Direct"],
    dealModel: "CPL",
    description:
      "Looking for B2B software review sites and newsletters to promote our free trial in Sweden.",
    status: "pending",
    createdAt: "2026-08-28",
  },
  {
    id: "dreq_05",
    advertiserId: "adv_08",
    brand: "PulsePlay Gaming",
    market: "Finland",
    vertical: "Gaming",
    targetCustomers: "Mobile gamers 16-30",
    budget: 60000,
    preferredChannels: ["App", "Paid Social"],
    dealModel: "CPA",
    description:
      "Launching our mobile game in Finland and seeking app-install focused publishers.",
    status: "closed",
    createdAt: "2026-07-15",
  },
];

export const proposals: Proposal[] = [
  {
    id: "prop_01",
    distributionRequestId: "dreq_01",
    publisherId: "pub_02",
    expectedVolume: 400,
    requestedCpa: "400 DKK",
    trafficSource: "SEO",
    placement: "Loan comparison table, top of page",
    message: "We have strong SEO rankings for loan comparison keywords in Norway.",
    status: "pending",
    createdAt: "2026-08-22",
  },
  {
    id: "prop_02",
    distributionRequestId: "dreq_02",
    publisherId: "pub_08",
    expectedVolume: 1200,
    requestedCpa: "30 DKK",
    trafficSource: "SEO",
    placement: "Dedicated insurance comparison page",
    message: "Our auto comparison audience frequently also searches for home insurance.",
    status: "accepted",
    createdAt: "2026-09-02",
  },
  {
    id: "prop_03",
    distributionRequestId: "dreq_03",
    publisherId: "pub_10",
    expectedVolume: 300,
    requestedCpa: "12%",
    trafficSource: "Influencer",
    placement: "Instagram + TikTok integrated content",
    message: "Our creator network aligns closely with Verde's sustainable positioning.",
    status: "pending",
    createdAt: "2026-09-06",
  },
  {
    id: "prop_04",
    distributionRequestId: "dreq_04",
    publisherId: "pub_09",
    expectedVolume: 150,
    requestedCpa: "70 DKK",
    trafficSource: "SEO",
    placement: "Software review section",
    message: "We're expanding into B2B software reviews and would like to feature Flowline.",
    status: "declined",
    createdAt: "2026-08-29",
  },
  {
    id: "prop_05",
    distributionRequestId: "dreq_05",
    publisherId: "pub_07",
    expectedVolume: 2000,
    requestedCpa: "35 DKK",
    trafficSource: "App",
    placement: "In-app featured offers slot",
    message: "Our app has strong reach across Nordic gamers including Finland.",
    status: "accepted",
    createdAt: "2026-07-18",
  },
];

export function getDistributionRequestById(id: string): DistributionRequest | undefined {
  return distributionRequests.find((r) => r.id === id);
}

export function getProposalsByRequest(distributionRequestId: string): Proposal[] {
  return proposals.filter((p) => p.distributionRequestId === distributionRequestId);
}
