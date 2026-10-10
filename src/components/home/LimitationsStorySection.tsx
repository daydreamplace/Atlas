import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import { useScrollSequence } from "../../hooks/useInteractiveScene";
import "../../styles/limitations-story.css";
import { HandDrawnMark } from "./HandDrawnMark";
import { NfcPaperMark } from "./NfcPaperMark";

interface LimitationsStorySectionProps {
  readonly section: HomeSectionContent;
}

const LIMITATION_PAGES = [
  { id: "qr", label: "COPIED", heading: null },
  { id: "hologram", label: "PEEL & REUSE", heading: "Peel & reuse" },
  { id: "serial", label: "EASY TO CLONE", heading: "Easy to clone" },
  {
    id: "conclusion",
    label: "PACKAGING ≠ PRODUCT",
    heading: "Packaging ≠ product",
  },
] as const;

type LimitationPageId = (typeof LIMITATION_PAGES)[number]["id"];

const AUTHENTICATION_ASSET_PATH = "images/main-page/authentication";

function getBaseAwareImageUrl(
  fileName: string,
  assetPath = AUTHENTICATION_ASSET_PATH,
): string {
  const baseUrl = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  return `${baseUrl}${assetPath}/${fileName}`;
}

const limitationAssets = {
  productJar: getBaseAwareImageUrl("product-jar-pencil-v2.webp"),
  openCarton: getBaseAwareImageUrl("open-carton-pencil-v2.webp"),
  qrPaper: getBaseAwareImageUrl("qr-paper-v2.webp"),
  hologramPeeled: getBaseAwareImageUrl("hologram-security-peeled-v3.webp"),
  hologramFlat: getBaseAwareImageUrl("hologram-security-flat-v3.webp"),
  serialPaper: getBaseAwareImageUrl("serial-paper-v2.webp"),
  cloneOperator: getBaseAwareImageUrl("clone-operator-v1.webp"),
} as const;

const legalPadStyle = {
  "--limitations-pad-paper": `url("${getBaseAwareImageUrl("legal-pad-paper-v1.webp", "images/main-page/limitations")}")`,
} as CSSProperties;

function Asset({
  src,
  className,
}: {
  readonly src: string;
  readonly className: string;
}) {
  return (
    <img
      className={`limitations-story__asset ${className}`}
      src={src}
      alt=""
      width="1254"
      height="1254"
      draggable="false"
      loading="lazy"
      decoding="async"
    />
  );
}

function QrVisual() {
  return (
    <div className="limitations-story__risk limitations-story__risk--qr">
      <Asset
        className="limitations-story__mark limitations-story__mark--qr-source"
        src={limitationAssets.qrPaper}
      />
      <HandDrawnMark
        type="arrow"
        className="limitations-story__transfer limitations-story__transfer--qr"
      />
      <Asset
        className="limitations-story__mark limitations-story__qr-copy-sheet limitations-story__qr-copy-sheet--back-two"
        src={limitationAssets.qrPaper}
      />
      <Asset
        className="limitations-story__mark limitations-story__qr-copy-sheet limitations-story__qr-copy-sheet--back-one"
        src={limitationAssets.qrPaper}
      />
      <Asset
        className="limitations-story__mark limitations-story__mark--qr-copy limitations-story__qr-copy-sheet limitations-story__qr-copy-sheet--front limitations-story__copied-piece"
        src={limitationAssets.qrPaper}
      />
      <strong className="limitations-story__annotation limitations-story__annotation--qr">
        COPIED
      </strong>
    </div>
  );
}

function HologramVisual() {
  return (
    <div className="limitations-story__risk limitations-story__risk--hologram">
      <Asset
        className="limitations-story__mark limitations-story__mark--hologram-source"
        src={limitationAssets.hologramPeeled}
      />
      <HandDrawnMark
        type="arrow"
        className="limitations-story__transfer limitations-story__transfer--hologram"
      />
      <Asset
        className="limitations-story__mark limitations-story__mark--hologram-reused limitations-story__copied-piece"
        src={limitationAssets.hologramFlat}
      />
      <strong className="limitations-story__annotation limitations-story__annotation--hologram">
        PEEL &amp; REUSE
      </strong>
    </div>
  );
}

function SerialMark({ modifier }: { readonly modifier: "source" | "copy" }) {
  return (
    <div
      className={`limitations-story__mark limitations-story__mark--serial-${modifier}`}
    >
      <Asset
        className="limitations-story__serial-paper"
        src={limitationAssets.serialPaper}
      />
      <span className="limitations-story__serial-number">A1B3C2D4</span>
    </div>
  );
}

function SerialVisual() {
  return (
    <div className="limitations-story__risk limitations-story__risk--serial">
      <SerialMark modifier="source" />
      <Asset
        className="limitations-story__clone-operator"
        src={limitationAssets.cloneOperator}
      />
      <HandDrawnMark
        type="arrow"
        className="limitations-story__transfer limitations-story__transfer--serial"
      />
      <SerialMark modifier="copy" />
      <strong className="limitations-story__annotation limitations-story__annotation--serial">
        EASY TO CLONE
      </strong>
    </div>
  );
}

