import { useCallback, useEffect, useRef, useState } from "react";
import { isGnbLocked, subscribeGnbLock } from "../utils/gnbLock";

// Ignore tiny scroll jitter (trackpads, mobile bounce).
const SCROLL_THRESHOLD_PX = 6;

/**
 * Hides the GNB while scrolling down and shows it again on scroll up.
 * While a component holds the GNB lock (see utils/gnbLock), it stays hidden
 * even on scroll up. `reveal()` brings it back on demand (hamburger button);
 * the next scroll down hides it again.
 */
export function useAutoHideGnb({ menuOpen }: { menuOpen: boolean }) {
  const [hiddenByScroll, setHiddenByScroll] = useState(false);
  const [locked, setLocked] = useState(isGnbLocked);
  const [revealed, setRevealed] = useState(false);
  const lastY = useRef(0);

  useEffect(() => subscribeGnbLock(() => setLocked(isGnbLocked())), []);

  useEffect(() => {
    lastY.current = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < SCROLL_THRESHOLD_PX) return;
      lastY.current = y;

      if (delta > 0) {
        setRevealed(false);
        setHiddenByScroll(y > 80);
      } else {
        setHiddenByScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hidden = !menuOpen && !revealed && (hiddenByScroll || locked);

  useEffect(() => {
    document.documentElement.dataset.gnbHidden = hidden ? "true" : "false";
  }, [hidden]);

  const reveal = useCallback(() => setRevealed(true), []);

  return { hidden, reveal };
}
