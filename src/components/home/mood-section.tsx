import Link from "next/link";
import { Play } from "lucide-react";

const cards = [
  { title: "Sad Melodies", sub: "Songs for when words don't work", style: "from-[#41515b] via-[#20282e] to-[#111]", mark: "SAD" },
  { title: "Love in Haryana", sub: "Desi sounds, big feelings", style: "from-[#d2a46f] via-[#68482e] to-[#211810]", mark: "LOVE" },
  { title: "Songs to scream in the car", sub: "Volume up. Windows down.", style: "from-[#b5a18d] via-[#63574c] to-[#1c1917]", mark: "LOUD" },
  { title: "Late night thoughts", sub: "For the hours that blur", style: "from-[#526346] via-[#293323] to-[#111]", mark: "NIGHT" },
  { title: "Sad Hours Punjabi", sub: "Heartbreak with a beat", style: "from-[#765341] via-[#35261f] to-[#111]", mark: "PUNJABI" },
  { title: "On repeat", sub: "One more time won't hurt", style: "from-[#21605f] via-[#153b3a] to-[#101]", mark: "LOOP" },
];

export default function MoodSection({ eyebrow, title, query }: { eyebrow: string; title: string; query: string }) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div><p className="mb-1 text-xs text-[#b3b3b3]">{eyebrow}</p><h2 className="text-2xl font-bold tracking-tight">{title}</h2></div>
        <Link href={`/search?q=${encodeURIComponent(query)}`} className="mb-1 shrink-0 text-xs font-bold text-[#b3b3b3] hover:text-white">Show all</Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {cards.map((card) => <Link key={card.title} href={`/search?q=${encodeURIComponent(card.title)}`} className="group min-w-0 rounded-lg p-2 transition hover:bg-[#1d1d1d]">
          <div className={`relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br ${card.style} p-3 shadow-lg`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.16),transparent_38%)]" />
            <span className="relative text-[10px] font-black tracking-[0.2em] text-white/70">{card.mark}</span>
            <div className="absolute bottom-3 right-3 grid size-11 translate-y-2 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100"><Play size={19} fill="currentColor" /></div>
          </div>
          <h3 className="truncate text-sm font-bold">{card.title}</h3>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#a7a7a7]">{card.sub}</p>
        </Link>)}
      </div>
    </section>
  );
}
