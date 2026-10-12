import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import { getMainPageAssetUrl } from "../../utils/wikiAssets";
import "../../styles/k-beauty-story.css";
import { AuthenticityStamp } from "./AuthenticityStamp";
import { HandNote } from "./SectionExtras";
import {
  GLOBE_KOREA,
  GLOBE_ROTATION_DEG,
  ZOOM_LINK_ENTRANCE_LENGTH,
  pointOnImage,
  useStoryZoomLink,
  type Point,
} from "./storyZoomLink";
import { useScrollSteps } from "./useScrollSteps";

interface KBeautyStorySectionProps {
  readonly section: HomeSectionContent;
}

const kBeautyAssets = {
  seoulOrigin: getMainPageAssetUrl("k-beauty/seoul-origin.webp"),
  skincareCollection: getMainPageAssetUrl("k-beauty/skincare-collection.webp"),
  globalReach: getMainPageAssetUrl("k-beauty/global-reach.webp"),
  aircraft: getMainPageAssetUrl("counterfeit/aircraft.webp"),
  parcel: getMainPageAssetUrl("counterfeit/parcel.webp"),
  // The label the next section's phone scans (AuthenticationStorySection).
  qrLabel: getMainPageAssetUrl("authentication/qr-paper-v2.webp"),
} as const;

// Anchor points on the artwork, as fractions of each source image.
// Tip of N Seoul Tower on seoul-origin.webp (1536 × 1024).
const SEOUL_TOWER = { x: 962 / 1536, y: 150 / 1024 } as const;
// Image tilt, matching the `rotate()` on .k-beauty-story__seoul.
const SEOUL_ROTATION_DEG = -1.3;

const NODE_RADIUS = 6;
// Lines stop this far from a node so arrows do not run into the dots.
const NODE_GAP = NODE_RADIUS + 5;

function moveToward(from: Point, to: Point, distance: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x: from.x + (dx / length) * distance,
    y: from.y + (dy / length) * distance,
  };
}

interface RouteGeometry {
  readonly width: number;
  readonly height: number;
  readonly origin: Point;
  readonly korea: Point;
  readonly flowPath: string;
  readonly riskPath: string;
}

/**
 * Measures where Seoul Tower, Korea on the globe and the counterfeit parcels
 * are on screen (in artwork pixels) and builds the export / risk routes
 * between them, so the lines always start and end on the right spots.
 */
