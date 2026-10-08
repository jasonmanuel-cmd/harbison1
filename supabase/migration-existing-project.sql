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
-- The visitor's free-text message. The form always collected it and the email
-- always carried it, but it was never persisted, so /hq rendered an empty field.
alter table public.leads add column if not exists message text;

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
-- Per-page-view token. recordDwell filters on it so a heartbeat updates the
-- existing row rather than appending one row per heartbeat.
alter table public.visits add column if not exists page_token      text;
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
create unique index if not exists visits_page_token_idx
  on public.visits (page_token) where page_token is not null;

-- ---------------------------------------------------------------- bump_session
-- The app accumulates page views and dwell time through this function instead of
-- a read-modify-write, which would drop concurrent updates on fast multi-page
-- visits. It has to exist or /api/track silently loses all of that data.
--
-- SECURITY DEFINER because sessions has RLS on with no policies; the execute
-- grant is limited to service_role, which is the only caller.
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

-- ---------------------------------------------------------------- lockdown
-- RLS on, and deliberately NO public policies: the anon key can read nothing.
-- Only the server-side service_role key (which bypasses RLS) reaches the data.
alter table public.leads    enable row level security;
alter table public.sessions enable row level security;
alter table public.visits   enable row level security;
