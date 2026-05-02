import React, { useState } from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/AuthStyles.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleResend = async () => {
    try {
      const res = await axios.post("/api/v1/user/resend-otp", { email: userEmail });
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to resend OTP");
    }
  };

  const onfinishHandler = async (values) => {
    try {
      if (showOtp) {
        dispatch(showLoading());
        const res = await axios.post("/api/v1/user/verify-otp", {
          email: userEmail,
          otp: values.otp,
        });
        dispatch(hideLoading());
        if (res.data.success) {
          message.success(res.data.message);
          navigate("/login");
        } else {
          message.error(res.data.message);
        }
      } else {
        dispatch(showLoading());
        const res = await axios.post('/api/v1/user/register', {
          ...values,
          isDoctor: false
        });
        dispatch(hideLoading());
        if (res.data.success && res.data.requireOtp) {
          setUserEmail(values.email);
          setShowOtp(true);
          message.success("OTP sent to your email!");
        } else if (res.data.success) {
          message.success('Registered Successfully! Please log in.');
          navigate('/login');
        } else {
          message.error(res.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong during registration');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-wrapper">
        <div className="auth-header-icon">
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <Form layout="vertical" onFinish={onfinishHandler}>
          <h3 className="auth-title">Join Medi-Connect {showOtp && "- Verify Email"}</h3>
          <p className="auth-subtitle">
            {showOtp ? "Please enter the OTP sent to your email." : "Get started with a secure free account."}
          </p>
          
          {!showOtp ? (
            <>
              <Form.Item label="Full Name" name="name" rules={[{ required: true, message: 'Please input your full name!' }]}>
                <Input placeholder="Enter your full name" size="large" />
              </Form.Item>
              
              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
                <Input type="email" placeholder="Enter your email" size="large" />
              </Form.Item>
              
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please create a password!' }]}>
                <Input.Password placeholder="Create a password" size="large" />
              </Form.Item>
            </>
          ) : (
            <Form.Item label="OTP Code" name="otp" rules={[{ required: true, message: 'Please input your OTP!' }]}>
              <Input placeholder="Enter the 6-digit OTP" size="large" />
            </Form.Item>
          )}
          
          <button className="auth-btn" type="submit">
            {showOtp ? "Verify & Complete" : "Register"}
          </button>
          
          {!showOtp && (
            <Link to="/login" className="auth-link">Already have an account? Login here</Link>
          )}
          
          {showOtp && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
              <div 
                className="auth-link" 
                style={{ cursor: "pointer", color: "#4A90E2" }} 
                onClick={handleResend}
              >
                Resend Code
              </div>
              <div 
                className="auth-link" 
                style={{ cursor: "pointer" }} 
                onClick={() => setShowOtp(false)}
              >
                Go Back
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default Register;