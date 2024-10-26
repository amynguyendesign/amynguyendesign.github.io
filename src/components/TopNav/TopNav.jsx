import React from 'react';
import './TopNav.css';
import burgerIcon from '../../assets/burger.png';
import { Link } from 'react-router-dom';

function TopNav({ navRef, menuOpen, toggleMenu }) {
  return (
    <header className="container" ref={navRef}>
      <a className="hpLogo name" href="/">
        <div>amy nguyen</div>
      </a>

      <div className={`subPagesContainer ${menuOpen ? 'open' : ''}`}>
        <div className="menuItem">
        <Link to="/work" className="text"> work </Link>
        </div>
        <div className="menuItem">
        <Link to="/play" className="text"> play </Link> </div>
        <div className="menuItem">
        <Link to="/contact" className="text"> contact </Link> </div>
      </div>

      <div className="burger" onClick={toggleMenu}>
        <img src={burgerIcon} alt="burger"/>
      </div>
    </header>
  );
}

export default TopNav;
