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
        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark m-0"><i className="fa-regular fa-calendar-check text-primary me-2"></i>My Appointments</h2>
            <p className="text-muted m-0 mt-1">Review and manage your incoming patient consultation requests.</p>
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