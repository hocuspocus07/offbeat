-- Offbeat initial database migration
-- Target: Supabase PostgreSQL
-- Migration version: 202610100001
--
-- Apply this once to the intended Supabase project.
-- This migration creates the nine application tables, constraints, indexes,
-- profile bootstrap trigger, grants, and Row Level Security policies.
--
-- Audio files/downloads are intentionally NOT stored in PostgreSQL.
-- The MVP stores downloaded audio and local download state in IndexedDB.
-- Supabase's auth.users table is managed by Supabase and is not created here.

begin;

-- ---------------------------------------------------------------------------
-- 1. Profiles
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  constraint profiles_username_format_check
    check (
      username is null
      or (
        char_length(username) between 3 and 30
        and username ~ '^[A-Za-z0-9_]+$'
      )
    )
);

-- ---------------------------------------------------------------------------
-- 2. Catalog tables
-- ---------------------------------------------------------------------------

create table public.artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artists_name_nonempty_check
    check (char_length(btrim(name)) > 0)
);

create table public.albums (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists (id) on delete restrict,
  title text not null,
  artwork_url text,
  release_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint albums_title_nonempty_check
    check (char_length(btrim(title)) > 0),
  -- Supports a composite FK from tracks that enforces matching primary artists.
  constraint albums_id_artist_id_unique unique (id, artist_id)
);

create table public.tracks (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists (id) on delete restrict,
  album_id uuid,
  title text not null,
  duration_seconds integer,
  artwork_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tracks_title_nonempty_check
    check (char_length(btrim(title)) > 0),
  constraint tracks_duration_positive_check
    check (duration_seconds is null or duration_seconds > 0),
  -- If album_id is present, the album must have the same primary artist.
  -- The composite FK also ensures the referenced album exists.
  constraint tracks_album_artist_fk
    foreign key (album_id, artist_id)
    references public.albums (id, artist_id)
    on delete restrict
);

create table public.track_sources (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.tracks (id) on delete cascade,
  provider text not null,
  provider_item_id text,
  source_url text not null,
  playback_mode text not null,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  constraint track_sources_provider_nonempty_check
    check (char_length(btrim(provider)) > 0),
  constraint track_sources_url_nonempty_check
    check (char_length(btrim(source_url)) > 0),
  constraint track_sources_playback_mode_check
    check (playback_mode in ('embed', 'direct_stream', 'external_link'))
);

-- ---------------------------------------------------------------------------
-- 3. User-owned data
-- ---------------------------------------------------------------------------

create table public.playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint playlists_name_nonempty_check
    check (char_length(btrim(name)) > 0)
);

create table public.playlist_tracks (
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  track_id uuid not null references public.tracks (id) on delete cascade,
  position integer not null,
  added_at timestamptz not null default now(),
  primary key (playlist_id, track_id),
  constraint playlist_tracks_position_positive_check check (position > 0),
  constraint playlist_tracks_position_unique unique (playlist_id, position)
);

create table public.likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  track_id uuid not null references public.tracks (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, track_id)
);

create table public.listening_history (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  track_id uuid not null references public.tracks (id) on delete cascade,
  played_at timestamptz not null default now(),
  listened_seconds integer not null default 0,
  constraint listening_history_seconds_nonnegative_check
    check (listened_seconds >= 0)
);

-- ---------------------------------------------------------------------------
-- 4. Indexes
-- ---------------------------------------------------------------------------

create index albums_artist_id_idx
  on public.albums (artist_id);

create index tracks_artist_id_idx
  on public.tracks (artist_id);

create index tracks_album_id_idx
  on public.tracks (album_id);

create index track_sources_track_id_idx
  on public.track_sources (track_id);

create unique index track_sources_provider_item_unique_idx
  on public.track_sources (provider, provider_item_id)
  where provider_item_id is not null;

create index track_sources_provider_idx
  on public.track_sources (provider);

create index playlists_owner_updated_idx
  on public.playlists (owner_id, updated_at desc);

create index playlist_tracks_track_id_idx
  on public.playlist_tracks (track_id);

create index likes_track_id_idx
  on public.likes (track_id);

create index listening_history_user_played_idx
  on public.listening_history (user_id, played_at desc);

