import { HomeStorySection } from "../components/home/HomeStorySection";
import { HomeHeroSection } from "../components/home/HomeHeroSection";
import { HomeProgressRail } from "../components/home/HomeProgressRail";
import { HOME_SECTIONS } from "../data/homeContent";

export function Home() {
  return (
    <div className="home-story">
      <HomeHeroSection />
      <HomeProgressRail />
      {HOME_SECTIONS.map((section) => (
        <HomeStorySection key={section.id} section={section} />
      ))}
    </div>
  );
}
