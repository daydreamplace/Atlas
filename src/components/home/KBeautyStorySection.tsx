import { useLayoutEffect, useRef, useState } from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import "../../styles/k-beauty-story.css";
import { AuthenticityStamp } from "./AuthenticityStamp";

interface KBeautyStorySectionProps {
  readonly section: HomeSectionContent;
}

function getBaseAwareImageUrl(assetPath: string): string {
  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${baseUrl}${assetPath.replace(/^\/+/, "")}`;
}

const kBeautyAssets = {
  seoulOrigin: getBaseAwareImageUrl(
    "images/main-page/k-beauty/seoul-origin.webp",
  ),
  skincareCollection: getBaseAwareImageUrl(
    "images/main-page/k-beauty/skincare-collection.webp",
  ),
  globalReach: getBaseAwareImageUrl(
    "images/main-page/k-beauty/global-reach.webp",
  ),
  aircraft: getBaseAwareImageUrl("images/main-page/counterfeit/aircraft.webp"),
  parcel: getBaseAwareImageUrl("images/main-page/counterfeit/parcel.webp"),
} as const;

// Anchor points on the artwork, as fractions of each source image.
// Seoul on global-reach.webp (1254 × 1254).
const GLOBE_KOREA = { x: 575 / 1254, y: 425 / 1254 } as const;
// Tip of N Seoul Tower on seoul-origin.webp (1536 × 1024).
const SEOUL_TOWER = { x: 962 / 1536, y: 150 / 1024 } as const;
// Image tilts, matching the `rotate()` on .k-beauty-story__globe / __seoul.
const GLOBE_ROTATION_DEG = 1.2;
const SEOUL_ROTATION_DEG = -1.3;

const NODE_RADIUS = 6;
// Lines stop this far from a node so arrows do not run into the dots.
const NODE_GAP = NODE_RADIUS + 5;

type Point = { readonly x: number; readonly y: number };

/** Point on an image box (object-fit: contain, rotated about its centre). */
function pointOnImage(
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

export function KBeautyStorySection({ section }: KBeautyStorySectionProps) {
  const titleId = `${section.id}-title`;
  const { artworkRef, originRef, globeRef, parcelsRef, routes } =
    useExportRoutes();

  return (
    <section
      id={section.id}
      className="home-section home-story-section home-story-section--k-beauty-challenge k-beauty-story"
      data-home-section={section.id}
      data-section-number={section.number}
      aria-labelledby={titleId}
    >
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
    </section>
  );
}
