import { useEffect, useState } from "react";
import "./LoadingScreen.css";

import {
  ASSET_TIMEOUT_MS,
  COSMETICS_FRAME_MS,
  COSMETICS_FRAMES,
  FADE_MS,
  FILL_MS,
  FULL_HOLD_MS,
  MAX_WAIT_MS,
  PROGRESS_FRAMES,
} from "./config";

const LAST_STEP = PROGRESS_FRAMES.length - 1;

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
          aria-valuenow={Math.round((step / LAST_STEP) * 100)}
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
