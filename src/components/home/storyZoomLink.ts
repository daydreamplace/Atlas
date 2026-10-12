import { useMediaQuery } from "./useMediaQuery";

/*
  Sections 1 and 2 play as one scroll-driven scene on large screens:

    1. the world map fills the screen while the aircraft crosses it,
    2. the FAKE / AUTHENTIC products take one half of the screen each,
    3. they leave and the map zooms in on Korea,
    4. the K-beauty section fades in over the zoomed map, with Korea on its
       globe where Korea on the map ended up.

  CounterfeitStorySection pins the map for ZOOM_LINK_SCENE_LENGTH screens.
  KBeautyStorySection is pulled up over the end of that scroll and pinned
  for the last ZOOM_LINK_ENTRANCE_LENGTH screens of it, so both release
  together. The timings of steps 1–3 are in styles/counterfeit-story.css.

  Smaller screens and reduced-motion users keep the two static sections.
*/
const ZOOM_LINK_QUERY =
  "(min-width: 1200px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";

export function useStoryZoomLink(): boolean {
  return useMediaQuery(ZOOM_LINK_QUERY);
}

/** Scroll distances, as fractions of the viewport height. */
export const ZOOM_LINK_SCENE_LENGTH = 3;
export const ZOOM_LINK_ENTRANCE_LENGTH = 0.5;

export type Point = { readonly x: number; readonly y: number };

// Korea on the pinned map layer (3:2), as a fraction of the layer. Matches
// the transform-origin in counterfeit-story.css.
export const MAP_KOREA: Point = { x: 0.817, y: 0.443 };
// Seoul on k-beauty/global-reach.webp (1254 × 1254).
export const GLOBE_KOREA: Point = { x: 575 / 1254, y: 425 / 1254 };
// Image tilt, matching the `rotate()` on .k-beauty-story__globe.
export const GLOBE_ROTATION_DEG = 1.2;

/** Point on an image box (object-fit: contain, rotated about its centre). */
export function pointOnImage(
  box: DOMRect,
  imageAspect: number,
  fraction: Point,
  rotationDeg: number,
): Point {
  const boxAspect = box.width / box.height;
  const width = boxAspect > imageAspect ? box.height * imageAspect : box.width;
  const height = width / imageAspect;
  const px = (fraction.x - 0.5) * width;
  const py = (fraction.y - 0.5) * height;
  const angle = (rotationDeg * Math.PI) / 180;
  return {
    x: box.left + box.width / 2 + px * Math.cos(angle) - py * Math.sin(angle),
    y: box.top + box.height / 2 + px * Math.sin(angle) + py * Math.cos(angle),
  };
}
