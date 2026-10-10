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

export function KBeautyStorySection({ section }: KBeautyStorySectionProps) {
  const titleId = `${section.id}-title`;

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
          className="k-beauty-story__artwork"
          role="img"
          aria-label="K-beauty begins in Seoul, reaches consumers through global air routes, and faces counterfeit parcels alongside its growing skincare market."
        >
          <div className="k-beauty-story__origin" data-art-piece="seoul-origin">
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

          <div className="k-beauty-story__global" data-art-piece="global-reach">
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

          <svg
            className="k-beauty-story__export-route k-beauty-story__export-route--desktop"
            data-art-piece="global-export-route"
            viewBox="0 0 1000 760"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <marker
                id="k-beauty-export-arrow-desktop"
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
              d="M165 608 C310 506 420 334 610 228 S790 140 878 166"
            />
            <path
              className="k-beauty-story__route-flow"
              d="M165 608 C310 506 420 334 610 228 S790 140 878 166"
              markerEnd="url(#k-beauty-export-arrow-desktop)"
            />
            <path
              className="k-beauty-story__route-track k-beauty-story__route-track--risk"
              d="M858 184 C932 286 928 430 850 610"
            />
            <path
              className="k-beauty-story__route-flow k-beauty-story__route-flow--risk"
              d="M858 184 C932 286 928 430 850 610"
              markerEnd="url(#k-beauty-export-arrow-desktop)"
            />
            <circle
              className="k-beauty-story__route-node k-beauty-story__route-node--origin"
              cx="165"
              cy="608"
              r="6"
            />
            <circle
              className="k-beauty-story__route-node k-beauty-story__route-node--reach"
              cx="878"
              cy="166"
              r="6"
            />
          </svg>

          <svg
            className="k-beauty-story__export-route k-beauty-story__export-route--mobile"
            data-art-piece="global-export-route-mobile"
            viewBox="0 0 360 780"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <marker
                id="k-beauty-export-arrow-mobile"
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
              d="M84 126 C286 178 302 304 184 390 S62 574 246 690"
            />
            <path
              className="k-beauty-story__route-flow"
              d="M84 126 C286 178 302 304 184 390 S62 574 246 690"
              markerEnd="url(#k-beauty-export-arrow-mobile)"
            />
            <circle
              className="k-beauty-story__route-node k-beauty-story__route-node--origin"
              cx="84"
              cy="126"
              r="5"
            />
            <circle
              className="k-beauty-story__route-node k-beauty-story__route-node--reach"
              cx="184"
              cy="390"
              r="5"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
