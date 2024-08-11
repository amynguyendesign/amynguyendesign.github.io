import './App.css';
import TopNav from './components/TopNav/TopNav';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';
import './global.css';

function HomePage() {
  return (
    <div className="corner-brackets">
    {/* Your content here */}
    <div className="content">
      <div className='headline1'>coding + designing</div>
      <div className='headline2'>in San Francisco or at a decaf-serving coffee shop near you.</div>
    </div>
  </div>
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