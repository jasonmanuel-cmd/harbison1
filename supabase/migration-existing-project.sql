-- =============================================================================
-- Reconciliation migration — Harbison-Standard2 (ref: pebqmuumwygrpjofdwfy)
-- =============================================================================
-- This project already holds real data, so nothing here is created from scratch
-- and nothing existing is dropped:
--
--   leads      13 rows   (full buyer profile + first/last-touch UTM)
--   sessions  147 rows   (id, last_seen, visits, lead_id — minimal shape)
--   visits    227 rows   (id, session_id, path, referrer, utm_*, created_at)
--
-- The new site wants a richer sessions table. Rather than drop 147 rows, this
-- adds the missing columns and backfills them from what is already there:
--
--   session_id        <- copied from the existing `id` (which the app already
--                        used as the session key), then made unique so the
--                        upsert path works
--   page_views        <- copied from the existing `visits` counter
--   created_at        <- backfilled from `last_seen` for the historical rows
--
-- Every statement is idempotent.
-- =============================================================================

-- ---------------------------------------------------------------- leads
alter table public.leads add column if not exists age_range text;

-- ---------------------------------------------------------------- sessions
-- The new columns. `duration_seconds`, geo, device, referrer type and the
-- visitor hash have no historical equivalent, so they stay NULL for old rows —
-- the dashboard ignores NULLs rather than treating them as zero.
alter table public.sessions add column if not exists session_id      text;
alter table public.sessions add column if not exists created_at      timestamptz;
alter table public.sessions add column if not exists visitor_hash    text;
alter table public.sessions add column if not exists referrer_host   text;
alter table public.sessions add column if not exists referrer_type   text;
alter table public.sessions add column if not exists utm_source      text;
alter table public.sessions add column if not exists utm_medium      text;
alter table public.sessions add column if not exists utm_campaign    text;
alter table public.sessions add column if not exists utm_term        text;
alter table public.sessions add column if not exists utm_content     text;
alter table public.sessions add column if not exists entry_path      text;
alter table public.sessions add column if not exists exit_path       text;
alter table public.sessions add column if not exists page_views      integer;
alter table public.sessions add column if not exists device_type     text;
alter table public.sessions add column if not exists browser         text;
alter table public.sessions add column if not exists os              text;
alter table public.sessions add column if not exists country         text;
alter table public.sessions add column if not exists region          text;
alter table public.sessions add column if not exists city            text;
alter table public.sessions add column if not exists duration_seconds integer;

-- Backfill from the existing shape.
update public.sessions set session_id = id        where session_id is null;
update public.sessions set page_views  = visits    where page_views  is null;
update public.sessions set created_at  = last_seen where created_at  is null;
update public.sessions set entry_path  = '/'      where entry_path  is null;

alter table public.sessions alter column session_id set not null;
alter table public.sessions alter column page_views  set default 0;
alter table public.sessions alter column duration_seconds set default 0;

-- The upsert in the app needs a unique key on session_id.
create unique index if not exists sessions_session_id_key on public.sessions (session_id);

-- The referrer_type check constraint only applies to new rows.
alter table public.sessions drop constraint if exists sessions_referrer_type_check;
alter table public.sessions add  constraint sessions_referrer_type_check
  check (referrer_type in ('direct','search','social','referral','email','other'));
alter table public.sessions drop constraint if exists sessions_device_type_check;
alter table public.sessions add  constraint sessions_device_type_check
  check (device_type in ('desktop','mobile','tablet','bot','other'));

-- ---------------------------------------------------------------- visits
-- The two columns the new tracker writes that the old table lacks.
alter table public.visits add column if not exists title            text;
alter table public.visits add column if not exists duration_seconds integer;
-- The app no longer records a full referrer URL, but the old rows do; the
-- dashboard reads referrer_host, which is derived from it in the app layer.

-- ---------------------------------------------------------------- indexes
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);
create index if not exists leads_session_idx    on public.leads (session_id);

create index if not exists sessions_created_at_idx on public.sessions (created_at desc);
create index if not exists sessions_visitor_idx    on public.sessions (visitor_hash);
create index if not exists sessions_device_idx     on public.sessions (device_type);
create index if not exists sessions_country_idx    on public.sessions (country);

create index if not exists visits_session_idx   on public.visits (session_id);
create index if not exists visits_path_idx      on public.visits (path);
create index if not exists visits_created_at_idx on public.visits (created_at desc);

-- ---------------------------------------------------------------- lockdown
-- RLS on, and deliberately NO public policies: the anon key can read nothing.
-- Only the server-side service_role key (which bypasses RLS) reaches the data.
alter table public.leads    enable row level security;
alter table public.sessions enable row level security;
alter table public.visits   enable row level security;
