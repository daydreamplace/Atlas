export type HandDrawnMarkType = "arrow" | "not-equal";

interface HandDrawnMarkProps {
  readonly type: HandDrawnMarkType;
  readonly className?: string;
}

export function HandDrawnMark({ type, className = "" }: HandDrawnMarkProps) {
  const classes =
    `hand-drawn-mark hand-drawn-mark--${type} ${className}`.trim();

  if (type === "arrow") {
    return (
      <svg
        className={classes}
        data-hand-drawn-mark="arrow"
        viewBox="0 0 120 72"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M8 38.5c21-2.8 48 2.2 84-2.7"
          stroke="currentColor"
          strokeWidth="4.4"
          strokeLinecap="round"
        />
        <path
          d="M9 41.2c23-1.4 49 1.9 82-3.1"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.52"
        />
        <path
          d="M75.5 20.8c7.2 3.4 13.2 9.1 20.1 14.6-7.4 7.8-14.2 13.5-22 18.7"
          stroke="currentColor"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M77.4 18.7c6.5 4.7 12.4 10.4 20.5 16.5-6.1 7.5-13.5 14.6-21.5 20.4"
          stroke="currentColor"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.48"
        />
      </svg>
    );
  }

  return (
    <svg
      className={classes}
      data-hand-drawn-mark="not-equal"
      viewBox="0 0 100 80"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M14.5 25.8c20.2-2.4 45.8 2.5 72.2-.8"
        stroke="currentColor"
        strokeWidth="4.1"
        strokeLinecap="round"
      />
      <path
        d="M13.7 28.4c21.5-1.9 48.8 1.7 73.3-1.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M13.2 54.1c22.8 1.9 48.5-2.5 74.1.4"
        stroke="currentColor"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <path
        d="M14.8 51.6c20.5 2.1 47-1.8 71.4.7"
        stroke="currentColor"
        strokeWidth="1.05"
        strokeLinecap="round"
        opacity="0.46"
      />
      <path
        d="M69.8 9.4c-8.4 14.8-18.2 32.8-39.7 61.1"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M72.1 10.7c-9.5 16.8-20.3 35.9-39.6 60.3"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
