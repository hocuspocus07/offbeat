"use client";

import Link from "next/link";
import {
  Check,
  Heart,
  ListMusic,
  Maximize,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useMusicPlayer } from "@/components/music/music-player-provider";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function GlobalYouTubePlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayback,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    currentTime,
    duration,
    seekTo,
    playerReady,
  } = useMusicPlayer();

  const progress =
    duration > 0
      ? Math.min(100, (currentTime / duration) * 100)
      : 0;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-[76px] border-t border-[#252525] bg-[#050505] px-3 text-white sm:px-5">
      <div className="mx-auto grid h-full max-w-[1900px] grid-cols-[minmax(0,1fr)_minmax(0,40vw)_minmax(0,1fr)] items-center gap-3">
        {/* Current track */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-sm bg-[#202020]">
            {currentTrack?.thumbnailUrl ? (
              <img
                src={currentTrack.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-xs font-black text-white/70">
                OB
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {currentTrack?.title ?? "Nothing playing"}
            </p>
            <p className="truncate text-xs text-[#aaa]">
              {currentTrack?.channelTitle ??
                "Choose a track from search"}
            </p>
          </div>

          {currentTrack && (
            <>
              <button
                type="button"
                aria-label="Like track"
                className="hidden shrink-0 text-[#aaa] hover:text-[#1ed760] sm:block"
              >
                <Heart size={17} />
              </button>

              <Check
                size={16}
                className="hidden shrink-0 text-[#1ed760] md:block"
              />
            </>
          )}
        </div>

        {/* Playback controls and seek slider */}
        <div className="flex min-w-0 flex-col items-center gap-1">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Shuffle"
              disabled
              className="hidden text-[#777] sm:block"
            >
              <Shuffle size={16} />
            </button>

            <button
              type="button"
              aria-label="Previous track"
              disabled
              className="text-[#777]"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            {currentTrack ? (
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlayback}
                disabled={!playerReady}
                className="grid size-9 place-items-center rounded-full bg-white text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
              </button>
            ) : (
              <Link
                href="/search"
                aria-label="Choose a track"
                className="grid size-9 place-items-center rounded-full bg-white text-black transition hover:scale-105"
              >
                <Play size={18} fill="currentColor" />
              </Link>
            )}

            <button
              type="button"
              aria-label="Next track"
              disabled
              className="text-[#777]"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              aria-label="Repeat"
              disabled
              className="hidden text-[#777] sm:block"
            >
              <Repeat2 size={17} />
            </button>
          </div>

          <div className="flex w-full min-w-0 items-center gap-2 text-[10px] tabular-nums text-[#aaa]">
            <span className="w-9 shrink-0 text-right">
              {formatTime(currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={1}
              value={Math.min(currentTime, Math.max(duration, 1))}
              disabled={!playerReady || duration <= 0}
              aria-label="Seek through track"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              onChange={(event) => {
                seekTo(Number(event.currentTarget.value));
              }}
              style={{
                background: `linear-gradient(to right, #1ed760 ${progress}%, #4d4d4d ${progress}%)`,
              }}
              className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full accent-white hover:accent-[#1ed760] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <span className="w-9 shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and utility controls */}
        <div className="flex min-w-0 items-center justify-end gap-3 text-[#aaa]">
          <button
            type="button"
            aria-label="Queue"
            className="hidden hover:text-white lg:block"
          >
            <ListMusic size={18} />
          </button>

          <button
            type="button"
            aria-label={isMuted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            disabled={!playerReady}
            className="hover:text-white disabled:opacity-50"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(event) => {
              setVolume(Number(event.currentTarget.value));
            }}
            aria-label="Volume"
            className="h-1 w-[min(20vw,96px)] cursor-pointer accent-[#1ed760]"
          />

          <button
            type="button"
            aria-label="Fullscreen player"
            disabled
            className="hidden text-[#777] sm:block"
          >
            <Maximize size={17} />
          </button>
        </div>
      </div>
    </footer>
  );
}