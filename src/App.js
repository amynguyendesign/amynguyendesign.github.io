import "./App.css";
import TopNav from "./components/TopNav/TopNav";
import { useState, useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import WorkPage from "./components/WorkPage/WorkPage";
import ArtPage from "./components/ArtPage/ArtPage";
import ContactPage from "./components/ContactPage/ContactPage";
import AboutPage from "./components/AboutPage/AboutPage";
import "./global.css";
import Footer from "./components/Footer/Footer";

function HomePage({ workRef, scrollToWork, setScrollToWork }) {
  useEffect(() => {
    if (scrollToWork && workRef.current) {
      setTimeout(() => {
        workRef.current.scrollIntoView({ behavior: "smooth" });
        setScrollToWork(false); // reset
      }, 100);
    }
  }, [scrollToWork, workRef, setScrollToWork]);

  return (
    <>
      <div className="homeContainer fadeSlideIn">
        <div className="headline1">
          Design-First Engineering. <br />
          Always<span className="accent">.</span>{" "}
        </div>
        <p>
          Meet Amy -- Engineer. Designer at heart. Stanford-trained. San
          Francisco-based.
        </p>
        <p
          className="homepageCTA"
          onClick={() => {
            if (workRef.current) {
              workRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          style={{ cursor: "pointer" }}
        >
          See my work.
        </p>{" "}
      </div>

      <div className="homepageWorkSection homeContainer" ref={workRef}>
        <div className="headline1">
          Selected Work<span className="accent">.</span>
        </div>{" "}
        The portfolio paradox: too busy building to show what I built. Project
        write-ups coming soon. <div></div>
      </div>
    </>
  );
}

function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const workRef = useRef(null);
  const [scrollToWork, setScrollToWork] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="wrapper">
      <TopNav
        navRef={navRef}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        setScrollToWork={setScrollToWork}
      />
      <div className="content">
        <Routes>
          <Route path="/work" element={<WorkPage />} />
        </Routes>
        <Routes>
          <Route path="/play" element={<ArtPage />} />
        </Routes>
        <Routes>
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Routes>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        {location.pathname !== "/work" &&
          location.pathname !== "/play" &&
          location.pathname !== "/contact" &&
          location.pathname !== "/about" && (
            <HomePage
              workRef={workRef}
              scrollToWork={scrollToWork}
              setScrollToWork={setScrollToWork}
            />
          )}
      </div>

      <Footer />
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
