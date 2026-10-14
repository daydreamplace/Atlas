interface AuthenticityStampProps {
  readonly variant: "fake" | "authentic";
}

export function AuthenticityStamp({ variant }: AuthenticityStampProps) {
  const isFake = variant === "fake";

  return (
    <svg
      className={`authenticity-stamp authenticity-stamp--${variant}`}
      viewBox="0 0 220 138"
      aria-hidden="true"
      focusable="false"
    >
      <g className="authenticity-stamp__signal">
        {isFake ? (
          <>
            <path
              className="authenticity-stamp__icon"
              d="M34 8 68 65H0L34 8Z"
            />
            <path
              className="authenticity-stamp__icon-detail"
              d="M34 27v19m0 9v2"
            />
          </>
        ) : (
          <>
            <circle
              className="authenticity-stamp__icon"
              cx="34"
              cy="36"
              r="31"
            />
            <path
              className="authenticity-stamp__icon-detail"
              d="m17 37 11 11 23-27"
            />
          </>
        )}

        <g className="authenticity-stamp__label">
          <rect x="7" y="71" width="206" height="55" rx="4" />
          <rect x="12" y="76" width="196" height="45" rx="2" />
          <text x="110" y="109" textAnchor="middle">
            {isFake ? "NEAR" : "FAR"}
          </text>
        </g>
      </g>
    </svg>
  );
}
