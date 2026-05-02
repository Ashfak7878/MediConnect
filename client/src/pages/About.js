import React from "react";
import Layout from "../components/Layout";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import "../styles/About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="about-page-container">
        
        {}
        <section className="hero-gradient">
          <h1 className="hero-title">Revolutionizing Healthcare Access</h1>
          <p className="hero-subtitle">
            Medi-Connect is bridging the critical gap between world-class healthcare professionals and the patients who need them most, through a seamless, secure, and modern platform.
          </p>
        </section>

        {}
        <div className="stats-container">
          <div className="glass-stat-card">
            <div className="stat-number">5K+</div>
            <div className="stat-label">Verified Doctors</div>
          </div>
          <div className="glass-stat-card">
            <div className="stat-number">10K+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="glass-stat-card">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Instant Support</div>
          </div>
        </div>

        {}
        <section className="features-section">
          <h2 className="section-title">Why Choose Medi-Connect?</h2>
          <Row gutter={[32, 32]} justify="center">
            
            <Col xs={24} md={8}>
              <div className="premium-feature-card">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-user-doctor"></i>
                </div>
                <h4>Top Specialists</h4>
                <p>
                  We rigorously vet all our healthcare providers. Our platform guarantees access to highly qualified doctors from diverse specialties.
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="premium-feature-card">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <h4>Instant Scheduling</h4>
                <p>
                  Skip the frustrating waiting rooms. View real-time availability, book, reschedule, or cancel your appointments with maximum flexibility.
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="premium-feature-card">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h4>Bank-Grade Security</h4>
                <p>
                  Your medical history and personal data are heavily encrypted and strictly confidential. We prioritize your privacy above all else.
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="premium-feature-card">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-heart-pulse"></i>
                </div>
                <h4>Patient-Centric Care</h4>
                <p>
                  Our interface is designed with you in mind. Experience a stress-free journey from finding the right doctor to receiving care.
                </p>
              </div>
            </Col>

            <Col xs={24} md={8}>
              <div className="premium-feature-card">
                <div className="icon-wrapper">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <h4>Access Anywhere</h4>
                <p>
                  Manage your health on the go. Medi-Connect is fully responsive and optimized for mobile, tablet, and desktop devices.
                </p>
              </div>
            </Col>

          </Row>
        </section>

        {}
        <section className="cta-section">
          <h2>Ready to prioritize your health?</h2>
          <p>
            Join thousands of patients who have already transformed their healthcare experience. Find your perfect specialist today.
          </p>
          <button className="cta-btn" onClick={() => navigate('/')}>
            Find a Doctor Now
          </button>
        </section>

      </div>
    </Layout>
  );
};

export default About;