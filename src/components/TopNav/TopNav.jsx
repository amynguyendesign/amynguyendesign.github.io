import './TopNav.css';
import '../../global.css';
import { Link, useLocation } from 'react-router-dom';

function TopNav() {
  const location = useLocation();
  
  // const isSubPage = location.pathname !== '/';

  return (
    <header className="container">
      <a className="hpLogo name" href="/">
        <div>amy nguyen</div>
      </a>
      
      {/* {isSubPage && ( */}
        <div className='subPagesContainer'>
          <Link to="/work" className="text"> work </Link>
          <Link to="/play" className="text"> play </Link>
          <Link to="/contact" className="text"> contact </Link>
        </div>
      {/* )} */}
    </header>
  );
}

export default TopNav;
