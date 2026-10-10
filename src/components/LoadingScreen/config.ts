// Everything you may want to tweak for the splash screen lives here.

const LOADING_ASSET_BASE =
  "https://static.igem.wiki/teams/6479/wiki/loading";

/** Drawings that alternate in a loop. */
export const COSMETICS_FRAMES = [
  `${LOADING_ASSET_BASE}/cosmetics-1.webp`,
  `${LOADING_ASSET_BASE}/cosmetics-2.webp`,
];

/** Progress bar images, from empty to full, in equal steps. */
export const PROGRESS_FRAMES = [
  `${LOADING_ASSET_BASE}/progress-000.webp`,
  `${LOADING_ASSET_BASE}/progress-010.webp`,
  `${LOADING_ASSET_BASE}/progress-020.webp`,
  `${LOADING_ASSET_BASE}/progress-030.webp`,
  `${LOADING_ASSET_BASE}/progress-040.webp`,
  `${LOADING_ASSET_BASE}/progress-050.webp`,
  `${LOADING_ASSET_BASE}/progress-060.webp`,
  `${LOADING_ASSET_BASE}/progress-070.webp`,
  `${LOADING_ASSET_BASE}/progress-080.webp`,
  `${LOADING_ASSET_BASE}/progress-090.webp`,
  `${LOADING_ASSET_BASE}/progress-100.webp`,
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
