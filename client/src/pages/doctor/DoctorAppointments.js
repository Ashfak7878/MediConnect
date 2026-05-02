import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import { message, Table, Tag, Button, Popconfirm } from 'antd';
import moment from 'moment';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/doctor/doctor-appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error('Something went wrong while fetching appointments');
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const handleStatus = async (record, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/v1/doctor/update-status',
        { appointmentsId: record._id, status: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        message.success(response.data.message);
        getAppointments(); 
      }
    } catch (error) {
      console.log(error);
      message.error('Error updating appointment status');
    }
  };

  const columns = [
    {
      title: 'Patient Details',
      dataIndex: 'userInfo',
      render: (text, record) => (
        <div>
          <span className="fw-bold text-dark d-block">{(record.userInfo?.name || 'Patient').toUpperCase()}</span>
          <span className="text-muted small"><i className="fa-regular fa-envelope me-1"></i> {record.userInfo?.email || 'N/A'}</span>
        </div>
      )
    },
    {
      title: 'Requested Date & Time',
      dataIndex: 'date',
      render: (text, record) => (
        <div>
          <span className="fw-bold text-primary d-block"><i className="fa-regular fa-calendar bg-light p-1 rounded me-2"></i>{moment(record.date).format('MMMM Do, YYYY')}</span>
          <span className="text-muted small"><i className="fa-regular fa-clock bg-light p-1 rounded me-2 mt-1"></i>{record.time.includes('T') ? moment(record.time).format('h:mm A') : moment(record.time, 'HH:mm').format('h:mm A')}</span>
        </div>
      )
    },
    {
      title: 'Session Status',
      dataIndex: 'status',
      render: (status) => {
        let color = 'gold';
        if (status === 'approved') color = 'green';
        if (status === 'reject') color = 'volcano';
        return <Tag color={color} className="px-3 py-1 rounded-pill fw-bold text-uppercase border-0 shadow-sm">{status}</Tag>;
      }
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      render: (paymentStatus) => {
        let color = 'gold';
        if (paymentStatus === 'paid') color = 'success';
        else if (paymentStatus === 'failed') color = 'error';
        return <Tag color={color} className="px-3 py-1 rounded fw-bold text-uppercase border-0">{paymentStatus || 'UNKNOWN'}</Tag>;
      }
    },
    {
      title: 'Action Required',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex gap-2">
          {record.status === 'pending' ? (
            <>
              <Button type="primary" className="fw-bold shadow-sm" onClick={() => handleStatus(record, 'approved')}>
                <i className="fa-solid fa-check me-1"></i> Approve
              </Button>
              <Popconfirm title="Reject appointment?" onConfirm={() => handleStatus(record, 'reject')} okText="Yes" cancelText="No">
                <Button danger type="primary" className="fw-bold shadow-sm">
                  <i className="fa-solid fa-xmark me-1"></i> Reject
                </Button>
              </Popconfirm>
            </>
          ) : (
             <span className="text-muted fw-bold"><i className="fa-solid fa-lock me-1"></i> Locked</span>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="glass-card mx-auto mt-4 p-4 rounded-4 shadow-sm bg-white" style={{ maxWidth: '1100px' }}>
        {}
        <div className="rounded-4 mb-4 shadow-sm text-white p-4" style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(59, 130, 246, 0.8) 100%), url("/dashboard_banner.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold text-white m-0" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                <i className="fa-regular fa-calendar-check me-2"></i> My Appointments
              </h2>
              <p className="opacity-100 m-0 mt-1 fs-6" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                Review and manage your incoming patient consultation requests.
              </p>
            </div>
            <div className="text-end">
              <Tag color="blue" className="fs-5 py-2 px-4 rounded-pill border-0 shadow-sm" style={{ color: '#000', background: 'rgba(255,255,255,0.95)' }}>
                Total Requests: <b className="text-primary">{appointments.length}</b>
              </Tag>
            </div>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={appointments} 
          rowKey="_id" 
          pagination={{ pageSize: 6 }} 
          className="border rounded-3 overflow-hidden shadow-sm"
        />
      </div>
    </Layout>
  );
};

export default DoctorAppointments;  