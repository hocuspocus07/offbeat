import AlbumCard, { type Album } from "@/components/music/album-card";

type AlbumShelfProps = {
  albums: Album[];
};

export default function AlbumShelf({ albums }: AlbumShelfProps) {
  return (
    <div className="min-w-0 overflow-x-auto overflow-y-hidden pb-3 [scrollbar-width:thin] [scrollbar-color:#444_transparent]">
      <div className="flex w-max gap-2">
        {albums.map((album) => (
          <div
            key={album.id}
            className="w-[150px] shrink-0 sm:w-[175px] lg:w-[190px]"
          >
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
    </div>
  );
}