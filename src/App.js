import './App.css';
import TopNav from './components/TopNav/TopNav';
import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';
import ArtPage from './components/ArtPage/ArtPage';
import ContactPage from './components/ContactPage/ContactPage';
import './global.css';
import block from './assets/pixel-block.png';
import Footer from './components/Footer/Footer';

function HomePage() {
  return (
      <div className="homeContainer">
        <div className='headline1'>Design-First Engineering. User-First Everything</div>
        <p>Hi! I’m Amy, a full-stack engineer based in San Francisco.  I’ve spent the past three years creating tools that make learning fun.     
         Before that, I studied Computer Science at Stanford with a focus on Human-Computer Interaction. </p>
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
      {/* <img src={block} className="block"/> */}
      <div class="pixel-grid">
     {/* Row 1 */}
    <div class="pixel empty"></div> 
    <div class="pixel dark"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel medium"></div>
    <div class="pixel empty"></div>

    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>

    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel light"></div> 
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>

     {/* Row 2 */}
     <div class="pixel light"></div> 
    <div class="pixel medium"></div> 
    <div class="pixel medium"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div>
    <div class="pixel medium"></div>
    <div class="pixel medium"></div>
    <div class="pixel empty"></div>

    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>

    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel dark"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>
    <div class="pixel empty"></div>

     {/* Row 3 */}
     <div class="pixel semi-dark"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel medium"></div> 
    <div class="pixel medium"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel light"></div>
    <div class="pixel light"></div>
    <div class="pixel light"></div>
    <div class="pixel semi-dark"></div>

    <div class="pixel dark"></div> 
    <div class="pixel dark"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel light"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel medium"></div>
    <div class="pixel medium"></div>
    <div class="pixel dark"></div>
    <div class="pixel empty"></div>

    <div class="pixel empty"></div> 
    <div class="pixel empty"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel semi-dark"></div> 
    <div class="pixel medium"></div> 
    <div class="pixel medium"></div> 
    <div class="pixel empty"></div>
    <div class="pixel medium"></div>
    <div class="pixel medium"></div>
    <div class="pixel medium"></div>

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