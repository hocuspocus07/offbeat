import Link from "next/link";
import { AudioLines, Compass, Heart, House, LibraryBig, Plus, Search, Waves } from "lucide-react";

const covers = [
  ["Sad melodies", "from-[#38434a] to-[#161b20]"],
  ["Love in Haryana", "from-[#c1a27b] to-[#4a3022]"],
  ["Songs to scream in the car", "from-[#b7a18c] to-[#3b3633]"],
  ["Late night", "from-[#6a4b34] to-[#201a17]"],
  ["2024", "from-[#111] to-[#393939]"],
  ["Deep cuts", "from-[#293b46] to-[#111]"],
  ["After hours", "from-[#6b4b7d] to-[#211728]"],
];

export default function AppRail() {
  return (
    <aside className="flex h-full w-[60px] shrink-0 flex-col items-center gap-3 overflow-hidden rounded-xl bg-[#080808] py-3 md:w-[72px]">
      <Link href="/" aria-label="Offbeat home" className="mb-1 grid size-10 shrink-0 place-items-center rounded-full text-white hover:bg-[#242424]">
        <Waves size={22} />
      </Link>
      <Link href="/" aria-label="Home" className="grid size-10 shrink-0 place-items-center rounded-full bg-[#242424] text-white">
        <House size={21} fill="currentColor" />
      </Link>
      <Link href="/search" aria-label="Search music" className="grid size-10 shrink-0 place-items-center rounded-full text-[#aaa] hover:bg-[#242424] hover:text-white">
        <Search size={21} />
      </Link>
      <Link href="/library" aria-label="Your library" className="grid size-10 shrink-0 place-items-center rounded-full text-[#aaa] hover:bg-[#242424] hover:text-white">
        <LibraryBig size={21} />
      </Link>
      <button aria-label="Create playlist" className="grid size-10 shrink-0 place-items-center rounded-full text-[#aaa] hover:bg-[#242424] hover:text-white">
        <Plus size={22} />
      </button>
      <div className="my-1 h-px w-8 shrink-0 bg-white/10" />
      <div className="flex min-h-0 w-full flex-1 flex-col items-center gap-2 overflow-y-auto overflow-x-hidden pb-2">
        {covers.map(([label, color], i) => (
          <Link key={label} href="/search" aria-label={label} title={label} className={`group relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-md bg-gradient-to-br ${color} ring-1 ring-white/5 transition hover:ring-white/30 md:size-12`}>
            {i === 0 ? <AudioLines size={18} className="text-white/80" /> : i === 1 ? <Heart size={17} className="text-white/70" /> : i === 2 ? <Compass size={18} className="text-white/70" /> : <span className="font-mono text-[9px] text-white/70">{String(i + 1).padStart(2, "0")}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
