// ---------------------------------------------------------------------------
// Core domain types for PartnerGoGo.
//
// These interfaces mirror the shape of a future Postgres/Supabase schema.
// Every entity carries an `id` (uuid string in production) and, where
// relevant, timestamps and foreign keys, so that the mock data layer in
// `src/lib/mock/` can later be swapped 1:1 for real database queries
// without changing the shape consumed by UI components.
// ---------------------------------------------------------------------------

export type UserRole = "advertiser" | "publisher" | "admin";
export type UserStatus = "pending" | "approved" | "disabled";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string; // ISO date
  status: UserStatus;
}

// ---------------------------------------------------------------------------
// Shared enums
// ---------------------------------------------------------------------------

export type Vertical =
  | "Finance"
  | "Ecommerce"
  | "Travel"
  | "Fashion"
  | "Beauty"
  | "Home"
  | "Insurance"
  | "Software"
  | "Sports"
  | "Health"
  | "Gaming"
  | "Automotive"
  | "Telecom"
  | "Other";

export const VERTICALS: Vertical[] = [
  "Finance",
  "Ecommerce",
  "Travel",
  "Fashion",
  "Beauty",
  "Home",
  "Insurance",
  "Software",
  "Sports",
  "Health",
  "Gaming",
  "Automotive",
  "Telecom",
  "Other",
];

export type TrafficSource =
  | "SEO"
  | "Email"
  | "SMS"
  | "Paid Search"
  | "Paid Social"
  | "Organic Social"
  | "Influencer"
  | "App"
  | "Direct"
  | "Other";

export const TRAFFIC_SOURCES: TrafficSource[] = [
  "SEO",
  "Email",
  "SMS",
  "Paid Search",
  "Paid Social",
  "Organic Social",
  "Influencer",
  "App",
  "Direct",
  "Other",
];

export type CommissionModel =
  | "CPA"
  | "CPL"
  | "CPS"
  | "Revenue Share"
  | "Fixed Placement"
  | "Hybrid";

export const COMMISSION_MODELS: CommissionModel[] = [
  "CPA",
  "CPL",
  "CPS",
  "Revenue Share",
  "Fixed Placement",
  "Hybrid",
];

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export interface PublisherPerformanceStats {
  lifetimeRevenue: number; // DKK
  conversions: number;
  avgEpc: number; // DKK, earnings per click
  conversionRate: number; // 0-1
  cancellationRate: number; // 0-1
  successfulPartnerships: number;
}

export interface PublisherProfile {
  id: string;
  userId: string;
  companyName: string;
  website: string;
  country: string;
  primaryGeos: string[];
  categories: Vertical[];
  trafficSources: TrafficSource[];
  monthlyTraffic: number;
  newsletterSubscribers?: number;
  instagramFollowers?: number;
  tiktokFollowers?: number;
  youtubeSubscribers?: number;
  appUsers?: number;
  otherAudience?: string;
  preferredDealModels: CommissionModel[];
  description: string;
  logoUrl?: string;
  approved: boolean;
  performanceStats: PublisherPerformanceStats;
}

