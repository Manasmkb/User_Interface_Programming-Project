import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../context/userContext";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="navbar navbar-expand navbar-dark custom-navbar px-3">
      <Link className="navbar-brand" to="/">MyApp</Link>

      <div className="navbar-nav ms-auto">
        <Link className="nav-link" to="/reaction-game">Game</Link>
        {user?.authenticated ? (
          <Link className="nav-link" to="/profile">Profile</Link>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;