import { stringToSlug } from "../../utils";
import { CONTACT, SPONSORS } from "./config";
import "./Footer.css";

export function Footer() {
  const teamYear = import.meta.env.VITE_TEAM_YEAR;
  const teamName = import.meta.env.VITE_TEAM_NAME;
  const teamSlug = stringToSlug(teamName);

  return (
    <footer className="site-footer mt-5">
      <div className="container">
        <div className="row g-5 mb-5">
          <section className="col-lg-7">
            <h2 className="footer-label">Sponsor</h2>
            <ul className="footer-sponsors">
              {SPONSORS.map(({ name, logo, href }) => (
                <li key={name}>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      <img src={logo} alt={name} />
                    </a>
                  ) : (
                    <img src={logo} alt={name} />
                  )}
                </li>
              ))}
            </ul>
          </section>
          <section className="col-lg-5">
            <h2 className="footer-label">Contact</h2>
            <dl className="footer-contact">
              <div>
                <dt>Call</dt>
                <dd>
                  <a href={`tel:${CONTACT.call}`}>{CONTACT.call}</a>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{CONTACT.address}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* The following MUST be on every page: license information and link to the repository on gitlab.igem.org */}
        <div className="footer-legal text-center">
          <p className="mb-2">
            <small>
              © {teamYear} - Content on this site is licensed under a{" "}
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
              The repository used to create this website is available at{" "}
              <a href={`https://gitlab.igem.org/${teamYear}/${teamSlug}`}>
                gitlab.igem.org/{teamYear}/{teamSlug}
              </a>
              .
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
}
