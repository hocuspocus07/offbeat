import Link from "next/link";
import { MoreHorizontal, Play } from "lucide-react";

export default function FeaturedRelease() {
  return (
    <section className="relative isolate flex min-h-[230px] overflow-hidden rounded-xl bg-gradient-to-br from-[#66300e] via-[#321a0b] to-[#111] p-4 sm:min-h-[278px] sm:p-6 lg:min-h-[298px] lg:p-7">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_10%_0%,rgba(237,105,19,0.35),transparent_55%)]" />
      <div className="grid min-w-0 flex-1 grid-cols-1 gap-5 sm:grid-cols-[minmax(160px,0.82fr)_1fr] sm:gap-6">
        <div className="relative hidden min-h-[200px] overflow-hidden rounded-lg bg-gradient-to-br from-[#45483b] via-[#202a29] to-[#111] sm:block">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,rgba(225,178,123,0.38),transparent_42%)]" />
          <div className="absolute bottom-0 left-[18%] right-[18%] h-[75%] rounded-t-[48%] bg-gradient-to-b from-[#a68b6a] via-[#282a25] to-[#111] opacity-70 blur-[1px]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/30 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-white/70">Featured</span>
        </div>
        <div className="flex min-w-0 flex-col justify-center py-2 sm:py-0">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid size-11 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#d77b27] to-[#302016] font-mono text-xs font-bold">OB</div>
            <div className="min-w-0"><p className="truncate text-sm font-semibold">Offbeat selection</p><p className="text-sm text-white/60">Featured discovery</p></div>
          </div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">Your next repeat</p>
          <h1 className="max-w-2xl text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-[clamp(28px,2.5vw,42px)]">Find a sound that sticks.</h1>
          <p className="mt-2 max-w-md text-sm text-white/65">New rabbit holes. Familiar favorites. Zero need to explain the playlist.</p>
          <div className="mt-5 flex items-center gap-3">
            <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-[#B6FF3B] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02]"><Play size={16} fill="currentColor" />Listen now</Link>
            <button aria-label="More featured options" className="grid size-10 place-items-center rounded-full text-white/75 hover:bg-white/10 hover:text-white"><MoreHorizontal size={22} /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
