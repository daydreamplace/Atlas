import { useId } from "react";

export type AuthenticationMethod = "qr" | "hologram" | "serial" | "nfc";

interface AuthenticationMarkProps {
  method: AuthenticationMethod;
  className?: string;
}

// Illustrative symbols only: no real product URL, credential, or verification data.
const QR_MODULES = [
  [8, 0],
  [10, 0],
  [12, 0],
  [8, 2],
  [9, 3],
  [11, 2],
  [12, 4],
  [0, 8],
  [2, 8],
  [4, 8],
  [6, 9],
  [8, 7],
  [10, 6],
  [12, 8],
  [14, 8],
  [16, 8],
  [18, 8],
  [20, 8],
  [1, 10],
  [3, 10],
  [5, 11],
  [7, 10],
  [9, 9],
  [11, 10],
  [13, 11],
  [15, 10],
  [17, 11],
  [19, 10],
  [0, 12],
  [3, 12],
  [6, 12],
  [8, 12],
  [10, 13],
  [12, 12],
  [15, 13],
  [18, 12],
  [20, 13],
  [8, 15],
  [10, 15],
  [12, 16],
  [14, 15],
  [17, 15],
  [19, 16],
  [8, 18],
  [9, 20],
  [11, 18],
  [13, 19],
  [15, 18],
  [17, 20],
  [19, 18],
  [20, 20],
];
const BAR_WIDTHS = [2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2, 1];

export function AuthenticationMark({
  method,
  className = "",
}: AuthenticationMarkProps) {
  const gradientId = useId();
  return (
    <svg
      className={`authentication-mark authentication-mark--${method} ${className}`}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="3"
        y="3"
        width="114"
        height="114"
        rx={method === "hologram" ? 13 : 3}
        fill="#f1ecdd"
        stroke="#68606b"
        strokeWidth="1.3"
      />
      {method === "qr" ? (
        <g fill="#39333d" transform="translate(13 13) scale(4.48)">
          {[
            [0, 0],
            [14, 0],
            [0, 14],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <path
                d={`M${x} ${y}h7v7h-7z M${x + 1} ${y + 1}v5h5v-5z`}
                fillRule="evenodd"
              />
              <rect x={x + 2} y={y + 2} width="3" height="3" />
            </g>
          ))}
          {QR_MODULES.map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
          ))}
        </g>
      ) : null}
      {method === "hologram" ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#bcc4a1" />
              <stop offset=".25" stopColor="#beafd5" />
              <stop offset=".5" stopColor="#d8b8b3" />
              <stop offset=".75" stopColor="#9fbabd" />
              <stop offset="1" stopColor="#ccbdde" />
            </linearGradient>
          </defs>
          <rect
            x="7"
            y="7"
            width="106"
            height="106"
            rx="10"
            fill={`url(#${gradientId})`}
          />
          <g fill="none" stroke="#f8f2df" strokeWidth="1.4" opacity=".88">
            <path d="M60 21 91 33v29c0 19-17 30-31 38-14-8-31-19-31-38V33Z" />
            <circle cx="60" cy="55" r="20" />
            <ellipse cx="60" cy="55" rx="9" ry="20" />
            <path d="M40 55h40M44 44h32M44 66h32M18 92 99 18M23 103l80-80" />
          </g>
        </>
      ) : null}
      {method === "serial" ? (
        <>
          <g fill="#39333d">
            {BAR_WIDTHS.map((width, index) => (
              <rect
                key={index}
                x={13 + index * 4.7}
                y="24"
                width={width}
                height="49"
              />
            ))}
          </g>
          <text
            x="60"
            y="93"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="13"
            fill="#39333d"
          >
            A1B3C2D4
          </text>
        </>
      ) : null}
      {method === "nfc" ? (
        <g
          fill="none"
          stroke="#655777"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M25 83V39l26 39V35M65 43c9 10 9 24 0 34M77 31c16 16 16 42 0 58M89 19c24 23 24 59 0 82" />
        </g>
      ) : null}
    </svg>
  );
}
