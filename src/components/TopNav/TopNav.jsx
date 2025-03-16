import React from "react";
import "./TopNav.css";
import burgerIcon from "../../assets/burgerIcon.png";
import { Link, useLocation } from "react-router-dom";

function TopNav({ navRef, menuOpen, toggleMenu }) {
  const location = useLocation();
  const currentPath = location.pathname;
  console.log("currentPath", currentPath);
  return (
    <header className="container" ref={navRef}>
      <a className="name" href="/">
        <div>Amy Nguyen </div>
      </a>

      <div className={`subPagesContainer ${menuOpen ? "open" : ""}`}>
        <div className="menuItem">
          <Link
            to="/work"
            className={`text ${currentPath === "/work" ? "active" : ""}`}
          >
            work{currentPath === "/work" && <span className="active">.</span>}
          </Link>
        </div>
        <div className="menuItem">
        <Link
            to="/art"
            className={`text ${currentPath === "/art" ? "active" : ""}`}
          >
            art{currentPath === "/art" && <span className="active">.</span>}
          </Link>
        </div>
        <div className="menuItem">
        <Link
            to="/about"
            className={`text ${currentPath === "/about" ? "active" : ""}`}
          >
            about{currentPath === "/about" && <span className="active">.</span>}
          </Link>
        </div>
        <div className="menuItem">
        <Link
            to="/contact"
            className={`text ${currentPath === "/contact" ? "active" : ""}`}
          >
            contact{currentPath === "/contact" && <span className="active">.</span>}
          </Link>
        </div>
        <div className="menuItem">
        <Link
            to="/bookshelf"
            className={`text ${currentPath === "/bookshelf" ? "active" : ""}`}
          >
            bookshelf{currentPath === "/bookshelf" && <span className="active">.</span>}
          </Link>
        </div>
      </div>

      <div className="burger" onClick={toggleMenu}>
        <img src={burgerIcon} alt="burger" />
      </div>
    </header>
  );
}

export default TopNav;
