import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiUser } from "react-icons/fi";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        CodeNest
      </div>

      <div className="navbar-links">
        {user ? (
          <div className="user-menu">
            <div
              className="user-info"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <FiUser className="user-icon" />
              <div className="user-meta">
                <strong>{user.name}</strong>
                {user.role && <small className="user-role">{user.role}</small>}
              </div>
            </div>

            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={() => navigate("/profile")}>
                  ⚙️ Profile Settings
                </button>
                <button onClick={handleLogout}> Logout</button>
              </div>
            )}
          </div>
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
