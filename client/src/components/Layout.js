import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import "../styles/Layout.css";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();  const userMenu = [
    { name: "Home Dashboard", path: "/", icon: "fa-solid fa-house" },
    { name: "Appointments", path: "/appointments", icon: "fa-solid fa-list" },
    { name: "About Us", path: "/about", icon: "fa-solid fa-circle-info" },
    { name: "Profile", path: "/profile", icon: "fa-solid fa-user" },
  ];  const adminMenu = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: "fa-solid fa-house-user" },
    { name: "Manage Doctors", path: "/admin/doctors", icon: "fa-solid fa-user-doctor" },
    { name: "Manage Patients", path: "/admin/users", icon: "fa-solid fa-users" },
    { name: "Profile", path: "/profile", icon: "fa-solid fa-user" },
  ];  const doctorMenu = [
    { name: "Doctor Dashboard", path: "/doctor-appointments", icon: "fa-solid fa-house-medical" },
    { name: "Appointments", path: "/doctor-appointments", icon: "fa-solid fa-list" },
    { name: "Profile", path: `/doctor/profile/${user?._id}`, icon: "fa-solid fa-user" },
  ];  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;  const handleLogout = () => {
    localStorage.clear();    message.success("Logout Successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  return (
    <div className="main">
      <div className="layout">
        
        {}
        <div className="sidebar">
          <div className="logo">
            <h6>Medi-Connect</h6>
            <hr />
          </div>
          <div className="menu">
            {SidebarMenu.map((menu, index) => {
              const isActive = location.pathname === menu.path;
              return (
                <div 
                  key={index} 
                  className={`menu-item ${isActive && "active"}`}
                  onClick={() => navigate(menu.path)}
                  style={{ cursor: "pointer" }}
                >
                  <i className={menu.icon}></i>
                  <Link to={menu.path}>{menu.name}</Link>
                </div>
              );
            })}
            {}
            <div className="menu-item" onClick={handleLogout} style={{ cursor: "pointer" }}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <Link to="/login" onClick={(e) => e.preventDefault()}>Logout</Link>
            </div>
          </div>
        </div>

        {}
        <div className="content">
          
          {}
          <div className="header">
            <div className="header-content" style={{ cursor: "pointer" }}>
              <Badge 
                count={user && user.notification ? user.notification.length : 0} 
                onClick={() => navigate("/notification")}
              >
                <i className="fa-solid fa-bell"></i>
              </Badge>
              <Link to="/profile">{user?.name}</Link>
            </div>
          </div>

          {}
          <div className="body">{children}</div>
        
        </div>
      </div>
    </div>
  );
};

export default Layout;