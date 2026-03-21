import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Table, Tag, message, Popconfirm, Button } from "antd";

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch all users from the database
  const getUsers = async () => {
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
  }, []);

  // Securely Block a User
  const handleBlockUser = async (record) => {
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
  };

  // Professional Ant Design Table Columns
  const columns = [
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
          {/* Hides the block button for Admins so you don't block yourself! */}
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
        
        {/* PREMIUM HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h2 className="fw-bold text-dark m-0">
              <i className="fa-solid fa-users me-2 text-primary"></i>
              Manage Patients
            </h2>
            <p className="text-muted m-0 mt-1">
              Securely monitor and manage all registered patient accounts.
            </p>
          </div>
          <div className="text-end">
            <Tag color="blue" className="fs-6 py-1 px-3 rounded-pill border-0">
              Total Users: <b>{users.length}</b>
            </Tag>
          </div>
        </div>

        {/* ELEGANT TABLE */}
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