import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table, Tag, Form, Modal, Input, Select, Row, Col, Button } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form] = Form.useForm();

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

  const handleEdit = (record) => {
    setEditingDoctor(record);
    form.setFieldsValue({
      firstName: record.firstName,
      lastName: record.lastName,
      phone: record.phone,
      specialization: record.specialization,
      experience: record.experience,
      feesPerConsultation: record.feesPerConsultation,
    });
    setIsModalVisible(true);
  };

  const handleUpdateSubmit = async (values) => {
    try {
      const res = await axios.post("/api/v1/admin/updateDoctorProfile", {
        doctorId: editingDoctor._id,
        ...values,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        message.success(res.data.message);
        setIsModalVisible(false);
        getDoctors();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Failed to update profile");
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
            <>
              <button 
                className={`btn btn-sm px-3 fw-bold ${record.isAbsent ? "btn-primary" : "btn-warning"}`}
                onClick={() => handleToggleAbsent(record)}
              >
                {record.isAbsent ? "Mark Available" : "Mark Absent"}
              </button>
              <button 
                className="btn btn-sm btn-info px-3 fw-bold text-white"
                onClick={() => handleEdit(record)}
              >
                Edit Profile
              </button>
            </>
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

        {/* EDIT MODAL */}
        <Modal 
          title="Edit Doctor Profile" 
          open={isModalVisible} 
          onCancel={() => setIsModalVisible(false)} 
          footer={null}
        >
          <Form layout="vertical" form={form} onFinish={handleUpdateSubmit}>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Consultation Fee (₹)" name="feesPerConsultation" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
                  <Select showSearch>
                    <Select.Option value="Cardiology">Cardiology</Select.Option>
                    <Select.Option value="Dentist">Dentist</Select.Option>
                    <Select.Option value="Dermatology">Dermatology</Select.Option>
                    <Select.Option value="ENT">ENT (Ear, Nose, Throat)</Select.Option>
                    <Select.Option value="General Physician">General Physician</Select.Option>
                    <Select.Option value="Gynecology">Gynecology</Select.Option>
                    <Select.Option value="Neurology">Neurology</Select.Option>
                    <Select.Option value="Oncology">Oncology</Select.Option>
                    <Select.Option value="Ophthalmology">Ophthalmology</Select.Option>
                    <Select.Option value="Orthopedics">Orthopedics</Select.Option>
                    <Select.Option value="Pediatrics">Pediatrics</Select.Option>
                    <Select.Option value="Psychiatry">Psychiatry</Select.Option>
                    <Select.Option value="Urology">Urology</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Experience (Years)" name="experience" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button onClick={() => setIsModalVisible(false)} className="me-2">Cancel</Button>
              <Button type="primary" htmlType="submit">Save Changes</Button>
            </div>
          </Form>
        </Modal>

      </div>
    </Layout>
  );
};

export default Doctors;