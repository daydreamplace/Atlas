import { useEffect, useRef } from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import "../../styles/counterfeit-story.css";
import { AuthenticityStamp } from "./AuthenticityStamp";
import { SupplyRoute } from "./SupplyRoute";
import { useInteractiveScene } from "../../hooks/useInteractiveScene";
import { getMainPageAssetUrl } from "../../utils/wikiAssets";
import { HandNote } from "./SectionExtras";
import {
  GLOBE_KOREA,
  GLOBE_ROTATION_DEG,
  MAP_KOREA,
  ZOOM_LINK_SCENE_LENGTH,
  pointOnImage,
  useStoryZoomLink,
} from "./storyZoomLink";
import { useScrollSteps } from "./useScrollSteps";

interface CounterfeitStorySectionProps {
  readonly section: HomeSectionContent;
}

const counterfeitAssets = {
  worldMap: getMainPageAssetUrl("counterfeit/world-map.webp"),
  aircraft: getMainPageAssetUrl("counterfeit/aircraft.webp"),
  cargoShip: getMainPageAssetUrl("counterfeit/cargo-ship.webp"),
  parcel: getMainPageAssetUrl("counterfeit/parcel.webp"),
  market: getMainPageAssetUrl("counterfeit/market.webp"),
  productSamples: getMainPageAssetUrl("counterfeit/product-samples.webp"),
  researchPaper: getMainPageAssetUrl("counterfeit/research-paper.webp"),
} as const;

