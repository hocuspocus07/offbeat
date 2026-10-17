import Link from "next/link";
import { Check, Heart, ListMusic, Maximize, Mic2, MonitorSpeaker, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react";

export default function BottomPlayer() {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 h-[76px] border-t border-[#252525] bg-[#050505] px-3 sm:px-5">
      <div className="mx-auto grid h-full max-w-[1900px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-sm bg-gradient-to-br from-[#35413a] to-[#121512] text-[10px] font-black tracking-widest text-white/70">OB</div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold">Nothing playing</p><p className="truncate text-xs text-[#aaa]">Your selected track appears here</p></div>
          <button aria-label="Like track" className="hidden text-[#aaa] hover:text-[#1ed760] sm:block"><Heart size={17} /></button>
          <span className="hidden text-[#1ed760] md:block"><Check size={16} /></span>
        </div>
        <div className="flex w-[min(40vw,600px)] flex-col items-center gap-1">
          <div className="flex items-center gap-3 sm:gap-5">
            <button aria-label="Shuffle" className="hidden text-[#aaa] hover:text-white sm:block"><Shuffle size={16} /></button>
            <button aria-label="Previous track" className="text-[#aaa] hover:text-white"><SkipBack size={18} fill="currentColor" /></button>
            <Link href="/search" aria-label="Choose a track" className="grid size-9 place-items-center rounded-full bg-white text-black transition hover:scale-105"><Play size={18} fill="currentColor" /></Link>
            <button aria-label="Next track" className="text-[#aaa] hover:text-white"><SkipForward size={18} fill="currentColor" /></button>
            <button aria-label="Repeat" className="hidden text-[#aaa] hover:text-[#1ed760] sm:block"><Repeat2 size={17} /></button>
          </div>
          <div className="flex w-full items-center gap-2 text-[10px] tabular-nums text-[#aaa]"><span>0:00</span><div className="h-1 flex-1 overflow-hidden rounded-full bg-[#4d4d4d]"><div className="h-full w-0 rounded-full bg-white" /></div><span>0:00</span></div>
        </div>
        <div className="hidden min-w-0 items-center justify-end gap-3 text-[#aaa] lg:flex">
          <button aria-label="Lyrics" className="hover:text-white"><Mic2 size={17} /></button>
          <button aria-label="Queue" className="hover:text-white"><ListMusic size={18} /></button>
          <button aria-label="Connect to a device" className="hover:text-white"><MonitorSpeaker size={18} /></button>
          <Volume2 size={18} />
          <div className="h-1 w-20 overflow-hidden rounded-full bg-[#4d4d4d]"><div className="h-full w-2/3 bg-white" /></div>
          <button aria-label="Fullscreen" className="hover:text-white"><Maximize size={17} /></button>
        </div>
      </div>
    </footer>
  );
}
