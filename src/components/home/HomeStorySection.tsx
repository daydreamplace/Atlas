import type { CSSProperties } from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import { CounterfeitStorySection } from "./CounterfeitStorySection";
import { KBeautyStorySection } from "./KBeautyStorySection";
import { AuthenticationStorySection } from "./AuthenticationStorySection";
import { LimitationsStorySection } from "./LimitationsStorySection";

interface HomeStorySectionProps {
  section: HomeSectionContent;
}

function getBaseAwareImageUrl(imagePath: string) {
  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${baseUrl}${imagePath.replace(/^\/+/, "")}`;
}

export function HomeStorySection({ section }: HomeStorySectionProps) {
  if (section.number === 1) {
    return <CounterfeitStorySection section={section} />;
  }

  if (section.number === 2) {
    return <KBeautyStorySection section={section} />;
  }

  if (section.number === 3) {
    return <AuthenticationStorySection section={section} />;
  }

  if (section.number === 4) {
    return <LimitationsStorySection section={section} />;
  }

  const titleId = `${section.id}-title`;
  const closingLines = section.number === 10 ? section.body.split("\n") : [];
  const imageUrl = section.imagePath
    ? getBaseAwareImageUrl(section.imagePath)
    : undefined;

  return (
    <section
      id={section.id}
      className={`home-section home-story-section home-story-section--${section.layout} home-story-section--${section.id}`}
      data-home-section={section.id}
      data-section-number={section.number}
      aria-labelledby={titleId}
    >
      <div className="home-story-section__inner">
        <div className="home-story-section__content">
          <h2 id={titleId} className="home-story-section__title">
            {section.title}
          </h2>

          {section.number === 10 ? (
            <p className="home-story-section__body home-story-section__body--closing">
              <span className="home-story-section__closing-statement">
                {closingLines[0]}
              </span>
              <br />
              <span className="home-story-section__closing-tagline">
                {closingLines[1]}
              </span>
            </p>
          ) : (
            <p className="home-story-section__body">{section.body}</p>
          )}
        </div>

        {imageUrl ? (
          <div
            className="home-story-section__media"
            style={
              { "--home-art-image": `url("${imageUrl}")` } as CSSProperties
            }
            aria-hidden="true"
          >
            <img
              className="home-story-section__image home-story-section__image--base"
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <div className="home-story-section__fragments">
              <span className="home-story-section__fragment home-story-section__fragment--a" />
              <span className="home-story-section__fragment home-story-section__fragment--b" />
              <span className="home-story-section__fragment home-story-section__fragment--c" />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