function useExportRoutes() {
  const artworkRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<HTMLDivElement>(null);
  const parcelsRef = useRef<HTMLDivElement>(null);
  const [routes, setRoutes] = useState<RouteGeometry | null>(null);

  useLayoutEffect(() => {
    const artwork = artworkRef.current;
    const originBox = originRef.current;
    const globe = globeRef.current;
    const parcels = parcelsRef.current;
    if (!artwork || !originBox || !globe || !parcels) return;

    const measure = () => {
      const a = artwork.getBoundingClientRect();
      if (!a.width || !a.height) return;
      const local = (p: Point): Point => ({ x: p.x - a.left, y: p.y - a.top });

      const origin = local(
        pointOnImage(
          originBox.getBoundingClientRect(),
          1536 / 1024,
          SEOUL_TOWER,
          SEOUL_ROTATION_DEG,
        ),
      );
      const korea = local(
        pointOnImage(
          globe.getBoundingClientRect(),
          1,
          GLOBE_KOREA,
          GLOBE_ROTATION_DEG,
        ),
      );
      const p = parcels.getBoundingClientRect();
      const parcel = local({ x: p.left + p.width * 0.45, y: p.top + 4 });

      // Seoul → Korea: leaves the tower upward/outward, arrives level.
      const dx = korea.x - origin.x;
      const dy = korea.y - origin.y;
      const c1 = { x: origin.x + dx * 0.35, y: origin.y + dy * 0.5 };
      const c2 = { x: korea.x - dx * 0.45, y: korea.y + dy * 0.05 };
      const flowStart = moveToward(origin, c1, NODE_GAP);
      const flowEnd = moveToward(korea, c2, NODE_GAP);

      // Korea → parcels: swings out to the side, then drops onto them.
      const rx = parcel.x - korea.x;
      const ry = parcel.y - korea.y;
      const r1 = { x: korea.x + rx * 0.7 + 40, y: korea.y + ry * 0.15 };
      const r2 = { x: parcel.x + 30, y: parcel.y - ry * 0.4 };
      const riskStart = moveToward(korea, r1, NODE_GAP);

      const n = (v: number) => v.toFixed(1);
      setRoutes({
        width: a.width,
        height: a.height,
        origin,
        korea,
        flowPath: `M${n(flowStart.x)} ${n(flowStart.y)} C${n(c1.x)} ${n(c1.y)} ${n(c2.x)} ${n(c2.y)} ${n(flowEnd.x)} ${n(flowEnd.y)}`,
        riskPath: `M${n(riskStart.x)} ${n(riskStart.y)} C${n(r1.x)} ${n(r1.y)} ${n(r2.x)} ${n(r2.y)} ${n(parcel.x)} ${n(parcel.y)}`,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    [artwork, originBox, globe, parcels].forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { artworkRef, originRef, globeRef, parcelsRef, routes };
}

// The QR label on the skincare group: its centre and width on the squeeze
// tube, as fractions of skincare-collection.webp. Matches the placement of
// .k-beauty-story__follow-qr in k-beauty-story.css.
const PRODUCT_QR = { x: 0.78, y: 0.44, width: 0.17 } as const;
// The group comes down to the middle of the screen, growing until it is
// this large (fractions of the viewport width / height, whichever is less).
const PRODUCT_LANDING_SIZE = { width: 0.42, height: 0.74 } as const;
// Tilt of the QR label in the next section's "QR reveal" step
// (.auth-sequence__token--qr in authentication-story.css).
const QR_TOKEN_ROTATION_DEG = -6;
// After landing, in screens of scroll: the products fade and the label
// moves beside the phone, growing into the next section's QR label; it is
// taken away once that
// section shows its own label (its second step starts 0.38 screens in).
const QR_GROW_LENGTH = 0.3;
const QR_HANDOFF = { from: 0.44, to: 0.54 } as const;

function documentTop(element: HTMLElement): number {
  let top = 0;
  for (
    let node: HTMLElement | null = element;
    node;
    node = node.offsetParent as HTMLElement | null
  ) {
    top += node.offsetTop;
  }
  return top;
}

/** Layout offset of an element inside a positioned ancestor. */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let left = 0;
  let top = 0;
  for (
    let node: HTMLElement | null = element;
    node && node !== ancestor;
    node = node.offsetParent as HTMLElement | null
  ) {
    left += node.offsetLeft;
    top += node.offsetTop;
  }
  return { left, top };
}

/**
 * Large screens: the skincare group stays on screen from this section into
 * the next one. It sits in a "lane" that starts with this section and ends
 * inside the next; a sticky, screen-sized view in the lane keeps it in
 * place while the page scrolls underneath. `--follow` (0 → 1) moves it from
 * its place here to the middle of the screen, growing. There the products
 * fade (`--product-out`) while the QR label on the tube travels to the next
 * section's QR label and grows to its size (`--qr-grow`); it is removed
 * again (`--qr-out`) once that section's own label is showing underneath.
 */
function useFollowingProduct({
  sectionRef,
  trackRef,
  laneRef,
  productRef,
  enabled,
}: {
  readonly sectionRef: RefObject<HTMLElement | null>;
  readonly trackRef: RefObject<HTMLElement | null>;
  readonly laneRef: RefObject<HTMLElement | null>;
  readonly productRef: RefObject<HTMLElement | null>;
  readonly enabled: boolean;
}) {
  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const lane = laneRef.current;
    const product = productRef.current;
    if (!enabled || !section || !track || !lane || !product) return;

    const next = section.nextElementSibling;
    const nextPin =
      next?.querySelector<HTMLElement>(".scroll-steps-pin") ?? null;
    const nextArtwork =
      next?.querySelector<HTMLElement>(".auth-sequence__artwork") ?? null;
    const qrToken =
      nextArtwork?.querySelector<HTMLElement>(".auth-sequence__token--qr") ??
      null;

    let frame = 0;
    let viewportHeight = window.innerHeight;
    // Scroll positions: this section starts scrolling away / the product has
    // landed (the next section is pinned).
    let start = 0;
    let landed = 0;

    const update = () => {
      frame = 0;
      const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
      const follow = clamp((window.scrollY - start) / (landed - start));
      // Screens scrolled since landing.
      const after = (window.scrollY - landed) / viewportHeight;
      const grow = clamp(after / QR_GROW_LENGTH);
      const productOut = clamp((after - 0.06) / (QR_GROW_LENGTH - 0.1));
      const qrOut = clamp(
        (after - QR_HANDOFF.from) / (QR_HANDOFF.to - QR_HANDOFF.from),
      );
      lane.style.setProperty("--follow", follow.toFixed(4));
      lane.style.setProperty("--qr-grow", grow.toFixed(4));
      lane.style.setProperty("--product-out", productOut.toFixed(4));
      lane.style.setProperty("--qr-out", qrOut.toFixed(4));
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const layout = () => {
      viewportHeight = window.innerHeight;
      const trackTop = documentTop(track);
      start = trackTop + viewportHeight * ZOOM_LINK_ENTRANCE_LENGTH;

      const nextTrack = nextPin?.parentElement ?? null;
      const nextPinTop = nextPin ? parseFloat(nextPin.style.top) || 0 : 0;
      landed = nextTrack
        ? documentTop(nextTrack) - nextPinTop
        : documentTop(section) + section.offsetHeight - viewportHeight * 0.5;
      landed = Math.max(landed, start + 1);
      const end = landed + viewportHeight * QR_HANDOFF.to;

      lane.style.top = `${track.offsetTop}px`;
      lane.style.height = `${end - trackTop + viewportHeight}px`;

      // Landing pose, relative to the product's place in this section: in
      // the middle of the screen, larger than it set off.
      const width = product.offsetWidth;
      const height = product.offsetHeight;
      const home = {
        x: product.offsetLeft + width / 2,
        y: product.offsetTop + height / 2,
      };
      const scale = Math.min(
        (window.innerWidth * PRODUCT_LANDING_SIZE.width) / width,
        (viewportHeight * PRODUCT_LANDING_SIZE.height) / height,
      );
      const target = { x: window.innerWidth / 2, y: viewportHeight * 0.48 };
      lane.style.setProperty("--follow-x", (target.x - home.x).toFixed(1));
      lane.style.setProperty("--follow-y", (target.y - home.y).toFixed(1));
      lane.style.setProperty("--follow-scale", scale.toFixed(4));

      // From there the QR label travels to the next section's QR label and
      // grows to its size. That section's artwork is centred on screen at
      // this point (`--demo-center-shift`, see AuthenticationStorySection).
      const labelWidth = PRODUCT_QR.width * width * scale;
      const from = {
        x: target.x + (PRODUCT_QR.x - 0.5) * width * scale,
        y: target.y + (PRODUCT_QR.y - 0.5) * height * scale,
      };
      let to = { x: target.x, y: target.y, width: labelWidth * 3 };
      if (nextPin && nextArtwork && qrToken) {
        const shift =
          parseFloat(
            getComputedStyle(nextPin).getPropertyValue("--demo-center-shift"),
          ) || 0;
        // Layout position of the token in the pinned section (the pin spans
        // the section's content box; neither moves sideways).
        const tokenLeft =
          nextPin.getBoundingClientRect().left +
          offsetWithin(qrToken, nextPin).left;
        const tokenTop = nextPinTop + offsetWithin(qrToken, nextPin).top;
        // The token's art is a square above its caption, and the token is
        // tilted about its own centre.
        const art = qrToken.offsetWidth;
        const lift = (qrToken.offsetHeight - art) / 2;
        const angle = (QR_TOKEN_ROTATION_DEG * Math.PI) / 180;
        to = {
          x: tokenLeft + shift + art / 2 + lift * Math.sin(angle),
          y: tokenTop + qrToken.offsetHeight / 2 - lift * Math.cos(angle),
          width: art,
        };
      }
      // In the group's own (scaled) coordinates.
      lane.style.setProperty("--qr-x", ((to.x - from.x) / scale).toFixed(1));
      lane.style.setProperty("--qr-y", ((to.y - from.y) / scale).toFixed(1));
      lane.style.setProperty("--qr-scale", (to.width / labelWidth).toFixed(4));
      requestUpdate();
    };

    layout();
    const observer = new ResizeObserver(layout);
    [document.body, track, nextPin, nextArtwork, qrToken].forEach((element) => {
      if (element) observer.observe(element);
    });
    window.addEventListener("resize", layout);
    window.addEventListener("scroll", requestUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", layout);
      window.removeEventListener("scroll", requestUpdate);
    };
  }, [enabled, laneRef, productRef, sectionRef, trackRef]);
}

export function KBeautyStorySection({ section }: KBeautyStorySectionProps) {
  const titleId = `${section.id}-title`;
  const { artworkRef, originRef, globeRef, parcelsRef, routes } =
    useExportRoutes();
  // On large screens the section fades in over the zoomed-in world map of
  // the section before it (see storyZoomLink.ts).
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const isZoomLinked = useStoryZoomLink();
  useScrollSteps({
    trackRef,
    pinRef,
    progressRef: sectionRef,
    stepCount: 1,
    enabled: isZoomLinked,
    stepLength: ZOOM_LINK_ENTRANCE_LENGTH,
    align: "top",
  });
  // …and the skincare group follows the reader down into the next section.
  const laneRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  useFollowingProduct({
    sectionRef,
    trackRef,
    laneRef,
    productRef,
    enabled: isZoomLinked,
  });

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className="home-section home-story-section home-story-section--k-beauty-challenge k-beauty-story"
      data-home-section={section.id}
      data-section-number={section.number}
      aria-labelledby={titleId}
      data-zoom-linked={isZoomLinked ? "true" : "false"}
      style={
        {
          "--zoom-link-entrance": ZOOM_LINK_ENTRANCE_LENGTH,
        } as CSSProperties
      }
    >
      <div
        ref={trackRef}
        className="scroll-steps-track"
        data-scroll-driven={isZoomLinked ? "true" : "false"}
      >
        <div ref={pinRef} className="k-beauty-story__pin scroll-steps-pin">
          <div className="k-beauty-story__inner">
            <div className="k-beauty-story__content">
              <h2
                id={titleId}
                className="home-story-section__title k-beauty-story__title"
              >
                {section.title}
              </h2>
              <p className="home-story-section__body k-beauty-story__body">
                {section.body}
              </p>
              <HandNote sectionNumber={section.number} />
            </div>

            <div
              ref={artworkRef}
              className="k-beauty-story__artwork"
              role="img"
              aria-label="K-beauty begins in Seoul, reaches consumers through global air routes, and faces counterfeit parcels alongside its growing skincare market."
            >
              <div
                ref={originRef}
                className="k-beauty-story__origin"
                data-art-piece="seoul-origin"
              >
                <img
                  className="k-beauty-story__asset k-beauty-story__seoul"
                  src={kBeautyAssets.seoulOrigin}
                  alt=""
                  width="1536"
                  height="1024"
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div
                ref={globeRef}
                className="k-beauty-story__global"
                data-art-piece="global-reach"
              >
                <img
                  className="k-beauty-story__asset k-beauty-story__globe"
                  src={kBeautyAssets.globalReach}
                  alt=""
                  width="1254"
                  height="1254"
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="k-beauty-story__asset k-beauty-story__aircraft"
                  data-art-piece="export-aircraft"
                  src={kBeautyAssets.aircraft}
                  alt=""
                  width="1672"
                  height="941"
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div
                className="k-beauty-story__market-risk"
                data-art-piece="skincare-and-counterfeit-risk"
              >
                {isZoomLinked ? null : (
                  <div
                    className="k-beauty-story__skincare-stage"
                    data-art-piece="skincare-collection"
                  >
                    <img
                      className="k-beauty-story__asset k-beauty-story__skincare"
                      src={kBeautyAssets.skincareCollection}
                      alt=""
                      width="1305"
                      height="1206"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                )}

                <div
                  ref={parcelsRef}
                  className="k-beauty-story__parcel-cluster"
                  data-art-piece="counterfeit-parcels"
                >
                  <img
                    className="k-beauty-story__asset k-beauty-story__parcel k-beauty-story__parcel--one"
                    src={kBeautyAssets.parcel}
                    alt=""
                    width="1536"
                    height="1024"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="k-beauty-story__asset k-beauty-story__parcel k-beauty-story__parcel--two"
                    src={kBeautyAssets.parcel}
                    alt=""
                    width="1536"
                    height="1024"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="k-beauty-story__asset k-beauty-story__parcel k-beauty-story__parcel--three"
                    src={kBeautyAssets.parcel}
                    alt=""
                    width="1536"
                    height="1024"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="k-beauty-story__fake-stamp"
                    data-art-piece="fake-warning"
                  >
                    <AuthenticityStamp variant="fake" />
                  </div>
                </div>
              </div>

              {routes ? (
                <svg
                  className="k-beauty-story__export-route"
                  data-art-piece="global-export-route"
                  viewBox={`0 0 ${routes.width} ${routes.height}`}
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <marker
                      id="k-beauty-export-arrow"
                      markerWidth="9"
                      markerHeight="9"
                      refX="7"
                      refY="4.5"
                      orient="auto"
                      markerUnits="strokeWidth"
                    >
                      <path d="M0 0 9 4.5 0 9l2.4-4.5Z" />
                    </marker>
                  </defs>
                  <path
                    className="k-beauty-story__route-track"
                    d={routes.flowPath}
                  />
                  <path
                    className="k-beauty-story__route-flow"
                    d={routes.flowPath}
                    markerEnd="url(#k-beauty-export-arrow)"
                  />
                  <path
                    className="k-beauty-story__route-track k-beauty-story__route-track--risk"
                    d={routes.riskPath}
                  />
                  <path
                    className="k-beauty-story__route-flow k-beauty-story__route-flow--risk"
                    d={routes.riskPath}
                    markerEnd="url(#k-beauty-export-arrow)"
                  />
                  <circle
                    className="k-beauty-story__route-node k-beauty-story__route-node--origin"
                    cx={routes.origin.x}
                    cy={routes.origin.y}
                    r={NODE_RADIUS}
                  />
                  <circle
                    className="k-beauty-story__route-node k-beauty-story__route-node--reach"
                    cx={routes.korea.x}
                    cy={routes.korea.y}
                    r={NODE_RADIUS}
                  />
                </svg>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {isZoomLinked ? (
        <div
          ref={laneRef}
          className="k-beauty-story__follow-lane"
          aria-hidden="true"
        >
          <div className="k-beauty-story__follow-view">
            <div ref={productRef} className="k-beauty-story__follow-product">
              <img
                className="k-beauty-story__asset k-beauty-story__follow-skincare"
                data-art-piece="skincare-collection"
                src={kBeautyAssets.skincareCollection}
                alt=""
                width="1305"
                height="1206"
                draggable="false"
                decoding="async"
              />
              <img
                className="k-beauty-story__asset k-beauty-story__follow-qr"
                data-art-piece="qr-label"
                src={kBeautyAssets.qrLabel}
                alt=""
                width="1254"
                height="1254"
                draggable="false"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
