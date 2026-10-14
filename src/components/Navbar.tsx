import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useState } from "react";
import Pages from "../pages.ts";
import { useAutoHideGnb } from "./useAutoHideGnb";

export function Navbar() {
  const pathname = window.location.hash || "#home-hero";
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { hidden, reveal } = useAutoHideGnb({
    menuOpen: menuOpen || openDropdown !== null,
  });
  const pages = Pages.map((item, pageIndex) => {
    if ("folder" in item && item.folder) {
      const folderItems = item.folder.map((subpage, subpageIndex) => {
        if (subpage.path) {
          return (
            <NavDropdown.Item
              key={`subpage-${pageIndex}-${subpageIndex}`}
              as="a"
              href={subpage.path}
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
          as="a"
          href={item.path}
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
          <BootstrapNavbar.Brand as="a" href="#home-hero">
            bin(ary)room
          </BootstrapNavbar.Brand>
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
