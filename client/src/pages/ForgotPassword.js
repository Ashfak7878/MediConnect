import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/AuthStyles.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showOtp, setShowOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleResend = async () => {
    try {
      const res = await axios.post("/api/v1/user/forgot-password", { email: userEmail });
      if (res.data.success) {
        message.success("OTP reset code resent.");
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
        const res = await axios.post("/api/v1/user/reset-password", {
          email: userEmail,
          otp: values.otp,
          newPassword: values.newPassword,
        });
        dispatch(hideLoading());
        
        if (res.data.success) {
          message.success(res.data.message);
          navigate("/login");
        } else {
          message.error(res.data.message);
        }
      } else {
        // Step 1: Request OTP
        dispatch(showLoading());
        const res = await axios.post("/api/v1/user/forgot-password", values);
        dispatch(hideLoading());
        
        if (res.data.success) {
          setUserEmail(values.email);
          setShowOtp(true);
          message.success(res.data.message);
        } else {
          message.error(res.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-wrapper">
        <div className="auth-header-icon">
          <i className="fa-solid fa-key"></i>
        </div>
        <Form layout="vertical" onFinish={onfinishHandler}>
          <h3 className="auth-title">Medi-Connect - Reset Password</h3>
          <p className="auth-subtitle">
            {showOtp ? "Enter the OTP sent to your email and a new password." : "Enter your email to receive an OTP code."}
          </p>
          
          {!showOtp ? (
            <>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
                <Input type="email" placeholder="Enter your email" size="large" />
              </Form.Item>
            </>
          ) : (
            <>
              <Form.Item label="OTP Code" name="otp" rules={[{ required: true, message: 'Please input your OTP!' }]}>
                <Input placeholder="Enter the 6-digit OTP" size="large" />
              </Form.Item>
              <Form.Item label="New Password" name="newPassword" rules={[{ required: true, message: 'Please input a new password!' }]}>
                <Input.Password placeholder="Enter new password" size="large" />
              </Form.Item>
            </>
          )}
          
          <button className="auth-btn" type="submit">
            {showOtp ? "Reset Password" : "Send Request"}
          </button>
          
          {!showOtp && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
               <Link to="/login" className="auth-link">Back to Login</Link>
            </div>
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
                Cancel
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
