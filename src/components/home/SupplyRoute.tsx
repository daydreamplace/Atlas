import { useId } from "react";

interface SupplyRouteProps {
  readonly className?: string;
  readonly variant: "desktop" | "mobile";
}

const DESKTOP_PATHS = [
  "M92 320 C210 190 318 142 438 198 S575 94 682 118 S815 176 906 286",
  "M208 284 C326 342 420 328 514 358 S670 332 774 286",
] as const;

const MOBILE_PATHS = [
  "M180 70 C62 170 72 280 180 360 S296 536 180 646 S68 820 180 914 S292 1078 180 1210",
] as const;

export function SupplyRoute({ className = "", variant }: SupplyRouteProps) {
  const markerId = `supply-arrow-${useId().replace(/:/g, "")}`;
  const paths = variant === "desktop" ? DESKTOP_PATHS : MOBILE_PATHS;
  const viewBox = variant === "desktop" ? "0 0 1000 500" : "0 0 360 1280";

  return (
    <svg
      className={`supply-route supply-route--${variant} ${className}`.trim()}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="9"
          markerHeight="9"
          refX="7"
          refY="4.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            className="supply-route__arrowhead"
            d="M0 0 9 4.5 0 9l2.3-4.5Z"
          />
        </marker>
      </defs>

      {paths.map((path, index) => (
        <g
          key={path}
          className={`supply-route__segment supply-route__segment--${index + 1}`}
        >
          <path className="supply-route__track" d={path} />
          <path
            className="supply-route__flow"
            d={path}
            markerEnd={`url(#${markerId})`}
          />
          <path className="supply-route__moving-arrow" d="M-8-5 8 0-8 5-4 0Z">
            <animateMotion
              path={path}
              dur={variant === "desktop" ? "6.2s" : "9s"}
              begin={index === 0 ? "0s" : "-2.8s"}
              rotate="auto"
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}
    </svg>
  );
}
