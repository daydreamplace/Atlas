import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/tokens.css";
import "../../styles/fonts.css";
import "./App.css";
import "../../styles/global.css";
import "../../styles/home.css";
import "../../styles/typography.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { getPathMapping } from "../../utils";
import { useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { NotFound } from "../../components/NotFound";
import { Footer } from "../../components/Footer";
import { LoadingScreen } from "../../components/LoadingScreen";
import { StyleGuide } from "../../contents/style-guide";
import { WikiPageBackground } from "../../components/WikiPageBackground";

const App = () => {
  const { pathname: currentPath } = useLocation();
  const pathMapping = getPathMapping();

  // Set Page Title
  const title =
    currentPath in pathMapping
      ? pathMapping[currentPath].title
      : currentPath === "/style-guide"
        ? "Style Guide"
        : "Not Found";

  useEffect(() => {
    document.title = `${title || ""} | ${import.meta.env.VITE_TEAM_NAME} - iGEM ${import.meta.env.VITE_TEAM_YEAR}`;
  }, [title]);

  return (
    <>
      {/* Initial splash screen (every full page load) */}
      <LoadingScreen />

      {/* Navigation */}
      <Navbar />

      {/* Header and PageContent */}
      <Routes>
        {Object.entries(pathMapping).map(
          ([path, { title, lead, component: Component }]) => (
            <Route
              key={path}
              path={path}
              element={
                path === "/" ? (
                  <main id="main-content" className="home-page">
                    <Component />
                  </main>
                ) : (
                  <WikiPageBackground
                    title={title || ""}
                    lead={lead || ""}
                    pathname={path}
                  >
                    <Component />
                  </WikiPageBackground>
                )
              }
            />
          ),
        )}
        {/* Text style reference for the team; not linked from the GNB. */}
        <Route
          path="/style-guide"
          element={
            <WikiPageBackground
              title="Style Guide"
              lead="Every text style available on content pages, with how to use it."
            >
              <StyleGuide />
            </WikiPageBackground>
          }
        />
        <Route
          path="*"
          element={
            <WikiPageBackground
              title="Not Found"
              lead="The requested URL was not found on this server."
            >
              <NotFound />
            </WikiPageBackground>
          }
        />
      </Routes>

      {/* Footer */}
      {/* MUST mention license AND have a link to team wiki's repository on gitlab.igem.org */}
      <Footer />
    </>
  );
};

export default App;
