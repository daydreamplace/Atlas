import { useEffect, useRef } from "react";

export function HomeHeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = hero.getBoundingClientRect();
      const x = Math.max(
        18,
        Math.min(82, ((event.clientX - rect.left) / rect.width) * 100),
      );
      const y = Math.max(
        18,
        Math.min(78, ((event.clientY - rect.top) / rect.height) * 100),
      );
      hero.style.setProperty("--light-x", `${x.toFixed(2)}%`);
      hero.style.setProperty("--light-y", `${y.toFixed(2)}%`);
    };

    const handleScroll = () => {
      const progress = Math.max(
        0,
        Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight),
      );
      hero.style.setProperty("--hero-scroll", progress.toFixed(3));
    };

    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      hero.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home-hero"
      className="home-section home-hero-section"
      data-home-section="hero"
      aria-labelledby="home-hero-title"
    >
      <h1 id="home-hero-title" className="home-visually-hidden">
        Bio Color ID
      </h1>
      <div className="home-scene-inner" aria-hidden="true">
        <div className="home-light-field" />
      </div>
    </section>
  );
}
