"use client";

import Link from "next/link";
import { Check, Heart, ListMusic, Maximize, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useMusicPlayer } from "@/components/music/music-player-provider";

export default function GlobalYouTubePlayer() {
  const { currentTrack, isPlaying, togglePlayback, volume, setVolume } = useMusicPlayer();

  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-[76px] border-t border-[#252525] bg-[#050505] px-3 sm:px-5">
      <div className="mx-auto grid h-full max-w-[1900px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-sm bg-[#202020] text-[10px] font-black tracking-widest text-white/70">
            {currentTrack?.thumbnailUrl ? (
              <img src={currentTrack.thumbnailUrl} alt="" className="h-full w-full object-cover" />
            ) : "OB"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentTrack?.title ?? "Nothing playing"}</p>
            <p className="truncate text-xs text-[#aaa]">{currentTrack?.channelTitle ?? "Choose a track from search"}</p>
          </div>
          {currentTrack && <Heart size={17} className="hidden shrink-0 text-[#aaa] sm:block" />}
          {currentTrack && <Check size={16} className="hidden shrink-0 text-[#1ed760] md:block" />}
        </div>

        <div className="flex w-[min(40vw,600px)] flex-col items-center gap-1">
          <div className="flex items-center gap-3 sm:gap-5">
            <button aria-label="Shuffle" disabled className="hidden text-[#777] sm:block"><Shuffle size={16} /></button>
            <button aria-label="Previous track" disabled className="text-[#777]"><SkipBack size={18} fill="currentColor" /></button>
            {currentTrack ? (
              <button
                type="button"
                aria-label={isPlaying ? "Pause" : "Play"}
                onClick={togglePlayback}
                className="grid size-9 place-items-center rounded-full bg-white text-black transition hover:scale-105"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
            ) : (
              <Link href="/search" aria-label="Choose a track" className="grid size-9 place-items-center rounded-full bg-white text-black transition hover:scale-105">
                <Play size={18} fill="currentColor" />
              </Link>
            )}
            <button aria-label="Next track" disabled className="text-[#777]"><SkipForward size={18} fill="currentColor" /></button>
            <button aria-label="Repeat" disabled className="hidden text-[#777] sm:block"><Repeat2 size={17} /></button>
          </div>
          <div className="flex w-full items-center justify-center gap-2 text-[10px] text-[#aaa]">
            <span>{currentTrack ? "YouTube" : "Ready when you are"}</span>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3 text-[#aaa]">
          <button aria-label="Queue" className="hidden hover:text-white lg:block"><ListMusic size={18} /></button>
          <label className="flex items-center gap-2">
            {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume"
              className="h-1 w-[min(20vw,96px)] cursor-pointer accent-[#1ed760]"
            />
          </label>
          <button aria-label="Fullscreen player" className="hidden hover:text-white sm:block"><Maximize size={17} /></button>
        </div>
      </div>
    </footer>
  );
}
