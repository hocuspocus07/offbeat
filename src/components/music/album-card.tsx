import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";

export type Album = {
  id: string;
  title: string;
  artist: string;
  releaseYear?: number;
  coverUrl: string;
  href?: string;
};

type AlbumCardProps = {
  album: Album;
};

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link
      href={album.href ?? `/albums/${album.id}`}
      className="group min-w-0 rounded-lg p-2 transition-colors duration-200 hover:bg-[#1d1d1d]"
    >
      <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-[#282828] shadow-lg">
        <Image
          src={album.coverUrl}
          alt={`${album.title} album cover`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1280px) 22vw, 180px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

        <button
          type="button"
          aria-label={`Play ${album.title}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();

            // Connect this to your shared music player.
            // Album playback needs a track list or album-to-track resolver.
          }}
          className="absolute bottom-3 right-3 grid size-11 translate-y-2 place-items-center rounded-full bg-[#1ed760] text-black opacity-0 shadow-xl transition-all duration-200 hover:scale-105 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          <Play size={20} fill="currentColor" className="ml-0.5" />
        </button>
      </div>

      <h3 className="truncate text-sm font-bold text-white">
        {album.title}
      </h3>

      <p className="mt-1 truncate text-xs leading-5 text-[#a7a7a7]">
        {album.artist}
        {album.releaseYear ? ` · ${album.releaseYear}` : ""}
      </p>
    </Link>
  );
}