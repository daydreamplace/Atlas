import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pages from "../pages";

type SectionPage = {
  label: string;
  path: string;
  id?: string;
};

type NavigationSection = {
  label: string;
  pages: SectionPage[];
};

const navigationSections: NavigationSection[] = Pages.flatMap((item) => {
  if ("folder" in item && item.folder) {
    const sectionPages = item.folder.flatMap((page) =>
      page.path
        ? [{ label: page.name || page.title || "Untitled", path: page.path }]
        : [],
    );

    return sectionPages.length
      ? [{ label: item.name || "Section", pages: sectionPages }]
      : [];
  }

  if ("path" in item && item.path && item.path !== "/") {
    return [
      {
        label: item.name || item.title || "Page",
        pages: [
          {
            label: item.name || item.title || "Untitled",
            path: item.path,
          },
        ],
      },
    ];
  }

  return [];
});

const teamNavigationSection: NavigationSection = {
  label: "Team",
  pages: ["Members", "PI", "Instructor", "Advisor"].map((label) => ({
    id: `group-${label.toLowerCase()}`,
    label,
    path: `/team#group-${label.toLowerCase()}`,
  })),
};

export function SectionNavigation({ pathname }: { pathname: string }) {
  const isTeamPage = pathname === "/team";
  const section = isTeamPage
    ? teamNavigationSection
    : navigationSections.find((candidate) =>
        candidate.pages.some((page) => page.path === pathname),
      );
  const [activeSectionId, setActiveSectionId] = useState(
    teamNavigationSection.pages[0].id,
  );

  useEffect(() => {
    if (!isTeamPage) return;

    const updateActiveSection = () => {
      let nextId = teamNavigationSection.pages[0].id;

      teamNavigationSection.pages.forEach((page) => {
        if (!page.id) return;
        const element = document.getElementById(page.id);
        if (!element) return;
        // Match the CSS scroll-margin-top so a group counts as current as
        // soon as an SNB click scrolls it into place, at any screen size.
        const offset = parseFloat(getComputedStyle(element).scrollMarginTop);
        if (element.getBoundingClientRect().top <= (offset || 0) + 8) {
          nextId = page.id;
        }
      });

      setActiveSectionId(nextId);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, [isTeamPage]);

  if (!section) return null;

  return (
    <nav className="snb" aria-label={`${section.label} section navigation`}>
      <p className="snb-label">Section</p>
      <h2>{section.label}</h2>
      <ol>
        {section.pages.map((page) => {
          const isCurrent = page.id
            ? page.id === activeSectionId
            : page.path === pathname;
          const content = <strong>{page.label}</strong>;

          return (
            <li key={page.path}>
              {page.id ? (
                <a
                  href={`#${page.id}`}
                  className={isCurrent ? "active" : undefined}
                  aria-current={isCurrent ? "location" : undefined}
                  onClick={() => setActiveSectionId(page.id)}
                >
                  {content}
                </a>
              ) : (
                <Link
                  to={page.path}
                  className={isCurrent ? "active" : undefined}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
