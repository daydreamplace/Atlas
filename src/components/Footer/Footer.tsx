import "./Footer.css";

export function Footer() {
  return (
    <footer className="site-footer mt-5">
      <div className="container">
        <div className="row g-5 mb-5">
          <section className="col-lg-7">
            <h2 className="footer-label">Atlas / bin(ary)room</h2>
            <p className="footer-project-note">
              A personal web portfolio exploring microbe-inspired forms,
              movement, and perspective. Illustrative visual studies, with
              interaction at their core.
            </p>
          </section>
          <section className="col-lg-5">
            <h2 className="footer-label">Explore</h2>
            <dl className="footer-contact">
              <div>
                <dt>Source</dt>
                <dd>
                  <a href="https://github.com/daydreamplace/Atlas">
                    GitHub / Atlas ↗
                  </a>
                </dd>
              </div>
              <div>
                <dt>By</dt>
                <dd>bin(ary)room</dd>
              </div>
              <div>
                <dt>Field</dt>
                <dd>Visual design & creative development</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* The following MUST be on every page: license information and link to the repository on gitlab.igem.org */}
        <div className="footer-legal text-center">
          <p className="mb-2">
            <small>
              © 2026 - Content on this site is licensed under a{" "}
              <a
                className="subfoot"
                href="https://creativecommons.org/licenses/by/4.0/"
                rel="license"
              >
                Creative Commons Attribution 4.0 International license
              </a>
              .
            </small>
          </p>
          <p className="mb-0">
            <small>
              Adapted from the original source at{" "}
              <a href="https://gitlab.igem.org/2026/psi-korea">
                gitlab.igem.org/2026/psi-korea
              </a>
              .
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
}
