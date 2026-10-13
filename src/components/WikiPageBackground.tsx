import { useRef, type ReactNode } from "react";
import { Header } from "./Header";
import { SectionNavigation } from "./SectionNavigation";
import { usePageSections } from "./usePageSections";
import { TEAM_MEMBERS_PATH } from "../pages";

interface WikiPageBackgroundProps {
  children: ReactNode;
  title: string;
  lead: string;
  pathname?: string;
}

export function WikiPageBackground({
  children,
  title,
  lead,
  pathname,
}: WikiPageBackgroundProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const sections = usePageSections(contentRef);
  const isTeamPage = pathname === TEAM_MEMBERS_PATH;
  // A table of contents needs at least two places to go.
  const showSectionNavigation = sections.length > 1;
  const layoutClassName = [
    "container",
    "wiki-documentation-grid",
    showSectionNavigation ? null : "wiki-documentation-grid--single",
    isTeamPage ? "wiki-documentation-grid--team" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main
      id="main-content"
      className="wiki-page-background"
      data-page={pathname}
    >
      <Header title={title} lead={lead} withInspectionLight />
      <div className={layoutClassName}>
        {showSectionNavigation ? (
          <SectionNavigation title={title} sections={sections} />
        ) : null}
        <div ref={contentRef} className="wiki-page-content">
          {children}
        </div>
      </div>
    </main>
  );
}
