import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { HomeSectionContent } from "../../data/homeContent";
import { getMainPageAssetUrl } from "../../utils/wikiAssets";
import "../../styles/limitations-story.css";
import { HandDrawnMark } from "./HandDrawnMark";
import { NfcPaperMark } from "./NfcPaperMark";
import { useScrollSteps, useScrollStepsEnabled } from "./useScrollSteps";

interface LimitationsStorySectionProps {
  readonly section: HomeSectionContent;
}

const LIMITATION_SLIDES = [
  {
    id: "qr",
    controlLabel: "Repeated form",
    description: "A form repeats across different surfaces.",
  },
  {
    id: "hologram",
    controlLabel: "Surface shift",
    description: "A surface changes its context.",
  },
  {
    id: "serial",
    controlLabel: "Pattern",
    description: "A pattern repeats in a different setting.",
  },
  {
    id: "conclusion",
    controlLabel: "Perspective",
    description:
      "Shape and context each contribute to the way a form is perceived.",
  },
] as const;

type LimitationSlideId = (typeof LIMITATION_SLIDES)[number]["id"];

const AUTHENTICATION_ASSET_PATH = "authentication";
const PROOF_SLIDE_DURATION_MS = 2_600;
const CONCLUSION_SLIDE_INDEX = LIMITATION_SLIDES.length - 1;
const SEQUENCE_DURATION_MS = PROOF_SLIDE_DURATION_MS * CONCLUSION_SLIDE_INDEX;
const FINAL_ANNOUNCEMENT =
  "Perspective sequence complete. A closer look reveals the relationship between shape and context.";

function getBaseAwareImageUrl(
  fileName: string,
  assetPath = AUTHENTICATION_ASSET_PATH,
): string {
  return getMainPageAssetUrl(`${assetPath}/${fileName}`);
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

// Smallest/largest illustration area when the whole pad is pinned. If the
// pad cannot fit on screen even at the minimum, only the title, slides and
// steps are pinned and the body text follows after them.
const PAD_VIEWPORT_MIN_PX = 192;
const PAD_VIEWPORT_MAX_PX = 384;

/**
 * Nudges the handwritten body down so each line of text sits on a ruled line
 * of the pad. The rules start at the binding's lower edge (the stage's
 * ::after) and repeat every line-height; we measure the first baseline and
 * shift it onto the nearest rule below it.
 */
function useTextOnRuledLines(
  stageRef: React.RefObject<HTMLElement | null>,
  textRef: React.RefObject<HTMLElement | null>,
) {
  useLayoutEffect(() => {
    const stage = stageRef.current;
    const text = textRef.current;
    if (!stage || !text) return;

    // Sit the baseline this many px above the rule, like handwriting.
    const BASELINE_GAP_PX = 3;
    let frame = 0;

    const align = () => {
      frame = 0;
      const step = parseFloat(getComputedStyle(text).lineHeight);
      const rulesTop = parseFloat(getComputedStyle(stage, "::after").top);
      if (!step || Number.isNaN(rulesTop)) return;

      const probe = document.createElement("span");
      probe.style.cssText =
        "display:inline-block;width:0;height:0;vertical-align:baseline";
      text.prepend(probe);
      const baseline =
        probe.getBoundingClientRect().top - stage.getBoundingClientRect().top;
      probe.remove();

      const currentNudge = parseFloat(text.style.paddingTop) || 0;
      const naturalBaseline = baseline - currentNudge;
      // First rule line sits at rulesTop + step - 1.
      const target = rulesTop + step - 1 - BASELINE_GAP_PX;
      const nudge = (((target - naturalBaseline) % step) + step) % step;
      text.style.paddingTop = `${nudge.toFixed(2)}px`;
    };

    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(align);
    };

    align();
    document.fonts?.ready.then(request);
    const observer = new ResizeObserver(request);
    observer.observe(stage);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      text.style.paddingTop = "";
    };
  }, [stageRef, textRef]);
}

const legalPadStyle = {
  "--limitations-pad-paper": `url("${getBaseAwareImageUrl("legal-pad-paper-v1.webp", "limitations")}")`,
} as CSSProperties;

