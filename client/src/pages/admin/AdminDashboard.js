import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Row, Col, Card, Table, Tag } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    todayAppointmentsCount: 0
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentDoctors, setRecentDoctors] = useState([]);

  const getAdminStats = async () => {
    try {
      const res = await axios.get("/api/v1/admin/get-admin-stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRecentEntities = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
      
      const userRes = await axios.get("/api/v1/admin/getAllUsers", { headers });
      if (userRes.data.success) {
        // Grab the last 5 users
        const latestUsers = userRes.data.data.slice(-5).reverse();
        setRecentUsers(latestUsers);
      }

      const doctorRes = await axios.get("/api/v1/admin/getAllDoctors", { headers });
      if (doctorRes.data.success) {
        // Grab the last 5 doctors
        const latestDoctors = doctorRes.data.data.slice(-5).reverse();
        setRecentDoctors(latestDoctors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAdminStats();
    getRecentEntities();
  }, []);

  const chartData = [
    { name: 'Standard Users', value: stats.totalUsers },
    { name: 'Verified Doctors', value: stats.totalDoctors },
    { name: 'Active Appointments', value: stats.todayAppointmentsCount }
  ];
  const COLORS = ['#1e3a8a', '#10b981', '#f59e0b'];

  const userColumns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { 
      title: 'Verified', 
      dataIndex: 'isVerified',
      render: (isVerified) => isVerified 
        ? <Tag color="green">Active</Tag> 
        : <Tag color="orange">Unverified</Tag>
    }
  ];

  const doctorColumns = [
    { 
      title: 'Name', 
      render: (text, record) => `Dr. ${record.firstName} ${record.lastName}`
    },
    { title: 'Specialty', dataIndex: 'specialization' },
    { 
      title: 'Status', 
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'gold' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    }
  ];

  return (
    <Layout>
      <div className="admin-dashboard-container">
        <h1 className="dashboard-header">Command Center</h1>
        
        {/* Top Metric Cards */}
        <Row gutter={[20, 20]}>
          <Col xs={24} md={8}>
            <div className="stat-card card-blue">
              <div className="stat-card-header">Total Ecosystem Users</div>
              <div className="stat-value">
                <i className="fa-solid fa-users"></i>
                {stats.totalUsers}
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="stat-card card-green">
              <div className="stat-card-header">Total Verified Doctors</div>
              <div className="stat-value">
                <i className="fa-solid fa-user-doctor"></i>
                {stats.totalDoctors}
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="stat-card card-yellow">
              <div className="stat-card-header">Appointments Today</div>
              <div className="stat-value">
                 <i className="fa-solid fa-calendar-check"></i>
                {stats.todayAppointmentsCount}
              </div>
            </div>
          </Col>
        </Row>

        {/* Visual Analytics Row */}
        <Row gutter={[20, 20]} className="mt-4">
          <Col xs={24} lg={10}>
             <div className="chart-container-wrapper">
               <h4 style={{ fontWeight: 600, color: '#1e293b', marginBottom: '20px' }}>Platform Distribution</h4>
               <div style={{ width: '100%', height: 300 }}>
                 <ResponsiveContainer>
                   <PieChart>
                     <Pie
                       data={chartData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <RechartsTooltip wrapperStyle={{ borderRadius: '8px', overflow: 'hidden' }} />
                     <Legend verticalAlign="bottom" height={36}/>
                   </PieChart>
                 </ResponsiveContainer>
               </div>
             </div>
          </Col>

          {/* Quick Tables Row */}
          <Col xs={24} lg={14}>
            <div className="tables-row" style={{ marginTop: 0 }}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <Card title="Latest Registered Users" bordered={false}>
                    <Table 
                      columns={userColumns} 
                      dataSource={recentUsers} 
                      pagination={false} 
                      size="small" 
                      rowKey="_id"
                    />
                  </Card>
                </Col>
                <Col span={24}>
                  <Card title="Latest Doctor Enrollments" bordered={false}>
                    <Table 
                      columns={doctorColumns} 
                      dataSource={recentDoctors} 
                      pagination={false} 
                      size="small" 
                      rowKey="_id"
                    />
                  </Card>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
