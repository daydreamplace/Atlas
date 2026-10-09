import type { ReactNode } from "react";
import { Header } from "./Header";
import { SectionNavigation } from "./SectionNavigation";

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
  const isTeamPage = pathname === "/team";
  const showSectionNavigation = Boolean(pathname && !isTeamPage);
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
        {showSectionNavigation && pathname ? (
          <SectionNavigation pathname={pathname} />
        ) : null}
        <div className="wiki-page-content">{children}</div>
      </div>
    </main>
  );
}