create index listening_history_track_id_idx
  on public.listening_history (track_id);

-- ---------------------------------------------------------------------------
-- 5. Updated-at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

create trigger artists_set_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

create trigger albums_set_updated_at
before update on public.albums
for each row execute function public.set_updated_at();

create trigger tracks_set_updated_at
before update on public.tracks
for each row execute function public.set_updated_at();

create trigger playlists_set_updated_at
before update on public.playlists
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 6. Create a profile when Supabase Auth creates a user
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  chosen_display_name text;
begin
  chosen_display_name :=
    coalesce(
      nullif(pg_catalog.btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(pg_catalog.split_part(coalesce(new.email, ''), '@', 1), ''),
      'Listener'
    );

  insert into public.profiles (id, display_name)
  values (new.id, chosen_display_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Backfill profiles for auth users that existed before this migration ran.
insert into public.profiles (id, display_name)
select
  u.id,
  coalesce(
    nullif(pg_catalog.btrim(u.raw_user_meta_data ->> 'display_name'), ''),
    nullif(pg_catalog.split_part(coalesce(u.email, ''), '@', 1), ''),
    'Listener'
  )
from auth.users as u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- 7. Enable Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.albums enable row level security;
alter table public.tracks enable row level security;
alter table public.track_sources enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.likes enable row level security;
alter table public.listening_history enable row level security;

-- Catalog metadata is readable to visitors. Browser clients cannot mutate it.
create policy "Catalog artists are readable"
  on public.artists for select
  to anon, authenticated
  using (true);

create policy "Catalog albums are readable"
  on public.albums for select
  to anon, authenticated
  using (true);

create policy "Catalog tracks are readable"
  on public.tracks for select
  to anon, authenticated
  using (true);

-- Source references are available only to signed-in users in the MVP.
create policy "Authenticated users can read track sources"
  on public.track_sources for select
  to authenticated
  using (true);

-- Profiles: users can read and update their own row. Profile creation is
-- performed by the auth.users trigger, not by a browser insert.
create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Playlists: private to their owner in the MVP.
create policy "Users can read their own playlists"
  on public.playlists for select
  to authenticated
  using ((select auth.uid()) = owner_id);

create policy "Users can create their own playlists"
  on public.playlists for insert
  to authenticated
  with check ((select auth.uid()) = owner_id);

create policy "Users can update their own playlists"
  on public.playlists for update
  to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Users can delete their own playlists"
  on public.playlists for delete
  to authenticated
  using ((select auth.uid()) = owner_id);

-- Playlist membership is authorized through ownership of the parent playlist.
create policy "Users can read tracks in their own playlists"
  on public.playlist_tracks for select
  to authenticated
  using (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id
        and p.owner_id = (select auth.uid())
    )
  );

create policy "Users can add tracks to their own playlists"
  on public.playlist_tracks for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id
        and p.owner_id = (select auth.uid())
    )
  );

create policy "Users can remove tracks from their own playlists"
  on public.playlist_tracks for delete
  to authenticated
  using (
    exists (
      select 1
      from public.playlists p
      where p.id = playlist_id
        and p.owner_id = (select auth.uid())
    )
  );

-- Likes: users can manage only their own likes.
create policy "Users can read their own likes"
  on public.likes for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own likes"
  on public.likes for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can remove their own likes"
  on public.likes for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Listening history: users can read and append only their own events.
create policy "Users can read their own listening history"
  on public.listening_history for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can add their own listening history"
  on public.listening_history for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- 8. Table privileges
-- RLS and grants are both required. These grants do not grant catalog writes.
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on public.artists, public.albums, public.tracks to anon, authenticated;
grant select on public.track_sources to authenticated;

grant select, update on public.profiles to authenticated;

grant select, insert, update, delete on public.playlists to authenticated;
grant select, insert, delete on public.playlist_tracks to authenticated;

grant select, insert, delete on public.likes to authenticated;
grant select, insert on public.listening_history to authenticated;

-- No anon/authenticated INSERT, UPDATE, or DELETE grants are given on
-- artists, albums, tracks, or track_sources. Manage catalog rows through a
-- trusted server-side workflow using a secret key only on the server.

commit;
