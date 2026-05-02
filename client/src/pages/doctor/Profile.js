import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Form, Input, Row, TimePicker, message, Switch, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import moment from 'moment';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/doctor/updateProfile',
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format('HH:mm'),
            moment(values.timings[1]).format('HH:mm'),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something Went Wrong');
    }
  };
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        '/api/v1/doctor/getDoctorInfo',
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className="glass-card mt-3">
        {}
        <div className="rounded-4 mb-5 shadow-sm text-white p-4 text-center mt-2" style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(59, 130, 246, 0.8) 100%), url("/dashboard_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <h2 className="fw-bold text-white m-0" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
            <i className="fa-solid fa-user-doctor me-2"></i> Manage Professional Profile
          </h2>
          <p className="opacity-100 m-0 mt-2 fs-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            Update your professional information and working hours.
          </p>
        </div>

        {doctor && (
          <Form
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              ...doctor,
              timings: [
                moment(doctor.timings[0], 'HH:mm'),
                moment(doctor.timings[1], 'HH:mm'),
              ],
            }}
          >
            <h5 className="text-primary border-bottom pb-2 mb-4">
              <i className="fa-regular fa-id-card me-2"></i>Personal Details
            </h5>
            <Row gutter={20}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                  <Input placeholder="John" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                  <Input placeholder="Doe" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Phone Number" name="phone" rules={[{ required: true }]}>
                  <Input placeholder="(555) 123-4567" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Email Address" name="email" rules={[{ required: true }]}>
                  <Input type="email" placeholder="doctor@example.com" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Website (Optional)" name="website">
                  <Input placeholder="www.drjohn.com" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Clinic Address" name="address" rules={[{ required: true }]}>
                  <Input placeholder="123 Medical Plaza, City" className="py-2" disabled />
                </Form.Item>
              </Col>
            </Row>

            <h5 className="text-primary border-bottom pb-2 mb-4 mt-4">
              <i className="fa-solid fa-user-doctor me-2"></i>Professional Details
            </h5>
            <Row gutter={20}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Specialization" name="specialization" rules={[{ required: true, message: "Please select your specialization" }]}>
                  <Select placeholder="Select Specialization" size="large" className="w-100 py-1" showSearch disabled>
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
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Years of Experience" name="experience" rules={[{ required: true }]}>
                  <Input type="number" placeholder="e.g., 5" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Consultation Fee (₹)" name="feesPerConsultation" rules={[{ required: true }]}>
                  <Input type="number" placeholder="e.g., 500" className="py-2" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item label="Working Hours" name="timings" rules={[{ required: true }]}>
                  <TimePicker.RangePicker format="HH:mm" className="w-100 py-2" />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={12} lg={8}>
                <Form.Item 
                  label="Current Availability" 
                  name="isAbsent" 
                  valuePropName="checked"
                  tooltip="Turn this ON to temporarily hide yourself from the booking directory"
                >
                  <Switch 
                    checkedChildren="Absent & Hidden" 
                    unCheckedChildren="Available & Visible" 
                    style={{ transform: 'scale(1.2)', transformOrigin: 'left center', marginTop: '8px' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} className="mt-4 text-end">
                <button className="btn-primary-custom px-5" type="submit">
                  Update Profile
                </button>
              </Col>
            </Row>
          </Form>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
