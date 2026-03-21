import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Layout from "../components/Layout";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { message, DatePicker, TimePicker, Row, Col, Alert, Tag, Spin } from "antd";

const BookingPage = () => {
  const params = useParams(); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDoctorData = async () => {
    try {
      const res = await axios.post(
        "/api/v1/doctor/getDoctorById", 
        { doctorId: params.doctorId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (res.data.success) {
        setDoctorInfo(res.data.data);
      }
    } catch (error) {
      console.log("Error fetching doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line
  }, []);

  const handleBooking = async () => {
    if (!date || !time) {
      return message.warning("Please select both a Date and a Time!");
    }

    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/v1/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctorInfo, 
          userInfo: user, 
          date: date, 
          time: time,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Appointment Booked Successfully!");
        navigate("/appointments"); 
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log("Booking Error:", error);
      message.error("Something went wrong while booking.");
    }
  };

  return (
    <Layout>
      <div className="container mt-2 mb-5">
        <div className="text-center mb-5 pb-3 border-bottom">
          <h1 className="fw-bold text-dark display-5">Schedule Consultation</h1>
          <p className="text-muted fs-5">Pick an available time slot below to secure your appointment.</p>
        </div>
        
        {loading ? (
          <div className="text-center py-5 my-5">
            <Spin size="large" />
            <p className="mt-3 text-muted fw-bold">Loading specialist details...</p>
          </div>
        ) : !doctorInfo ? (
          <Alert message="Doctor not found" description="The specialist you are looking for does not exist." type="error" showIcon />
        ) : (
          <Row gutter={[40, 40]} align="top" className="px-md-4">
            
            {/* LEFT COLUMN: Premium Doctor Card */}
            <Col xs={24} md={10} lg={8}>
              <div className="glass-card text-center p-4 border-0 shadow-lg rounded-4" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center mx-auto mb-4" style={{ width: "120px", height: "120px", border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <i className="fa-solid fa-user-doctor text-primary" style={{ fontSize: '3.5rem' }}></i>
                </div>
                
                <h3 className="fw-bold text-dark mb-1">Dr. {doctorInfo.firstName} {doctorInfo.lastName}</h3>
                <Tag color="geekblue" className="rounded-pill px-4 py-1 mb-4 text-uppercase fw-bold border-0 fs-6 shadow-sm">{doctorInfo.specialization}</Tag>
                
                <div className="text-start mt-4 px-3">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded p-2 me-3"><i className="fa-solid fa-graduation-cap text-primary fs-5"></i></div>
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase">Experience</span>
                      <span className="fw-bold fs-6">{doctorInfo.experience} Years</span>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded p-2 me-3"><i className="fa-solid fa-indian-rupee-sign text-success fs-5"></i></div>
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase">Consultation Fee</span>
                      <span className="fw-bold fs-6">₹{doctorInfo.feesPerCunsultation || doctorInfo.feesPerCunsaltation}</span>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="bg-light rounded p-2 me-3"><i className="fa-regular fa-clock text-warning fs-5"></i></div>
                    <div>
                      <span className="d-block text-muted small fw-bold text-uppercase">Clinic Hours</span>
                      <span className="fw-bold fs-6">{doctorInfo.timings?.[0]} - {doctorInfo.timings?.[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* RIGHT COLUMN: Booking Form */}
            <Col xs={24} md={14} lg={16}>
              <div className="bg-white p-5 rounded-4 shadow-sm border" style={{ height: '100%' }}>
                {doctorInfo.isAbsent ? (
                  <div className="h-100 d-flex flex-column justify-content-center align-items-center py-5">
                     <i className="fa-solid fa-calendar-xmark text-danger mb-3 opacity-75" style={{ fontSize: '5rem' }}></i>
                     <h2 className="fw-bold text-dark">Currently Unavailable</h2>
                     <p className="text-muted text-center fs-5 px-3">
                       Dr. {doctorInfo.lastName} is currently marked as absent and is not accepting new appointments at this time. Please check back later.
                     </p>
                     <button className="btn btn-outline-secondary rounded-pill mt-4 px-4 py-2" onClick={() => navigate('/')}>Browse Other Doctors</button>
                  </div>
                ) : (
                  <>
                    <h3 className="fw-bold text-dark border-bottom pb-3 mb-4"><i className="fa-regular fa-calendar-check text-primary me-2"></i> Select Date & Time</h3>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold text-muted text-uppercase small">Preferred Date</label>
                        <DatePicker 
                          className="w-100 p-3 rounded-3 fs-6 input-shadow" 
                          format="DD-MM-YYYY"
                          disabledDate={(current) => current && current < moment().startOf('day')}
                          onChange={(value) => setDate(value ? moment(value).format("DD-MM-YYYY") : "")}
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="form-label fw-bold text-muted text-uppercase small">Preferred Time</label>
                        <TimePicker 
                          className="w-100 p-3 rounded-3 fs-6 input-shadow" 
                          format="HH:mm"
                          onChange={(value) => setTime(value ? moment(value).format("HH:mm") : "")}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-top">
                      <button 
                        className="btn-primary-custom w-100 py-3 fs-5 rounded-pill shadow"
                        onClick={handleBooking}
                      >
                        Confirm Booking
                      </button>
                      <p className="text-center text-muted small mt-3"><i className="fa-solid fa-shield-halved me-1 text-success"></i> Secure Booking Process. Payment collected at clinic.</p>
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;