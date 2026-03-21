import React from 'react';
import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/AuthStyles.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/register', {
        ...values,
        isDoctor: false
      });
      dispatch(hideLoading());
      if (res.data.success) {
        message.success('Registered Successfully! Please log in.');
        navigate('/login');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong during registration');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <Form layout="vertical" onFinish={onfinishHandler}>
          <h3 className="auth-title">Create Account</h3>
          
          <Form.Item label="Full Name" name="name">
            <Input required placeholder="Enter your full name" />
          </Form.Item>
          
          <Form.Item label="Email" name="email">
            <Input type="email" required placeholder="Enter your email" />
          </Form.Item>
          
          <Form.Item label="Password" name="password">
            <Input.Password required placeholder="Create a password" />
          </Form.Item>
          
          <button className="auth-btn" type="submit">Register</button>
          
          <Link to="/login" className="auth-link">Already have an account? Login here</Link>
        </Form>
      </div>
    </div>
  );
};

export default Register;