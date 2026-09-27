import type { TrafficListing, TrafficOffer } from "@/types";

// Publishers advertising available traffic/inventory for advertisers to bid on.
export const trafficListings: TrafficListing[] = [
  {
    id: "tlist_01",
    publisherId: "pub_01",
    country: "Denmark",
    vertical: "Ecommerce",
    monthlyTraffic: 420000,
    channel: "SEO",
    newsletterSubscribers: 85000,
    lookingForDealModels: ["CPS", "Revenue Share"],
    description: "High-intent deal-seeking traffic across Danish ecommerce categories.",
    status: "open",
    createdAt: "2026-08-10",
  },
  {
    id: "tlist_02",
    publisherId: "pub_03",
    country: "Norway",
    vertical: "Fashion",
    monthlyTraffic: 560000,
    channel: "Influencer",
    newsletterSubscribers: 120000,
    lookingForDealModels: ["CPS", "Hybrid"],
    description: "Fashion and beauty focused social audience with strong TikTok engagement.",
    status: "open",
    createdAt: "2026-08-25",
  },
  {
    id: "tlist_03",
    publisherId: "pub_04",
    country: "Germany",
    vertical: "Finance",
    monthlyTraffic: 780000,
    channel: "SEO",
    newsletterSubscribers: 60000,
    lookingForDealModels: ["CPL", "CPA"],
    description: "Established German finance comparison traffic, high conversion intent.",
    status: "open",
    createdAt: "2026-09-01",
  },
  {
    id: "tlist_04",
    publisherId: "pub_06",
    country: "Norway",
    vertical: "Health",
    monthlyTraffic: 180000,
    channel: "Influencer",
    lookingForDealModels: ["CPS", "Hybrid"],
    description: "Fitness and wellness audience open to new brand partnerships.",
    status: "pending",
    createdAt: "2026-09-08",
  },
  {
    id: "tlist_05",
    publisherId: "pub_09",
    country: "Denmark",
    vertical: "Telecom",
    monthlyTraffic: 205000,
    channel: "Paid Search",
    newsletterSubscribers: 12000,
    lookingForDealModels: ["CPA", "CPL"],
    description: "Telecom and software comparison traffic with strong purchase intent.",
    status: "open",
    createdAt: "2026-08-30",
  },
];

export const trafficOffers: TrafficOffer[] = [
  {
    id: "toffer_01",
    trafficListingId: "tlist_01",
    advertiserId: "adv_01",
    message: "We'd love to feature our autumn collection on your homepage deals block.",
    proposedTerms: "8% CPS, 30-day cookie",
    status: "accepted",
    createdAt: "2026-08-12",
  },
  {
    id: "toffer_02",
    trafficListingId: "tlist_02",
    advertiserId: "adv_04",
    message: "Interested in a dedicated content collaboration for our new arrivals.",
    proposedTerms: "10% CPS + fixed 5,000 DKK placement fee",
    status: "pending",
    createdAt: "2026-08-27",
  },
  {
    id: "toffer_03",
    trafficListingId: "tlist_03",
    advertiserId: "adv_02",
    message: "We'd like to run our personal loan offer on your comparison page.",
    proposedTerms: "CPA 500 DKK per approved loan",
    status: "pending",
    createdAt: "2026-09-02",
  },
];

export function getTrafficListingById(id: string): TrafficListing | undefined {
  return trafficListings.find((t) => t.id === id);
}

export function getTrafficOffersByListing(trafficListingId: string): TrafficOffer[] {
  return trafficOffers.filter((o) => o.trafficListingId === trafficListingId);
}
