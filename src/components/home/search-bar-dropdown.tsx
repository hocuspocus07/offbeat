"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, Music2, Search, X } from "lucide-react";
import type { YouTubeSearchResult } from "@/lib/youtube/search";
import { useMusicPlayer } from "@/components/music/music-player-provider";

type SearchResponse = {
  items?: YouTubeSearchResult[];
  error?: string;
};

const suggestions = ["Travis Scott songs", "Trending hip-hop", "Late night R&B"];

export default function SearchBarDropdown() {
  const router = useRouter();
  const player = useMusicPlayer();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const normalizedQuery = query.trim();

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/music/search?q=${encodeURIComponent(normalizedQuery)}&limit=8`, {
          method: "GET", cache: "no-store", signal: controller.signal,
        });
        const payload = (await response.json()) as SearchResponse;
        if (!response.ok) throw new Error(payload.error ?? "Search failed.");
        setResults(payload.items ?? []);
      } catch (caught) {
        if (caught instanceof Error && caught.name === "AbortError") return;
        setResults([]);
        setError(caught instanceof Error ? caught.message : "Search failed.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function playResult(item: YouTubeSearchResult) {
    player.play(item);
    setOpen(false);
    // Stay on the current page. The shared player persists across navigation.
  }

  function submitSearch(value = query) {
    const clean = value.trim();
    if (!clean) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(clean)}`);
  }

  return (
    <div ref={rootRef} className="relative z-40 w-[min(560px,54vw)] min-w-0">
      <div className={`flex h-11 items-center gap-3 rounded-full border px-4 transition ${open ? "border-white bg-[#242424]" : "border-transparent bg-[#242424] hover:bg-[#2b2b2b]"}`}>
        <Search size={22} className="shrink-0 text-white" />
        <input
          ref={inputRef}
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onKeyDown={(event) => { if (event.key === "Enter") submitSearch(); }}
          placeholder="What do you want to play?"
          autoComplete="off"
          maxLength={100}
          aria-label="Search songs and artists"
          aria-expanded={open}
          aria-controls="offbeat-search-dropdown"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b3b3b3]"
        />
        {loading ? <LoaderCircle size={19} className="shrink-0 animate-spin text-[#b3b3b3]" /> : query ? (
          <button type="button" aria-label="Clear search" onClick={() => { setQuery(""); setResults([]); setError(""); setOpen(true); inputRef.current?.focus(); }} className="shrink-0 text-[#b3b3b3] hover:text-white"><X size={21} /></button>
        ) : null}
        <span className="hidden h-6 w-px shrink-0 bg-white/20 sm:block" />
        <button type="button" aria-label="Search this query" onClick={() => submitSearch()} className="hidden shrink-0 text-[#b3b3b3] hover:text-white sm:block">▣</button>
      </div>

      {open && <div id="offbeat-search-dropdown" className="absolute left-0 right-0 top-[calc(100%+6px)] max-h-[min(72vh,620px)] overflow-y-auto overscroll-contain rounded-xl border border-white/5 bg-[#282828] p-2 shadow-[0_18px_60px_rgba(0,0,0,0.65)]" role="listbox" aria-label="Search suggestions and results">
        {normalizedQuery.length < 2 ? <div className="p-2">
          <p className="px-2 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-[#aaa]">Start searching</p>
          {suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => { setQuery(suggestion); setOpen(true); submitSearch(suggestion); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-[#ddd] hover:bg-[#3a3a3a]"><Search size={19} className="shrink-0 text-[#aaa]" /><span>{suggestion}</span></button>)}
          <p className="px-3 pb-2 pt-3 text-xs text-[#888]">Type at least 2 characters to search YouTube.</p>
        </div> : <>
          <div className="flex items-center justify-between px-3 pb-2 pt-1"><p className="text-[11px] font-bold uppercase tracking-wider text-[#aaa]">Songs and videos</p><span className="text-[11px] text-[#888]">Powered by YouTube</span></div>
          {error ? <div role="alert" className="m-2 rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm text-red-200">{error}</div> : loading && results.length === 0 ? <div className="flex items-center gap-3 px-4 py-6 text-sm text-[#bbb]"><LoaderCircle size={18} className="animate-spin" />Searching YouTube…</div> : results.length === 0 ? <div className="px-4 py-6 text-sm text-[#aaa]">No results found. Try another artist or song.</div> : <div className="space-y-1">
            {results.map((item) => <button key={item.videoId} type="button" role="option" onClick={() => playResult(item)} className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition hover:bg-[#3b3b3b] focus-visible:bg-[#3b3b3b] focus-visible:outline-none">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-[#3a3a3a]">{item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Music2 size={19} className="m-auto mt-3 text-[#aaa]" />}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-white">{item.title}</span><span className="mt-1 block truncate text-xs text-[#b3b3b3]">Video · {item.channelTitle}</span></span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full text-[#aaa] opacity-0 transition group-hover:opacity-100"><CheckCircle2 size={18} /></span>
            </button>)}
          </div>}
          <button type="button" onClick={() => submitSearch()} className="mt-2 flex w-full items-center gap-3 rounded-lg border-t border-white/10 px-3 py-3 text-left text-sm font-semibold text-white hover:bg-[#3b3b3b]"><Search size={18} className="text-[#aaa]" />Show all results for “{normalizedQuery}”</button>
        </>}
      </div>}
    </div>
  );
}
