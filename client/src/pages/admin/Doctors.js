import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table, Tag, Form, Modal, Input, Select, Row, Col, Button, TimePicker } from "antd";
import moment from "moment";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();  const getDoctors = async () => {
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
  };  const handleAccountStatus = async (record, status) => {
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
  };  const handleToggleAbsent = async (record) => {
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

  const handleAddSubmit = async (values) => {
    try {
      const formattedValues = {
        ...values,
        timings: [
          moment(values.timings[0]).format("HH:mm"),
          moment(values.timings[1]).format("HH:mm"),
        ],
      };
      const res = await axios.post("/api/v1/admin/createDoctor", formattedValues, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.data.success) {
        message.success(res.data.message);
        setIsAddModalVisible(false);
        addForm.resetFields();
        getDoctors();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Failed to create doctor");
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
        {}
        <div className="rounded-4 mb-4 shadow-sm text-white p-4" style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(59, 130, 246, 0.8) 100%), url("/dashboard_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-white m-0" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                <i className="fa-solid fa-user-doctor me-2"></i> Manage Doctors
              </h2>
              <p className="opacity-100 m-0 mt-1 fs-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Review applications and manage the availability of medical professionals.
              </p>
            </div>
            <Button type="default" size="large" onClick={() => setIsAddModalVisible(true)} className="fw-bold shadow-sm rounded-pill" style={{ color: '#1890ff', border: 'none' }}>
              <i className="fa-solid fa-plus me-2"></i> Add New Doctor
            </Button>
          </div>
        </div>
        <Table 
          columns={columns} 
          dataSource={doctors} 
          rowKey="_id" 
          pagination={{ pageSize: 6 }} 
          className="border rounded-3 overflow-hidden"
        />

        {}
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

        {}
        <Modal 
          title="Add New Doctor" 
          open={isAddModalVisible} 
          onCancel={() => setIsAddModalVisible(false)} 
          footer={null}
          width={800}
        >
          <Form layout="vertical" form={addForm} onFinish={handleAddSubmit}>
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
                <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                  <Input type="email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Website (Optional)" name="website">
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
              <Col span={12}>
                <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
                  <TimePicker.RangePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
            <div className="text-end mt-3">
              <Button onClick={() => setIsAddModalVisible(false)} className="me-2">Cancel</Button>
              <Button type="primary" htmlType="submit">Create Doctor</Button>
            </div>
          </Form>
        </Modal>

      </div>
    </Layout>
  );
};

export default Doctors;