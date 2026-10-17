"use client";

import Link from "next/link";
import { ListMusic, MonitorPlay, Music2, Radio } from "lucide-react";
import { useMusicPlayer } from "@/components/music/music-player-provider";

export default function NowPlayingPanel() {
  const { currentTrack, isPlaying, mode, setMode, volume } = useMusicPlayer();

  function syncFrame(frame: HTMLIFrameElement) {
    frame.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "setVolume", args: [volume] }),
      "https://www.youtube-nocookie.com",
    );
    frame.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: isPlaying ? "playVideo" : "pauseVideo", args: [] }),
      "https://www.youtube-nocookie.com",
    );
  }

  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-y-auto rounded-xl bg-[#121212] p-4 xl:flex 2xl:w-[340px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="truncate text-base font-bold">{currentTrack?.title ?? "Now playing"}</h2>
        <button aria-label="Open queue" className="rounded-full p-2 text-[#aaa] hover:bg-[#242424] hover:text-white">
          <ListMusic size={19} />
        </button>
      </div>

      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-black">
        {currentTrack ? (
          <>
            <iframe
              id="offbeat-youtube-player"
              key={currentTrack.videoId}
              title={`YouTube player: ${currentTrack.title}`}
              className={mode === "video" ? "h-full w-full" : "pointer-events-none absolute left-0 top-0 h-[200px] w-[200px] opacity-0"}
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(currentTrack.videoId)}?autoplay=1&controls=0&enablejsapi=1&playsinline=1&origin=${encodeURIComponent(window.location.origin)}`}
              onLoad={(event) => syncFrame(event.currentTarget)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              aria-hidden={mode === "audio"}
              tabIndex={mode === "audio" ? -1 : 0}
            />
            {mode === "audio" && (
              currentTrack.thumbnailUrl ? (
                <img src={currentTrack.thumbnailUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center">
                  <Music2 className="mx-auto mb-3 text-[#aaa]" size={34} />
                  <p className="px-5 text-sm font-semibold text-white">{currentTrack.title}</p>
                </div>
              )
            )}
          </>
        ) : (
          <div className="px-6 text-center text-[#777]">
            <Music2 className="mx-auto mb-3" size={34} />
            <p className="text-sm font-semibold">Your player is ready</p>
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={!currentTrack}
        onClick={() => setMode(mode === "video" ? "audio" : "video")}
        className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#292929] px-4 py-2 text-sm font-semibold hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {mode === "video" ? <Music2 size={17} /> : <MonitorPlay size={17} />}
        Switch to {mode === "video" ? "audio" : "video"}
      </button>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold">{currentTrack?.title ?? "Nothing playing"}</h3>
          <p className="mt-1 truncate text-sm text-[#b3b3b3]">{currentTrack?.channelTitle ?? "Choose something from search"}</p>
        </div>
        {isPlaying && <span className="mt-1 size-3 shrink-0 rounded-full bg-[#1ed760]" aria-label="Playing" />}
      </div>

      <div className="mt-6 rounded-lg bg-[#242424] p-4">
        <p className="mb-2 text-sm font-bold">Up next</p>
        <p className="text-xs leading-5 text-[#aaa]">
          {currentTrack ? "Find another track to replace the one playing." : "Search for a track and start listening."}
        </p>
        <Link href="/search" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white hover:underline">
          <Radio size={15} />Find music
        </Link>
      </div>
    </aside>
  );
}
