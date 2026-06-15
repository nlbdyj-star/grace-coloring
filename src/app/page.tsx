import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FeaturedCollections } from "@/components/featured-collections";
import { LatestColoringPages } from "@/components/latest-coloring-pages";
import { WatchColorSection } from "@/components/watch-color-section";
import { FreeDownloads } from "@/components/free-downloads";
import { DailyVerse } from "@/components/daily-verse";
import { Newsletter } from "@/components/newsletter";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedCollections />
        <LatestColoringPages />
        <WatchColorSection />
        <FreeDownloads />
        <DailyVerse />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
