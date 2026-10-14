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
import "../../styles/authentication-story.css";
import { IllustratedPhone } from "./IllustratedPhone";
import { NfcPaperMark } from "./NfcPaperMark";
import { useStoryZoomLink } from "./storyZoomLink";
import { useScrollSteps, useScrollStepsEnabled } from "./useScrollSteps";

interface AuthenticationStorySectionProps {
  readonly section: HomeSectionContent;
}

const SEQUENCE_STEPS = [
  {
    id: "intro",
    controlLabel: "Intro",
    durationMs: 1_600,
    description: "A lens enters the observation workspace.",
  },
  {
    id: "qr-reveal",
    controlLabel: "Form reveal",
    durationMs: 1_800,
    description: "A frame brings an individual form into view.",
  },
  {
    id: "qr-scan",
    controlLabel: "Focus",
    durationMs: 3_600,
    description:
      "The illustrative viewfinder frames a form and brings it into focus. This is an animated visual study.",
  },
  {
    id: "hologram",
    controlLabel: "Light",
    durationMs: 2_400,
    description: "Light reveals a different surface.",
  },
  {
    id: "serial",
    controlLabel: "Index",
    durationMs: 2_200,
    description:
      "An index gives the form a place in the field. Example ATLAS001.",
  },
  {
    id: "nfc",
    controlLabel: "Signal",
    durationMs: 2_400,
    description: "A signal connects one part of the scene to another.",
  },
  {
    id: "verified",
    controlLabel: "In focus",
    durationMs: 2_200,
    description:
      "The sequence ends with the form in focus, after exploring framing, light, indexing, and response.",
  },
] as const;

type SequenceStepId = (typeof SEQUENCE_STEPS)[number]["id"];

const METHOD_TOKENS = [
  {
    method: "qr",
    image: "qr-paper-v2.webp",
    label: "Frame",
    subtitle: "Find an individual form",
  },
  {
    method: "hologram",
    image: "hologram-security-flat-v3.webp",
    label: "Light",
    subtitle: "Reveal another layer",
  },
  {
    method: "serial",
    image: "serial-paper-v2.webp",
    label: "Index",
    subtitle: "A place in the field",
  },
  {
    method: "nfc",
    image: "nfc-paper-blank-v3.webp",
    label: "Signal",
    subtitle: "Follow a connection",
  },
] as const;

const LAST_STEP_INDEX = SEQUENCE_STEPS.length - 1;
const TOTAL_SEQUENCE_DURATION_MS = SEQUENCE_STEPS.reduce(
  (total, step) => total + step.durationMs,
  0,
);
const FINAL_ANNOUNCEMENT =
  "Observation sequence complete. The form is now in focus.";

function getBaseAwareImageUrl(fileName: string): string {
  return getMainPageAssetUrl(`authentication/${fileName}`);
}

const authenticationAssets = {
  hand: getBaseAwareImageUrl("hand.webp"),
  tokens: METHOD_TOKENS.map((token) => ({
    ...token,
    src: getBaseAwareImageUrl(token.image),
  })),
} as const;

