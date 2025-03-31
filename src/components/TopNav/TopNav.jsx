// ✅ TopNav.jsx — Final Version

import React from "react";
import "./TopNav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

function TopNav({ navRef, menuOpen, toggleMenu, setScrollToWork }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const handleWorkClick = (e) => {
    e.preventDefault();

    if (location.pathname === "/") {
      // Already on homepage — set scroll trigger
      setScrollToWork(true);
    } else {
      // Navigate home, then scroll after HomePage mounts
      setScrollToWork(true);
      navigate("/");
    }

    if (window.innerWidth < 768) {
      toggleMenu();
    }
  };

  return (
    <header className="container" ref={navRef}>
      <a className="name" href="/">
        <div>Amy Nguyen.</div>
      </a>

      {/* Desktop menu */}
      <div className="desktopMenu">
        {["work", "play", "about", "contact"].map((path) => (
          <Link
            key={path}
            to={path === "work" ? "/" : `/${path}`}
            onClick={path === "work" ? handleWorkClick : undefined}
            className={`menuItem ${currentPath === `/${path}` ? "active" : ""}`}
          >
            <span className="text">
              {path}
              {currentPath === `/${path}` && <span className="active">.</span>}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile menu */}
      <div className={`sidebarMenu ${menuOpen ? "open" : ""}`}>
        {["work", "play", "about", "contact"].map((path) => (
          <Link
            key={path}
            to={path === "work" ? "/" : `/${path}`}
            onClick={path === "work" ? handleWorkClick : toggleMenu}
            className={`menuItem ${currentPath === `/${path}` ? "active" : ""}`}
          >
            <span className="text">
              {path}
              {currentPath === `/${path}` && <span className="active">.</span>}
            </span>
          </Link>
        ))}
      </div>

      {menuOpen && window.innerWidth < 768 && (
        <div className="menuOverlay" onClick={toggleMenu}></div>
      )}

      <div className={`burger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
  );
}

export default TopNav;
