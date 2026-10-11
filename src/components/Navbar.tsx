import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Pages from "../pages.ts";
import { useAutoHideGnb } from "./useAutoHideGnb";

export function Navbar() {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = window.localStorage.getItem("psi-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { hidden, reveal } = useAutoHideGnb({
    menuOpen: menuOpen || openDropdown !== null,
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("psi-theme", theme);
  }, [theme]);

  const pages = Pages.map((item, pageIndex) => {
    if ("folder" in item && item.folder) {
      const folderItems = item.folder.map((subpage, subpageIndex) => {
        if (subpage.path) {
          return (
            <NavDropdown.Item
              key={`subpage-${pageIndex}-${subpageIndex}`}
              as={Link}
              to={subpage.path}
              className={pathname === subpage.path ? "active" : undefined}
              aria-current={pathname === subpage.path ? "page" : undefined}
              onClick={() => {
                setOpenDropdown(null);
                setMenuOpen(false);
              }}
            >
              {subpage.name}
            </NavDropdown.Item>
          );
        }
      });
      return (
        <NavDropdown
          key={`page-${pageIndex}`}
          title={item.name}
          id={`page-${pageIndex}`}
          active={item.folder.some((subpage) => subpage.path === pathname)}
          show={openDropdown === pageIndex}
          onToggle={(isOpen) => setOpenDropdown(isOpen ? pageIndex : null)}
          onMouseEnter={() => setOpenDropdown(pageIndex)}
          onMouseLeave={() => setOpenDropdown(null)}
        >
          {folderItems}
        </NavDropdown>
      );
    } else if ("path" in item && item.path) {
      return (
        <Nav.Link
          key={`page-${pageIndex}`}
          as={Link}
          to={item.path}
          className={pathname === item.path ? "active" : undefined}
          aria-current={pathname === item.path ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          {item.name}
        </Nav.Link>
      );
    }
  });

  return (
    <>
      <BootstrapNavbar
        expand="lg"
        className={`site-navigation${hidden ? " is-hidden" : ""}`}
        fixed="top"
        variant="dark"
        expanded={menuOpen}
        onToggle={setMenuOpen}
      >
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Container>
          <BootstrapNavbar.Brand as={Link} to="/">
            {import.meta.env.VITE_TEAM_NAME}
          </BootstrapNavbar.Brand>
          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme((current) => (current === "light" ? "dark" : "light"))
            }
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            aria-pressed={theme === "dark"}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <span className="theme-toggle__track" aria-hidden="true">
              <span className="theme-toggle__thumb">
                {theme === "light" ? "☀" : "☾"}
              </span>
            </span>
            <span className="theme-toggle__label">
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="left-aligned">{pages}</Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Shown while the GNB is tucked away; brings it back. */}
      <button
        type="button"
        className={`gnb-reveal${hidden ? " is-visible" : ""}`}
        onClick={reveal}
        aria-label="Show navigation"
        tabIndex={hidden ? 0 : -1}
        aria-hidden={!hidden}
      >
        <span aria-hidden="true" />
      </button>
    </>
  );
}
