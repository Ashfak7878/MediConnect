import React from "react";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { Form, Input, Row, Col, Card } from "antd";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <Layout>
      <div className="container mt-4">
        <Card title={<h3 className="m-0 text-primary"><i className="fa-solid fa-user me-2"></i> My Profile</h3>} bordered={false} className="shadow-sm rounded-4">
          {user ? (
            <Form layout="vertical" initialValues={user}>
              <Row gutter={20}>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Name" name="name">
                    <Input disabled className="py-2" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Email" name="email">
                    <Input disabled className="py-2" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12} lg={8}>
                  <Form.Item label="Account Type">
                    <Input disabled value={user.isAdmin ? "Administrator" : user.isDoctor ? "Doctor" : "Patient"} className="py-2" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          ) : (
            <div className="text-center p-5">Loading...</div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default UserProfile;
