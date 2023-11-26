import './TopNav.css';
import { Link } from 'react-router-dom';


function TopNav() {
  return (
    <header className="container">
            <div> home </div>
            <Link to="/work"> work </Link>

            <div> play </div>
    </header>
  );
}

export default TopNav;
