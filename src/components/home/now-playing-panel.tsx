import Link from "next/link";
import { Check, Ellipsis, ListMusic, MonitorPlay, MoreHorizontal, Radio, Volume2 } from "lucide-react";

export default function NowPlayingPanel() {
  return (
    <aside className="hidden h-full w-[280px] shrink-0 flex-col overflow-y-auto rounded-xl bg-[#121212] p-4 xl:flex 2xl:w-[340px]">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold">Now playing</h2>
        <button aria-label="More options" className="rounded-full p-2 text-[#aaa] hover:bg-[#242424] hover:text-white"><MoreHorizontal size={20} /></button>
      </div>
      <div className="relative mb-4 flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-black">
        <div className="absolute inset-8 border-[5px] border-white/80" />
        <div className="absolute inset-12 bg-gradient-to-b from-[#777] via-[#222] to-black" />
        <div className="relative z-10 text-center"><p className="text-xl font-black tracking-tight">OFFBEAT</p><p className="font-serif text-sm italic">ON REPEAT</p></div>
      </div>
      <button className="mb-4 flex w-fit items-center gap-2 rounded-full bg-[#292929] px-4 py-2 text-sm font-semibold hover:bg-[#383838]"><MonitorPlay size={17} />Switch to video</button>
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="text-xl font-bold">Your next track</h3><p className="mt-1 text-sm text-[#b3b3b3]">Choose something from search</p></div>
        <span className="mt-1 grid size-6 place-items-center rounded-full bg-[#1ed760] text-black"><Check size={15} /></span>
      </div>
      <div className="mt-6 rounded-lg bg-[#242424] p-4">
        <p className="mb-2 text-sm font-bold">Up next</p>
        <p className="text-xs leading-5 text-[#aaa]">Search for a track and start listening. Your queue will appear here when the player is connected.</p>
        <Link href="/search" className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-white hover:underline"><Radio size={15} />Find music</Link>
      </div>
      <div className="mt-auto flex items-center justify-between pt-6 text-[#aaa]"><ListMusic size={18} /><Volume2 size={18} /><Ellipsis size={18} /></div>
    </aside>
  );
}
