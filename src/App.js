import './App.css';
import TopNav from './components/TopNav/TopNav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';

function App() {
  return (
    <Router>
    <div className="App">
      <TopNav/>
        <Routes>
          <Route path="/work" element={<WorkPage />} />
        </Routes>
      <div className='appContainer'>
        <div className="introSection">
          <img src="amy.png" className="pic" alt="logo" />
          <div className="introText"> 
            <p>Welcome to my portfolio, carefully crafted and hand-coded from scratch, just for you! 👩‍🍳 </p>
            <b>I’m Amy, a design engineer based in San Francisco.</b>
            <p>I like arranging things in ways that spark joy.</p>
          </div>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
