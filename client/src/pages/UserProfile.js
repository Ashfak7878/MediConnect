import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, Row, Col, Card, Tabs, message, Button, Table, Tag } from "antd";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import moment from "moment";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user appointments specifically for the stats view
  const fetchMyAppointments = async () => {
    try {
      const res = await axios.get("/api/v1/user/user-appointments", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setAppointments(res.data.data.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(user) {
      fetchMyAppointments();
    }
  }, [user]);

  const handleUpdateProfile = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/update-profile",
        { name: values.name, userId: user._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        dispatch(setUser(res.data.data)); // Update Redux instantly
        setIsEditing(false);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Failed to update profile");
    }
  };

  if (!user) return <Layout><div className="text-center p-5">Loading Profile...</div></Layout>;

  const initialLetter = user?.name ? user.name.charAt(0) : "U";
  const roleText = user.isAdmin ? "Administrator" : user.isDoctor ? "Verified Doctor" : "Standard Patient";

  const apptColumns = [
    { 
      title: "Doctor", 
      dataIndex: "doctorId",
      render: (doc) => `Dr. ${doc.firstName} ${doc.lastName}` 
    },
    { 
      title: "Date",
      dataIndex: "date",
      render: (date) => moment(date, "DD-MM-YYYY").format("MMMM Do YYYY")
    },
    { 
      title: "Status", 
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "approved" ? "green" : status === "pending" ? "gold" : "red"}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <Layout>
      <div className="profile-container">
        <Row gutter={[30, 30]} className="profile-layout-row">
          
          {/* Left Column: Avatar & Roles */}
          <Col xs={24} lg={8}>
            <div className="profile-sidebar">
              <div className="profile-sidebar-header"></div>
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar">{initialLetter}</div>
              </div>
              <div className="p-4">
                <h3 className="profile-name">{user.name}</h3>
                <p className="profile-email">{user.email}</p>
                <div style={{ marginTop: '15px', marginBottom: '25px' }}>
                  <span className="profile-role-badge" style={{ 
                    backgroundColor: user.isAdmin ? '#ede9fe' : '#e0e7ff',
                    color: user.isAdmin ? '#6d28d9' : '#4338ca' 
                  }}>
                    {roleText}
                  </span>
                </div>
                {!isEditing ? (
                   <Button type="primary" shape="round" size="large" block onClick={() => setIsEditing(true)}>
                     Edit Profile
                   </Button>
                ) : (
                   <Button shape="round" size="large" block onClick={() => setIsEditing(false)}>
                     Cancel Editing
                   </Button>
                )}
              </div>
            </div>

            {/* Mini Stats under the sidebar */}
            <div className="mt-4">
              <Row gutter={[15,15]}>
                <Col span={12}>
                  <div className="mini-stat-card">
                    <div className="mini-stat-title">Appointments Booked</div>
                    <h2 className="mini-stat-number">{appointments.length}</h2>
                    <i className="fa-solid fa-calendar-check mini-stat-icon"></i>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="mini-stat-card">
                    <div className="mini-stat-title">Account Status</div>
                    <h2 className="mini-stat-number" style={{fontSize: '1.8rem', paddingTop: '10px'}}>{user.isVerified ? "Active" : "Unverified"}</h2>
                    <i className="fa-solid fa-shield-check mini-stat-icon" style={{ color: '#10b981' }}></i>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Right Column: Content Tabs */}
          <Col xs={24} lg={16}>
            <Card className="profile-content-card">
              <Tabs defaultActiveKey="1" size="large">
                
                {/* General Info Tab */}
                <Tabs.TabPane tab={<span><i className="fa-solid fa-address-card me-2"></i>General Details</span>} key="1">
                  <div className="p-2">
                    <Form 
                      layout="vertical" 
                      initialValues={user} 
                      onFinish={handleUpdateProfile}
                      className="profile-form mt-3"
                    >
                      <Row gutter={20}>
                        <Col xs={24} md={12}>
                          <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                            <Input size="large" disabled={!isEditing} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item label="Email Address">
                            <Input size="large" value={user.email} disabled />
                            <small className="text-muted mt-1 d-block">Email addresses cannot be changed.</small>
                          </Form.Item>
                        </Col>
                      </Row>
                      
                      {isEditing && (
                        <div className="text-end mt-3 border-top pt-4">
                          <Button htmlType="submit" type="primary" size="large" shape="round">
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </Form>
                  </div>
                </Tabs.TabPane>

                {/* Patient History Tab */}
                <Tabs.TabPane tab={<span><i className="fa-solid fa-clock-rotate-left me-2"></i>Recent Activity</span>} key="2">
                   <div className="p-2 pt-3">
                     <h5 className="mb-4" style={{ color: '#475569', fontWeight: 600 }}>Your Appointment History</h5>
                     <Table 
                       columns={apptColumns} 
                       dataSource={appointments.slice(0, 5)} 
                       pagination={false} 
                       size="middle" 
                       rowKey="_id"
                       bordered={false}
                     />
                   </div>
                </Tabs.TabPane>

                {/* Security Tab */}
                <Tabs.TabPane tab={<span><i className="fa-solid fa-lock me-2"></i>Security</span>} key="3">
                  <div className="p-2 pt-3">
                     <div className="alert alert-info border-0 shadow-sm rounded-4 p-4">
                        <h5 className="fw-bold"><i className="fa-solid fa-key me-2"></i>Password Reset</h5>
                        <p className="m-0 mt-2 text-dark">If you need to change your password, please log out and use the <b>Forgot Password</b> feature on the login screen. It will securely issue a One-Time Password to your email.</p>
                     </div>
                  </div>
                </Tabs.TabPane>

              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default UserProfile;
