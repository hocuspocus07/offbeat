"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ListMusic, MonitorPlay, Music2, Radio } from "lucide-react";
import {
  useMusicPlayer,
  type YouTubePlayerController,
} from "@/components/music/music-player-provider";

type ResizableYouTubePlayer = YouTubePlayerController & {
  destroy: () => void;
  setSize: (width: number, height: number) => void;
};

type YouTubePlayerEvent = {
  target: ResizableYouTubePlayer;
  data: number;
};

type YouTubeApi = {
  Player: new (
    target: HTMLElement,
    options: {
      host: string;
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: YouTubePlayerEvent) => void;
        onStateChange: (event: YouTubePlayerEvent) => void;
        onError: (event: YouTubePlayerEvent) => void;
      };
    },
  ) => ResizableYouTubePlayer;

  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();

      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        youtubeApiPromise = null;
        reject(new Error("The YouTube player API did not initialize."));
      }
    };

    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;

      script.onerror = () => {
        youtubeApiPromise = null;
        reject(new Error("Could not load the YouTube player API."));
      };

      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

export default function NowPlayingPanel() {
  const {
    currentTrack,
    isPlaying,
    mode,
    setMode,
    volume,
    registerPlayer,
    updatePlaybackProgress,
    updatePlaybackState,
  } = useMusicPlayer();

  const playerTarget = useRef<HTMLDivElement>(null);

  const playerRef = useRef<
    ResizableYouTubePlayer | null
  >(null);

  const isPlayingRef = useRef(isPlaying);
  const volumeRef = useRef(volume);

  isPlayingRef.current = isPlaying;
  volumeRef.current = volume;

  useEffect(() => {
    if (!currentTrack || !playerTarget.current) {
      registerPlayer(null);
      updatePlaybackProgress(0, 0);
      return;
    }

    const track = currentTrack;
    let disposed = false;

    let player:
      | ResizableYouTubePlayer
      | null = null;

    let progressInterval: number | undefined;

    void loadYouTubeApi()
      .then((youtube) => {
        if (disposed || !playerTarget.current) return;

        player = new youtube.Player(playerTarget.current, {
          host: "https://www.youtube-nocookie.com",

          videoId: track.videoId,

          playerVars: {
            autoplay: 1,
            controls: 0,
            playsinline: 1,
            origin: window.location.origin,
          },

          events: {
            onReady: ({ target }) => {
              if (disposed) return;

              playerRef.current = player;
              registerPlayer(target);

              target.setVolume(volumeRef.current);

              // Match the iframe to its current container dimensions.
              const container = playerTarget.current;

              if (container) {
                target.setSize(
                  Math.max(container.clientWidth, 1),
                  Math.max(container.clientHeight, 1),
                );
              }

              if (!isPlayingRef.current) {
                target.pauseVideo();
              }

              progressInterval = window.setInterval(() => {
                updatePlaybackProgress(
                  target.getCurrentTime(),
                  target.getDuration(),
                );
              }, 500);
            },

            onStateChange: ({ data }) => {
              if (!window.YT) return;

              if (data === window.YT.PlayerState.PLAYING) {
                updatePlaybackState(true);
              }

              if (
                data === window.YT.PlayerState.PAUSED ||
                data === window.YT.PlayerState.ENDED
              ) {
                updatePlaybackState(false);
              }
            },

            onError: ({ data }) => {
              console.error(`YouTube player error: ${data}`);
              updatePlaybackState(false);
            },
          },
        });
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error("YouTube player initialization failed.", error);
        }
      });

    return () => {
      disposed = true;

      if (progressInterval !== undefined) {
        window.clearInterval(progressInterval);
      }

      player?.destroy();

      if (playerRef.current === player) {
        playerRef.current = null;
      }

      registerPlayer(null);
    };
  }, [
    currentTrack?.videoId,
    registerPlayer,
    updatePlaybackProgress,
    updatePlaybackState,
  ]);

  // Resize the existing YouTube iframe when the panel becomes visible.
  useEffect(() => {
    if (mode !== "video" || !playerTarget.current) return;

    const container = playerTarget.current;

    const resizePlayer = () => {
      const player = playerRef.current;

      if (!player) return;

      player.setSize(
        Math.max(container.clientWidth, 1),
        Math.max(container.clientHeight, 1),
      );
    };

    const observer = new ResizeObserver(resizePlayer);

    observer.observe(container);
    resizePlayer();

    return () => observer.disconnect();
  }, [mode, currentTrack?.videoId]);

  useEffect(() => {
    playerRef.current?.setVolume(volume);
  }, [volume]);

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-y-auto rounded-xl bg-[#121212] p-4 xl:flex 2xl:w-[340px]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="truncate text-base font-bold">
          {currentTrack?.title ?? "Now playing"}
        </h2>

        <button
          type="button"
          aria-label="Open queue"
          className="rounded-full p-2 text-[#aaa] hover:bg-[#242424] hover:text-white"
        >
          <ListMusic size={19} />
        </button>
      </div>

      <div className="relative mb-4 aspect-square w-full shrink-0 overflow-hidden rounded-lg bg-black">
        {/* Keep the player mounted and resize it instead of recreating it. */}
        <div
          ref={playerTarget}
          className="absolute inset-0 h-full w-full"
          style={{
            display:
              currentTrack && mode === "video" ? "block" : "none",
          }}
          aria-hidden={mode !== "video"}
        />

        {currentTrack && mode === "audio" ? (
          currentTrack.thumbnailUrl ? (
            <img
              src={currentTrack.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Music2 className="mb-3 text-[#aaa]" size={34} />
              <p className="px-5 text-sm font-semibold text-white">
                {currentTrack.title}
              </p>
            </div>
          )
        ) : !currentTrack ? (
          <div className="px-6 text-center text-[#777]">
            <Music2 className="mx-auto mb-3" size={34} />
            <p className="text-sm font-semibold">Your player is ready</p>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        disabled={!currentTrack}
        onClick={() => setMode(mode === "video" ? "audio" : "video")}
        className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#292929] px-4 py-2 text-sm font-semibold hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mode === "video" ? (
          <Music2 size={17} />
        ) : (
          <MonitorPlay size={17} />
        )}

        Switch to {mode === "video" ? "audio" : "video"}
      </button>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold">
            {currentTrack?.title ?? "Nothing playing"}
          </h3>

          <p className="mt-1 truncate text-sm text-[#b3b3b3]">
            {currentTrack?.channelTitle ?? "Choose something from search"}
          </p>
        </div>

        {isPlaying && (
          <span
            className="mt-1 size-3 shrink-0 rounded-full bg-[#1ed760]"
            aria-label="Playing"
          />
        )}
      </div>

      <div className="mt-6 rounded-lg bg-[#242424] p-4">
        <p className="mb-2 text-sm font-bold">Up next</p>

        <p className="text-xs leading-5 text-[#aaa]">
          {currentTrack
            ? "Find another track to replace the one playing."
            : "Search for a track and start listening."}
        </p>

        <Link
          href="/search"
          className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white hover:underline"
        >
          <Radio size={15} />
          Find music
        </Link>
      </div>
    </aside>
  );
}