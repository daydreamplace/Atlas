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

  With `stopAtSteps` the reader cannot fly through: every scroll gesture
  moves one step and the page comes to rest on it.
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
  /**
   * Stop on every step: while the pin is held, one scroll gesture moves
   * exactly one step, however hard it is flicked, and the page rests on the
   * step. Without it the steps simply pass by as fast as the reader scrolls.
   */
  readonly stopAtSteps?: boolean;
}

// Stop-at-steps timing. After a step starts, all scroll input is ignored for
// STEP_HOLD_MS so the step can be seen; until STEP_INERTIA_MS only a fresh
// gesture counts, so the tail of a trackpad flick doesn't skip the next one.
const STEP_HOLD_MS = 850;
const STEP_INERTIA_MS = 1600;
const NEW_GESTURE_GAP_MS = 140;
const SCROLL_IDLE_MS = 160;
// How close (px) to a step's resting point counts as being on it.
const STEP_TOLERANCE_PX = 8;
// Wheel travel (px) that counts as meaning it: to move on, and to turn
// around while a step is still under way.
const WHEEL_INTENT_PX = 24;
const WHEEL_TURN_PX = 80;
// Page movement (px) one way before it counts as the direction of travel.
const TRAVEL_MIN_PX = 48;
// How far past the end a gesture that leaves the sequence carries the page.
const STEP_EXIT_PX = 24;

const SCROLL_KEYS: Record<string, 1 | -1> = {
  ArrowDown: 1,
  PageDown: 1,
  " ": 1,
  ArrowUp: -1,
  PageUp: -1,
};

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
  stopAtSteps = false,
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

  // Stop at every step (see `stopAtSteps`).
  useEffect(() => {
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!enabled || !stopAtSteps || !track || !pin) return;

    let stepStartedAt = -Infinity;
    let stepDirection = 0;
    // The run of wheel events going one way without a pause.
    let lastWheelAt = -Infinity;
    let lastWheelSize = 0;
    let runDirection = 0;
    let runLength = 0;
    let runIsFresh = false;
    let idleTimer = 0;
    // Which way the page is travelling (1 down, -1 up). Small movements the
    // other way (layout shifts, bounce) do not change it.
    let lastScrollY = window.scrollY;
    let travel = 0;
    let travelRun = 0;

    // Where the sequence is: `position` px scrolled into `distance`.
    const measure = () => {
      const distance = window.innerHeight * stepLength * stepCount;
      const pinTop = parseFloat(pin.style.top) || 0;
      const trackTop = track.getBoundingClientRect().top;
      return {
        distance,
        stepSize: distance / stepCount,
        position: pinTop - trackTop,
        // Page scroll offset at which the sequence starts.
        start: window.scrollY + trackTop - pinTop,
      };
    };

    const isInside = () => {
      const { distance, position } = measure();
      return position > 0 && position < distance;
    };

    const scrollWithin = (offset: number, direction: number) => {
      stepStartedAt = performance.now();
      stepDirection = direction;
      travel = direction;
      travelRun = 0;
      window.scrollTo({ top: measure().start + offset, behavior: "smooth" });
    };

    /** Move one step. The page only ever moves the way `direction` points. */
    const step = (direction: 1 | -1) => {
      const { distance, stepSize, position } = measure();
      const current = Math.min(Math.floor(position / stepSize), stepCount - 1);
      const rest = (current + 0.5) * stepSize;
      // Not yet at this step's resting point: stop there first.
      const reached =
        direction > 0
          ? position >= rest - STEP_TOLERANCE_PX
          : position <= rest + STEP_TOLERANCE_PX;
      const target = reached ? current + direction : current;

      if (target < 0) scrollWithin(-STEP_EXIT_PX, direction);
      else if (target >= stepCount) {
        scrollWithin(distance + STEP_EXIT_PX, direction);
      } else scrollWithin((target + 0.5) * stepSize, direction);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !event.deltaY) return;
      const now = performance.now();
      const unit =
        event.deltaMode === 1
          ? 40
          : event.deltaMode === 2
            ? window.innerHeight
            : 1;
      const size = Math.abs(event.deltaY) * unit;
      const direction = event.deltaY > 0 ? 1 : -1;

      // A new run starts after a pause, on a turn-around, or with a push
      // harder than the fading tail of the last flick.
      const isPause = now - lastWheelAt > NEW_GESTURE_GAP_MS;
      const isTurnAround = direction !== runDirection;
      if (isPause || isTurnAround || size > lastWheelSize + 4) {
        if (isPause || isTurnAround) runLength = 0;
        runDirection = direction;
        runIsFresh = true;
      }
      lastWheelAt = now;
      lastWheelSize = size;
      runLength += size;

      if (!isInside()) return;
      event.preventDefault();

      // A stray twitch (a finger lifting off the trackpad often sends a few
      // pixels the other way) is not a gesture. Turning around mid-step
      // takes a clearer push than carrying on.
      const isTurn = direction !== stepDirection && stepDirection !== 0;
      const sinceStep = now - stepStartedAt;
      const isSettled = sinceStep > STEP_HOLD_MS;
      const needed = isTurn && !isSettled ? WHEEL_TURN_PX : WHEEL_INTENT_PX;
      if (runLength < needed) return;

      const ready =
        sinceStep > STEP_INERTIA_MS || (runIsFresh && (isSettled || isTurn));
      if (!ready) return;

      runIsFresh = false;
      runLength = 0;
      step(direction);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        target?.closest("input, textarea, select, [contenteditable]")
      ) {
        return;
      }
      let direction = SCROLL_KEYS[event.key];
      if (!direction) return;
      if (event.key === " " && event.shiftKey) direction = -1;
      if (!isInside()) return;
      event.preventDefault();
      const sinceStep = performance.now() - stepStartedAt;
      if (sinceStep > (event.repeat ? STEP_INERTIA_MS : STEP_HOLD_MS)) {
        step(direction);
      }
    };

    // Touch, the scrollbar and anything else that scrolls freely: once the
    // page comes to rest between two steps, carry on to the next one in the
    // direction it was already moving. Never back the way it came, and never
    // back into the sequence when the reader is on the way out of it.
    const settle = () => {
      const { distance, stepSize, position } = measure();
      if (!travel || position <= 0 || position >= distance) return;

      // Steps rest at (index + 0.5) × stepSize.
      const exact = position / stepSize - 0.5;
      if (Math.abs(exact - Math.round(exact)) * stepSize <= STEP_TOLERANCE_PX) {
        return;
      }
      const index = travel > 0 ? Math.ceil(exact) : Math.floor(exact);
      if (index < 0 || index >= stepCount) return;
      scrollWithin((index + 0.5) * stepSize, travel);
    };

    const handleScroll = () => {
      const moved = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      if (moved) {
        travelRun =
          Math.sign(moved) === Math.sign(travelRun) ? travelRun + moved : moved;
        if (Math.abs(travelRun) >= TRAVEL_MIN_PX) travel = Math.sign(travelRun);
      }
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settle, SCROLL_IDLE_MS);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [enabled, pinRef, stepCount, stepLength, stopAtSteps, trackRef]);

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
