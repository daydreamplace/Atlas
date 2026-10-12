import "../../styles/story-connective.css";
import { useRevealOnScroll } from "./useRevealOnScroll";

interface StoryConnectiveProps {
  readonly word: string;
}

/**
 * A single handwritten linking word between two story sections ("However,"),
 * written in as it scrolls into view to signal the turn in the argument.
 */
export function StoryConnective({ word }: StoryConnectiveProps) {
  const ref = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className="home-connective">
      <p className="home-connective__word">
        {word}
        <svg
          className="home-connective__underline"
          viewBox="0 0 300 24"
          aria-hidden="true"
          focusable="false"
        >
          <path pathLength="1" d="M4 15 C58 5 104 20 152 11 S250 6 296 13" />
        </svg>
      </p>
    </div>
  );
}
