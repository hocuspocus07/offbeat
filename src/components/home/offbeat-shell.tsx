import AppRail from "@/components/home/app-rail";
import TopNavigation from "@/components/home/top-navigation";
import FeaturedRelease from "@/components/home/featured-release";
import QuickAccessGrid from "@/components/home/quick-access-grid";
import MoodSection from "@/components/home/mood-section";
import NowPlayingPanel from "@/components/home/now-playing-panel";
import BottomPlayer from "@/components/home/bottom-player";

export default function OffbeatShell() {
  return (
    <main className="h-dvh w-screen overflow-hidden bg-black text-white">
      <div className="flex h-full min-h-0 w-full gap-2 p-2 pb-[76px]">
        <AppRail />
        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-[#121212]">
          <TopNavigation />
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="space-y-7 p-4 sm:p-6">
              <FeaturedRelease />
              <QuickAccessGrid />
              <MoodSection
                eyebrow="Music for dark days."
                title="Sad songs"
                query="sad songs"
              />
              <MoodSection
                eyebrow="Keep the rotation moving."
                title="Made for your headphones"
                query="alternative hip hop"
              />
              <footer className="border-t border-white/10 py-5 text-xs text-[#777]">
                Offbeat · Find your frequency.
              </footer>
            </div>
          </div>
        </section>
        <NowPlayingPanel />
      </div>
      <BottomPlayer />
    </main>
  );
}
