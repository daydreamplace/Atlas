import { useEffect, useState } from "react";
import "./LoadingScreen.css";

// TODO: iGEM requires images to be served from static.igem.wiki.
// Upload src/assets/Loading/web/* with the uploads tool, then replace these
// imports with the resulting https://static.igem.wiki/... URLs.
import cosmetics1 from "../assets/Loading/web/cosmetics-1.webp";
import cosmetics2 from "../assets/Loading/web/cosmetics-2.webp";
import progress000 from "../assets/Loading/web/progress-000.webp";
import progress010 from "../assets/Loading/web/progress-010.webp";
import progress020 from "../assets/Loading/web/progress-020.webp";
import progress030 from "../assets/Loading/web/progress-030.webp";
import progress040 from "../assets/Loading/web/progress-040.webp";
import progress050 from "../assets/Loading/web/progress-050.webp";
import progress060 from "../assets/Loading/web/progress-060.webp";
import progress070 from "../assets/Loading/web/progress-070.webp";
import progress080 from "../assets/Loading/web/progress-080.webp";
import progress090 from "../assets/Loading/web/progress-090.webp";
import progress100 from "../assets/Loading/web/progress-100.webp";

const COSMETICS_FRAMES = [cosmetics1, cosmetics2];
const PROGRESS_FRAMES = [
  progress000,
  progress010,
  progress020,
  progress030,
  progress040,
  progress050,
  progress060,
  progress070,
  progress080,
  progress090,
  progress100,
];
const LAST_STEP = PROGRESS_FRAMES.length - 1;

// --- Timing (all in ms) ---------------------------------------------------
// How long each cosmetics drawing stays on screen before swapping. Two
// hand-drawn frames read as a gentle "boil" around 350–400ms; below ~250ms
// it starts to look like flicker.
const COSMETICS_FRAME_MS = 380;
// Time for the bar to fill 0% → 90%. The bar then waits at 90% until the
// page has finished loading.
const FILL_MS = 2000;
// How long the full (100%) bar stays visible before fading out.
const FULL_HOLD_MS = 350;
// Fade-out duration; keep in sync with `.loading-screen` transition in CSS.
const FADE_MS = 500;
// Safety net: never block the site longer than this, even if `load` never fires.
const MAX_WAIT_MS = 8000;
// Give up waiting for the loader's own images after this long.
const ASSET_TIMEOUT_MS = 2500;

const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

const preload = (src: string) => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => undefined);
};

const pageLoaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });

type Phase = "preparing" | "loading" | "leaving" | "done";

export function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("preparing");
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState(0);

  // Decode the loader's own images first so the first swaps don't flash blank.
  useEffect(() => {
    let cancelled = false;
    const assets = Promise.all(
      [...COSMETICS_FRAMES, ...PROGRESS_FRAMES].map(preload),
    );
    const timeout = new Promise((r) => setTimeout(r, ASSET_TIMEOUT_MS));
    Promise.race([assets, timeout]).then(() => {
      if (!cancelled) setPhase("loading");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Alternate the cosmetics drawings.
  useEffect(() => {
    if (phase !== "loading") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setFrame((f) => (f + 1) % COSMETICS_FRAMES.length),
      COSMETICS_FRAME_MS,
    );
    return () => clearInterval(id);
  }, [phase]);

  // Drive the progress bar: eased fill to 90%, then 100% once the page is ready.
  useEffect(() => {
    if (phase !== "loading") return;
    let ready = false;
    let raf = 0;
    let finishTimer: ReturnType<typeof setTimeout>;
    const start = performance.now();

    pageLoaded().then(() => (ready = true));
    const giveUp = setTimeout(() => (ready = true), MAX_WAIT_MS);

    const tick = (now: number) => {
      const t = Math.min((now - start) / FILL_MS, 1);
      const filled = Math.floor(easeOutQuad(t) * (LAST_STEP - 1));
      if (t >= 1 && ready) {
        setStep(LAST_STEP);
        finishTimer = setTimeout(() => setPhase("leaving"), FULL_HOLD_MS);
        return;
      }
      setStep(filled);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      clearTimeout(finishTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "leaving") return;
    const id = setTimeout(() => setPhase("done"), FADE_MS);
    return () => clearTimeout(id);
  }, [phase]);

  // Lock page scroll while the loader is up.
  useEffect(() => {
    if (phase === "done") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`loading-screen${phase === "leaving" ? " is-leaving" : ""}`}
      role="status"
      aria-label="Loading"
    >
      <div className="loading-light" aria-hidden="true" />
      <div
        className={`loading-content${phase === "preparing" ? "" : " is-ready"}`}
      >
        <div className="loading-cosmetics">
          {COSMETICS_FRAMES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={i === frame ? "is-active" : undefined}
            />
          ))}
        </div>
        <div
          className="loading-progress"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={step * 10}
        >
          {PROGRESS_FRAMES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={i === step ? "is-active" : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
