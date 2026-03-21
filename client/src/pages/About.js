import React from "react";
import Layout from "../components/Layout";
import { Row, Col } from "antd";
import { 
  SafetyCertificateOutlined, 
  TeamOutlined, 
  ClockCircleOutlined 
} from "@ant-design/icons";

// Make sure the path matches where you saved the CSS file!
import "../styles/About.css"; 

const About = () => {
  return (
    <Layout>
      <div className="container mt-4 mb-5">
        
        {/* Hero Section */}
        <div className="about-hero">
          <h1>About Medi-Connect</h1>
          <p>
            Bridging the gap between exceptional healthcare professionals and the patients who need them most.
          </p>
        </div>

        {/* 3-Column Features Section */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className="feature-card">
              <TeamOutlined className="feature-icon" />
              <h4>Top Specialists</h4>
              <p>
                We bring together highly qualified and verified doctors from various specialties to ensure you get the absolute best care possible.
              </p>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <div className="feature-card">
              <ClockCircleOutlined className="feature-icon" />
              <h4>24/7 Booking</h4>
              <p>
                Skip the waiting room lines. Book, reschedule, or cancel your appointments online instantly from any device.
              </p>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <div className="feature-card">
              <SafetyCertificateOutlined className="feature-icon" />
              <h4>Secure & Private</h4>
              <p>
                Your health data, medical history, and personal information are heavily encrypted and kept strictly confidential.
              </p>
            </div>
          </Col>
        </Row>

        {/* Mission Statement */}
        <div className="mission-section shadow-sm">
          <h2>Our Mission</h2>
          <p style={{ fontSize: "1.1rem", color: "#555", maxWidth: "800px", margin: "0 auto", lineHeight: "1.8" }}>
            At Medi-Connect, we believe that accessing quality healthcare should be seamless, transparent, and stress-free. 
            Our platform is designed to empower patients by providing clear choices, instant booking capabilities, 
            and a direct line of communication with medical experts. We are committed to building a healthier tomorrow, today.
          </p>
        </div>

      </div>
    </Layout>
  );
};

export default About;