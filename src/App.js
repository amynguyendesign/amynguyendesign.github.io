import './App.css';
import TopNav from './components/TopNav/TopNav';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';
import ArtPage from './components/ArtPage/ArtPage';
import ContactPage from './components/ContactPage/ContactPage';
import './global.css';
import Footer from './components/Footer/Footer';

function HomePage() {
  return (
      <div className="homeContainer">
        <div className='headline1'>Pushing pixels, writing code</div>
        <div className='headline2'>and probably convincing you to increase that <span className='inlineCode'> border-radius</span> just a tiny bit more.</div>
        <ul className='bodyText'>
        <li> Hi! I'm Amy! I've spent the past 3 years building education tools as a full-time fullstack engineer.  </li>    
        <li> Prior to that, I was at Stanford studying Computer Science and avoiding caterpillars. </li>
        </ul>
      </div>
  );
}

function App() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

   // Close menu on route change
   useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <div className="wrapper">
      <TopNav navRef={navRef} menuOpen={menuOpen} toggleMenu={toggleMenu}  />    
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
      {(location.pathname !== '/work' && location.pathname !== '/art' && location.pathname !== '/contact')  && <HomePage />}
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