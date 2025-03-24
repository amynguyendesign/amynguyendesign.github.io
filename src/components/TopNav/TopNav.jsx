import React from "react";
import "./TopNav.css";
import { Link, useLocation } from "react-router-dom";

function TopNav({ navRef, menuOpen, toggleMenu }) {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log("currentPath", currentPath);

  return (
    <header className="container" ref={navRef}>
      <a className="name" href="/">
        <div>Amy Nguyen</div>
      </a>

      <div className={`sidebarMenu ${menuOpen ? "open" : ""}`}>
  {["work", "art", "about", "contact", "bookshelf"].map((path) => (
    <Link
      key={path}
      to={`/${path}`}
      onClick={toggleMenu}
      className={`menuItem ${currentPath === `/${path}` ? "active" : ""}`}
    >
      <span className="text">
        {path}
        {currentPath === `/${path}` && <span className="active">.</span>}
      </span>
    </Link>
  ))}
</div>

<div className={`desktopMenu`}>
  {["work", "art", "about", "contact", "bookshelf"].map((path) => (
    <Link
      key={path}
      to={`/${path}`}
      className={`menuItem ${currentPath === `/${path}` ? "active" : ""}`}
    >
      <span className="text">
        {path}
        {currentPath === `/${path}` && <span className="active">.</span>}
      </span>
    </Link>
  ))}
</div>

      {menuOpen && <div className="menuOverlay" onClick={toggleMenu}></div>}

      <div className={`burger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default TopNav;