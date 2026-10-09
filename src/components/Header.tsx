interface HeaderProps {
  title: string;
  lead: string;
  withInspectionLight?: boolean;
}

export function Header({
  title,
  lead,
  withInspectionLight = false,
}: HeaderProps) {
  return (
    <header className="bg-hero py-5 mb-5">
      {withInspectionLight ? (
        <div className="inspection-light" aria-hidden="true" />
      ) : null}
      <div className="container h-100">
        <div className="row h-100 align-items-center">
          <div className="col-lg-12">
            <h1 className="display-4 text-white mt-5 mb-2">{title}</h1>
            <p className="lead mb-5 text-white-50">{lead}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
