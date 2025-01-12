import React from 'react';
import './TopNav.css';
import burgerIcon from '../../assets/burgerIcon.png';
import { Link } from 'react-router-dom';

function TopNav({ navRef, menuOpen, toggleMenu }) {
  return (
    <header className="container" ref={navRef}>
      <a className="name" href="/">
        <div>Amy Nguyen </div>
      </a>

      <div className={`subPagesContainer ${menuOpen ? 'open' : ''}`}>
        <div className="menuItem">
        <Link to="/work" className="text"> Work </Link>
        </div>
        <div className="menuItem">
        <Link to="/art" className="text"> Art </Link> </div>
        <div className="menuItem">
        <Link to="/contact" className="text"> Contact </Link> </div>
      </div>

      <div className="burger" onClick={toggleMenu}>
        <img src={burgerIcon} alt="burger"/>
      </div>
    </header>
  );
}

export default TopNav;
