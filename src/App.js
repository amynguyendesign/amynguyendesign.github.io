import './App.css';
import TopNav from './components/TopNav/TopNav';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';
import { Link } from 'react-router-dom';
import './global.css';

function HomePage() {
  return (
    // <div className="corner-brackets">
      <div className="homeContainer">
        <div className='headline1'>pushing pixels & writing code</div>
        <div className='headline2'>in San Francisco or at a decaf-serving coffee shop near you.</div>
        <ul className='bodyText'>
        <li>Currently a full-time fullstack engineer  </li>    
          <li>I designed and coded this website <Link to="/work" className="link">and a few other things</Link>  </li>    
          <li> Also doing  <Link to="/play" className="link">some other fun things</Link> outside of work</li>   
          <li> Love chatting about art, books, life & tech. <Link to="/contact" className="link"> You, too? </Link></li>   
        </ul>
      </div>
    // </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <TopNav />
      <Routes>
        <Route path="/work" element={<WorkPage />} />
      </Routes>
      {location.pathname !== '/work' && <HomePage />}
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