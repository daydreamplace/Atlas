import { Link } from "react-router-dom";
import Pages from "../pages";

type SectionPage = {
  label: string;
  path: string;
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

export function SectionNavigation({ pathname }: { pathname: string }) {
  const section = navigationSections.find((candidate) =>
    candidate.pages.some((page) => page.path === pathname),
  );

  if (!section) return null;

  return (
    <nav className="snb" aria-label={`${section.label} section navigation`}>
      <p className="snb-label">Section</p>
      <h2>{section.label}</h2>
      <ol>
        {section.pages.map((page, index) => {
          const isCurrent = page.path === pathname;

          return (
            <li key={page.path}>
              <Link
                to={page.path}
                className={isCurrent ? "active" : undefined}
                aria-current={isCurrent ? "page" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{page.label}</strong>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
