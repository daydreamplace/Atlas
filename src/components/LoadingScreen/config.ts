// Everything you may want to tweak for the splash screen lives here.

// TODO: iGEM requires images to be served from static.igem.wiki.
// Upload src/assets/loading/* with the uploads tool, then replace these
// imports with the resulting https://static.igem.wiki/... URLs.
import cosmetics1 from "../../assets/loading/cosmetics-1.webp";
import cosmetics2 from "../../assets/loading/cosmetics-2.webp";
import progress000 from "../../assets/loading/progress-000.webp";
import progress010 from "../../assets/loading/progress-010.webp";
import progress020 from "../../assets/loading/progress-020.webp";
import progress030 from "../../assets/loading/progress-030.webp";
import progress040 from "../../assets/loading/progress-040.webp";
import progress050 from "../../assets/loading/progress-050.webp";
import progress060 from "../../assets/loading/progress-060.webp";
import progress070 from "../../assets/loading/progress-070.webp";
import progress080 from "../../assets/loading/progress-080.webp";
import progress090 from "../../assets/loading/progress-090.webp";
import progress100 from "../../assets/loading/progress-100.webp";

/** Drawings that alternate in a loop. */
export const COSMETICS_FRAMES = [cosmetics1, cosmetics2];

/** Progress bar images, from empty to full, in equal steps. */
export const PROGRESS_FRAMES = [
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

// --- Timing (all in ms) ---------------------------------------------------
// How long each cosmetics drawing stays on screen before swapping. Two
// hand-drawn frames read as a gentle "boil" around 350–400ms; below ~250ms
// it starts to look like flicker.
export const COSMETICS_FRAME_MS = 380;
// Time for the bar to fill to the second-to-last step. The bar then waits
// there until the page has finished loading.
export const FILL_MS = 2000;
// How long the full bar stays visible before fading out.
export const FULL_HOLD_MS = 350;
// Fade-out duration; keep in sync with `.loading-screen` transition in CSS.
export const FADE_MS = 500;
// Safety net: never block the site longer than this, even if `load` never fires.
export const MAX_WAIT_MS = 8000;
// Give up waiting for the loader's own images after this long.
export const ASSET_TIMEOUT_MS = 2500;
