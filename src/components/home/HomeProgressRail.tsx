import { useEffect, useState } from "react";
import { HOME_SECTIONS } from "../../data/homeContent";
import { HOME_CHAPTER_LABELS } from "../../data/homeExtras";
import "../../styles/progress-rail.css";

const CHAPTERS = HOME_SECTIONS.filter(
  (section) => HOME_CHAPTER_LABELS[section.number],
);

/** Dots on the right edge showing which chapter of the story is on screen. */
export function HomeProgressRail() {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          visible.set(entry.target.id, entry.isIntersecting),
        );
        // The last chapter crossing the middle of the screen wins.
        const current = [...CHAPTERS]
          .reverse()
          .find((chapter) => visible.get(chapter.id));
        setActiveId(current ? current.id : null);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );

    CHAPTERS.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`home-progress-rail${activeId ? " is-visible" : ""}`}
      aria-label="Story chapters"
    >
      <ol>
        {CHAPTERS.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              aria-current={chapter.id === activeId ? "step" : undefined}
            >
              <span className="home-progress-rail__label">
                {HOME_CHAPTER_LABELS[chapter.number]}
              </span>
              <span className="home-progress-rail__dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
