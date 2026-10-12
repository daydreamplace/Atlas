import { useRef, type CSSProperties } from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import type { FocusTour } from "../../data/homeTours";
import "../../styles/focus-tour.css";
import { HandNote, SpectrumFigure } from "./SectionExtras";
import { useScrollSteps } from "./useScrollSteps";

interface FocusTourSectionProps {
  readonly section: HomeSectionContent;
  readonly tour: FocusTour;
  readonly imageUrl: string;
}

// Scroll distance per step, in screens.
const STEP_LENGTH = 0.5;
const WHOLE_ARTWORK = { x: 0.5, y: 0.5, zoom: 1 } as const;

/**
 * A story section as a pinned, scroll-driven tour of its artwork. It opens
 * on the whole picture with the section text; each further step moves in on
 * one detail of the picture and swaps the text for that step's caption.
 * (Small screens and reduced motion use GenericStorySection instead.)
 */
export function FocusTourSection({
  section,
  tour,
  imageUrl,
}: FocusTourSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stepCount = tour.steps.length + 1;
  const { stepIndex, scrollToStep } = useScrollSteps({
    trackRef,
    pinRef,
    stepCount,
    enabled: true,
    stepLength: STEP_LENGTH,
    align: "top",
  });
  const titleId = `${section.id}-title`;
  const focus = tour.steps[stepIndex - 1]?.focus ?? WHOLE_ARTWORK;
  const total = String(tour.steps.length).padStart(2, "0");

  return (
    <section
      id={section.id}
      className={`home-section home-story-section home-story-section--${section.id} focus-tour`}
      data-home-section={section.id}
      data-section-number={section.number}
      data-tour-side={section.layout === "image-left" ? "left" : "right"}
      data-tour-step={stepIndex}
      aria-labelledby={titleId}
    >
      <div
        ref={trackRef}
        className="scroll-steps-track"
        data-scroll-driven="true"
      >
        <div ref={pinRef} className="focus-tour__pin scroll-steps-pin">
          <div className="focus-tour__text">
            <h2
              id={titleId}
              className="home-story-section__title focus-tour__title"
            >
              {section.title}
            </h2>

            <div className="focus-tour__swap">
              <div
                className="focus-tour__intro"
                data-active={stepIndex === 0 ? "true" : "false"}
              >
                <p className="home-story-section__body focus-tour__body">
                  {section.body}
                </p>
                <HandNote sectionNumber={section.number} />
              </div>

              <ol className="focus-tour__steps" aria-label={tour.label}>
                {tour.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="focus-tour__step"
                    data-active={stepIndex === index + 1 ? "true" : "false"}
                  >
                    <span className="focus-tour__count" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                      <i> / {total}</i>
                    </span>
                    <strong className="focus-tour__step-title">
                      {step.title}
                    </strong>
                    {step.text ? (
                      <span className="focus-tour__step-text">{step.text}</span>
                    ) : null}
                    {step.figure === "spectrum" ? <SpectrumFigure /> : null}
                  </li>
                ))}
              </ol>
            </div>

            <div className="focus-tour__rail" aria-hidden="true">
              {Array.from({ length: stepCount }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  tabIndex={-1}
                  className="focus-tour__dot"
                  data-active={stepIndex === index ? "true" : "false"}
                  data-done={stepIndex > index ? "true" : "false"}
                  onClick={() => scrollToStep(index)}
                />
              ))}
            </div>
          </div>

          <div
            className="focus-tour__stage"
            style={{ "--tour-aspect": tour.aspect } as CSSProperties}
            aria-hidden="true"
          >
            <div className="focus-tour__lens">
              <img
                className="focus-tour__image"
                src={imageUrl}
                alt=""
                draggable="false"
                decoding="async"
                style={
                  {
                    "--focus-x": focus.x,
                    "--focus-y": focus.y,
                    "--focus-zoom": focus.zoom,
                  } as CSSProperties
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