function ConclusionVisual() {
  return (
    <div className="limitations-story__comparison">
      <span className="limitations-story__question">
        Same label. Different contents?
      </span>
      <div className="limitations-story__comparison-object limitations-story__comparison-object--packaging">
        <Asset
          className="limitations-story__carton limitations-story__carton--comparison"
          src={limitationAssets.openCarton}
        />
        <div className="limitations-story__package-label limitations-story__package-label--qr">
          <Asset
            className="limitations-story__package-label-image"
            src={limitationAssets.qrPaper}
          />
        </div>
        <div className="limitations-story__package-label limitations-story__package-label--nfc">
          <NfcPaperMark className="limitations-story__nfc-paper-mark" />
        </div>
      </div>
      <HandDrawnMark
        type="not-equal"
        className="limitations-story__not-equal"
      />
      <div className="limitations-story__comparison-object limitations-story__comparison-object--product">
        <Asset
          className="limitations-story__product-jar"
          src={limitationAssets.productJar}
        />
      </div>
      <strong className="limitations-story__comparison-note">
        <span>PACKAGING</span>
        <HandDrawnMark
          type="not-equal"
          className="limitations-story__comparison-note-mark"
        />
        <span>PRODUCT</span>
      </strong>
    </div>
  );
}

const PAGE_VISUALS: Record<LimitationPageId, ReactNode> = {
  qr: <QrVisual />,
  hologram: <HologramVisual />,
  serial: <SerialVisual />,
  conclusion: <ConclusionVisual />,
};

export function LimitationsStorySection({
  section,
}: LimitationsStorySectionProps) {
  const titleId = `${section.id}-title`;
  const pages = section.pages ?? [section.body];
  const { targetRef, currentIndex, prefersReducedMotion } =
    useScrollSequence<HTMLElement>(LIMITATION_PAGES.length, {
      reducedIndex: LIMITATION_PAGES.length - 1,
      startViewportRatio: 0.68,
      endViewportRatio: 0.22,
    });
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const activeIndex = prefersReducedMotion
    ? LIMITATION_PAGES.length - 1
    : (clickedIndex ?? currentIndex);

  useEffect(() => {
    setClickedIndex(null);
  }, [currentIndex]);

  const advancePage = () => {
    if (prefersReducedMotion) return;
    setClickedIndex(
      (index) => ((index ?? currentIndex) + 1) % LIMITATION_PAGES.length,
    );
  };

  const interactionLabel =
    activeIndex === LIMITATION_PAGES.length - 1
      ? "Return to the first limitation"
      : `Tear page ${activeIndex + 1} of ${LIMITATION_PAGES.length} to reveal the next limitation`;

  return (
    <section
      ref={targetRef}
      id={section.id}
      className="home-section home-story-section home-story-section--authentication-limitations limitations-story limitations-tear-sequence"
      data-home-section={section.id}
      data-section-number={section.number}
      data-limitations-page={LIMITATION_PAGES[activeIndex].id}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      aria-labelledby={titleId}
    >
      <div className="limitations-story__stage" style={legalPadStyle}>
        <div
          className="limitations-story__sheet-stack"
          role="button"
          tabIndex={prefersReducedMotion ? -1 : 0}
          onClick={advancePage}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              advancePage();
            }
          }}
          aria-label={interactionLabel}
        >
          {LIMITATION_PAGES.map((page, index) => {
            const state =
              index < activeIndex
                ? "torn"
                : index === activeIndex
                  ? "current"
                  : "stacked";

            return (
              <article
                key={page.id}
                className="limitations-story__sheet-page"
                data-sheet={page.id}
                data-sheet-state={state}
                aria-hidden={
                  prefersReducedMotion ? undefined : index !== activeIndex
                }
                style={{ "--sheet-index": index } as CSSProperties}
              >
                <header className="limitations-story__sheet-heading">
                  {index === 0 ? (
                    <h2 id={titleId} className="home-story-section__title">
                      {section.title}
                    </h2>
                  ) : (
                    <h3>{page.heading}</h3>
                  )}
                  <span
                    className="limitations-story__tear-instruction"
                    aria-hidden="true"
                  >
                    {index === LIMITATION_PAGES.length - 1
                      ? "Click to review again"
                      : "Scroll or click to tear"}
                  </span>
                </header>
                <div className="limitations-story__sheet-visual">
                  {PAGE_VISUALS[page.id]}
                </div>
                <p className="limitations-story__sheet-copy">
                  {pages[index] ?? ""}
                </p>
              </article>
            );
          })}
        </div>

        <p className="home-visually-hidden" aria-live="polite">
          Page {activeIndex + 1} of {LIMITATION_PAGES.length}:{" "}
          {LIMITATION_PAGES[activeIndex].label}
        </p>
      </div>
    </section>
  );
}
