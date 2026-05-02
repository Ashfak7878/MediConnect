import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import DoctorList from "../components/DoctorList"; 
import { Row, Col, Input, Empty, Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const categories = [
    { name: "All", icon: "fa-solid fa-list" },
    { name: "Cardiologist", icon: "fa-solid fa-heart-pulse" },
    { name: "Dentist", icon: "fa-solid fa-tooth" },
    { name: "Neurologist", icon: "fa-solid fa-brain" },
    { name: "Orthopedic", icon: "fa-solid fa-bone" },
    { name: "Pediatrician", icon: "fa-solid fa-baby" },
  ];

  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/user/getAllDoctors", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      if (res.data.success) setDoctors(res.data.data);
    } catch (error) { console.log(error); }
  };

  useEffect(() => { 
    if (user?.isAdmin) {
      navigate('/admin/users');
      return;
    }
    if (user?.isDoctor) {
      navigate('/doctor-appointments');
      return;
    }
    getDoctors(); 
  }, [user, navigate]);

  const filtered = doctors.filter(d => {
    const searchLower = search.toLowerCase();
    const docName = d?.firstName?.toLowerCase() || "";
    const docSpec = d?.specialization?.toLowerCase() || "";
    
    return search === "All" ||
      docName.includes(searchLower) || 
      docSpec.includes(searchLower);
  });

  return (
    <Layout>
      {}
      <div className="hero-section text-center text-white rounded-4 mb-5 shadow-sm" style={{ 
        background: 'linear-gradient(135deg, rgba(30,58,138,0.7) 0%, rgba(59,130,246,0.85) 100%), url("/dashboard_banner.png")', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        marginTop: '-10px',
        padding: '80px 20px'
      }}>
        <h1 className="display-4 fw-bold mb-3 text-white" style={{ textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>Find your specialist and book instantly.</h1>
        <p className="fs-5 opacity-100 mb-4" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}>Top-rated doctors. Transparent pricing. Verified reviews.</p>
        
        <div className="d-flex justify-content-center px-4">
          <Input 
            size="large"
            prefix={<i className="fa-solid fa-magnifying-glass text-muted me-2 border-end pe-2"></i>}
            placeholder="Search illness, specialty, or doctor name..." 
            className="rounded-pill shadow px-4 w-100"
            style={{ maxWidth: '750px', height: '60px', fontSize: '1.1rem' }}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {}
        <div className="d-flex justify-content-center flex-wrap gap-2 mt-4 px-2">
          {categories.map((cat, index) => (
            <Button 
              key={index}
              type={search.toLowerCase() === cat.name.toLowerCase() ? "primary" : "default"}
              shape="round" 
              size="large"
              className={`fw-bold border-0 shadow-sm ${search.toLowerCase() === cat.name.toLowerCase() ? 'bg-white text-primary' : 'bg-white bg-opacity-25 text-white'}`}
              onClick={() => setSearch(cat.name === "All" ? "" : cat.name)}
            >
              <i className={`${cat.icon} me-2`}></i> {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-4">
        <h4 className="fw-bold m-0 text-dark">
          <i className="fa-solid fa-user-doctor text-primary me-2"></i> 
          Available Specialists
        </h4>
        <span className="text-muted fw-bold">{filtered.length} doctors found</span>
      </div>
      
      <Row gutter={[24, 24]}>
        {filtered.length > 0 ? filtered.map(d => (
          <Col xs={24} sm={12} lg={8} xl={6} key={d._id}>
            <DoctorList doctor={d} />
          </Col>
        )) : (
          <div className="w-100 py-5 text-center">
             <Empty description={<span className="fs-5 fw-bold text-muted">No specialists match your search criteria.</span>} />
          </div>
        )}
      </Row>
    </Layout>
  );
};

export default Home;