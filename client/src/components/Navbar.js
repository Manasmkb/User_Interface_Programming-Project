// src/Navbar.js
import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar">
      <div className="container">
        <a className="navbar-brand" href="#">MyApp</a>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#profile">Profile</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#login">Login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#register">Register</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;