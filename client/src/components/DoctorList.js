import React from "react";
import { useNavigate } from "react-router-dom";
import { Tag } from "antd";

const DoctorList = ({ doctor }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className="card doctor-card h-100 rounded-4 p-4 border-0"
      style={{ cursor: "pointer", background: '#ffffff' }}
      onClick={() => navigate(`/book-appointment/${doctor._id}`)}
    >
      {/* Availability Badge */}
      <div className="text-end mb-2">
        {doctor.isAbsent ? (
          <Tag color="red" className="rounded-pill px-3 m-0 border-0 fw-bold">Currently Unavailable</Tag>
        ) : (
          <Tag color="green" className="rounded-pill px-3 m-0 border-0 fw-bold"><i className="fa-solid fa-circle text-success me-1" style={{fontSize: '8px', verticalAlign: 'middle'}}></i> Available Today</Tag>
        )}
      </div>

      {/* Profile Header */}
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary bg-opacity-10 rounded-circle d-flex justify-content-center align-items-center shadow-sm" style={{ width: "70px", height: "70px", minWidth: "70px" }}>
           <i className="fa-solid fa-stethoscope fs-3 text-primary"></i>
        </div>
        <div className="ms-3 overflow-hidden">
          <h5 className="fw-bold mb-1 text-dark text-truncate" title={`Dr. ${doctor.firstName} ${doctor.lastName}`}>
            Dr. {doctor.firstName} {doctor.lastName}
          </h5>
          <span className="badge bg-light text-primary border border-primary-subtle rounded-pill px-3 py-1">
            {doctor.specialization}
          </span>
        </div>
      </div>

      {/* Details Body */}
      <div className="card-body p-0 mt-3 pt-3 border-top border-light">        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small fw-medium"><i className="fa-solid fa-graduation-cap me-2"></i>Experience</span>
          <span className="fw-bold text-dark">{doctor.experience} Yrs</span>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="text-muted small fw-medium"><i className="fa-solid fa-indian-rupee-sign me-2"></i>Consult Fee</span>
          <span className="fw-bold text-success fs-6">₹{doctor.feesPerCunsultation || doctor.feesPerCunsaltation}</span>
        </div>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="text-muted small fw-medium"><i className="fa-solid fa-clock me-2"></i>Timings</span>
          <span className="fw-bold text-dark small">{doctor.timings?.[0]} - {doctor.timings?.[1]}</span>
        </div>
        
        {/* Hover Button */}
        <button 
          className={`btn w-100 rounded-pill fw-bold action-btn shadow-sm py-2 ${doctor.isAbsent ? 'btn-outline-secondary disabled' : 'btn-outline-primary'}`}
          disabled={doctor.isAbsent}
        >
          {doctor.isAbsent ? 'No Slots Available' : 'Book Appointment'}
        </button>
      </div>
    </div>
  );
};

export default DoctorList;