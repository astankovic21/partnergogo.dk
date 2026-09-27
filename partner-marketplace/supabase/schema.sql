-- ============================================================================
-- Partner Marketplace — Supabase schema (run once, in the Supabase SQL editor)
--
-- This mirrors src/types/index.ts field-for-field. Run this whole file in
-- one go on a fresh Supabase project: SQL editor → New query → paste → Run.
--
-- Auth: Supabase Auth (auth.users) is the source of truth for login. This
-- schema adds one `profiles` table keyed to auth.users.id that carries the
-- role/status fields the app needs (mirrors the old mock `User` type), plus
-- one row per company in publisher_profiles / advertiser_profiles.
-- ============================================================================

-- NOTE: no "create extension pgcrypto" needed — Supabase's Postgres (15+)
-- already has gen_random_uuid() built into core, and some projects' SQL
-- editor sessions reject CREATE EXTENSION with "cannot execute ... in a
-- read-only transaction" anyway. Safe to skip entirely.

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth.users row, created automatically on signup)
-- ---------------------------------------------------------------------------

create type user_role as enum ('advertiser', 'publisher', 'admin');
create type user_status as enum ('pending', 'approved', 'disabled');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role user_role not null,
  name text not null default '',
  status user_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever someone signs up via Supabase Auth.
-- The role/name are passed in as auth signup metadata (see the app's
-- signup form — it sends `options.data.role` and `options.data.name`).
create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, name)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'publisher'),
    coalesce(new.raw_user_meta_data->>'name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ---------------------------------------------------------------------------
-- Publisher / advertiser company profiles
-- ---------------------------------------------------------------------------

create table publisher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  company_name text not null,
  website text not null,
  country text not null,
  primary_geos text[] not null default '{}',
  categories text[] not null default '{}',
  traffic_sources text[] not null default '{}',
  monthly_traffic integer not null default 0,
  newsletter_subscribers integer,
  instagram_followers integer,
  tiktok_followers integer,
  youtube_subscribers integer,
  app_users integer,
  other_audience text,
  preferred_deal_models text[] not null default '{}',
  description text not null default '',
  logo_url text,
  approved boolean not null default false,
  -- performance_stats is computed from clicks/conversions in production;
  -- kept as a denormalized snapshot here for fast reads on cards/dashboards.
  lifetime_revenue numeric not null default 0,
  conversions integer not null default 0,
  avg_epc numeric not null default 0,
  conversion_rate numeric not null default 0,
  cancellation_rate numeric not null default 0,
  successful_partnerships integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id)
);

create table advertiser_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  company_name text not null,
  website text not null,
  industry text not null,
  description text not null default '',
  logo_url text,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- ---------------------------------------------------------------------------
-- Campaigns
-- ---------------------------------------------------------------------------

create type campaign_status as enum ('active', 'paused', 'draft');

create table campaigns (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references advertiser_profiles (id) on delete cascade,
  name text not null,
  brand text not null,
  description text not null default '',
  landing_page_url text not null,
  countries text[] not null default '{}',
  vertical text not null,
  conversion_goal text not null,
  commission_model text not null,
  commission_amount text not null, -- e.g. "150 DKK" or "8%"
  cookie_duration_days integer not null default 30,
  allowed_traffic text[] not null default '{}',
  restricted_traffic text[] not null default '{}',
  monthly_target integer,
  budget numeric,
  start_date date not null default current_date,
  end_date date,
  status campaign_status not null default 'draft',
  created_at timestamptz not null default now()
);

-- Banners/creatives an advertiser makes available for a campaign — the
-- "grafik til publishers" feature.
create table campaign_creatives (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  name text not null,
  image_url text not null, -- Supabase Storage public URL
  width integer not null,
  height integer not null,
  format text not null default 'image/png',
  created_at timestamptz not null default now()
);

create type application_status as enum ('pending', 'approved', 'rejected');

create table campaign_applications (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  status application_status not null default 'pending',
  message text,
  created_at timestamptz not null default now(),
  unique (campaign_id, publisher_id)
);

-- ---------------------------------------------------------------------------
-- Distribution requests & proposals ("I need distribution")
-- ---------------------------------------------------------------------------

create type request_status as enum ('open', 'closed', 'pending');

create table distribution_requests (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references advertiser_profiles (id) on delete cascade,
  brand text not null,
  market text not null,
  vertical text not null,
  target_customers text not null,
  budget numeric not null default 0,
  preferred_channels text[] not null default '{}',
  deal_model text not null,
  description text not null default '',
  status request_status not null default 'open',
  created_at timestamptz not null default now()
);

create type proposal_status as enum ('pending', 'accepted', 'declined');

