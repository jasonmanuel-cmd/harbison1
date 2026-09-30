-- =============================================================================
-- Harbison Standard — CRM + site analytics schema
-- =============================================================================
-- Run this in the Supabase SQL editor (Dashboard > SQL > New query), or with:
--   psql "$DATABASE_URL" -f supabase/schema.sql
--
-- Security posture:
--   * RLS is ENABLED on every table and NO public policies are created.
--   * Only the service_role key (server-side only, never in the browser) can read
--     or write. The anon key cannot touch this data.
--   * No raw IP addresses are stored. Repeat visitors are counted via a daily
--     rotating salted hash, which cannot be reversed to an IP.
-- =============================================================================

create table if not exists public.leads (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),

  -- Contact
  name                  text,
  email                 text,
  phone                 text,

  -- Buyer profile (matches the form)
  goal                  text,
  interest              text,
  current_city          text,
  desired_area          text,
  budget                text,
  bedrooms              integer,
  acreage_requirement  text,
  property_type         text,
  timeline              text,
  financing_status      text,
  age_range             text,          -- optional, self-reported by the visitor

  -- The visitor's own words. This is the highest-signal field on the form and
  -- the /hq dashboard renders it, so it must persist alongside the rest.
  message               text,

  -- CRM workflow
  status                text not null default 'new'
                          check (status in ('new','contacted','qualified','closed')),
  brand                 text not null default 'harbison_standard',
  source                text,
  notes                 text,

  -- Which visit produced this lead, for attribution
  session_id            text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_email_idx      on public.leads (lower(email));
create index if not exists leads_session_idx    on public.leads (session_id);

-- -----------------------------------------------------------------------------
-- Sessions: one row per visitor visit. Aggregated on the server as they browse.
-- -----------------------------------------------------------------------------
create table if not exists public.sessions (
  session_id      text primary key,
  created_at      timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),

  visitor_hash    text,                    -- daily-rotating hash, not an IP
  referrer_host   text,                    -- e.g. "google.com" (no full URL)
  referrer_type   text check (referrer_type in
                    ('direct','search','social','referral','email','other')),
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_term        text,
  utm_content     text,

  entry_path      text,
  exit_path       text,
  page_views      integer not null default 0,

  -- Device / browser, derived from the UA string
  device_type     text check (device_type in ('desktop','mobile','tablet','bot','other')),
  browser         text,
  os              text,

  -- Coarse location from Vercel edge headers (no IP retained)
  country         text,
  region          text,                    -- state / province
  city            text,

  -- Total engaged time in seconds, accumulated client-side and flushed on exit
  duration_seconds integer not null default 0
);

create index if not exists sessions_created_at_idx on public.sessions (created_at desc);
create index if not exists sessions_visitor_idx    on public.sessions (visitor_hash);
create index if not exists sessions_device_idx    on public.sessions (device_type);
create index if not exists sessions_country_idx   on public.sessions (country);

-- -----------------------------------------------------------------------------
-- Visits: one row per page view, for per-page analysis and drop-off.
-- -----------------------------------------------------------------------------
create table if not exists public.visits (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  session_id    text not null,
  path          text not null,
  title         text,
  referrer_host text,
  duration_seconds integer
);

create index if not exists visits_session_idx  on public.visits (session_id);
create index if not exists visits_path_idx     on public.visits (path);
create index if not exists visits_created_at_idx on public.visits (created_at desc);

-- One token per page view, generated in the browser. recordDwell filters on it
-- so a heartbeat updates the existing row instead of appending a new one per
-- heartbeat. Unique so the token is a real identifier, not a guessable value.
alter table public.visits add column if not exists page_token text;
create unique index if not exists visits_page_token_idx
  on public.visits (page_token) where page_token is not null;

-- -----------------------------------------------------------------------------
-- Atomic session counter.
--
-- Page views, dwell time and exit path are accumulated. PostgREST cannot express
-- `page_views = page_views + n`, and a read-modify-write from the app would drop
-- concurrent updates — which happens constantly on a fast multi-page visit.
-- This function does the addition inside the database instead.
--
-- SECURITY DEFINER because the sessions table has RLS enabled with no policies:
-- the function still needs to write, and only service_role may call it. The
-- execute grant is revoked from everyone else.
-- -----------------------------------------------------------------------------
create or replace function public.bump_session(
  p_session_id       text,
  p_page_views       integer default 0,
  p_duration_seconds integer default 0,
  p_exit_path        text   default null
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.sessions
     set page_views       = coalesce(page_views, 0) + coalesce(p_page_views, 0),
         duration_seconds = coalesce(duration_seconds, 0) + coalesce(p_duration_seconds, 0),
         exit_path        = coalesce(p_exit_path, exit_path),
         last_seen_at     = now()
   where session_id = p_session_id;
end;
$$;

revoke all on function public.bump_session(text, integer, integer, text) from public;
grant  execute on function public.bump_session(text, integer, integer, text) to service_role;

-- -----------------------------------------------------------------------------
-- Lock it down. No policies = anon/authenticated roles get nothing.
-- service_role bypasses RLS, which is what the server-side API uses.
-- -----------------------------------------------------------------------------
alter table public.leads    enable row level security;
alter table public.sessions enable row level security;
alter table public.visits   enable row level security;

-- =============================================================================
-- Optional: a convenience view summarising the last 7 days.
-- =============================================================================
create or replace view public.analytics_daily as
select
  date_trunc('day', created_at) as day,
  count(*)                        as sessions,
  count(distinct visitor_hash)    as unique_visitors,
  sum(page_views)                 as page_views,
  round(avg(duration_seconds))     as avg_duration_seconds,
  count(*) filter (where referrer_type = 'direct')   as direct,
  count(*) filter (where referrer_type = 'search')   as search,
  count(*) filter (where referrer_type = 'social')   as social,
  count(*) filter (where referrer_type = 'referral') as referral
from public.sessions
where created_at > now() - interval '90 days'
group by 1
order by 1 desc;
