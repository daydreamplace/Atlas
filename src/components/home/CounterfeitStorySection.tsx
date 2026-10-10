import type { HomeSectionContent } from "../../data/homeContent";
import "../../styles/counterfeit-story.css";
import { AuthenticityStamp } from "./AuthenticityStamp";
import { SupplyRoute } from "./SupplyRoute";
import { useInteractiveScene } from "../../hooks/useInteractiveScene";

interface CounterfeitStorySectionProps {
  readonly section: HomeSectionContent;
}

const COUNTERFEIT_ASSET_PATH = "images/main-page/counterfeit";

function getBaseAwareImageUrl(fileName: string): string {
  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${baseUrl}${COUNTERFEIT_ASSET_PATH}/${fileName}`;
}

const counterfeitAssets = {
  worldMap: getBaseAwareImageUrl("world-map.webp"),
  aircraft: getBaseAwareImageUrl("aircraft.webp"),
  cargoShip: getBaseAwareImageUrl("cargo-ship.webp"),
  parcel: getBaseAwareImageUrl("parcel.webp"),
  market: getBaseAwareImageUrl("market.webp"),
  productSamples: getBaseAwareImageUrl("product-samples.webp"),
  researchPaper: getBaseAwareImageUrl("research-paper.webp"),
} as const;

export function CounterfeitStorySection({
  section,
}: CounterfeitStorySectionProps) {
  const titleId = `${section.id}-title`;
  const { targetRef, isInView } = useInteractiveScene<HTMLElement>();

  return (
    <section
      ref={targetRef}
      id={section.id}
      className="home-section home-story-section home-story-section--global-counterfeit-problem counterfeit-story"
      data-home-section={section.id}
      data-section-number={section.number}
      aria-labelledby={titleId}
      data-scene-active={isInView ? "true" : "false"}
    >
      <div className="counterfeit-story__inner">
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
        </div>

        <div
          className="counterfeit-story__artwork"
          role="img"
          aria-label="A world map traces counterfeit cosmetics and pharmaceuticals through international air and sea freight, parcels, and online and offline markets, ending with fake and authentic products that look alike."
        >
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

          <div className="counterfeit-story__freight" data-art-piece="freight">
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
    </section>
  );
}
