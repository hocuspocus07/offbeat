"use client";

import { useEffect, useState } from "react";
import type { YouTubeSearchResult } from "@/lib/youtube/search";

type SearchResponse = {
  items?: YouTubeSearchResult[];
  error?: string;
};

function formatPublishedDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function YouTubeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [selected, setSelected] = useState<YouTubeSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
        const response = await fetch(
          `/api/music/search?q=${encodeURIComponent(normalizedQuery)}&limit=12`,
          { method: "GET", cache: "no-store", signal: controller.signal },
        );
        const payload = (await response.json()) as SearchResponse;
        if (!response.ok) throw new Error(payload.error ?? "Search failed.");
        setResults(payload.items ?? []);
      } catch (caught) {
        if (caught instanceof Error && caught.name === "AbortError") return;
        setResults([]);
        setError(
          caught instanceof Error
            ? caught.message
            : "Something went wrong while searching.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [normalizedQuery]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-lime-400">
          OFFBEAT / DISCOVER
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Find your next repeat.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
          Search YouTube videos and play them using YouTube&apos;s embedded player.
          Results and playback availability are controlled by YouTube.
        </p>
      </header>

      <label htmlFor="youtube-search" className="sr-only">
        Search YouTube music
      </label>
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-3 shadow-lg shadow-black/20 focus-within:border-lime-400/70">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="ml-1 h-5 w-5 shrink-0 text-neutral-400">
          <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
          <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          id="youtube-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search artists, songs, live sessions..."
          autoComplete="off"
          maxLength={100}
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-neutral-500"
        />
        {loading ? (
          <span className="mr-1 h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-lime-400" aria-label="Searching" />
        ) : query ? (
          <button
            type="button"
            onClick={() => { setQuery(""); setSelected(null); }}
            className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          {normalizedQuery.length < 2
            ? "Enter at least 2 characters to search."
            : loading
              ? "Searching YouTube…"
              : `${results.length} result${results.length === 1 ? "" : "s"} shown`}
        </p>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-neutral-300 underline decoration-neutral-600 underline-offset-4 hover:text-white">
          Powered by YouTube
        </a>
      </div>

      {error ? (
        <div role="alert" className="mt-6 rounded-xl border border-red-900/70 bg-red-950/30 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {selected ? (
        <section className="mt-8 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <div className="aspect-video w-full bg-black">
            <iframe
              key={selected.videoId}
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selected.videoId)}?autoplay=1`}
              title={`YouTube player: ${selected.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="truncate font-semibold text-white">{selected.title}</h2>
              <p className="mt-1 truncate text-sm text-neutral-400">{selected.channelTitle}</p>
            </div>
            <a href={selected.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800">
              Open on YouTube ↗
            </a>
          </div>
        </section>
      ) : null}

      {!error && results.length === 0 && !loading && normalizedQuery.length >= 2 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-neutral-800 px-6 py-12 text-center">
          <p className="font-medium text-white">No videos found</p>
          <p className="mt-2 text-sm text-neutral-400">Try another song title or artist name.</p>
        </div>
      ) : null}

      {results.length > 0 ? (
        <section aria-label="YouTube search results" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((item) => {
            const published = formatPublishedDate(item.publishedAt);
            const isSelected = selected?.videoId === item.videoId;
            return (
              <article key={item.videoId} className={`overflow-hidden rounded-2xl border bg-neutral-900 transition ${isSelected ? "border-lime-400/70" : "border-neutral-800 hover:border-neutral-700"}`}>
                <button
                  type="button"
                  onClick={() => { setSelected(item); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  aria-pressed={isSelected}
                  className="block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-lime-400"
                >
                  <div className="relative aspect-video overflow-hidden bg-neutral-800">
                    {item.thumbnailUrl ? (
                      // Keep YouTube thumbnails unmodified.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnailUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-500">No thumbnail available</div>
                    )}
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/85 px-2 py-1 text-xs font-semibold text-white">▶ Play</span>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 min-h-10 font-semibold leading-5 text-white">{item.title}</h3>
                    <p className="mt-2 truncate text-sm text-neutral-300">{item.channelTitle}</p>
                    {published ? <p className="mt-1 text-xs text-neutral-500">Published {published}</p> : null}
                    <p className="mt-3 line-clamp-2 text-xs leading-5 text-neutral-400">{item.description}</p>
                  </div>
                </button>
                <div className="border-t border-neutral-800 px-4 py-3">
                  <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-neutral-300 underline decoration-neutral-700 underline-offset-4 hover:text-white">
                    View on YouTube
                  </a>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      <p className="mt-10 border-t border-neutral-900 pt-4 text-xs leading-5 text-neutral-500">
        YouTube video titles, channel names and thumbnails are provided by YouTube and shown without alteration. Playback uses YouTube&apos;s embedded player, including its standard controls and ads where served.
      </p>
    </main>
  );
}
