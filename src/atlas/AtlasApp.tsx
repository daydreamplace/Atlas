import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/tokens.css";
import "../styles/global.css";
import "../styles/home.css";
import "../styles/typography.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer/Footer";
import { LoadingScreen } from "../components/LoadingScreen/LoadingScreen";
import { Home } from "../contents/home";
import "./atlas.css";

export default function AtlasApp() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main id="main-content" className="home-page">
        <Home />
      </main>
      <Footer />
    </>
  );
}