export interface AdvertiserProfile {
  id: string;
  userId: string;
  companyName: string;
  website: string;
  industry: Vertical;
  description: string;
  logoUrl?: string;
  approved: boolean;
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export type CampaignStatus = "active" | "paused" | "draft";

// Aggregate performance across every publisher currently running this
// campaign. Undefined for campaigns that haven't launched yet (status
// "draft") — there's no honest number to show until there's real traffic.
// This is mock data today; once real tracking (see clicks/conversions
// below) exists, these become computed aggregates instead of hand-set values.
export interface CampaignStats {
  avgEpc: number; // DKK earned per click, averaged across all publishers
  conversionRate: number; // 0–1, conversions / clicks
  approvalRate: number; // 0–1, conversions approved / conversions submitted
  activePublishers: number;
}

export interface Campaign {
  id: string;
  advertiserId: string;
  name: string;
  brand: string;
  description: string;
  landingPageUrl: string;
  countries: string[];
  vertical: Vertical;
  conversionGoal: string;
  commissionModel: CommissionModel;
  commissionAmount: string; // e.g. "150 DKK" or "8%"
  cookieDurationDays: number;
  allowedTraffic: TrafficSource[];
  restrictedTraffic: TrafficSource[];
  monthlyTarget?: number;
  budget?: number; // DKK
  startDate: string;
  endDate?: string;
  status: CampaignStatus;
  stats?: CampaignStats;
}

// Banners/creatives an advertiser makes available for publishers to embed
// (a hyperlinked image, using the publisher's own tracking link as the href).
export interface CampaignCreative {
  id: string;
  campaignId: string;
  name: string;
  imageUrl: string;
  width: number;
  height: number;
  format: string;
  createdAt: string;
}

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface CampaignApplication {
  id: string;
  campaignId: string;
  publisherId: string;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Distribution requests (advertiser looking for publishers)
// ---------------------------------------------------------------------------

export type RequestStatus = "open" | "closed" | "pending";

export interface DistributionRequest {
  id: string;
  advertiserId: string;
  brand: string;
  market: string; // country / region
  vertical: Vertical;
  targetCustomers: string;
  budget: number; // DKK
  preferredChannels: TrafficSource[];
  dealModel: CommissionModel;
  description: string;
  status: RequestStatus;
  createdAt: string;
}

export type ProposalStatus = "pending" | "accepted" | "declined";

export interface Proposal {
  id: string;
  distributionRequestId: string;
  publisherId: string;
  expectedVolume: number;
  requestedCpa: string;
  trafficSource: TrafficSource;
  placement: string;
  message: string;
  status: ProposalStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Traffic listings (publisher advertising available inventory)
// ---------------------------------------------------------------------------

export interface TrafficListing {
  id: string;
  publisherId: string;
  country: string;
  vertical: Vertical;
  monthlyTraffic: number;
  channel: TrafficSource;
  newsletterSubscribers?: number;
  lookingForDealModels: CommissionModel[];
  description: string;
  status: RequestStatus;
  createdAt: string;
}

export interface TrafficOffer {
  id: string;
  trafficListingId: string;
  advertiserId: string;
  message: string;
  proposedTerms: string;
  status: ProposalStatus;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Private offers, negotiation, deals
// ---------------------------------------------------------------------------

export type PrivateOfferStatus = "pending" | "accepted" | "countered" | "declined";

export interface PrivateOffer {
  id: string;
  advertiserId: string;
  publisherId: string;
  campaignId?: string;
  brand: string;
  standardCpa?: string;
  privateCpa: string;
  requirement?: string;
  status: PrivateOfferStatus;
  createdAt: string;
}

export interface NegotiationMessage {
  id: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  proposedTerms?: string;
  createdAt: string;
}

export interface Negotiation {
  id: string;
  dealId?: string;
  offerId?: string;
  messages: NegotiationMessage[];
}

export type DealStatus =
  | "negotiating"
  | "accepted"
  | "rejected"
  | "active"
  | "completed";

export interface DealTerms {
  baseFixed?: number; // DKK, for hybrid/fixed models
  percentage?: number; // 0-1, for revenue share / hybrid
  notes?: string;
}

export interface Deal {
  id: string;
  advertiserId: string;
  publisherId: string;
  campaignId?: string;
  commissionModel: CommissionModel;
  terms: DealTerms;
  status: DealStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Tracking / performance
// ---------------------------------------------------------------------------

export interface Click {
  id: string;
  campaignId: string;
  publisherId: string;
  clickId: string;
  timestamp: string;
  geo?: string;
}

export type ConversionStatus = "pending" | "approved" | "rejected";

export interface Conversion {
  id: string;
  clickId: string;
  campaignId: string;
  publisherId: string;
  advertiserId: string;
  commission: number; // DKK
  status: ConversionStatus;
  timestamp: string;
}

export type TransactionType = "payout" | "invoice" | "adjustment";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  dealId: string;
  amount: number; // DKK
  type: TransactionType;
  status: TransactionStatus;
  timestamp: string;
}
