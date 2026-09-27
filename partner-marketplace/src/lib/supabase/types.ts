// ---------------------------------------------------------------------------
// Hand-written Postgres row types for the tables this app actually queries
// from application code today. These mirror `supabase/schema.sql` — keep the
// two in sync if you add columns there.
//
// This is intentionally not a full generated `Database` type (that would
// normally come from `supabase gen types typescript`, which needs a live
// project this sandbox doesn't have). It only covers what's used so far;
// extend it as more of the schema gets wired up.
// ---------------------------------------------------------------------------

export type UserRoleRow = "advertiser" | "publisher" | "admin";
export type UserStatusRow = "pending" | "approved" | "disabled";
export type CampaignStatusRow = "active" | "paused" | "draft";
export type ApplicationStatusRow = "pending" | "approved" | "rejected";

export interface ProfileRow {
  id: string;
  email: string;
  role: UserRoleRow;
  name: string;
  status: UserStatusRow;
  created_at: string;
}

export interface PublisherProfileRow {
  id: string;
  user_id: string;
  company_name: string;
  website: string;
  country: string;
  primary_geos: string[];
  categories: string[];
  traffic_sources: string[];
  monthly_traffic: number;
  newsletter_subscribers: number | null;
  instagram_followers: number | null;
  tiktok_followers: number | null;
  youtube_subscribers: number | null;
  app_users: number | null;
  other_audience: string | null;
  preferred_deal_models: string[];
  description: string;
  logo_url: string | null;
  approved: boolean;
  lifetime_revenue: number;
  conversions: number;
  avg_epc: number;
  conversion_rate: number;
  cancellation_rate: number;
  successful_partnerships: number;
  created_at: string;
}

export interface AdvertiserProfileRow {
  id: string;
  user_id: string;
  company_name: string;
  website: string;
  industry: string;
  description: string;
  logo_url: string | null;
  approved: boolean;
  created_at: string;
}

export interface CampaignRow {
  id: string;
  advertiser_id: string;
  name: string;
  brand: string;
  description: string;
  landing_page_url: string;
  countries: string[];
  vertical: string;
  conversion_goal: string;
  commission_model: string;
  commission_amount: string;
  cookie_duration_days: number;
  allowed_traffic: string[];
  restricted_traffic: string[];
  monthly_target: number | null;
  budget: number | null;
  start_date: string;
  end_date: string | null;
  status: CampaignStatusRow;
  created_at: string;
}

export interface CampaignApplicationRow {
  id: string;
  campaign_id: string;
  publisher_id: string;
  status: ApplicationStatusRow;
  message: string | null;
  created_at: string;
}

export interface CampaignCreativeRow {
  id: string;
  campaign_id: string;
  name: string;
  image_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
}

export interface ClickRow {
  id: string;
  campaign_id: string;
  publisher_id: string;
  click_id: string;
  geo: string | null;
  created_at: string;
}

export type ConversionStatusRow = "pending" | "approved" | "rejected";

export interface ConversionRow {
  id: string;
  click_id: string;
  campaign_id: string;
  publisher_id: string;
  advertiser_id: string;
  commission: number;
  status: ConversionStatusRow;
  created_at: string;
}
