import './App.css';
import TopNav from './components/TopNav/TopNav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkPage from './components/WorkPage/WorkPage';

function App() {
  return (
    <Router>
    <div className="App">
      <TopNav/>
        <img src="Octocat.png" className="App-logo" alt="logo" />
        <Routes>
          <Route path="/work" element={<WorkPage />} />
        </Routes>
    </div>
    </Router>
  );
}

export default App;
