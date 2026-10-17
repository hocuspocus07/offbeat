"use client";

import {
  Check,
  Heart,
  ListMusic,
  Maximize,
  Mic2,
  MonitorSpeaker,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";

type YouTubePlayerInstance = {
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getVolume: () => number;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
};

type BottomPlayerProps = {
  player: YouTubePlayerInstance | null;
  title?: string;
  artist?: string;
  thumbnailUrl?: string;
  onPrevious?: () => void;
  onNext?: () => void;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function BottomPlayer({
  player,
  title = "Nothing playing",
  artist = "Choose a track from search",
  thumbnailUrl,
  onPrevious,
  onNext,
}: BottomPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [seeking, setSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!player) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    const interval = window.setInterval(() => {
      try {
        const nextDuration = player.getDuration();
        const nextTime = player.getCurrentTime();
        const state = player.getPlayerState();

        if (Number.isFinite(nextDuration)) {
          setDuration(nextDuration);
        }

        if (Number.isFinite(nextTime) && !seeking) {
          setCurrentTime(nextTime);
          setSeekValue(nextTime);
        }

        // YouTube PlayerState.PLAYING = 1
        setIsPlaying(state === 1);
      } catch {
        // The YouTube iframe may still be initializing.
      }
    }, 500);

    return () => window.clearInterval(interval);
  }, [player, seeking]);

  function seekTo(seconds: number) {
    if (!player || !Number.isFinite(seconds)) return;

    const boundedTime = Math.max(0, Math.min(seconds, duration || seconds));

    player.seekTo(boundedTime, true);
    setCurrentTime(boundedTime);
    setSeekValue(boundedTime);
    setSeeking(false);
  }

  function togglePlayback() {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function changeVolume(value: number) {
    setVolume(value);

    if (!player) return;

    player.setVolume(value);

    if (value > 0 && muted) {
      player.unMute();
      setMuted(false);
    }

    if (value === 0) {
      player.mute();
      setMuted(true);
    }
  }

  function toggleMute() {
    if (!player) return;

    if (muted) {
      player.unMute();
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-[76px] border-t border-[#252525] bg-[#050505] px-3 sm:px-5">
      <div className="mx-auto grid h-full max-w-[1900px] grid-cols-[minmax(0,1fr)_minmax(120px,40vw)_minmax(0,1fr)] items-center gap-3">
        {/* Track information */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="size-11 shrink-0 overflow-hidden rounded-sm bg-[#202020]">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-[10px] font-black tracking-widest text-white/70">
                OB
              </div>
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {title}
            </p>
            <p className="truncate text-xs text-[#aaa]">{artist}</p>
          </div>

          <button
            type="button"
            aria-label="Like track"
            className="hidden text-[#aaa] hover:text-[#1ed760] sm:block"
          >
            <Heart size={17} />
          </button>

          <span className="hidden text-[#1ed760] md:block">
            <Check size={16} />
          </span>
        </div>

        {/* Playback and seek bar */}
        <div className="flex min-w-0 flex-col items-center gap-1">
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              type="button"
              aria-label="Shuffle"
              className="hidden text-[#aaa] hover:text-white sm:block"
            >
              <Shuffle size={16} />
            </button>

            <button
              type="button"
              aria-label="Previous track"
              onClick={onPrevious}
              className="text-[#aaa] hover:text-white"
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={togglePlayback}
              disabled={!player}
              className="grid size-9 place-items-center rounded-full bg-white text-black transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              aria-label="Next track"
              onClick={onNext}
              className="text-[#aaa] hover:text-white"
            >
              <SkipForward size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              aria-label="Repeat"
              className="hidden text-[#aaa] hover:text-[#1ed760] sm:block"
            >
              <Repeat2 size={17} />
            </button>
          </div>

          <div className="flex w-full min-w-0 items-center gap-2 text-[10px] tabular-nums text-[#aaa]">
            <span className="w-9 shrink-0 text-right">
              {formatTime(seeking ? seekValue : currentTime)}
            </span>

            <input
              type="range"
              min={0}
              max={Math.max(duration, 1)}
              step={1}
              value={Math.min(
                seeking ? seekValue : currentTime,
                Math.max(duration, 1),
              )}
              disabled={!player || duration <= 0}
              aria-label="Seek through track"
              aria-valuetext={`${formatTime(
                seeking ? seekValue : currentTime,
              )} of ${formatTime(duration)}`}
              onChange={(event) => {
                setSeeking(true);
                setSeekValue(Number(event.target.value));
              }}
              onPointerUp={(event) => {
                seekTo(Number(event.currentTarget.value));
              }}
              onKeyUp={(event) => {
                if (
                  event.key.startsWith("Arrow") ||
                  event.key === "Home" ||
                  event.key === "End"
                ) {
                  seekTo(Number(event.currentTarget.value));
                }
              }}
              onBlur={(event) => {
                if (seeking) {
                  seekTo(Number(event.currentTarget.value));
                }
              }}
              style={{
                background: `linear-gradient(to right, #ffffff ${duration > 0 ? progress : 0
                  }%, #4d4d4d ${duration > 0 ? progress : 0
                  }%)`,
              }}
              className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full accent-white hover:accent-[#1ed760] disabled:cursor-not-allowed disabled:opacity-70"
            />

            <span className="w-9 shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Additional controls */}
        <div className="hidden min-w-0 items-center justify-end gap-3 text-[#aaa] lg:flex">
          <button type="button" aria-label="Lyrics" className="hover:text-white">
            <Mic2 size={17} />
          </button>

          <button type="button" aria-label="Queue" className="hover:text-white">
            <ListMusic size={18} />
          </button>

          <button
            type="button"
            aria-label="Connect to a device"
            className="hover:text-white"
          >
            <MonitorSpeaker size={18} />
          </button>

          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="hover:text-white"
          >
            <Volume2 size={18} />
          </button>

          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            aria-label="Volume"
            onChange={(event) => changeVolume(Number(event.target.value))}
            className="h-1 w-20 cursor-pointer accent-white hover:accent-[#1ed760]"
          />

          <button
            type="button"
            aria-label="Fullscreen"
            className="hover:text-white"
          >
            <Maximize size={17} />
          </button>
        </div>
      </div>
    </footer>
  );
}