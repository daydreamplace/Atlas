import type { CSSProperties } from "react";
import {
  BIO_COLOR_ID_FEATURES,
  BIO_COLOR_ID_STEPS,
  HOME_TAGLINES,
  STANDARD_OUTCOMES,
  SYNBIO_FLOW,
} from "../../data/homeExtras";
import "../../styles/section-extras.css";

/** Handwritten one-liner from the storyline deck. */
export function HandNote({
  sectionNumber,
  className = "",
}: {
  readonly sectionNumber: number;
  readonly className?: string;
}) {
  const text = HOME_TAGLINES[sectionNumber];
  if (!text) return null;
  return <p className={`home-hand-note ${className}`.trim()}>{text}</p>;
}

/** Numbered left-to-right flow ("a → b → c"). */
function Flow({
  label,
  steps,
}: {
  readonly label: string;
  readonly steps: readonly { title: string; text?: string }[];
}) {
  return (
    <ol
      className="home-flow"
      aria-label={label}
      style={{ "--flow-count": steps.length } as CSSProperties}
    >
      {steps.map((step, index) => (
        <li key={step.title} style={{ "--i": index } as CSSProperties}>
          <span className="home-flow__index" aria-hidden="true">
            {index + 1}
          </span>
          <strong>{step.title}</strong>
          {step.text ? <span>{step.text}</span> : null}
        </li>
      ))}
    </ol>
  );
}

/** Section-specific supporting block shown under the text and artwork. */
export function SectionExtras({
  sectionNumber,
}: {
  readonly sectionNumber: number;
}) {
  switch (sectionNumber) {
    case 5:
      return (
        <Flow
          label="From a question to trusted authentication"
          steps={SYNBIO_FLOW}
        />
      );
    case 6:
      return (
        <Flow
          label="How a Bio Color ID tag is made"
          steps={BIO_COLOR_ID_STEPS.map((title) => ({ title }))}
        />
      );
    case 7:
      return (
        <ul className="home-features" aria-label="Key features">
          {BIO_COLOR_ID_FEATURES.map((feature, index) => (
            <li key={feature.title} style={{ "--i": index } as CSSProperties}>
              <strong>{feature.title}</strong>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      );
    case 8:
      return (
        <div className="home-reader-steps">
          <Flow
            label="How the reader works"
            steps={[
              {
                title: "Illuminate",
                text: "Several wavelengths of light shine on the tag.",
              },
              {
                title: "Capture",
                text: "An iPhone above the reader images the tag from the top.",
              },
              {
                title: "Compare",
                text: "The app compares the spectral signature with reference data.",
              },
            ]}
          />
          <figure className="home-spectrum">
            {/* Shape only, no values: real measurements go on the results pages. */}
            <svg viewBox="0 0 240 80" aria-hidden="true" focusable="false">
              <path
                className="home-spectrum__ref"
                d="M0 70 C30 70 40 22 62 22 S92 70 120 66 S150 30 168 30 S200 70 240 70"
              />
              <path
                className="home-spectrum__tag"
                d="M0 72 C32 72 42 26 64 26 S94 70 122 68 S152 34 170 34 S202 72 240 72"
              />
            </svg>
            <figcaption>
              Illustrative spectral comparison — tag vs. reference
            </figcaption>
          </figure>
        </div>
      );
    case 9:
      return (
        <ul className="home-outcomes" aria-label="Where it leads">
          {STANDARD_OUTCOMES.map((outcome) => (
            <li key={outcome}>{outcome}</li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}
