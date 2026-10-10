import { Fragment, useRef, type CSSProperties } from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import { CounterfeitStorySection } from "./CounterfeitStorySection";
import { KBeautyStorySection } from "./KBeautyStorySection";
import { AuthenticationStorySection } from "./AuthenticationStorySection";
import { LimitationsStorySection } from "./LimitationsStorySection";
import { useMediaQuery } from "./useMediaQuery";
import { useRevealOnScroll } from "./useRevealOnScroll";
import { useScrollSteps } from "./useScrollSteps";

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

  return <GenericStorySection section={section} />;
}

// Each section arrives a little differently (see styles/reveal.css).
const REVEAL_VARIANTS: Partial<
  Record<
    HomeSectionContent["number"],
    { art: string; title: "words" | "mask"; body: "fade" | "side" }
  >
> = {
  5: { art: "zoom", title: "words", body: "fade" },
  6: { art: "iris", title: "mask", body: "side" },
  7: { art: "drift", title: "words", body: "fade" },
  8: { art: "focus", title: "mask", body: "side" },
  9: { art: "zoom", title: "words", body: "side" },
  10: { art: "focus", title: "mask", body: "fade" },
};

// Sections shown as a pinned, scroll-driven reveal on large screens: the art
// grows out of the dark first, then the text comes in (styles/reveal.css).
const PINNED_REVEAL_SECTIONS: ReadonlySet<number> = new Set([9]);
const PINNED_REVEAL_QUERY =
  "(min-width: 1021px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

function GenericStorySection({ section }: HomeStorySectionProps) {
  const revealRef = useRevealOnScroll<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const isPinnedReveal =
    useMediaQuery(PINNED_REVEAL_QUERY) &&
    PINNED_REVEAL_SECTIONS.has(section.number);
  useScrollSteps({
    trackRef,
    pinRef,
    stepCount: 1,
    enabled: isPinnedReveal,
    stepLength: 1.5,
    align: "top",
  });
  const titleId = `${section.id}-title`;
  const closingLines = section.number === 10 ? section.body.split("\n") : [];
  const imageUrl = section.imagePath
    ? getBaseAwareImageUrl(section.imagePath)
    : undefined;
  const reveal = REVEAL_VARIANTS[section.number] ?? {
    art: "zoom",
    title: "words",
    body: "fade",
  };
  const titleWords = section.title.split(" ");

  return (
    <section
      ref={revealRef}
      id={section.id}
      className={`home-section home-story-section home-story-section--${section.layout} home-story-section--${section.id}`}
      data-home-section={section.id}
      data-section-number={section.number}
      data-reveal-art={isPinnedReveal ? "pinned" : reveal.art}
      data-reveal-title={isPinnedReveal ? "pinned" : reveal.title}
      data-reveal-body={isPinnedReveal ? "pinned" : reveal.body}
      aria-labelledby={titleId}
    >
      <div
        ref={trackRef}
        className="scroll-steps-track"
        data-scroll-driven={isPinnedReveal ? "true" : "false"}
      >
        <div
          ref={pinRef}
          className="home-story-section__inner scroll-steps-pin"
        >
          <div className="home-story-section__content">
            <h2
              id={titleId}
              className="home-story-section__title reveal-text reveal-title"
              style={{ "--reveal-delay": "150ms" } as CSSProperties}
            >
              {reveal.title === "words" || isPinnedReveal
                ? titleWords.map((word, index) => (
                    <Fragment key={`${word}-${index}`}>
                      {index > 0 ? " " : null}
                      <span
                        className="reveal-word"
                        style={{ "--word-index": index } as CSSProperties}
                      >
                        {word}
                      </span>
                    </Fragment>
                  ))
                : section.title}
            </h2>

            {section.number === 10 ? (
              <p
                className="home-story-section__body home-story-section__body--closing reveal-text reveal-body"
                style={{ "--reveal-delay": "380ms" } as CSSProperties}
              >
                <span className="home-story-section__closing-statement">
                  {closingLines[0]}
                </span>
                <br />
                <span className="home-story-section__closing-tagline">
                  {closingLines[1]}
                </span>
              </p>
            ) : (
              <p
                className="home-story-section__body reveal-text reveal-body"
                style={{ "--reveal-delay": "380ms" } as CSSProperties}
              >
                {section.body}
              </p>
            )}
          </div>

          {imageUrl ? (
            <div
              className="home-story-section__media reveal-art"
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
      </div>
    </section>
  );
}