create table proposals (
  id uuid primary key default gen_random_uuid(),
  distribution_request_id uuid not null references distribution_requests (id) on delete cascade,
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  expected_volume integer not null default 0,
  requested_cpa text not null default '',
  traffic_source text not null,
  placement text not null default '',
  message text not null default '',
  status proposal_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Traffic listings & offers ("Available traffic")
-- ---------------------------------------------------------------------------

create table traffic_listings (
  id uuid primary key default gen_random_uuid(),
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  country text not null,
  vertical text not null,
  monthly_traffic integer not null default 0,
  channel text not null,
  newsletter_subscribers integer,
  looking_for_deal_models text[] not null default '{}',
  description text not null default '',
  status request_status not null default 'open',
  created_at timestamptz not null default now()
);

create table traffic_offers (
  id uuid primary key default gen_random_uuid(),
  traffic_listing_id uuid not null references traffic_listings (id) on delete cascade,
  advertiser_id uuid not null references advertiser_profiles (id) on delete cascade,
  message text not null default '',
  proposed_terms text not null default '',
  status proposal_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Private offers, negotiation, deals
-- ---------------------------------------------------------------------------

create type private_offer_status as enum ('pending', 'accepted', 'countered', 'declined');

create table private_offers (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references advertiser_profiles (id) on delete cascade,
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  campaign_id uuid references campaigns (id) on delete set null,
  brand text not null,
  standard_cpa text,
  private_cpa text not null,
  requirement text,
  status private_offer_status not null default 'pending',
  created_at timestamptz not null default now()
);

create type deal_status as enum ('negotiating', 'accepted', 'rejected', 'active', 'completed');

create table deals (
  id uuid primary key default gen_random_uuid(),
  advertiser_id uuid not null references advertiser_profiles (id) on delete cascade,
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  campaign_id uuid references campaigns (id) on delete set null,
  commission_model text not null,
  base_fixed numeric,
  percentage numeric,
  notes text,
  status deal_status not null default 'negotiating',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table negotiation_messages (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals (id) on delete cascade,
  sender_id uuid not null references profiles (id) on delete cascade,
  sender_role user_role not null,
  text text not null,
  proposed_terms text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Tracking: clicks, conversions, transactions
-- (Written by the /go/[campaignId]/[publisherId] redirect route and the
-- /api/postback route using the Supabase service-role key — see README.)
-- ---------------------------------------------------------------------------

create table clicks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  click_id text not null unique, -- the id embedded in the redirect URL, matched on postback
  geo text,
  created_at timestamptz not null default now()
);

create type conversion_status as enum ('pending', 'approved', 'rejected');

create table conversions (
  id uuid primary key default gen_random_uuid(),
  click_id text not null references clicks (click_id),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  publisher_id uuid not null references publisher_profiles (id) on delete cascade,
  advertiser_id uuid not null references advertiser_profiles (id) on delete cascade,
  commission numeric not null default 0,
  status conversion_status not null default 'pending',
  created_at timestamptz not null default now()
);

create type transaction_type as enum ('payout', 'invoice', 'adjustment');
create type transaction_status as enum ('pending', 'completed', 'failed');

create table transactions (
  id uuid primary key default gen_random_uuid(),
  deal_id uuid not null references deals (id) on delete cascade,
  amount numeric not null default 0,
  type transaction_type not null,
  status transaction_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
--
-- Model: anyone (even logged out) can browse the public marketplace data —
-- that's the whole point of a discovery platform. Private data (deals,
-- negotiations, offers, applications, raw tracking rows) is only visible to
-- the two parties involved, or an admin. Writes to tracking tables
-- (clicks/conversions) go through the service-role key from server-only
-- route handlers, which bypasses RLS by design — never expose that key to
-- the browser.
-- ============================================================================

alter table profiles enable row level security;
alter table publisher_profiles enable row level security;
alter table advertiser_profiles enable row level security;
alter table campaigns enable row level security;
alter table campaign_creatives enable row level security;
alter table campaign_applications enable row level security;
alter table distribution_requests enable row level security;
alter table proposals enable row level security;
alter table traffic_listings enable row level security;
alter table traffic_offers enable row level security;
alter table private_offers enable row level security;
alter table deals enable row level security;
alter table negotiation_messages enable row level security;
alter table clicks enable row level security;
alter table conversions enable row level security;
alter table transactions enable row level security;

-- Helper: is the current user an admin?
create function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- profiles: everyone can read (needed for names on cards/threads); only the
-- owner or an admin can update; admin can update status (approve/disable).
create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users update own profile" on profiles for update using (auth.uid() = id or is_admin());

-- publisher/advertiser profiles: public read (marketplace discovery);
-- owner or admin can insert/update their own.
create policy "publisher profiles are publicly readable" on publisher_profiles for select using (true);
create policy "publisher manages own profile" on publisher_profiles for insert with check (auth.uid() = user_id);
create policy "publisher updates own profile" on publisher_profiles for update using (auth.uid() = user_id or is_admin());

create policy "advertiser profiles are publicly readable" on advertiser_profiles for select using (true);
create policy "advertiser manages own profile" on advertiser_profiles for insert with check (auth.uid() = user_id);
create policy "advertiser updates own profile" on advertiser_profiles for update using (auth.uid() = user_id or is_admin());

-- campaigns + creatives: public read; only the owning advertiser (or admin) writes.
create policy "campaigns are publicly readable" on campaigns for select using (true);
create policy "advertiser manages own campaigns" on campaigns for all using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid()) or is_admin()
);

create policy "creatives are publicly readable" on campaign_creatives for select using (true);
create policy "advertiser manages own creatives" on campaign_creatives for all using (
  campaign_id in (
    select c.id from campaigns c
    join advertiser_profiles a on a.id = c.advertiser_id
    where a.user_id = auth.uid()
  ) or is_admin()
);

-- applications: visible to the publisher who applied and the campaign's advertiser.
create policy "applications visible to involved parties" on campaign_applications for select using (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or campaign_id in (
    select c.id from campaigns c join advertiser_profiles a on a.id = c.advertiser_id where a.user_id = auth.uid()
  )
  or is_admin()
);
create policy "publisher creates own application" on campaign_applications for insert with check (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid())
);
create policy "advertiser updates application status" on campaign_applications for update using (
  campaign_id in (
    select c.id from campaigns c join advertiser_profiles a on a.id = c.advertiser_id where a.user_id = auth.uid()
  ) or is_admin()
);

