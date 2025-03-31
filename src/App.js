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

      <div className="homepageWorkSection" ref={workRef}>
        <div className="headline1">
          Selected Work<span className="accent">.</span>
        </div>{" "}
        The portfolio paradox: too busy building to show what I built. Come back
        soon.{" "}
        <div>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            volutpat eros sit amet luctus ultricies. Morbi placerat vel diam
            vitae ultricies. Donec in ligula sapien. Sed a dolor quis purus
            volutpat maximus. Cras nec elit nec tellus rhoncus lobortis id vitae
            purus. Duis fermentum massa ut neque eleifend tempor. Donec ac diam
            eu lacus sagittis vehicula. Phasellus ullamcorper nec nunc ac
            laoreet. Maecenas et elit sollicitudin, commodo nulla sit amet,
            sagittis odio. Sed eget lacinia turpis, ac convallis mi. Proin in
            mauris at libero eleifend auctor quis in erat. Aenean sed finibus
            est. Duis ornare ultricies magna nec sodales. Fusce ultrices quis
            leo eu finibus. Integer in efficitur sem, gravida feugiat erat.
            Nulla volutpat dignissim ex vel condimentum. Aenean ut dui finibus,
            vulputate nibh in, fermentum felis. Donec laoreet quam eget nisi
            dictum, at fringilla odio viverra. Quisque nec pharetra ipsum, sed
            congue diam. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nam magna eros, sagittis a tristique a, laoreet vel augue.
            Suspendisse eget metus fermentum purus scelerisque feugiat eget ut
            mi. Maecenas aliquet tristique nisi eu tincidunt. Phasellus rhoncus
            molestie interdum. In suscipit venenatis urna quis iaculis. Ut
            hendrerit iaculis magna. Vestibulum ante ipsum primis in faucibus
            orci luctus et ultrices posuere cubilia curae; Phasellus non nisi
            enim. Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Quisque vel euismod felis. Nulla semper
            pretium diam sed fermentum. Etiam eget semper felis. Aenean sit amet
            ante elementum, faucibus nibh eu, porttitor urna. In ullamcorper
            fringilla aliquet. Sed a nisl ut odio imperdiet molestie. Sed mollis
            congue nulla a semper. Maecenas vel arcu risus. Aliquam ac blandit
            magna, id molestie metus. Maecenas faucibus semper nisi pretium
            rhoncus. Aliquam erat volutpat.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            volutpat eros sit amet luctus ultricies. Morbi placerat vel diam
            vitae ultricies. Donec in ligula sapien. Sed a dolor quis purus
            volutpat maximus. Cras nec elit nec tellus rhoncus lobortis id vitae
            purus. Duis fermentum massa ut neque eleifend tempor. Donec ac diam
            eu lacus sagittis vehicula. Phasellus ullamcorper nec nunc ac
            laoreet. Maecenas et elit sollicitudin, commodo nulla sit amet,
            sagittis odio. Sed eget lacinia turpis, ac convallis mi. Proin in
            mauris at libero eleifend auctor quis in erat. Aenean sed finibus
            est. Duis ornare ultricies magna nec sodales. Fusce ultrices quis
            leo eu finibus. Integer in efficitur sem, gravida feugiat erat.
            Nulla volutpat dignissim ex vel condimentum. Aenean ut dui finibus,
            vulputate nibh in, fermentum felis. Donec laoreet quam eget nisi
            dictum, at fringilla odio viverra. Quisque nec pharetra ipsum, sed
            congue diam. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Nam magna eros, sagittis a tristique a, laoreet vel augue.
            Suspendisse eget metus fermentum purus scelerisque feugiat eget ut
            mi. Maecenas aliquet tristique nisi eu tincidunt. Phasellus rhoncus
            molestie interdum. In suscipit venenatis urna quis iaculis. Ut
            hendrerit iaculis magna. Vestibulum ante ipsum primis in faucibus
            orci luctus et ultrices posuere cubilia curae; Phasellus non nisi
            enim. Orci varius natoque penatibus et magnis dis parturient montes,
            nascetur ridiculus mus. Quisque vel euismod felis. Nulla semper
            pretium diam sed fermentum. Etiam eget semper felis. Aenean sit amet
            ante elementum, faucibus nibh eu, porttitor urna. In ullamcorper
            fringilla aliquet. Sed a nisl ut odio imperdiet molestie. Sed mollis
            congue nulla a semper. Maecenas vel arcu risus. Aliquam ac blandit
            magna, id molestie metus. Maecenas faucibus semper nisi pretium
            rhoncus. Aliquam erat volutpat.
          </p>
        </div>
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
          <Route path="/art" element={<ArtPage />} />
        </Routes>
        <Routes>
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Routes>
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        {location.pathname !== "/work" &&
          location.pathname !== "/art" &&
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
