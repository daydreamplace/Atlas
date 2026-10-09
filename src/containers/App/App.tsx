import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "../../styles/global.css";
import { Route, Routes, useLocation } from "react-router-dom";
import { getPathMapping } from "../../utils";
import { useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Header } from "../../components/Header";
import { NotFound } from "../../components/NotFound";
import { Footer } from "../../components/Footer";
import { WikiPageBackground } from "../../components/WikiPageBackground";

const App = () => {
  const { pathname: currentPath } = useLocation();
  const pathMapping = getPathMapping();

  // Set Page Title
  const title =
    currentPath in pathMapping ? pathMapping[currentPath].title : "Not Found";

  useEffect(() => {
    document.title = `${title || ""} | ${import.meta.env.VITE_TEAM_NAME} - iGEM ${import.meta.env.VITE_TEAM_YEAR}`;
  }, [title]);

  return (
    <>
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
                    <Header title={title || ""} lead={lead || ""} />
                    <div className="container">
                      <Component />
                    </div>
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
