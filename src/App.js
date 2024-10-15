import './App.css';
import TopNav from './components/TopNav/TopNav';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';
import './global.css';

function HomePage() {
  return (
    // <div className="corner-brackets">
      <div className="homeContainer">
        <div className='headline1'>pushing pixels</div>
        <div className='headline2'>in San Francisco or at a decaf-serving coffee shop near you.</div>
        <ul className='bodyText'>
          <li>I designed and coded this website and a few other things   </li>    
          <li> Also doing some other fun things outside of work</li>   
          <li> Occasionally I advise on UX and help with product review</li>   
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