import { useEffect, useRef, useState } from "react";
import type { PageSection } from "./usePageSections";

interface SectionNavigationProps {
  title: string;
  sections: PageSection[];
}

/** Table of contents for the current page: jumps to its section titles. */
export function SectionNavigation({ title, sections }: SectionNavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const clickedIdRef = useRef<string | undefined>(undefined);
  const [activeId, setActiveId] = useState<string | undefined>(sections[0]?.id);

  useEffect(() => {
    const updateActiveSection = () => {
      let nextId = sections[0]?.id;

      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return;
        // Match the CSS scroll-margin-top so a section counts as current as
        // soon as an SNB click scrolls it into place, at any screen size.
        const offset = parseFloat(getComputedStyle(element).scrollMarginTop);
        if (element.getBoundingClientRect().top <= (offset || 0) + 8) {
          nextId = id;
        }
      });

      // The last sections may be too short to ever reach the top: at the
      // bottom of the page the one just clicked wins, otherwise the last.
      const page = document.documentElement;
      if (window.innerHeight + window.scrollY >= page.scrollHeight - 2) {
        const clicked = sections.find(({ id }) => id === clickedIdRef.current);
        nextId = clicked?.id ?? sections[sections.length - 1]?.id;
      }

      setActiveId(nextId);
    };

    // Scrolling by hand ends the effect of the last click.
    const forgetClick = () => {
      clickedIdRef.current = undefined;
    };
    const manualScrollEvents = ["wheel", "touchmove", "keydown"] as const;

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    manualScrollEvents.forEach((type) =>
      window.addEventListener(type, forgetClick, { passive: true }),
    );
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      manualScrollEvents.forEach((type) =>
        window.removeEventListener(type, forgetClick),
      );
    };
  }, [sections]);

  // On small screens the SNB is a horizontal strip: keep the current section
  // in view as the reader scrolls down the page.
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>("a.active");
    if (!nav || !link || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({
      left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeId]);

  return (
    <nav ref={navRef} className="snb" aria-label="On this page">
      <p className="snb-label">On this page</p>
      <h2>{title}</h2>
      <ol>
        {sections.map(({ id, label }) => {
          const isCurrent = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                className={isCurrent ? "active" : undefined}
                aria-current={isCurrent ? "location" : undefined}
                onClick={() => {
                  clickedIdRef.current = id;
                  setActiveId(id);
                }}
              >
                <strong>{label}</strong>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
