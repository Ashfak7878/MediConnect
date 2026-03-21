import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import Layout from '../components/Layout';
import { Row, Col, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAppointments = async () => {
    try {
      const res = await axios.get('/api/v1/user/user-appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (res.data.success) {
        setAppointments(res.data.data.reverse()); // Show newest first
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <Layout>
      <div className="container mt-4 mb-5">
        <div className="text-center mb-5 border-bottom pb-4">
          <h2 className="fw-bold text-dark display-6 m-0"><i className="fa-regular fa-calendar-check text-primary me-3"></i>My Appointments</h2>
          <p className="text-muted fs-5 mt-2">Track your upcoming and past medical consultations.</p>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
             <Spin size="large" />
             <h5 className="text-muted mt-3">Loading your schedule...</h5>
          </div>
        ) : appointments.length > 0 ? (
          <Row gutter={[24, 24]}>
            {appointments.map((appt) => (
              <Col xs={24} md={12} xl={8} key={appt._id}>
                <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden booking-card">
                  {/* Status Ribbon */}
                  <div className={`py-2 px-3 text-white fw-bold ${
                    appt.status === 'pending' ? 'bg-warning text-dark' : 
                    appt.status === 'approved' ? 'bg-success' : 'bg-danger'
                  }`}>
                    {appt.status.toUpperCase()}
                  </div>
                  
                  <div className="card-body p-4 bg-white">
                    <div className="d-flex align-items-center mb-4">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center me-3" style={{width: '60px', height: '60px', minWidth: '60px'}}>
                        <i className="fa-solid fa-user-doctor fs-3 text-primary"></i>
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-1 text-truncate">Dr. {appt.doctorInfo?.firstName} {appt.doctorInfo?.lastName}</h5>
                        <p className="text-muted small mb-0 fw-medium">{appt.doctorInfo?.phone || 'Contact not available'}</p>
                      </div>
                    </div>
                    
                    <div className="bg-light rounded-3 p-3 mb-3 border">
                      <div className="d-flex justify-content-between mb-2">
                         <span className="text-muted fw-bold small text-uppercase"><i className="fa-regular fa-calendar me-2"></i>Date</span>
                         <span className="fw-bold text-dark">{moment(appt.date).format('MMMM Do, YYYY')}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                         <span className="text-muted fw-bold small text-uppercase"><i className="fa-regular fa-clock me-2"></i>Time</span>
                         <span className="fw-bold text-dark">
                           {appt.time.includes('T') ? moment(appt.time).format('h:mm A') : moment(appt.time, 'HH:mm').format('h:mm A')}
                         </span>
                      </div>
                    </div>
                    
                    <button 
                      className="btn w-100 btn-outline-primary rounded-pill fw-bold"
                      onClick={() => navigate(`/book-appointment/${appt.doctorId}`)}
                    >
                      View Doctor Profile
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5 my-5 glass-card mx-auto" style={{maxWidth: '600px'}}>
             <Empty description={
               <div>
                 <h4 className="fw-bold text-dark mb-2">No Appointments Found</h4>
                 <p className="text-muted">You haven't booked any consultations yet.</p>
               </div>
             } />
             <button className="btn btn-primary-custom px-5 rounded-pill mt-4" onClick={() => navigate('/')}>Book Your First Session</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Appointments;