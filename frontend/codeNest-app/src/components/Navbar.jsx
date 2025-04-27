import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        CodeNest
      </div>
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")} className="nav-button">
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="nav-button"
            >
              Register
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
