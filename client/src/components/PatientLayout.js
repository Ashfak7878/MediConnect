import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, message, Avatar, Dropdown } from "antd";

const PatientLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  // Branding Logic
  const isApplyPage = location.pathname === "/apply-doctor";
  const brandName = isApplyPage ? "MediConnect" : "DocApp";

  const menuItems = [
    { name: "Home", path: "/", icon: "fa-solid fa-house" },
    { name: "Appointments", path: "/appointments", icon: "fa-solid fa-calendar-check" },
    { name: "Apply Doctor", path: "/apply-doctor", icon: "fa-solid fa-stethoscope" },
  ];

  const profileMenu = [
    { key: '1', label: ( <Link to="/profile">My Profile</Link> ) },
    { key: '2', label: ( <span onClick={handleLogout}>Logout</span> ) },
  ];

  return (
    <div className="layout-wrapper">
      {/* TOP NAVIGATION BAR */}
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <span style={{ color: "#1890ff" }}>+</span>{brandName}
        </Link>

        <div className="nav-links">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              <i className={item.icon}></i> {item.name}
            </Link>
          ))}
          
          <div className="nav-actions d-flex align-items-center gap-4">
            <Badge count={user?.notification?.length || 0} onClick={() => navigate("/notification")} style={{ cursor: "pointer" }}>
              <i className="fa-regular fa-bell fs-4 text-muted"></i>
            </Badge>

            <Dropdown menu={{ items: profileMenu }} placement="bottomRight" arrow>
              <div style={{ cursor: "pointer" }} className="d-flex align-items-center gap-2">
                <Avatar style={{ backgroundColor: '#1890ff' }}>{user?.name?.[0]}</Avatar>
                <span className="fw-bold text-dark d-none d-md-block">{user?.name}</span>
              </div>
            </Dropdown>
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="page-container">
        {children}
      </main>
    </div>
  );
};

export default PatientLayout;