import React, { useState } from "react";
import Layout from "../components/Layout";
import { Col, Form, Input, Row, TimePicker, message, Upload, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cvFile, setCvFile] = useState(null);

  const handleFinish = async (values) => {
    try {
      if (!cvFile) {
        return message.error("Please upload your CV in PDF format.");
      }

      dispatch(showLoading());
      
      // Use FormData for file uploads
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("website", values.website || "");
      formData.append("address", values.address);
      formData.append("specialization", values.specialization);
      formData.append("experience", values.experience);
      formData.append("feesPerCunsaltation", values.feesPerConsultation);
      formData.append("userId", user._id);
      
      // Send timings as a stringified array
      formData.append("timings", JSON.stringify([
        values.timings[0].format("HH:mm"),
        values.timings[1].format("HH:mm")
      ]));
      
      // The CV file
      formData.append("cv", cvFile);

      const res = await axios.post("/api/v1/user/apply-doctor", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong while submitting your application.");
    }
  };

  return (
    <Layout>
      <div className="glass-card mt-3">
        {/* ELEGANT HEADER */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-dark">
            Join <span style={{ color: "#1890ff" }}>MediConnect</span>
          </h2>
          <p className="text-muted">
            Register as a healthcare professional and expand your reach.
          </p>
        </div>

        {/* APPLICATION FORM */}
        <Form layout="vertical" onFinish={handleFinish}>
          
          <h5 className="text-primary border-bottom pb-2 mb-4">
            <i className="fa-regular fa-id-card me-2"></i>Personal Details
          </h5>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                <Input placeholder="John" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                <Input placeholder="Doe" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                <Input placeholder="(555) 123-4567" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Email Address" name="email" rules={[{ required: true }]}>
                <Input type="email" placeholder="doctor@example.com" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Website (Optional)" name="website">
                <Input placeholder="www.drjohn.com" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Clinic Address" name="address" rules={[{ required: true }]}>
                <Input placeholder="123 Medical Plaza, City" className="py-2" />
              </Form.Item>
            </Col>
          </Row>

          <h5 className="text-primary border-bottom pb-2 mb-4 mt-4">
            <i className="fa-solid fa-user-doctor me-2"></i>Professional Details
          </h5>
          <Row gutter={20}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
                <Input placeholder="e.g., Cardiology, Pediatrics" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Years of Experience" name="experience" rules={[{ required: true }]}>
                <Input type="number" placeholder="e.g., 5" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Consultation Fee ($)" name="feesPerConsultation" rules={[{ required: true }]}>
                <Input type="number" placeholder="e.g., 100" className="py-2" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Working Hours" name="timings" rules={[{ required: true }]}>
                <TimePicker.RangePicker format="HH:mm" className="w-100 py-2" />
              </Form.Item>
            </Col>

            {/* CV UPLOAD FIELD */}
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Upload Professional CV" required>
                <Upload 
                  beforeUpload={(file) => {
                    setCvFile(file);
                    return false; // Prevent auto-upload, we handle it in handleFinish
                  }}
                  maxCount={1}
                  accept=".pdf,.doc,.docx"
                >
                  <Button icon={<UploadOutlined />} className="py-2 h-100 w-100 text-start">
                    {cvFile ? cvFile.name : "Click to select file"}
                  </Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col xs={24} className="mt-4 text-end">
              <button className="btn-primary-custom px-5" type="submit">
                Submit Application
              </button>
            </Col>
          </Row>

        </Form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;