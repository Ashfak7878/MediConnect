import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table, Tag } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch all doctors from your backend route
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Approve / Reject
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status: status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); 
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  // Handle Toggle Absent Status
  const handleToggleAbsent = async (record) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/toggleAbsentStatus",
        { doctorId: record._id, isAbsent: !record.isAbsent },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); 
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Doctor Name",
      dataIndex: "name",
      render: (text, record) => (
        <span className="fw-bold text-dark">
          Dr. {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Contact",
      dataIndex: "phone",
    },
    {
      title: "Application Status",
      dataIndex: "status",
      render: (text, record) => (
        <Tag color={record.status === "approved" ? "green" : "red"}>
          {record.status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: "Availability",
      dataIndex: "isAbsent",
      render: (text, record) => (
        <Tag color={record.isAbsent ? "orange" : "blue"}>
          {record.isAbsent ? "ABSENT" : "AVAILABLE"}
        </Tag>
      )
    },
    {
      title: "Administrative Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex gap-2">
          {record.status === "pending" ? (
            <>
              <button 
                className="btn btn-success btn-sm px-3 fw-bold" 
                onClick={() => handleAccountStatus(record, "approved")}
              >
                Approve
              </button>
              <button 
                className="btn btn-danger btn-sm px-3 fw-bold"
                onClick={() => handleAccountStatus(record, "rejected")}
              >
                Reject
              </button>
            </>
          ) : (
            <button 
              className="btn btn-danger btn-sm px-3 fw-bold"
              onClick={() => handleAccountStatus(record, "rejected")}
            >
              Revoke Access
            </button>
          )}

          {record.status === "approved" && (
            <button 
              className={`btn btn-sm px-3 fw-bold ${record.isAbsent ? "btn-primary" : "btn-warning"}`}
              onClick={() => handleToggleAbsent(record)}
            >
              {record.isAbsent ? "Mark Available" : "Mark Absent"}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <div className="glass-card mx-auto bg-white p-4 rounded shadow-sm" style={{ maxWidth: "1100px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <div>
            <h2 className="fw-bold text-dark m-0">
              <i className="fa-solid fa-user-doctor me-2 text-primary"></i>
              Manage Doctors
            </h2>
            <p className="text-muted m-0 mt-1">
              Review applications and manage the availability of medical professionals.
            </p>
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={doctors} 
          rowKey="_id" 
          pagination={{ pageSize: 6 }} 
          className="border rounded-3 overflow-hidden"
        />
      </div>
    </Layout>
  );
};

export default Doctors;