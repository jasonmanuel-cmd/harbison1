-- =============================================================================
-- Migration 002 — objects the analytics ingest already depends on
-- =============================================================================
-- /api/track writes `visits.page_token` and calls `bump_session()`, but neither
-- schema.sql nor migration-existing-project.sql created them, so page-view
-- inserts and session counters fail against a database built from those files.
-- Run after schema.sql (new project) or migration-existing-project.sql.
-- Idempotent.
-- =============================================================================

alter table public.visits add column if not exists page_token text;
create unique index if not exists visits_page_token_key on public.visits (page_token) where page_token is not null;

-- Atomic increment so concurrent requests for the same session don't drop updates
-- (PostgREST can't express `page_views = page_views + n`).
create or replace function public.bump_session(
  p_session_id       text,
  p_page_views       integer default 0,
  p_duration_seconds integer default 0,
  p_exit_path        text    default null
) returns void
language sql
security definer
set search_path = public
as $$
  update public.sessions
     set page_views       = coalesce(page_views, 0) + greatest(p_page_views, 0),
         duration_seconds = coalesce(duration_seconds, 0) + greatest(p_duration_seconds, 0),
         exit_path        = coalesce(p_exit_path, exit_path),
         last_seen_at     = now()
   where session_id = p_session_id;
$$;

revoke all on function public.bump_session(text, integer, integer, text) from public, anon, authenticated;
grant execute on function public.bump_session(text, integer, integer, text) to service_role;
