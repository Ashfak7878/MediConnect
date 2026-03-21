import React from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import "../styles/AuthStyles.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <Form layout="vertical" onFinish={onfinishHandler}>
          <h3 className="auth-title">Welcome Back</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password required placeholder="Enter your password" />
          </Form.Item>
          
          <button className="auth-btn" type="submit">Login</button>
          
          <Link to="/register" className="auth-link">Not a user? Register here</Link>
        </Form>
      </div>
    </div>
  );
};

export default Login;