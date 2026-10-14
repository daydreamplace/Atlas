import { useId } from "react";
import { getMainPageAssetUrl } from "../../utils/wikiAssets";
import "../../styles/nfc-paper-mark.css";

interface NfcPaperMarkProps {
  readonly className?: string;
}

const nfcPaperMarkAssets = {
  paper: getMainPageAssetUrl("authentication/nfc-paper-blank-v3.webp"),
} as const;

/**
 * Paper scrap with a generic "contactless" symbol (a dot and three signal
 * arcs) drawn in pencil. Deliberately not the NFC Forum N-Mark, so no
 * trademark notice is needed.
 */
export function NfcPaperMark({ className = "" }: NfcPaperMarkProps) {
  const pencilFilterId = `nfc-pencil-${useId().replace(/:/g, "")}`;

  return (
    <span
      className={`nfc-paper-mark ${className}`.trim()}
      data-art-piece="nfc-contactless-illustration"
      aria-hidden="true"
    >
      <img
        className="nfc-paper-mark__paper"
        src={nfcPaperMarkAssets.paper}
        alt=""
        width="1254"
        height="1254"
        draggable="false"
        loading="lazy"
        decoding="async"
      />
      <svg
        className="nfc-paper-mark__mark"
        viewBox="0 0 100 100"
        focusable="false"
      >
        <defs>
          {/* Slightly wobbly, grainy strokes so it reads as pencil. */}
          <filter
            id={pencilFilterId}
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              seed="7"
            />
            <feDisplacementMap in="SourceGraphic" scale="2.4" />
          </filter>
        </defs>
        <g
          filter={`url(#${pencilFilterId})`}
          fill="none"
          stroke="#2f2a33"
          strokeLinecap="round"
        >
          <circle cx="28" cy="50" r="5" fill="#2f2a33" stroke="none" />
          <path d="M39 37.5a16 16 0 0 1 0 25" strokeWidth="6" />
          <path d="M47 28a28 28 0 0 1 0 44" strokeWidth="6" />
          <path d="M55 19a40 40 0 0 1 0 62" strokeWidth="6" />
          {/* Lighter second pass, offset a little, like re-traced pencil. */}
          <g stroke="#5a5260" strokeWidth="2" opacity="0.6">
            <path d="M40 36.5a17 17 0 0 1 0 27" />
            <path d="M48 27a29 29 0 0 1 0 46" />
            <path d="M56 18a41 41 0 0 1 0 64" />
          </g>
        </g>
      </svg>
    </span>
  );
}
