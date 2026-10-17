import Link from "next/link";
import { AudioLines, Disc3, Flame, Headphones, Radio, Sparkles } from "lucide-react";

const tiles = [
  { title: "things", query: "things song", style: "from-[#393939] to-[#171717]", icon: Disc3 },
  { title: "ESCAPE PLAN / MAFIA", query: "Travis Scott Escape Plan Mafia", style: "from-[#4c4c4c] to-[#181818]", icon: AudioLines },
  { title: "So opium 😈", query: "opium rap", style: "from-[#392849] to-[#151515]", icon: Flame },
  { title: "Chani Nattan", query: "Chani Nattan", style: "from-[#744044] to-[#211515]", icon: Radio },
  { title: "2024", query: "2024 songs", style: "from-[#253c35] to-[#141414]", icon: AudioLines },
  { title: "c4$h $h1t", query: "underground rap", style: "from-[#4e3428] to-[#171717]", icon: Flame },
  { title: "Imran Khan", query: "Imran Khan songs", style: "from-[#343434] to-[#171717]", icon: Headphones },
  { title: "mamacita, i can see the devil in your eyes", query: "mamacita song", style: "from-[#39334a] to-[#171717]", icon: Sparkles },
];

export default function QuickAccessGrid() {
  return (
    <section aria-label="Quick picks">
      <div className="mb-3 flex items-center gap-2">
        {["All", "Music", "Podcasts"].map((label, i) => <button key={label} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${i === 0 ? "bg-white text-black" : "bg-[#2a2a2a] text-white hover:bg-[#393939]"}`}>{label}</button>)}
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map(({ title, query, style, icon: Icon }, i) => (
          <Link key={title} href={`/search?q=${encodeURIComponent(query)}`} className="group flex h-[54px] min-w-0 items-center gap-3 overflow-hidden rounded-md bg-[#292929] pr-3 transition hover:bg-[#383838]">
            <div className={`grid h-full w-[58px] shrink-0 place-items-center bg-gradient-to-br ${style} text-white/75`}><Icon size={21} /></div>
            <span className="min-w-0 flex-1 truncate text-sm font-bold">{title}</span>
            {i === 4 && <AudioLines size={17} className="mr-1 shrink-0 text-[#1ed760]" />}
            <span className="mr-1 grid size-8 shrink-0 translate-x-2 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition group-hover:translate-x-0 group-hover:opacity-100"><span className="ml-0.5">▶</span></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