function getInitialReducedMotionPreference(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getSlideIndexForElapsed(elapsedMs: number): number {
  if (elapsedMs >= SEQUENCE_DURATION_MS) return CONCLUSION_SLIDE_INDEX;

  return Math.min(
    Math.floor(elapsedMs / PROOF_SLIDE_DURATION_MS),
    CONCLUSION_SLIDE_INDEX - 1,
  );
}

function getElapsedAtSlideStart(slideIndex: number): number {
  return Math.min(slideIndex * PROOF_SLIDE_DURATION_MS, SEQUENCE_DURATION_MS);
}

export function LimitationsStorySection({
  section,
}: LimitationsStorySectionProps) {
  const titleId = `${section.id}-title`;
  const slideshowId = `${section.id}-slideshow`;
  const viewportId = `${section.id}-slideshow-viewport`;
  const slideshowRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const padTrackRef = useRef<HTMLDivElement>(null);
  const padRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  useTextOnRuledLines(padRef, bodyRef);
  const elapsedRef = useRef(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotionPreference,
  );
  const initialSlideIndex = prefersReducedMotion ? CONCLUSION_SLIDE_INDEX : 0;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const currentSlideIndexRef = useRef(initialSlideIndex);
  const [isRunning, setIsRunning] = useState(false);
  const [isViewportVisible, setIsViewportVisible] = useState(false);
  const [isViewportReady, setIsViewportReady] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const autoplayUsedRef = useRef(prefersReducedMotion);
  const [sequenceRun, setSequenceRun] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  // The slides follow the scroll position instead of a timer.
  const isScrollDriven = useScrollStepsEnabled() && !prefersReducedMotion;
  const [padViewportHeight, setPadViewportHeight] = useState<number>();

  // The whole pad is pinned while the slides follow the scroll. Shrink the
  // illustration so the pad fits on screen when that is possible; on small
  // screens it cannot fit, so it stays full size and is pinned by its top.
  useLayoutEffect(() => {
    const pad = padRef.current;
    const viewport = viewportRef.current;
    if (!isScrollDriven || !pad || !viewport) {
      setPadViewportHeight(undefined);
      return;
    }

    let screenHeight = window.innerHeight;
    let screenWidth = window.innerWidth;

    const measure = () => {
      const body = bodyRef.current;
      // The ruled-line nudge (see useTextOnRuledLines) is left out of the
      // pad height and added back as-is. The illustration only changes in
      // whole ruled lines, so the nudge does not change and both settle.
      const textNudge = body ? parseFloat(body.style.paddingTop) || 0 : 0;
      const rest = pad.offsetHeight - viewport.offsetHeight - textNudge;
      const step = body ? parseFloat(getComputedStyle(body).lineHeight) : 0;
      const room = screenHeight - rest - textNudge;
      const available = step ? Math.floor(room / step) * step : room;
      setPadViewportHeight(
        available >= PAD_VIEWPORT_MIN_PX
          ? Math.min(PAD_VIEWPORT_MAX_PX, available)
          : undefined,
      );
    };

    // Ignore the mobile address bar sliding in/out (small height changes).
    const handleResize = () => {
      if (
        window.innerWidth === screenWidth &&
        Math.abs(window.innerHeight - screenHeight) < 120
      ) {
        return;
      }
      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;
      measure();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pad);
    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [isScrollDriven]);

  const { stepIndex: scrollSlideIndex, scrollToStep } = useScrollSteps({
    trackRef: padTrackRef,
    pinRef: padRef,
    stepCount: LIMITATION_SLIDES.length,
    enabled: isScrollDriven,
    stepLength: 0.5,
    align: "top",
  });

  const setCurrentSlide = useCallback((nextSlideIndex: number) => {
    currentSlideIndexRef.current = nextSlideIndex;
    setCurrentSlideIndex(nextSlideIndex);
  }, []);

  const claimAutoplay = useCallback(() => {
    autoplayUsedRef.current = true;
  }, []);

  const startSequence = useCallback(() => {
    claimAutoplay();

    if (prefersReducedMotion) {
      elapsedRef.current = SEQUENCE_DURATION_MS;
      setCurrentSlide(CONCLUSION_SLIDE_INDEX);
      setIsRunning(false);
      return;
    }

    elapsedRef.current = 0;
    setCurrentSlide(0);
    setSequenceRun((currentRun) => currentRun + 1);
    setIsRunning(true);
    setAnnouncement("");
  }, [claimAutoplay, prefersReducedMotion, setCurrentSlide]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handlePreferenceChange);
    return () =>
      mediaQuery.removeEventListener("change", handlePreferenceChange);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => setIsPageVisible(!document.hidden);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    const viewportNode = viewportRef.current;

    if (!viewportNode || !("IntersectionObserver" in window)) {
      setIsViewportVisible(true);
      setIsViewportReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const isMeaningfullyVisible =
          entry.isIntersecting && entry.intersectionRatio >= 0.25;
        setIsViewportVisible(isMeaningfullyVisible);
        setIsViewportReady(isMeaningfullyVisible);
      },
      { threshold: [0, 0.25] },
    );

    observer.observe(viewportNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    claimAutoplay();
    elapsedRef.current = SEQUENCE_DURATION_MS;
    setIsRunning(false);
    setCurrentSlide(CONCLUSION_SLIDE_INDEX);
  }, [claimAutoplay, prefersReducedMotion, setCurrentSlide]);

  useEffect(() => {
    if (
      !isViewportReady ||
      prefersReducedMotion ||
      isScrollDriven ||
      autoplayUsedRef.current
    ) {
      return;
    }

    startSequence();
  }, [isScrollDriven, isViewportReady, prefersReducedMotion, startSequence]);

  useEffect(() => {
    if (isScrollDriven && scrollSlideIndex === CONCLUSION_SLIDE_INDEX) {
      setAnnouncement(FINAL_ANNOUNCEMENT);
    }
  }, [isScrollDriven, scrollSlideIndex]);

  // In scroll mode each slide's own animation plays whenever it is reached.
  const isSequenceActive = isScrollDriven || isRunning;
  const isEnvironmentPaused = !isViewportVisible || !isPageVisible;
  const isSequencePaused = isSequenceActive && isEnvironmentPaused;

  useEffect(() => {
    if (
      !isRunning ||
      isSequencePaused ||
      prefersReducedMotion ||
      isScrollDriven
    )
      return;

    let animationFrameId = 0;
    let previousTimestamp: number | undefined;

    const advanceSequence = (timestamp: number) => {
      if (previousTimestamp !== undefined) {
        elapsedRef.current += timestamp - previousTimestamp;
      }
      previousTimestamp = timestamp;

      const nextSlideIndex = getSlideIndexForElapsed(elapsedRef.current);
      if (nextSlideIndex !== currentSlideIndexRef.current) {
        setCurrentSlide(nextSlideIndex);
      }

      if (elapsedRef.current >= SEQUENCE_DURATION_MS) {
        elapsedRef.current = SEQUENCE_DURATION_MS;
        if (currentSlideIndexRef.current !== CONCLUSION_SLIDE_INDEX) {
          setCurrentSlide(CONCLUSION_SLIDE_INDEX);
        }
        setAnnouncement(FINAL_ANNOUNCEMENT);
        setIsRunning(false);
        return;
      }

      animationFrameId = window.requestAnimationFrame(advanceSequence);
    };

    animationFrameId = window.requestAnimationFrame(advanceSequence);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [
    isRunning,
    isScrollDriven,
    isSequencePaused,
    prefersReducedMotion,
    sequenceRun,
    setCurrentSlide,
  ]);

  const handleSlideSelection = (slideId: LimitationSlideId) => {
    const nextSlideIndex = LIMITATION_SLIDES.findIndex(
      (slide) => slide.id === slideId,
    );
    if (nextSlideIndex < 0) return;

    if (isScrollDriven) {
      scrollToStep(nextSlideIndex);
      return;
    }

    claimAutoplay();
    elapsedRef.current = getElapsedAtSlideStart(nextSlideIndex);
    setIsRunning(false);
    setCurrentSlide(nextSlideIndex);
    setSequenceRun((currentRun) => currentRun + 1);
    setAnnouncement(
      `Selected limitation step ${nextSlideIndex + 1} of ${LIMITATION_SLIDES.length}: ${LIMITATION_SLIDES[nextSlideIndex].description}`,
    );
  };

  const currentSlide =
    LIMITATION_SLIDES[isScrollDriven ? scrollSlideIndex : currentSlideIndex];
  const sequenceData = {
    "data-limitations-slide": currentSlide.id,
    "data-limitations-running": isSequenceActive ? "true" : "false",
    "data-limitations-paused": isSequencePaused ? "true" : "false",
    "data-limitations-run": sequenceRun,
  } as const;
  const slideshowStyle = {
    "--limitations-slide-duration": `${PROOF_SLIDE_DURATION_MS}ms`,
  } as CSSProperties;

  return (
    <section
      id={section.id}
      className="home-section home-story-section home-story-section--authentication-limitations limitations-story limitations-sequence"
      data-home-section={section.id}
      data-section-number={section.number}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      aria-labelledby={titleId}
      data-scroll-driven={isScrollDriven ? "true" : "false"}
      {...sequenceData}
    >
      {/* The whole pad is pinned while the slides follow the scroll, so the
          text stays put and the paper does not move. */}
      <div
        ref={padTrackRef}
        className="scroll-steps-track"
        data-scroll-driven={isScrollDriven ? "true" : "false"}
      >
        <div
          ref={padRef}
          className="limitations-story__stage scroll-steps-pin"
          style={
            {
              ...legalPadStyle,
              ...(padViewportHeight
                ? {
                    "--limitations-viewport-height": `${padViewportHeight}px`,
                  }
                : null),
            } as CSSProperties
          }
        >
          <header className="home-story-section__content limitations-story__pad-heading">
            <h2 id={titleId} className="home-story-section__title">
              {section.title}
            </h2>
          </header>

          <div
            ref={slideshowRef}
            id={slideshowId}
            className="limitations-story__slideshow"
            role="region"
            aria-label="An illustrative sequence of repeated forms, shifting surfaces, and changes in perspective"
            style={slideshowStyle}
          >
            <div
              ref={viewportRef}
              id={viewportId}
              className="limitations-story__viewport"
            >
              <div
                key={`qr-${sequenceRun}`}
                className="limitations-story__slide limitations-story__slide--qr"
                data-slide="qr"
                data-active={currentSlide.id === "qr" ? "true" : "false"}
                aria-hidden={currentSlide.id !== "qr"}
                role="img"
                aria-label="A form repeats across different surfaces."
              >
                <div className="limitations-story__risk limitations-story__risk--qr">
                  <img
                    className="limitations-story__asset limitations-story__mark limitations-story__mark--qr-source"
                    data-art-piece="qr-source"
                    src={limitationAssets.qrPaper}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <HandDrawnMark
                    type="arrow"
                    className="limitations-story__transfer limitations-story__transfer--qr"
                  />
                  <img
                    className="limitations-story__asset limitations-story__mark limitations-story__qr-copy-sheet limitations-story__qr-copy-sheet--back-two"
                    data-art-piece="qr-copy-back-two"
                    src={limitationAssets.qrPaper}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="limitations-story__asset limitations-story__mark limitations-story__qr-copy-sheet limitations-story__qr-copy-sheet--back-one"
                    data-art-piece="qr-copy-back-one"
                    src={limitationAssets.qrPaper}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <img
                    className="limitations-story__asset limitations-story__mark limitations-story__mark--qr-copy limitations-story__qr-copy-sheet limitations-story__qr-copy-sheet--front limitations-story__copied-piece"
                    data-art-piece="qr-copy-front"
                    src={limitationAssets.qrPaper}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <strong className="limitations-story__annotation limitations-story__annotation--qr">
                    COPIED
                  </strong>
                </div>
              </div>

              <div
                key={`hologram-${sequenceRun}`}
                className="limitations-story__slide limitations-story__slide--hologram"
                data-slide="hologram"
                data-active={currentSlide.id === "hologram" ? "true" : "false"}
                aria-hidden={currentSlide.id !== "hologram"}
                role="img"
                aria-label="A surface moves into a new context."
              >
                <div className="limitations-story__risk limitations-story__risk--hologram">
                  <img
                    className="limitations-story__asset limitations-story__mark limitations-story__mark--hologram-source"
                    data-art-piece="hologram-source"
                    src={limitationAssets.hologramPeeled}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <HandDrawnMark
                    type="arrow"
                    className="limitations-story__transfer limitations-story__transfer--hologram"
                  />
                  <img
                    className="limitations-story__asset limitations-story__mark limitations-story__mark--hologram-reused limitations-story__copied-piece"
                    data-art-piece="hologram-reused"
                    src={limitationAssets.hologramFlat}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <strong className="limitations-story__annotation limitations-story__annotation--hologram">
                    PEEL &amp; REUSE
                  </strong>
                </div>
              </div>

              <div
                key={`serial-${sequenceRun}`}
                className="limitations-story__slide limitations-story__slide--serial"
                data-slide="serial"
                data-active={currentSlide.id === "serial" ? "true" : "false"}
                aria-hidden={currentSlide.id !== "serial"}
                role="img"
                aria-label="A pattern repeats in a different setting."
              >
                <div className="limitations-story__risk limitations-story__risk--serial">
                  <div
                    className="limitations-story__mark limitations-story__mark--serial-source"
                    data-art-piece="serial-source"
                  >
                    <img
                      className="limitations-story__asset limitations-story__serial-paper"
                      src={limitationAssets.serialPaper}
                      alt=""
                      width="1254"
                      height="1254"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="limitations-story__serial-number">
                      ATLAS001
                    </span>
                  </div>
                  <img
                    className="limitations-story__asset limitations-story__clone-operator"
                    data-art-piece="clone-operator"
                    src={limitationAssets.cloneOperator}
                    alt=""
                    width="1254"
                    height="1254"
                    draggable="false"
                    loading="lazy"
                    decoding="async"
                  />
                  <HandDrawnMark
                    type="arrow"
                    className="limitations-story__transfer limitations-story__transfer--serial"
                  />
                  <div
                    className="limitations-story__mark limitations-story__mark--serial-copy limitations-story__copied-piece"
                    data-art-piece="serial-copy"
                  >
                    <img
                      className="limitations-story__asset limitations-story__serial-paper"
                      src={limitationAssets.serialPaper}
                      alt=""
                      width="1254"
                      height="1254"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="limitations-story__serial-number">
                      ATLAS001
                    </span>
                  </div>
                  <strong className="limitations-story__annotation limitations-story__annotation--serial">
                    EASY TO CLONE
                  </strong>
                </div>
              </div>

              <div
                key={`conclusion-${sequenceRun}`}
                className="limitations-story__slide limitations-story__slide--conclusion"
                data-slide="conclusion"
                data-active={
                  currentSlide.id === "conclusion" ? "true" : "false"
                }
                aria-hidden={currentSlide.id !== "conclusion"}
                role="img"
                aria-label="Shape and context offer two perspectives on the same visual study."
              >
                <div className="limitations-story__comparison">
                  <span className="limitations-story__question">
                    Same form. Another perspective?
                  </span>
                  <div className="limitations-story__comparison-object limitations-story__comparison-object--packaging">
                    <img
                      className="limitations-story__asset limitations-story__carton limitations-story__carton--comparison"
                      src={limitationAssets.openCarton}
                      alt=""
                      width="1254"
                      height="1254"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />
                    <div
                      className="limitations-story__package-label limitations-story__package-label--qr"
                      data-art-piece="package-qr-label"
                    >
                      <img
                        className="limitations-story__asset limitations-story__package-label-image"
                        src={limitationAssets.qrPaper}
                        alt=""
                        width="1254"
                        height="1254"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div
                      className="limitations-story__package-label limitations-story__package-label--nfc"
                      data-art-piece="package-nfc-label"
                    >
                      <NfcPaperMark className="limitations-story__nfc-paper-mark" />
                    </div>
                  </div>
                  <HandDrawnMark
                    type="not-equal"
                    className="limitations-story__not-equal"
                  />
                  <div className="limitations-story__comparison-object limitations-story__comparison-object--product">
                    <img
                      className="limitations-story__asset limitations-story__product-jar"
                      src={limitationAssets.productJar}
                      alt=""
                      width="1254"
                      height="1254"
                      draggable="false"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <strong className="limitations-story__comparison-note">
                    <span aria-hidden="true">SHAPE</span>
                    <HandDrawnMark
                      type="not-equal"
                      className="limitations-story__comparison-note-mark"
                    />
                    <span aria-hidden="true">CONTEXT</span>
                    <span className="home-visually-hidden">
                      SHAPE ≠ CONTEXT
                    </span>
                  </strong>
                </div>
              </div>
            </div>

            <div className="limitations-story__controls">
              <div
                className="limitations-story__steps"
                role="group"
                aria-label="Perspective sequence steps"
                style={
                  {
                    "--step-count": LIMITATION_SLIDES.length,
                    "--step-index": LIMITATION_SLIDES.indexOf(currentSlide),
                  } as CSSProperties
                }
              >
                {LIMITATION_SLIDES.map((slide, index) => (
                  <button
                    key={slide.id}
                    className="limitations-story__step-button"
                    type="button"
                    data-limitations-slide-control={slide.id}
                    aria-controls={viewportId}
                    aria-pressed={currentSlide.id === slide.id}
                    aria-label={`Show limitation step ${index + 1} of ${LIMITATION_SLIDES.length}: ${slide.controlLabel}`}
                    onClick={() => handleSlideSelection(slide.id)}
                  >
                    <span className="limitations-story__step-label">
                      {slide.controlLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p
              className="home-visually-hidden limitations-story__announcement"
              aria-live="polite"
              aria-atomic="true"
            >
              {announcement}
            </p>
          </div>

          <div className="home-story-section__content limitations-story__pad-body">
            <p ref={bodyRef} className="home-story-section__body">
              {section.body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
