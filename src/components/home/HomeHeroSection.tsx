import { useEffect, useRef, type CSSProperties } from "react";
import magnifierCursorUrl from "../../assets/home/hero/magnifier-cursor.svg?url";
import { HeroMicrobeField } from "./HeroMicrobeField";

export function HomeHeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const light = lightRef.current;
    const scene = light?.parentElement;
    if (!hero || !light || !scene) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 700px)");
    const restingPosition = () =>
      mobile.matches ? { x: 0.52, y: 0.52 } : { x: 0.61, y: 0.49 };
    let sceneRect = scene.getBoundingClientRect();
    const current = restingPosition();
    let target = { ...current };
    let pointerInside = false;
    let animationFrame = 0;
    let lastTime = 0;

    const applyPosition = () => {
      // Update only the glow layer, keeping the full-viewport paper grain out
      // of the pointer animation's repaint path.
      light.style.setProperty(
        "--light-position-x",
        `${(current.x * sceneRect.width).toFixed(2)}px`,
      );
      light.style.setProperty(
        "--light-position-y",
        `${(current.y * sceneRect.height).toFixed(2)}px`,
      );
    };

    const animateLight = (time: number) => {
      animationFrame = 0;
      const delta = Math.max(0, Math.min(0.064, (time - lastTime) / 1000));
      lastTime = time;
      // A short, frame-rate-independent follow keeps a little softness without
      // restarting a CSS transition whenever the pointer changes direction.
      const ease = reduceMotion.matches ? 1 : 1 - Math.exp(-delta * 32);
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      const settled =
        Math.abs(target.x - current.x) < 0.0001 &&
        Math.abs(target.y - current.y) < 0.0001;
      if (settled) Object.assign(current, target);
      applyPosition();
      if (!settled) animationFrame = window.requestAnimationFrame(animateLight);
    };

    const startLight = () => {
      if (animationFrame) return;
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(animateLight);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointerInside = true;
      target.x = Math.max(
        0.04,
        Math.min(0.96, (event.clientX - sceneRect.left) / sceneRect.width),
      );
      target.y = Math.max(
        0.05,
        Math.min(0.95, (event.clientY - sceneRect.top) / sceneRect.height),
      );
      startLight();
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      target = restingPosition();
      startLight();
    };

    const handleScroll = () => {
      sceneRect = scene.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight),
      );
      hero.style.setProperty("--hero-scroll", progress.toFixed(3));
    };

    const resizeObserver = new ResizeObserver(() => {
      sceneRect = scene.getBoundingClientRect();
      if (!pointerInside) target = restingPosition();
      applyPosition();
      startLight();
    });

    resizeObserver.observe(scene);
    hero.addEventListener("pointermove", handlePointerMove, { passive: true });
    hero.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("scroll", handleScroll, { passive: true });
    reduceMotion.addEventListener("change", startLight);
    handleScroll();
    applyPosition();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", handlePointerMove);
      hero.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      reduceMotion.removeEventListener("change", startLight);
      light.style.removeProperty("--light-position-x");
      light.style.removeProperty("--light-position-y");
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home-hero"
      className="home-section home-hero-section"
      data-home-section="hero"
      aria-labelledby="home-hero-title"
      style={
        {
          "--hero-magnifier-cursor": `url("${magnifierCursorUrl}") 17 17, crosshair`,
        } as CSSProperties
      }
    >
      <div className="home-scene-inner" aria-hidden="true">
        <HeroMicrobeField />
        <div ref={lightRef} className="home-light-field" />
        <div className="home-microbe-lens" />
      </div>
      <div className="home-hero-section__copy">
        <h1 id="home-hero-title" className="home-hero-section__title">
          Atlas
        </h1>
        <p className="home-hero-section__lead">
          A closer look at the worlds we rarely see.
        </p>
      </div>
      <a
        className="home-hero-section__scroll"
        href="#global-counterfeit-problem"
      >
        <span>Enter the field</span>
        <i aria-hidden="true" />
      </a>
    </section>
  );
}
