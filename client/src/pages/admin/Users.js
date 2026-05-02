import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, Tag, message, Popconfirm, Button } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);  const getUsers = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);  const handleBlockUser = async (record) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/blockUser",
        { userId: record._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(`User ${record.name} has been restricted.`);
        getUsers(); // Refresh the table instantly
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to block user");
    }
  };  const columns = [
    {
      title: "Full Name",
      dataIndex: "name",
      render: (text, record) => (
        <div className="d-flex align-items-center gap-2">
          <div 
            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: "35px", height: "35px", backgroundColor: "#1890ff" }}
          >
            {record.name.charAt(0).toUpperCase()}
          </div>
          <span className="fw-bold text-dark">{record.name}</span>
        </div>
      ),
    },
    {
      title: "Email Address",
      dataIndex: "email",
      render: (text) => <span className="text-muted">{text}</span>,
    },
    {
      title: "Account Role",
      dataIndex: "role",
      render: (text, record) => {
        if (record.isAdmin) {
          return <Tag color="purple" className="px-3 py-1 rounded-pill fw-bold border-0">ADMIN</Tag>;
        }
        if (record.isDoctor) {
          return <Tag color="cyan" className="px-3 py-1 rounded-pill fw-bold border-0">DOCTOR</Tag>;
        }
        return <Tag color="green" className="px-3 py-1 rounded-pill fw-bold border-0">PATIENT</Tag>;
      },
    },
    {
      title: "Security Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex gap-2">
          {}
          {!record.isAdmin && (
            <Popconfirm
              title="Restrict this user?"
              description={`Are you sure you want to block ${record.name}?`}
              onConfirm={() => handleBlockUser(record)}
              okText="Yes, Block"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger type="primary" shape="round" size="small" className="fw-bold px-3">
                <i className="fa-solid fa-ban me-1"></i> Block
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="glass-card mx-auto bg-white p-4 rounded shadow-sm" style={{ maxWidth: "1100px" }}>
        
        {}
        <div className="rounded-4 mb-4 shadow-sm text-white p-4" style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(59, 130, 246, 0.8) 100%), url("/dashboard_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-white m-0" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                <i className="fa-solid fa-users me-2"></i> Manage Patients
              </h2>
              <p className="opacity-100 m-0 mt-1 fs-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Securely monitor and manage all registered patient accounts.
              </p>
            </div>
            <div className="text-end">
              <Tag color="blue" className="fs-5 py-2 px-4 rounded-pill border-0 shadow-sm" style={{ color: '#000', background: 'rgba(255,255,255,0.95)' }}>
                Total Users: <b className="text-primary">{users.length}</b>
              </Tag>
            </div>
          </div>
        </div>

        {}
        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey={(record) => record._id} 
          pagination={{ pageSize: 6 }} 
          className="border rounded-3 overflow-hidden"
        />

      </div>
    </Layout>
  );
};

export default Users;