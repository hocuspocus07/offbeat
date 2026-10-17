"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { YouTubeSearchResult } from "@/lib/youtube/search";

type MusicPlayerContextValue = {
  currentTrack: YouTubeSearchResult | null;
  isPlaying: boolean;
  mode: "audio" | "video";
  volume: number;
  play: (track: YouTubeSearchResult) => void;
  togglePlayback: () => void;
  setMode: (mode: "audio" | "video") => void;
  setVolume: (volume: number) => void;
  stop: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

function sendYouTubeCommand(func: string, args: unknown[] = []) {
  if (typeof document === "undefined") return;
  const frame = document.getElementById("offbeat-youtube-player") as HTMLIFrameElement | null;
  frame?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args }),
    "https://www.youtube-nocookie.com",
  );
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<YouTubeSearchResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<"audio" | "video">("audio");
  const [volume, setVolumeState] = useState(70);
  const play = useCallback((track: YouTubeSearchResult) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);
  const togglePlayback = useCallback(() => {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
    sendYouTubeCommand(nextIsPlaying ? "playVideo" : "pauseVideo");
  }, [isPlaying]);
  const setVolume = useCallback((nextVolume: number) => {
    const safeVolume = Math.max(0, Math.min(100, nextVolume));
    setVolumeState(safeVolume);
    sendYouTubeCommand("setVolume", [safeVolume]);
  }, []);
  const stop = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);
  const value = useMemo(
    () => ({ currentTrack, isPlaying, mode, volume, play, togglePlayback, setMode, setVolume, stop }),
    [currentTrack, isPlaying, mode, volume, play, togglePlayback, setVolume, stop],
  );

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error("useMusicPlayer must be used inside MusicPlayerProvider.");
  return context;
}
