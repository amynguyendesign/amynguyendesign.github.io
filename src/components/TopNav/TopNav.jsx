import './TopNav.css';
import { Link } from 'react-router-dom';


function TopNav() {
  return (
    <header className="container">
      <div className="hpLogo"> Amy Nguyen </div>
      <div className="links">
            <div> home </div>
            <Link to="/work"> work </Link>
            <div> play </div>
            </div>
    </header>
  );
}

export default TopNav;
