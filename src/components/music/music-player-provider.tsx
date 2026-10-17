"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { YouTubeSearchResult } from "@/lib/youtube/search";

export type YouTubePlayerController = {
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  setSize: (width: number, height: number) => void;
};

type MusicPlayerContextValue = {
  currentTrack: YouTubeSearchResult | null;
  isPlaying: boolean;
  mode: "audio" | "video";
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  playerReady: boolean;
  play: (track: YouTubeSearchResult) => void;
  togglePlayback: () => void;
  setMode: (mode: "audio" | "video") => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (seconds: number) => void;
  registerPlayer: (player: YouTubePlayerController | null) => void;
  updatePlaybackProgress: (
    currentTime: number,
    duration: number,
  ) => void;
  updatePlaybackState: (isPlaying: boolean) => void;
  stop: () => void;
};

const MusicPlayerContext =
  createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [currentTrack, setCurrentTrack] =
    useState<YouTubeSearchResult | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<"audio" | "video">("audio");
  const [volumeState, setVolumeState] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [player, setPlayer] =
    useState<YouTubePlayerController | null>(null);

  const [playerReady, setPlayerReady] = useState(false);

  const play = useCallback((track: YouTubeSearchResult) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(0);
    setMode("audio");
  }, []);

  const togglePlayback = useCallback(() => {
    if (!player || !playerReady) return;

    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (error) {
      console.error("Unable to toggle playback:", error);
    }
  }, [isPlaying, player, playerReady]);

  const setVolume = useCallback(
    (nextVolume: number) => {
      const safeVolume = Math.max(
        0,
        Math.min(100, Math.round(nextVolume)),
      );

      setVolumeState(safeVolume);

      try {
        player?.setVolume(safeVolume);

        if (safeVolume > 0 && isMuted) {
          player?.unMute();
          setIsMuted(false);
        }

        if (safeVolume === 0) {
          player?.mute();
          setIsMuted(true);
        }
      } catch (error) {
        console.error("Unable to change volume:", error);
      }
    },
    [player, isMuted],
  );

  const toggleMute = useCallback(() => {
    if (!player || !playerReady) return;

    try {
      if (isMuted) {
        player.unMute();
        player.setVolume(volumeState);
        setIsMuted(false);
      } else {
        player.mute();
        setIsMuted(true);
      }
    } catch (error) {
      console.error("Unable to toggle mute:", error);
    }
  }, [player, playerReady, isMuted, volumeState]);

  const seekTo = useCallback(
    (seconds: number) => {
      if (!player || !playerReady || !Number.isFinite(seconds)) {
        return;
      }

      const boundedTime = Math.max(
        0,
        Math.min(seconds, duration),
      );

      try {
        player.seekTo(boundedTime, true);
        setCurrentTime(boundedTime);
      } catch (error) {
        console.error("Unable to seek:", error);
      }
    },
    [duration, player, playerReady],
  );

  const registerPlayer = useCallback(
    (nextPlayer: YouTubePlayerController | null) => {
      setPlayer(nextPlayer);
      setPlayerReady(nextPlayer !== null);

      if (nextPlayer) {
        try {
          nextPlayer.setVolume(volumeState);

          if (isMuted) {
            nextPlayer.mute();
          }
        } catch (error) {
          console.error("Unable to configure player:", error);
        }
      }
    },
    [volumeState, isMuted],
  );

  const updatePlaybackProgress = useCallback(
    (nextCurrentTime: number, nextDuration: number) => {
      if (Number.isFinite(nextCurrentTime)) {
        setCurrentTime(Math.max(0, nextCurrentTime));
      }

      if (Number.isFinite(nextDuration) && nextDuration >= 0) {
        setDuration(nextDuration);
      }
    },
    [],
  );

  const updatePlaybackState = useCallback(
    (nextIsPlaying: boolean) => {
      setIsPlaying(nextIsPlaying);
    },
    [],
  );

  const stop = useCallback(() => {
    try {
      player?.pauseVideo();
    } catch {
      // The iframe may already be shutting down.
    }

    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlayerReady(false);
  }, [player]);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      mode,
      volume: volumeState,
      isMuted,
      currentTime,
      duration,
      playerReady,
      play,
      togglePlayback,
      setMode,
      setVolume,
      toggleMute,
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
      volumeState,
      isMuted,
      currentTime,
      duration,
      playerReady,
      play,
      togglePlayback,
      setVolume,
      toggleMute,
      seekTo,
      registerPlayer,
      updatePlaybackProgress,
      updatePlaybackState,
      stop,
    ],
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);

  if (!context) {
    throw new Error(
      "useMusicPlayer must be used inside MusicPlayerProvider.",
    );
  }

  return context;
}