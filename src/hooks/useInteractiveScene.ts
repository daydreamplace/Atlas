import { useEffect, useRef, useState, type CSSProperties } from "react";

interface ScrollSequenceOptions {
  readonly reducedIndex?: number;
  readonly startViewportRatio?: number;
  readonly endViewportRatio?: number;
  readonly monotonic?: boolean;
}

export function useInteractiveScene<T extends HTMLElement>() {
  const targetRef = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "-12% 0px -12%", threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = node.getBoundingClientRect();
      const x = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1),
      );
      const y = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1),
      );
      node.style.setProperty("--scene-x", x.toFixed(3));
      node.style.setProperty("--scene-y", y.toFixed(3));
    };

    const resetPointer = () => {
      node.style.setProperty("--scene-x", "0");
      node.style.setProperty("--scene-y", "0");
    };

    node.addEventListener("pointermove", handlePointerMove, { passive: true });
    node.addEventListener("pointerleave", resetPointer);
    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return { targetRef, isInView };
}

export function useScrollSequence<T extends HTMLElement>(
  stepCount: number,
  {
    reducedIndex = stepCount - 1,
    startViewportRatio = 0.72,
    endViewportRatio = 0.28,
    monotonic = false,
  }: ScrollSequenceOptions = {},
) {
  const targetRef = useRef<T>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) setCurrentIndex(reducedIndex);
    };

    applyPreference();
    mediaQuery.addEventListener("change", applyPreference);
    return () => mediaQuery.removeEventListener("change", applyPreference);
  }, [reducedIndex]);

  useEffect(() => {
    const node = targetRef.current;
    if (!node || prefersReducedMotion) return;

    let animationFrame = 0;
    const update = () => {
      animationFrame = 0;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * startViewportRatio;
      const travel = Math.max(
        viewportHeight * 0.5,
        rect.height - viewportHeight * (1 - endViewportRatio),
      );
      const progress = Math.max(
        0,
        Math.min(0.9999, (start - rect.top) / travel),
      );
      const nextIndex = Math.min(
        stepCount - 1,
        Math.floor(progress * stepCount),
      );
      setCurrentIndex((current) => {
        const resolvedIndex = monotonic
          ? Math.max(current, nextIndex)
          : nextIndex;
        return current === resolvedIndex ? current : resolvedIndex;
      });
      setIsActive(rect.bottom > 0 && rect.top < viewportHeight);
      node.style.setProperty("--sequence-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (!animationFrame)
        animationFrame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [
    endViewportRatio,
    monotonic,
    prefersReducedMotion,
    startViewportRatio,
    stepCount,
  ]);

  return {
    targetRef,
    currentIndex,
    setCurrentIndex,
    isActive,
    prefersReducedMotion,
  };
}

export type InteractiveStyle = CSSProperties & {
  "--scene-x"?: string;
  "--scene-y"?: string;
  "--sequence-progress"?: string;
};
