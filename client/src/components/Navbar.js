import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";

const Navbar = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          MEDI-CONNECT
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* NEW: About Link Added Here */}
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            {/* Notification Icon with Badge */}
            <li className="nav-item mx-2">
              <Badge
                count={user && user.notification ? user.notification.length : 0}
              >
                <div 
                  onClick={() => navigate("/notification")} 
                  style={{ cursor: "pointer", display: "inline-block", padding: "5px" }}
                >
                  <i
                    className="fa-solid fa-bell text-white"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                </div>
              </Badge>
            </li>

            {/* User Name & Logout */}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-uppercase" to="/profile">
                    {user.name}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger btn-sm ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;