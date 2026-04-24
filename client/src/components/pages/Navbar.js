import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar navbar-expand navbar-dark custom-navbar px-3">
    <Link className="navbar-brand" to="/">MyApp</Link>

    <div className="navbar-nav ms-auto">
      <Link className="nav-link" to="/login">Login</Link>
      <Link className="nav-link" to="/register">Register</Link>
      <Link className="nav-link" to="/profile">Profile</Link>
    </div>
  </nav>
);

export default Navbar;