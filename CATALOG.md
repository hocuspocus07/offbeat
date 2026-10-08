Who can upload music?
What content can be hosted?
Who owns the content?
What licenses are accepted?
Can tracks be streamed?
Can tracks be downloaded?
Can tracks be played offline?
Can artists remove tracks?

1-nobody
2-no content can be hosted, only streaming music
3- content is owned purely by their respective owners
4-no licensing bs
5-tracks can only be STREAMED
6-yes
7-yes
8-no

Track
├── id
├── title
├── artist
├── album
├── audio
├── artwork
├── streaming_allowed
├── download_allowed
└── offline_allowed

Input:
MP3 / WAV / FLAC / etc.

Stored/playback:
Opus or AAC

audio/
  {artist_id}/
    {album_id}/
      {track_id}/
        {content_hash}.opus

artwork/
  {artist_id}/
    {album_id}.webp