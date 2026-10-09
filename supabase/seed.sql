-- Offbeat Phase 2.3: development catalog seed data
-- These are fictional fixtures for testing database relationships and catalog UI.
-- The example URLs are NOT playable media. Replace them with supported provider
-- URLs/references during Phase 3. Do not treat these fixtures as real music.

begin;

insert into public.artists (id, name, bio, image_url)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Neon Harbor',
    'Fictional indie-electronic artist used for local development.',
    'https://images.example.com/artists/neon-harbor.jpg'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Paper Satellites',
    'Fictional alternative-pop duo used for local development.',
    'https://images.example.com/artists/paper-satellites.jpg'
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Mira Sol',
    'Fictional ambient artist used for local development.',
    'https://images.example.com/artists/mira-sol.jpg'
  )
on conflict (id) do nothing;

insert into public.albums (id, artist_id, title, artwork_url, release_date)
values
  (
    '20000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    'After the Static',
    'https://images.example.com/albums/after-the-static.jpg',
    '2025-03-14'
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000002',
    'Postcards from Orbit',
    'https://images.example.com/albums/postcards-from-orbit.jpg',
    '2024-09-20'
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000003',
    'Soft Focus',
    'https://images.example.com/albums/soft-focus.jpg',
    '2026-01-09'
  )
on conflict (id) do nothing;

insert into public.tracks
  (id, artist_id, album_id, title, duration_seconds, artwork_url)
values
  (
    '30000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'Signal in the Fog',
    214,
    'https://images.example.com/tracks/signal-in-the-fog.jpg'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    '10000000-0000-4000-8000-000000000001',
    '20000000-0000-4000-8000-000000000001',
    'Midnight Frequency',
    187,
    'https://images.example.com/tracks/midnight-frequency.jpg'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    '10000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    'Orbiting You',
    203,
    'https://images.example.com/tracks/orbiting-you.jpg'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    '10000000-0000-4000-8000-000000000002',
    '20000000-0000-4000-8000-000000000002',
    'A Map of Stars',
    231,
    'https://images.example.com/tracks/a-map-of-stars.jpg'
  ),
  (
    '30000000-0000-4000-8000-000000000005',
    '10000000-0000-4000-8000-000000000003',
    '20000000-0000-4000-8000-000000000003',
    'Rooms of Light',
    265,
    'https://images.example.com/tracks/rooms-of-light.jpg'
  ),
  (
    '30000000-0000-4000-8000-000000000006',
    '10000000-0000-4000-8000-000000000003',
    null,
    'Blue Hour (Single)',
    198,
    'https://images.example.com/tracks/blue-hour.jpg'
  )
on conflict (id) do nothing;

insert into public.track_sources
  (id, track_id, provider, provider_item_id, source_url, playback_mode)
values
  (
    '40000000-0000-4000-8000-000000000001',
    '30000000-0000-4000-8000-000000000001',
    'demo',
    'demo-signal-in-the-fog',
    'https://music.example.com/demo/signal-in-the-fog',
    'external_link'
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    '30000000-0000-4000-8000-000000000002',
    'demo',
    'demo-midnight-frequency',
    'https://music.example.com/demo/midnight-frequency',
    'external_link'
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    '30000000-0000-4000-8000-000000000003',
    'demo',
    'demo-orbiting-you',
    'https://music.example.com/demo/orbiting-you',
    'external_link'
  ),
  (
    '40000000-0000-4000-8000-000000000004',
    '30000000-0000-4000-8000-000000000004',
    'demo',
    'demo-a-map-of-stars',
    'https://music.example.com/demo/a-map-of-stars',
    'external_link'
  ),
  (
    '40000000-0000-4000-8000-000000000005',
    '30000000-0000-4000-8000-000000000005',
    'demo',
    'demo-rooms-of-light',
    'https://music.example.com/demo/rooms-of-light',
    'external_link'
  ),
  (
    '40000000-0000-4000-8000-000000000006',
    '30000000-0000-4000-8000-000000000006',
    'demo',
    'demo-blue-hour',
    'https://music.example.com/demo/blue-hour',
    'external_link'
  )
on conflict do nothing;

commit;