export function CounterfeitStorySection({
  section,
}: CounterfeitStorySectionProps) {
  const titleId = `${section.id}-title`;
  const { targetRef, isInView } = useInteractiveScene<HTMLElement>();
  // Large screens: the map is pinned and scrolls through map → products →
  // zoom on Korea, handing over to the K-beauty section (storyZoomLink.ts).
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mapLayerRef = useRef<HTMLDivElement>(null);
  const isZoomLinked = useStoryZoomLink();
  useScrollSteps({
    trackRef,
    pinRef,
    stepCount: 1,
    enabled: isZoomLinked,
    stepLength: ZOOM_LINK_SCENE_LENGTH,
    align: "top",
  });

  // How far Korea on the map has to travel during the zoom to end up on
  // Korea on the K-beauty globe (where that section is pinned on entry).
  useEffect(() => {
    const pin = pinRef.current;
    const layer = mapLayerRef.current;
    if (!isZoomLinked || !pin || !layer) return;

    const nextPin = document.querySelector<HTMLElement>(".k-beauty-story__pin");
    const globe =
      nextPin?.querySelector<HTMLElement>(".k-beauty-story__global") ?? null;

    const measure = () => {
      const rest = {
        x: layer.offsetLeft + layer.offsetWidth * MAP_KOREA.x,
        y: layer.offsetTop + layer.offsetHeight * MAP_KOREA.y,
      };
      let target = { x: pin.offsetWidth * 0.75, y: pin.offsetHeight * 0.36 };
      if (nextPin && globe) {
        const origin = nextPin.getBoundingClientRect();
        const korea = pointOnImage(
          globe.getBoundingClientRect(),
          1,
          GLOBE_KOREA,
          GLOBE_ROTATION_DEG,
        );
        // Both pins sit at the top of the screen then; only this one is
        // full-bleed, so x is taken against it.
        target = {
          x: korea.x - pin.getBoundingClientRect().left,
          y: korea.y - origin.top,
        };
      }
      pin.style.setProperty("--korea-shift-x", (target.x - rest.x).toFixed(1));
      pin.style.setProperty("--korea-shift-y", (target.y - rest.y).toFixed(1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pin);
    if (globe) observer.observe(globe);
    return () => {
      observer.disconnect();
      pin.style.removeProperty("--korea-shift-x");
      pin.style.removeProperty("--korea-shift-y");
    };
  }, [isZoomLinked]);

  return (
    <section
      ref={targetRef}
      id={section.id}
      className="home-section home-story-section home-story-section--global-counterfeit-problem counterfeit-story"
      data-home-section={section.id}
      data-section-number={section.number}
      aria-labelledby={titleId}
      data-scene-active={isInView ? "true" : "false"}
      data-zoom-linked={isZoomLinked ? "true" : "false"}
    >
      <div
        ref={trackRef}
        className="scroll-steps-track"
        data-scroll-driven={isZoomLinked ? "true" : "false"}
      >
        <div ref={pinRef} className="counterfeit-story__inner scroll-steps-pin">
          <div className="home-story-section__content counterfeit-story__content">
            <h2
              id={titleId}
              className="home-story-section__title counterfeit-story__title"
            >
              {section.title}
            </h2>
            <p className="home-story-section__body counterfeit-story__body">
              {section.body}
            </p>
            <HandNote sectionNumber={section.number} />
          </div>

          <div
            className="counterfeit-story__artwork"
            role="img"
            aria-label="A world map traces counterfeit cosmetics and pharmaceuticals through international air and sea freight, parcels, and online and offline markets, ending with fake and authentic products that look alike."
          >
            <div ref={mapLayerRef} className="counterfeit-story__map-layer">
              <div
                className="counterfeit-story__map-stage"
                data-art-piece="world-map"
              >
                <img
                  className="counterfeit-story__asset counterfeit-story__paper counterfeit-story__paper--map"
                  src={counterfeitAssets.researchPaper}
                  alt=""
                  draggable="false"
                  decoding="async"
                />
                <img
                  className="counterfeit-story__asset counterfeit-story__world-map"
                  src={counterfeitAssets.worldMap}
                  alt=""
                  draggable="false"
                  decoding="async"
                />
              </div>

              <div
                className="counterfeit-story__routes"
                data-art-piece="international-route"
                aria-hidden="true"
              >
                <SupplyRoute
                  className="counterfeit-story__route counterfeit-story__route--desktop"
                  variant="desktop"
                />
                <SupplyRoute
                  className="counterfeit-story__route counterfeit-story__route--mobile"
                  variant="mobile"
                />
              </div>

              <div
                className="counterfeit-story__freight"
                data-art-piece="freight"
              >
                <img
                  className="counterfeit-story__asset counterfeit-story__aircraft"
                  data-art-piece="aircraft"
                  src={counterfeitAssets.aircraft}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="counterfeit-story__asset counterfeit-story__cargo-ship"
                  data-art-piece="cargo-ship"
                  src={counterfeitAssets.cargoShip}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  className="counterfeit-story__asset counterfeit-story__parcel"
                  data-art-piece="parcel"
                  src={counterfeitAssets.parcel}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div
                className="counterfeit-story__market-stage"
                data-art-piece="market"
              >
                <img
                  className="counterfeit-story__asset counterfeit-story__market"
                  src={counterfeitAssets.market}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <span
                className="counterfeit-story__korea-marker"
                aria-hidden="true"
              />
            </div>

            <div
              className="counterfeit-story__product-comparison"
              data-art-piece="product-comparison"
            >
              <div
                className="counterfeit-story__product-group counterfeit-story__product-group--fake"
                data-art-piece="fake-products"
              >
                <img
                  className="counterfeit-story__asset counterfeit-story__paper counterfeit-story__paper--product"
                  src={counterfeitAssets.researchPaper}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                <div className="counterfeit-story__stamp counterfeit-story__stamp--fake">
                  <AuthenticityStamp variant="fake" />
                </div>
                <img
                  className="counterfeit-story__asset counterfeit-story__product-samples"
                  src={counterfeitAssets.productSamples}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div
                className="counterfeit-story__product-group counterfeit-story__product-group--authentic"
                data-art-piece="authentic-products"
              >
                <img
                  className="counterfeit-story__asset counterfeit-story__paper counterfeit-story__paper--product"
                  src={counterfeitAssets.researchPaper}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
                <div className="counterfeit-story__stamp counterfeit-story__stamp--authentic">
                  <AuthenticityStamp variant="authentic" />
                </div>
                <img
                  className="counterfeit-story__asset counterfeit-story__product-samples"
                  src={counterfeitAssets.productSamples}
                  alt=""
                  draggable="false"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
