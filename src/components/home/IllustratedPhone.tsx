import type { ReactNode } from "react";
import { getMainPageAssetUrl } from "../../utils/wikiAssets";
import "../../styles/illustrated-phone.css";

interface IllustratedPhoneProps {
  readonly children: ReactNode;
  readonly foreground?: ReactNode;
  readonly className?: string;
  readonly screenClassName?: string;
}

const phoneFrame = getMainPageAssetUrl("authentication/phone.webp");

/**
 * Reusable illustrated device: put the scene in children, and gestures in
 * foreground. Animate the outer wrapper so the screen stays inside the bezel.
 * Coordinates describe the visible display in the original square phone asset.
 */
export function IllustratedPhone({
  children,
  foreground,
  className = "",
  screenClassName = "",
}: IllustratedPhoneProps) {
  return (
    <div
      className={`illustrated-phone ${className}`.trim()}
      data-art-piece="phone"
    >
      <img
        className="illustrated-phone__frame"
        src={phoneFrame}
        alt=""
        width="1254"
        height="1254"
        draggable="false"
        loading="lazy"
        decoding="async"
      />
      <div
        className={`illustrated-phone__screen ${screenClassName}`.trim()}
        data-phone-screen="true"
      >
        {children}
      </div>
      {foreground}
    </div>
  );
}
