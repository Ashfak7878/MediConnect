import React from "react";
import Layout from "../components/Layout";
import { message, Tabs } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Pull the current user's data from Redux
  const { user } = useSelector((state) => state.user);

  // ==========================================
  // MOVE NOTIFICATIONS TO 'READ'
  // ==========================================
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/get-all-notification",
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload(); // Refresh to update the badge count
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong marking notifications as read");
    }
  };

  // ==========================================
  // DELETE ALL 'READ' NOTIFICATIONS
  // ==========================================
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/delete-all-notification",
        { userId: user._id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong deleting notifications");
    }
  };

  // ==========================================
  // NEW ANT DESIGN TABS STRUCTURE
  // ==========================================
  const tabItems = [
    {
      key: "0",
      label: "Unread",
      children: (
        <>
          <div className="d-flex justify-content-end mb-2">
            <h6 className="p-2 text-primary m-0" style={{ cursor: "pointer" }} onClick={handleMarkAllRead}>
              <i className="fa-solid fa-check-double me-2"></i>Mark All Read
            </h6>
          </div>
          {user?.notification?.length > 0 ? (
            user?.notification.map((notificationMgs, index) => (
              <div 
                className="card p-3 mb-3 shadow-sm" 
                style={{ cursor: "pointer", borderLeft: "4px solid #1890ff", borderRadius: "8px" }} 
                key={index}
                onClick={() => navigate(notificationMgs.onClickPath)}
              >
                <div className="card-text fw-bold text-dark">{notificationMgs.message}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted mt-5">
              <h5>No new notifications</h5>
            </div>
          )}
        </>
      ),
    },
    {
      key: "1",
      label: "Read",
      children: (
        <>
          <div className="d-flex justify-content-end mb-2">
            <h6 className="p-2 text-danger m-0" style={{ cursor: "pointer" }} onClick={handleDeleteAllRead}>
              <i className="fa-solid fa-trash-can me-2"></i>Delete All Read
            </h6>
          </div>
          {user?.seennotification?.length > 0 ? (
            user?.seennotification.map((notificationMgs, index) => (
              <div 
                className="card p-3 mb-3" 
                style={{ cursor: "pointer", backgroundColor: "#f8f9fa", border: "1px solid #eee", borderRadius: "8px" }} 
                key={index}
                onClick={() => navigate(notificationMgs.onClickPath)}
              >
                <div className="card-text text-muted">{notificationMgs.message}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted mt-5">
              <h5>No read notifications</h5>
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <Layout>
      <div className="glass-card mt-4 mx-auto" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold text-dark mb-4 text-center border-bottom pb-3">
          <i className="fa-regular fa-bell me-2 text-primary"></i>Notification Center
        </h2>
        
        {/* Render the tabs using the new 'items' prop! */}
        <Tabs defaultActiveKey="0" items={tabItems} />
      
      </div>
    </Layout>
  );
};

export default NotificationPage;