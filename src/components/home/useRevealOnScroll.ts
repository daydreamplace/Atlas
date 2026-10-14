import { useEffect, useRef } from "react";
import "../../styles/reveal.css";

/**
 * Entrance motion for a section (styles in styles/reveal.css):
 *
 * - `data-reveal="shown" | "hidden"` toggles when the section enters the
 *   viewport, and resets when it leaves through the bottom (scrolling back
 *   up) so the entrance plays again next time. Drives the text animations.
 * - `--reveal-progress` (0 → 1) follows the scroll position while the section
 *   moves up into view. Drives the scroll-linked artwork animations.
 *
 * Without JS (or before this runs) everything is simply visible.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    element.dataset.reveal = "hidden";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          element.dataset.reveal = "shown";
        } else if (entry.boundingClientRect.top > 0) {
          element.dataset.reveal = "hidden";
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(element);

    // 0 when the section's top reaches the bottom of the screen, 1 once it
    // has risen 70% of the screen height.
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const top = element.getBoundingClientRect().top;
      const viewport = window.innerHeight;
      const progress = reducedMotion
        ? 1
        : Math.min(Math.max((viewport - top) / (viewport * 0.7), 0), 1);
      element.style.setProperty("--reveal-progress", progress.toFixed(3));
    };
    const requestProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", requestProgress);
      delete element.dataset.reveal;
      element.style.removeProperty("--reveal-progress");
    };
  }, []);

  return ref;
}
