import { useEffect, useState, type RefObject } from "react";
import { stringToSlug } from "../utils/stringToSlug";

export interface PageSection {
  id: string;
  label: string;
}

/*
  What the SNB lists: every <h2> in the page content, plus any element marked
  with data-toc="Label" (the team page marks its member groups this way).
  Headings without an id get one from their text. Dialogs are left out.
*/
const SECTION_SELECTOR = "h2, [data-toc]";

function readSections(content: HTMLElement): PageSection[] {
  const usedIds = new Set<string>();
  const sections: PageSection[] = [];

  content.querySelectorAll<HTMLElement>(SECTION_SELECTOR).forEach((element) => {
    if (element.closest('[aria-modal="true"]')) return;
    const label = (element.dataset.toc || element.textContent || "").trim();
    if (!label) return;

    if (!element.id) {
      const base = stringToSlug(label) || "section";
      let id = base;
      for (let count = 2; usedIds.has(id) || document.getElementById(id);) {
        id = `${base}-${count++}`;
      }
      element.id = id;
    }
    usedIds.add(element.id);
    sections.push({ id: element.id, label });
  });

  return sections;
}

/** The sections of the page in `contentRef`, kept up to date as it renders. */
export function usePageSections(
  contentRef: RefObject<HTMLElement | null>,
): PageSection[] {
  const [sections, setSections] = useState<PageSection[]>([]);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const update = () => {
      const next = readSections(content);
      setSections((current) =>
        current.length === next.length &&
        current.every(
          (section, index) =>
            section.id === next[index].id &&
            section.label === next[index].label,
        )
          ? current
          : next,
      );
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => observer.disconnect();
  }, [contentRef]);

  return sections;
}
