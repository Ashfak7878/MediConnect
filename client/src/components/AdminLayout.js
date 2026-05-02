import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { message, Badge } from "antd";

const AdminLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };  const adminMenu = [
    { name: "Dashboard Overview", path: "/", icon: "fa-solid fa-chart-pie" },
    { name: "Manage Doctors", path: "/admin/doctors", icon: "fa-solid fa-user-doctor" },
    { name: "Manage Patients", path: "/admin/users", icon: "fa-solid fa-bed-pulse" },
  ];

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "#f4f7fa" }}>
      
      {}
      <div className="bg-dark text-white d-flex flex-column shadow-lg" style={{ width: "260px", zIndex: 10 }}>
        <div className="p-4 text-center border-bottom border-secondary">
          <h4 className="text-info fw-bold m-0">
            <i className="fa-solid fa-shield-halved me-2"></i>Admin Panel
          </h4>
        </div>
        
        <div className="flex-grow-1 p-3 mt-3">
          {adminMenu.map((menu, index) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link 
                key={index} 
                to={menu.path} 
                className={`d-flex align-items-center p-3 mb-2 rounded text-decoration-none fw-bold transition-all ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-light hover-bg-secondary"
                }`}
                style={{ transition: "0.3s" }}
              >
                <i className={`${menu.icon} fs-5 me-3`} style={{ width: "20px" }}></i> 
                {menu.name}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-top border-secondary">
          <div 
            className="d-flex align-items-center p-3 rounded text-danger fw-bold" 
            onClick={handleLogout} 
            style={{ cursor: "pointer", transition: "0.3s" }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 53, 69, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="fa-solid fa-right-from-bracket fs-5 me-3"></i> Secure Logout
          </div>
        </div>
      </div>

      {}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        
        {}
        <div className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center z-index-1">
          <h5 className="m-0 fw-bold text-secondary">MediConnect Workspace</h5>
          
          <div className="d-flex align-items-center gap-4">
            <Badge count={user?.notification?.length || 0} onClick={() => navigate("/notification")} style={{cursor: "pointer"}}>
              <i className="fa-solid fa-bell fs-4 text-secondary hover-text-primary transition-all"></i>
            </Badge>
            
            <div className="d-flex align-items-center gap-2 border-start ps-4">
              <div 
                className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold shadow-sm" 
                style={{width: "40px", height: "40px", fontSize: "1.2rem"}}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <div className="fw-bold text-dark lh-1">{user?.name}</div>
                <small className="text-muted fw-bold" style={{ fontSize: "0.75rem" }}>SUPER ADMIN</small>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="p-4 flex-grow-1 overflow-auto">
          {children}
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;