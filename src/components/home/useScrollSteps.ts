import { useCallback, useEffect, useState, type RefObject } from "react";
import { lockGnb, unlockGnb } from "../../utils/gnbLock";
import "../../styles/scroll-steps.css";

/*
  Scroll-driven step sequences.

  Markup:
    <div ref={trackRef} className="scroll-steps-track" data-scroll-driven>
      <div ref={pinRef} className="scroll-steps-pin">…</div>
    </div>

  While enabled, the track is made taller than the pin by `stepCount` ×
  `stepLength`. The pin is held centred on screen (or, if it is taller than
  the screen, by its bottom or top edge — see `align`) while the
  reader scrolls through that extra distance, and each slice of it shows one
  step. After the last step the page scrolls on. The pin also gets
  `--scroll-progress` (0 → 1) for sequences animated purely in CSS.

  While pinned it holds the GNB lock, so the GNB stays out of the way until
  the sequence is finished — even when scrolling back up through it.
*/

// Very short windows (landscape phones) keep the timed autoplay instead.
// Reduced-motion users get the static final state in the sections.
const SCROLL_STEPS_QUERY =
  "(min-height: 520px) and (prefers-reduced-motion: no-preference)";

export function useScrollStepsEnabled(): boolean {
  const [enabled, setEnabled] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(SCROLL_STEPS_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(SCROLL_STEPS_QUERY);
    const handleChange = () => setEnabled(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return enabled;
}

interface ScrollStepsOptions {
  readonly trackRef: RefObject<HTMLElement | null>;
  readonly pinRef: RefObject<HTMLElement | null>;
  readonly stepCount: number;
  readonly enabled: boolean;
  /** Scroll distance per step, as a fraction of the viewport height. */
  readonly stepLength?: number;
  /**
   * A pin that fits on screen is held vertically centred. One taller than
   * the screen is held so that its lower part ("bottom", default) or its top
   * ("top") stays in view.
   */
  readonly align?: "top" | "bottom";
  /** Element that receives `--scroll-progress` (defaults to the pin). */
  readonly progressRef?: RefObject<HTMLElement | null>;
}

// Height-only resizes smaller than this (e.g. a mobile browser's address bar
// sliding in and out while scrolling) are ignored to avoid layout jumps.
const MIN_HEIGHT_CHANGE_PX = 120;

export function useScrollSteps({
  trackRef,
  pinRef,
  stepCount,
  enabled,
  stepLength = 0.4,
  align = "bottom",
  progressRef,
}: ScrollStepsOptions) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!enabled || !track || !pin) return;
    const progressTarget = progressRef?.current ?? pin;

    const lockHolder = Symbol("scroll-steps");
    let frame = 0;
    let pinTop = 0;
    let distance = 0;
    let viewportHeight = window.innerHeight;
    let viewportWidth = window.innerWidth;

    const layout = () => {
      distance = viewportHeight * stepLength * stepCount;
      const spare = viewportHeight - pin.offsetHeight;
      pinTop = spare >= 0 ? spare / 2 : align === "top" ? 0 : spare;
      pin.style.top = `${pinTop}px`;
      track.style.height = `${pin.offsetHeight + distance}px`;
    };

    const update = () => {
      frame = 0;
      const progress = (pinTop - track.getBoundingClientRect().top) / distance;
      const clamped = Math.min(Math.max(progress, 0), 0.9999);
      setStepIndex(Math.floor(clamped * stepCount));
      // Continuous progress for CSS-driven sequences.
      progressTarget.style.setProperty("--scroll-progress", clamped.toFixed(4));

      if (progress > 0 && progress < 1) lockGnb(lockHolder);
      else unlockGnb(lockHolder);
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const relayout = () => {
      layout();
      requestUpdate();
    };

    const handleResize = () => {
      const widthChanged = window.innerWidth !== viewportWidth;
      const heightDelta = Math.abs(window.innerHeight - viewportHeight);
      if (!widthChanged && heightDelta < MIN_HEIGHT_CHANGE_PX) return;
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      relayout();
    };

    relayout();
    const resizeObserver = new ResizeObserver(relayout);
    resizeObserver.observe(pin);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", requestUpdate);
      unlockGnb(lockHolder);
      pin.style.top = "";
      progressTarget.style.removeProperty("--scroll-progress");
      track.style.height = "";
    };
  }, [align, enabled, pinRef, progressRef, stepCount, stepLength, trackRef]);

  /** Scroll so that the given step is showing (used by the step buttons). */
  const scrollToStep = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;

      const distance = window.innerHeight * stepLength * stepCount;
      const pinTop = parseFloat(pin.style.top) || 0;
      const trackTop = track.getBoundingClientRect().top + window.scrollY;
      const target = trackTop - pinTop + ((index + 0.5) / stepCount) * distance;

      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [pinRef, stepCount, stepLength, trackRef],
  );

  return { stepIndex, scrollToStep };
}