-- distribution requests + proposals: public read; owner writes.
create policy "distribution requests are publicly readable" on distribution_requests for select using (true);
create policy "advertiser manages own requests" on distribution_requests for all using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid()) or is_admin()
);

create policy "proposals visible to involved parties" on proposals for select using (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or distribution_request_id in (
    select r.id from distribution_requests r join advertiser_profiles a on a.id = r.advertiser_id where a.user_id = auth.uid()
  )
  or is_admin()
);
create policy "publisher creates own proposal" on proposals for insert with check (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid())
);

-- traffic listings + offers: public read; owner writes.
create policy "traffic listings are publicly readable" on traffic_listings for select using (true);
create policy "publisher manages own listings" on traffic_listings for all using (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid()) or is_admin()
);

create policy "traffic offers visible to involved parties" on traffic_offers for select using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
  or traffic_listing_id in (
    select t.id from traffic_listings t join publisher_profiles p on p.id = t.publisher_id where p.user_id = auth.uid()
  )
  or is_admin()
);
create policy "advertiser creates own traffic offer" on traffic_offers for insert with check (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
);

-- private offers, deals, negotiation messages, transactions: only the two
-- parties involved (or admin) — this is private deal-making, not public data.
create policy "private offers visible to involved parties" on private_offers for select using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
  or publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or is_admin()
);
create policy "advertiser creates private offer" on private_offers for insert with check (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
);
create policy "involved parties update private offer" on private_offers for update using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
  or publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or is_admin()
);

create policy "deals visible to involved parties" on deals for select using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
  or publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or is_admin()
);
create policy "involved parties update deal" on deals for update using (
  advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
  or publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or is_admin()
);

create policy "negotiation messages visible to involved parties" on negotiation_messages for select using (
  deal_id in (
    select d.id from deals d
    where d.advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
       or d.publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  ) or is_admin()
);
create policy "involved parties send negotiation messages" on negotiation_messages for insert with check (
  deal_id in (
    select d.id from deals d
    where d.advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
       or d.publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  )
);

create policy "transactions visible to involved parties" on transactions for select using (
  deal_id in (
    select d.id from deals d
    where d.advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
       or d.publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  ) or is_admin()
);

-- clicks/conversions: written only by the service-role key (server-only,
-- bypasses RLS). Reads limited to the involved publisher/advertiser + admin.
create policy "clicks visible to involved parties" on clicks for select using (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or campaign_id in (
    select c.id from campaigns c join advertiser_profiles a on a.id = c.advertiser_id where a.user_id = auth.uid()
  )
  or is_admin()
);
create policy "conversions visible to involved parties" on conversions for select using (
  publisher_id in (select id from publisher_profiles where user_id = auth.uid())
  or advertiser_id in (select id from advertiser_profiles where user_id = auth.uid())
  or is_admin()
);

-- ============================================================================
-- Storage bucket for campaign creatives (banners) — public read, so the
-- <img> tags in publishers' embed codes work without auth.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('creatives', 'creatives', true)
on conflict (id) do nothing;

create policy "creative images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'creatives');

create policy "authenticated users upload creatives"
  on storage.objects for insert
  with check (bucket_id = 'creatives' and auth.role() = 'authenticated');
