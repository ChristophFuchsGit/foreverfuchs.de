-- Foreverfuchs Hochzeit - Fix + aktuelle Tabelle
-- Supabase → SQL Editor → New query → alles einfügen → Run

create table if not exists public.music_requests (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null default 'Gast',
  title text default '',
  artist text default '',
  album text default '',
  cover_url text default '',
  preview_url text default '',
  spotify_url text default '',
  youtube_url text default '',
  source text not null default 'manual',
  video_id text default '',
  thumbnail text default '',
  message text default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.music_requests add column if not exists title text default '';
alter table public.music_requests add column if not exists artist text default '';
alter table public.music_requests add column if not exists album text default '';
alter table public.music_requests add column if not exists cover_url text default '';
alter table public.music_requests add column if not exists preview_url text default '';
alter table public.music_requests add column if not exists spotify_url text default '';
alter table public.music_requests add column if not exists youtube_url text default '';
alter table public.music_requests add column if not exists source text default 'manual';
alter table public.music_requests add column if not exists video_id text default '';
alter table public.music_requests add column if not exists thumbnail text default '';
alter table public.music_requests add column if not exists message text default '';
alter table public.music_requests add column if not exists status text default 'new';
alter table public.music_requests add column if not exists created_at timestamptz default now();

-- WICHTIGER FIX für alte Tabellen:
alter table public.music_requests alter column video_id drop not null;
alter table public.music_requests alter column youtube_url drop not null;
alter table public.music_requests alter column thumbnail drop not null;

alter table public.music_requests alter column video_id set default '';
alter table public.music_requests alter column youtube_url set default '';
alter table public.music_requests alter column thumbnail set default '';

update public.music_requests set video_id = '' where video_id is null;
update public.music_requests set youtube_url = '' where youtube_url is null;
update public.music_requests set thumbnail = '' where thumbnail is null;

alter table public.music_requests enable row level security;

drop policy if exists "Guests can create requests" on public.music_requests;
drop policy if exists "Everyone can read requests" on public.music_requests;
drop policy if exists "DJ can update requests" on public.music_requests;
drop policy if exists "DJ can delete requests" on public.music_requests;

create policy "Guests can create requests"
on public.music_requests
for insert
to anon
with check (true);

create policy "Everyone can read requests"
on public.music_requests
for select
to anon
using (true);

create policy "DJ can update requests"
on public.music_requests
for update
to anon
using (true)
with check (true);

create policy "DJ can delete requests"
on public.music_requests
for delete
to anon
using (true);

-- Falls hier eine Meldung kommt, dass die Tabelle schon in realtime ist, ist das okay.
alter publication supabase_realtime add table public.music_requests;
