"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { YouTubeSearchResult } from "@/lib/youtube/search";

export type YouTubePlayerController = {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
};

type MusicPlayerContextValue = {
  currentTrack: YouTubeSearchResult | null;
  isPlaying: boolean;
  mode: "audio" | "video";
  volume: number;
  currentTime: number;
  duration: number;
  play: (track: YouTubeSearchResult) => void;
  togglePlayback: () => void;
  setMode: (mode: "audio" | "video") => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number) => void;
  registerPlayer: (player: YouTubePlayerController | null) => void;
  updatePlaybackProgress: (currentTime: number, duration: number) => void;
  updatePlaybackState: (isPlaying: boolean) => void;
  stop: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<YouTubeSearchResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<"audio" | "video">("audio");
  const [volume, setVolumeState] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayerController | null>(null);
  const play = useCallback((track: YouTubeSearchResult) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
  }, []);
  const togglePlayback = useCallback(() => {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
    if (nextIsPlaying) player?.playVideo();
    else player?.pauseVideo();
  }, [isPlaying, player]);
  const setVolume = useCallback((nextVolume: number) => {
    const safeVolume = Math.max(0, Math.min(100, nextVolume));
    setVolumeState(safeVolume);
    player?.setVolume(safeVolume);
  }, [player]);
  const seekTo = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds)) return;
    const boundedTime = Math.max(0, Math.min(seconds, duration));
    player?.seekTo(boundedTime, true);
    setCurrentTime(boundedTime);
  }, [duration, player]);
  const registerPlayer = useCallback((nextPlayer: YouTubePlayerController | null) => {
    setPlayer(nextPlayer);
  }, []);
  const updatePlaybackProgress = useCallback((nextCurrentTime: number, nextDuration: number) => {
    if (Number.isFinite(nextCurrentTime)) setCurrentTime(nextCurrentTime);
    if (Number.isFinite(nextDuration)) setDuration(nextDuration);
  }, []);
  const updatePlaybackState = useCallback((nextIsPlaying: boolean) => {
    setIsPlaying(nextIsPlaying);
  }, []);
  const stop = useCallback(() => {
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);
  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      mode,
      volume,
      currentTime,
      duration,
      play,
      togglePlayback,
      setMode,
      setVolume,
      seekTo,
      registerPlayer,
      updatePlaybackProgress,
      updatePlaybackState,
      stop,
    }),
    [
      currentTrack,
      isPlaying,
      mode,
      volume,
      currentTime,
      duration,
      play,
      togglePlayback,
      setVolume,
      seekTo,
      registerPlayer,
      updatePlaybackProgress,
      updatePlaybackState,
      stop,
    ],
  );

  return <MusicPlayerContext.Provider value={value}>{children}</MusicPlayerContext.Provider>;
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error("useMusicPlayer must be used inside MusicPlayerProvider.");
  return context;
}
