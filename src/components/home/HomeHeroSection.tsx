import { useEffect, useRef } from "react";

export function HomeHeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const light = lightRef.current;
    const scene = light?.parentElement;
    if (!hero || !light || !scene) return;

    const clampToRange = (value: number, min: number, max: number) =>
      min <= max ? Math.max(min, Math.min(max, value)) : (min + max) / 2;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const heroRect = hero.getBoundingClientRect();
      const sceneRect = scene.getBoundingClientRect();
      const lightRect = light.getBoundingClientRect();

      // Keep the transformed glow inside the clipped hero. Once the pointer
      // crosses a safe edge, the glow's centre stays pinned to that edge.
      const lightCenterX = lightRect.left + lightRect.width / 2;
      const lightCenterY = lightRect.top + lightRect.height / 2;
      const anchorX = sceneRect.left + light.offsetLeft;
      const anchorY = sceneRect.top + light.offsetTop;
      const transformOffsetX = lightCenterX - anchorX;
      const transformOffsetY = lightCenterY - anchorY;

      const safeAnchorX = clampToRange(
        event.clientX,
        heroRect.left + lightRect.width / 2 - transformOffsetX,
        heroRect.right - lightRect.width / 2 - transformOffsetX,
      );
      const safeAnchorY = clampToRange(
        event.clientY,
        heroRect.top + lightRect.height / 2 - transformOffsetY,
        heroRect.bottom - lightRect.height / 2 - transformOffsetY,
      );

      const x = ((safeAnchorX - sceneRect.left) / sceneRect.width) * 100;
      const y = ((safeAnchorY - sceneRect.top) / sceneRect.height) * 100;
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
      <div className="home-scene-inner" aria-hidden="true">
        <div ref={lightRef} className="home-light-field" />
      </div>
      <div className="home-hero-section__copy">
        <h1 id="home-hero-title" className="home-hero-section__title">
          Bio Color ID
        </h1>
        <p className="home-hero-section__lead">
          From the counterfeit problem to a new synthetic-biology-based
          authentication platform
        </p>
      </div>
      <a
        className="home-hero-section__scroll"
        href="#global-counterfeit-problem"
      >
        <span>Scroll to begin</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
