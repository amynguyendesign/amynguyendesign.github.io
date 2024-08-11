import './TopNav.css';
import '../../global.css';

import { Link } from 'react-router-dom';


function TopNav() {
  return (
    <header className="container">
    <div className="hpLogo name"> amy nguyen </div>
    {/* <Link to="/work" className="text"> Work </Link>
    <div className="text"> Play </div> */}
</header>
  );
}

export default TopNav;