function getInitialReducedMotionPreference(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getStepIndexForElapsed(elapsedMs: number): number {
  let boundary = 0;

  for (let index = 0; index < SEQUENCE_STEPS.length; index += 1) {
    boundary += SEQUENCE_STEPS[index].durationMs;
    if (elapsedMs < boundary) return index;
  }

  return LAST_STEP_INDEX;
}

function getElapsedAtStepStart(stepIndex: number): number {
  return SEQUENCE_STEPS.slice(0, stepIndex).reduce(
    (total, step) => total + step.durationMs,
    0,
  );
}

export function AuthenticationStorySection({
  section,
}: AuthenticationStorySectionProps) {
  const titleId = `${section.id}-title`;
  const sceneId = `${section.id}-sequence-scene`;
  const artworkRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const elapsedRef = useRef(0);
  const pausedTransitionsRef = useRef<Animation[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    getInitialReducedMotionPreference,
  );
  const initialStepIndex = prefersReducedMotion ? LAST_STEP_INDEX : 0;
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const currentStepIndexRef = useRef(initialStepIndex);
  const [isRunning, setIsRunning] = useState(false);
  const [isArtworkVisible, setIsArtworkVisible] = useState(false);
  const [isArtworkReady, setIsArtworkReady] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [hasAutoPlayed, setHasAutoPlayed] = useState(prefersReducedMotion);
  const hasAutoPlayedRef = useRef(prefersReducedMotion);
  const [sequenceRun, setSequenceRun] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  // On large screens the steps follow the scroll position instead of a timer.
  const isScrollDriven = useScrollStepsEnabled() && !prefersReducedMotion;
  // Large screens: the skincare group from the section before arrives with a
  // QR label that becomes this section's (see KBeautyStorySection); the text
  // waits until the phone has scanned it.
  const isZoomLinked = useStoryZoomLink() && isScrollDriven;
  const { stepIndex: scrollStepIndex, scrollToStep } = useScrollSteps({
    trackRef,
    pinRef,
    stepCount: SEQUENCE_STEPS.length,
    enabled: isScrollDriven,
    stepLength: 0.38,
  });

  // How far the artwork has to move to sit in the middle of the pin, where
  // it opens in the linked scene (styles/authentication-story.css).
  useLayoutEffect(() => {
    const pin = pinRef.current;
    const demo = pin?.querySelector<HTMLElement>(".auth-sequence__demo");
    if (!isZoomLinked || !pin || !demo) return;

    const measure = () => {
      const shift =
        pin.offsetWidth / 2 - (demo.offsetLeft + demo.offsetWidth / 2);
      pin.style.setProperty("--demo-center-shift", shift.toFixed(1));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pin);
    observer.observe(demo);
    return () => {
      observer.disconnect();
      pin.style.removeProperty("--demo-center-shift");
    };
  }, [isZoomLinked]);

  const setCurrentStep = useCallback((nextStepIndex: number) => {
    currentStepIndexRef.current = nextStepIndex;
    setCurrentStepIndex(nextStepIndex);
  }, []);

  const markAutoplayUsed = useCallback(() => {
    hasAutoPlayedRef.current = true;
    setHasAutoPlayed(true);
  }, []);

  const startSequence = useCallback(() => {
    markAutoplayUsed();
    setSequenceRun((currentRun) => currentRun + 1);

    if (prefersReducedMotion) {
      elapsedRef.current = TOTAL_SEQUENCE_DURATION_MS;
      setCurrentStep(LAST_STEP_INDEX);
      setIsRunning(false);
      return;
    }

    elapsedRef.current = 0;
    setCurrentStep(0);
    setIsRunning(true);
    setAnnouncement("");
  }, [markAutoplayUsed, prefersReducedMotion, setCurrentStep]);

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
    const artworkNode = artworkRef.current;

    if (!artworkNode || !("IntersectionObserver" in window)) {
      setIsArtworkVisible(true);
      setIsArtworkReady(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setIsArtworkVisible(entry.isIntersecting);
        setIsArtworkReady(
          entry.isIntersecting && entry.intersectionRatio >= 0.25,
        );
      },
      { threshold: [0, 0.25] },
    );

    observer.observe(artworkNode);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion) return;

    markAutoplayUsed();
    elapsedRef.current = TOTAL_SEQUENCE_DURATION_MS;
    setIsRunning(false);
    setCurrentStep(LAST_STEP_INDEX);
  }, [markAutoplayUsed, prefersReducedMotion, setCurrentStep]);

  useEffect(() => {
    if (
      !isArtworkReady ||
      prefersReducedMotion ||
      isScrollDriven ||
      hasAutoPlayedRef.current
    ) {
      return;
    }

    startSequence();
  }, [isArtworkReady, isScrollDriven, prefersReducedMotion, startSequence]);

  useEffect(() => {
    if (isScrollDriven && scrollStepIndex === LAST_STEP_INDEX) {
      setAnnouncement(FINAL_ANNOUNCEMENT);
    }
  }, [isScrollDriven, scrollStepIndex]);

  // In scroll mode each step's own animation plays whenever it is reached.
  const isSequenceActive = isScrollDriven || isRunning;
  const isEnvironmentPaused = !isArtworkVisible || !isPageVisible;
  const isSequencePaused = isSequenceActive && isEnvironmentPaused;

  useLayoutEffect(() => {
    const artwork = artworkRef.current;
    if (!artwork || typeof artwork.getAnimations !== "function") return;

    // CSS keyframes use animation-play-state; transitions need the Web Animations API.
    if (isSequencePaused) {
      pausedTransitionsRef.current = artwork
        .getAnimations({ subtree: true })
        .filter((animation) => "transitionProperty" in animation);
      pausedTransitionsRef.current.forEach((animation) => animation.pause());
    } else {
      pausedTransitionsRef.current.forEach((animation) => {
        if (animation.playState === "paused") animation.play();
      });
      pausedTransitionsRef.current = [];
    }
  }, [isSequencePaused, sequenceRun]);

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

      const nextStepIndex = getStepIndexForElapsed(elapsedRef.current);
      if (nextStepIndex !== currentStepIndexRef.current) {
        setCurrentStep(nextStepIndex);
        if (nextStepIndex === LAST_STEP_INDEX) {
          setAnnouncement(FINAL_ANNOUNCEMENT);
        }
      }

      if (elapsedRef.current >= TOTAL_SEQUENCE_DURATION_MS) {
        elapsedRef.current = TOTAL_SEQUENCE_DURATION_MS;
        if (currentStepIndexRef.current !== LAST_STEP_INDEX) {
          setCurrentStep(LAST_STEP_INDEX);
          setAnnouncement(FINAL_ANNOUNCEMENT);
        }
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
    setCurrentStep,
  ]);

  const handleStepSelection = (stepId: SequenceStepId) => {
    const nextStepIndex = SEQUENCE_STEPS.findIndex(
      (step) => step.id === stepId,
    );
    if (nextStepIndex < 0) return;

    if (isScrollDriven) {
      scrollToStep(nextStepIndex);
      return;
    }

    markAutoplayUsed();
    elapsedRef.current = getElapsedAtStepStart(nextStepIndex);
    setIsRunning(false);
    setCurrentStep(nextStepIndex);
    setSequenceRun((currentRun) => currentRun + 1);
    setAnnouncement(
      `Selected step ${nextStepIndex + 1} of ${SEQUENCE_STEPS.length}: ${SEQUENCE_STEPS[nextStepIndex].description}`,
    );
  };

  const currentStep =
    SEQUENCE_STEPS[isScrollDriven ? scrollStepIndex : currentStepIndex];
  const sceneStyle = {
    "--auth-sequence-step-duration": `${currentStep.durationMs}ms`,
    "--auth-sequence-total-duration": `${TOTAL_SEQUENCE_DURATION_MS}ms`,
  } as CSSProperties;
  const sequenceData = {
    "data-sequence-step": currentStep.id,
    "data-sequence-running": isSequenceActive ? "true" : "false",
    "data-sequence-paused": isSequencePaused ? "true" : "false",
    "data-sequence-run": sequenceRun,
  } as const;

  return (
    <section
      id={section.id}
      className="home-section home-story-section home-story-section--products-authenticated-today authentication-story auth-sequence"
      data-home-section={section.id}
      data-section-number={section.number}
      data-sequence-autoplay-used={hasAutoPlayed ? "true" : "false"}
      data-reduced-motion={prefersReducedMotion ? "true" : "false"}
      data-zoom-linked={isZoomLinked ? "true" : "false"}
      aria-labelledby={titleId}
      {...sequenceData}
    >
      <div
        ref={trackRef}
        className="scroll-steps-track"
        data-scroll-driven={isScrollDriven ? "true" : "false"}
      >
        <div
          ref={pinRef}
          className="authentication-story__inner scroll-steps-pin"
        >
          <div className="authentication-story__content">
            <h2
              id={titleId}
              className="home-story-section__title authentication-story__title"
            >
              {section.title}
            </h2>
            <p className="home-story-section__body authentication-story__body">
              {section.body}
            </p>
          </div>

          <div className="auth-sequence__demo">
            <div
              ref={artworkRef}
              id={sceneId}
              className="auth-sequence__artwork"
              data-reduced-motion={prefersReducedMotion ? "true" : "false"}
              style={sceneStyle}
              role="img"
              aria-label="Illustrative observation sequence showing framing, focus, light, indexing, and response."
              {...sequenceData}
            >
              <div key={sequenceRun} className="auth-sequence__motion-layer">
                <IllustratedPhone
                  className="auth-sequence__phone-stage"
                  screenClassName="auth-sequence__phone-screen"
                  foreground={
                    <>
                      <img
                        className="auth-sequence__asset auth-sequence__hand"
                        data-art-piece="hand"
                        src={authenticationAssets.hand}
                        alt=""
                        width="1254"
                        height="1254"
                        draggable="false"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Sits under the phone and turns with it. */}
                      <p className="auth-sequence__surface-note">
                        Easy to apply, but still on the surface.
                      </p>
                    </>
                  }
                >
                  <div className="auth-sequence__phone-ui auth-sequence__phone-ui--intro">
                    SCAN
                  </div>
                  <div className="auth-sequence__phone-ui auth-sequence__phone-ui--camera">
                    <div className="auth-camera__header">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M3 7h4l2-3h6l2 3h4v13H3Z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span>Focusner</span>
                      <small>DEMO</small>
                    </div>
                    <div className="auth-camera__viewfinder">
                      <img
                        className="auth-camera__qr"
                        src={authenticationAssets.tokens[0].src}
                        alt=""
                        width="1254"
                        height="1254"
                        draggable="false"
                      />
                      <span className="auth-camera__focus-frame">
                        <i />
                        <i />
                        <i />
                        <i />
                        <span className="auth-camera__scan-line" />
                      </span>
                      <span className="auth-camera__aim-hint">
                        Bring the form into view
                      </span>
                      <span className="auth-camera__scanning-hint">
                        Focusing…
                      </span>
                      <span className="auth-camera__zoom">1×</span>
                    </div>
                    <div className="auth-camera__result">
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m7 12 3 3 7-7" />
                      </svg>
                      <span>
                        <strong>Form in focus</strong>
                        <small>Observation study</small>
                      </span>
                    </div>
                    <div className="auth-camera__footer">
                      <span>Camera preview</span>
                      <span className="auth-camera__shutter" />
                      <small>Illustrative demo</small>
                    </div>
                  </div>

                  <div className="auth-sequence__phone-ui auth-sequence__phone-ui--serial">
                    <span className="auth-sequence__serial-value">
                      ATLAS001
                    </span>
                  </div>

                  <div className="auth-sequence__phone-ui auth-sequence__phone-ui--nfc">
                    <span className="auth-sequence__nfc-waves">
                      <i />
                      <i />
                      <i />
                    </span>
                  </div>

                  <div className="auth-sequence__phone-ui auth-sequence__phone-ui--verified">
                    <svg
                      className="auth-sequence__verified-tick"
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="32" cy="32" r="28" />
                      <path d="m18 33 9 9 19-21" />
                    </svg>
                    <span className="auth-sequence__verified-copy">
                      <strong>In focus</strong>
                      <small>Demo</small>
                    </span>
                  </div>
                </IllustratedPhone>

                {authenticationAssets.tokens.map((token) => (
                  <figure
                    key={token.method}
                    className={`auth-sequence__token auth-sequence__token--${token.method}`}
                    data-art-piece={`${token.method}-paper`}
                  >
                    <div className="auth-sequence__token-art">
                      {token.method === "nfc" ? (
                        <NfcPaperMark className="auth-sequence__nfc-paper-mark" />
                      ) : (
                        <img
                          className="auth-sequence__asset auth-sequence__token-image"
                          src={token.src}
                          alt=""
                          width="1254"
                          height="1254"
                          draggable="false"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      {token.method === "serial" ? (
                        <span className="auth-sequence__token-number">
                          ATLAS001
                        </span>
                      ) : null}
                    </div>
                    <figcaption className="auth-sequence__token-caption">
                      <strong>{token.label}</strong>
                      <span>{token.subtitle}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="auth-sequence__controls">
              <div
                className="auth-sequence__steps"
                role="group"
                aria-label="Observation sequence steps"
                style={
                  {
                    "--step-count": SEQUENCE_STEPS.length,
                    "--step-index": SEQUENCE_STEPS.indexOf(currentStep),
                  } as CSSProperties
                }
              >
                {SEQUENCE_STEPS.map((step, index) => (
                  <button
                    key={step.id}
                    className="auth-sequence__step-button"
                    type="button"
                    data-sequence-step-control={step.id}
                    aria-controls={sceneId}
                    aria-pressed={currentStep.id === step.id}
                    aria-label={`Show step ${index + 1} of ${SEQUENCE_STEPS.length}: ${step.controlLabel}`}
                    onClick={() => handleStepSelection(step.id)}
                  >
                    <span className="auth-sequence__step-label">
                      {step.controlLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary note: collapsed so it stays available without
                competing with the illustration. */}
            <details className="auth-sequence__notes">
              <summary>About this illustration</summary>
              <div className="auth-sequence__notes-panel">
                <p className="auth-sequence__disclaimer">
                  A visual study of looking closer. The scene uses animation and
                  illustrative forms; no camera access or measurements are used.
                </p>
              </div>
            </details>
            <p
              className="visually-hidden auth-sequence__announcement"
              aria-live="polite"
              aria-atomic="true"
            >
              {announcement}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
