import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AlbumCard, { type Album } from "@/components/music/album-card";

type AlbumSectionProps = {
  title: string;
  subtitle?: string;
  albums: Album[];
  href?: string;
};

export default function AlbumSection({
  title,
  subtitle,
  albums,
  href,
}: AlbumSectionProps) {
  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {subtitle && (
            <p className="mb-1 text-xs text-[#a7a7a7]">
              {subtitle}
            </p>
          )}

          <h2 className="truncate text-2xl font-bold tracking-tight text-white">
            {title}
          </h2>
        </div>

        {href && (
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#b3b3b3] hover:text-white"
          >
            Show all
            <ChevronRight size={15} />
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </section>
  );
}